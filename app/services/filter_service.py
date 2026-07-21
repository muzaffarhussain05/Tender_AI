from datetime import datetime


class FilterService:
    """
    Applies structured filters (location, organization, status, dates)
    to candidate results. Ranking/relevance is left entirely to the
    vector search's similarity score and the cross-encoder rerank score
    -- this service no longer does its own keyword/trap scoring, since
    that heuristic was excluding results that the vector search had
    already correctly identified as relevant.
    """

    # ======================================================
    # Helper Methods
    # ======================================================

    def _normalize(self, value):
        """
        Convert None -> ""
        Strip spaces
        Lowercase
        """

        if value is None:
            return ""

        return str(value).strip().lower()

    # ------------------------------------------------------

    def _parse_date(self, value):
        """
        Converts database values to date.

        Supports

        datetime
        YYYY-MM-DD
        YYYY-MM-DD HH:MM:SS
        """

        if not value:
            return None

        if isinstance(value, datetime):
            return value.date()

        if hasattr(value, "date"):
            return value.date()

        value = str(value)

        formats = (
            "%Y-%m-%d",
            "%Y-%m-%d %H:%M:%S",
        )

        for fmt in formats:

            try:

                return datetime.strptime(
                    value,
                    fmt
                ).date()

            except ValueError:

                pass

        return None

    # ------------------------------------------------------

    def _build_searchable_text(self, result):

        fields = [

            result.get("title", ""),

            result.get("organization", ""),

            result.get("department", ""),

            result.get("category", ""),

            result.get("location", ""),

            result.get("text", ""),

        ]

        return " ".join(
            self._normalize(f)
            for f in fields
        )

    # ------------------------------------------------------

    def _matches_location(
        self,
        result_location,
        filters,
    ):

        locations = filters.get("location", [])

        if not locations:
            return True

        result_location = self._normalize(
            result_location
        )

        return any(
            location in result_location
            for location in locations
        )

    # ------------------------------------------------------

    def _matches_organization(
        self,
        result_org,
        filters,
    ):

        organizations = filters.get(
            "organization",
            [],
        )

        if not organizations:
            return True

        result_org = self._normalize(
            result_org
        )

        return any(
            org in result_org
            for org in organizations
        )

    # ------------------------------------------------------

    def _matches_status(
        self,
        result_status,
        filters,
    ):

        statuses = filters.get(
            "status",
            [],
        )

        if not statuses:
            return True

        return result_status in statuses

    # ------------------------------------------------------

    def _matches_publish_date(
        self,
        publish_date,
        filters,
    ):

        date_filter = filters.get(
            "publish_date"
        )

        if not date_filter:
            return True

        publish_date = self._parse_date(
            publish_date
        )

        if publish_date is None:
            return False

        return (
            date_filter["from"]
            <= publish_date
            <= date_filter["to"]
        )

    # ------------------------------------------------------

    def _matches_closing_date(
        self,
        closing_date,
        filters,
    ):

        date_filter = filters.get(
            "closing_date"
        )

        if not date_filter:
            return True

        closing_date = self._parse_date(
            closing_date
        )

        if closing_date is None:
            return False

        return (
            date_filter["from"]
            <= closing_date
            <= date_filter["to"]
        )

    # ------------------------------------------------------

    def _matches_expired(
        self,
        closing_date,
        filters,
    ):

        expired = filters.get(
            "expired"
        )

        if expired is None:
            return True

        closing_date = self._parse_date(
            closing_date
        )

        if closing_date is None:
            return False

        is_expired = (
            closing_date
            < datetime.now().date()
        )

        return is_expired == expired

    # ======================================================
    # Main Filtering Pipeline
    # ======================================================

    def filter_tenders(
        self,
        results,
        parsed_query,
    ):

        filters = parsed_query.get(
            "filters",
            {}
        )

        filtered = []

        for result in results:

            # -----------------------------
            # Structured Filters
            # (these are still hard filters -- location, org, status and
            # dates are explicit, unambiguous user constraints, so it's
            # correct to exclude on them)
            # -----------------------------

            if not self._matches_location(
                result.get("location"),
                filters,
            ):
                continue

            if not self._matches_organization(
                result.get("organization"),
                filters,
            ):
                continue

            if not self._matches_status(
                result.get("status"),
                filters,
            ):
                continue

            if not self._matches_publish_date(
                result.get("publish_date"),
                filters,
            ):
                continue

            if not self._matches_closing_date(
                result.get("closing_date"),
                filters,
            ):
                continue

            if not self._matches_expired(
                result.get("closing_date"),
                filters,
            ):
                continue

            filtered.append(result)

        # -----------------------------
        # Final Ranking
        # (relevance is left entirely to the vector search / reranker --
        # this service only applies the hard structured filters above)
        # -----------------------------

        filtered.sort(
            key=lambda x: (

                # Cross Encoder score
                x.get(
                    "rerank_score",
                    0
                ),

                # FAISS similarity
                x.get(
                    "score",
                    0
                ),

                # Latest tenders first
                self._parse_date(
                    x.get(
                        "publish_date"
                    )
                ) or datetime.min.date(),

            ),
            reverse=True,
        )

        return filtered