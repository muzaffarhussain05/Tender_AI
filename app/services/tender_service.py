import math
from datetime import datetime
from app.database import SessionLocal
from app.models.tender import Tender
from sqlalchemy import or_
import math

class TenderService:

    def __init__(self):
        self.db = SessionLocal()

    def get_tenders(
    self,

    q: str | None = None,

    category: str | None = None,
    organization: str | None = None,
    location: str | None = None,
    status: str | None = None,

    publish_from: datetime | None = None,
    publish_to: datetime | None = None,

    closing_from: datetime | None = None,
    closing_to: datetime | None = None,

    sort_by: str = "publish_date",
    sort_order: str = "desc",

    page: int = 1,
    page_size: int = 20,
):

        query = self.db.query(Tender)

        # -------------------------
        # Search
        # -------------------------

        if q:

            query = query.filter(

                or_(

                    Tender.title.ilike(f"%{q}%"),

                    Tender.organization.ilike(f"%{q}%"),

                    Tender.department.ilike(f"%{q}%"),

                    Tender.category.ilike(f"%{q}%"),

                    Tender.location.ilike(f"%{q}%"),

                    Tender.tender_no.ilike(f"%{q}%"),

                    Tender.reference_number.ilike(f"%{q}%"),
                )
            )

        # -------------------------
        # Filters
        # -------------------------

        if category:
            query = query.filter(
                Tender.category.ilike(f"%{category}%")
            )

        if organization:
            query = query.filter(
                Tender.organization.ilike(f"%{organization}%")
            )

        if location:
            query = query.filter(
                Tender.location.ilike(f"%{location}%")
            )

        if status:
            query = query.filter(
                Tender.status.ilike(f"%{status}%")
            )

        if publish_from:
            query = query.filter(
                Tender.publish_date >= publish_from
            )

        if publish_to:
            query = query.filter(
                Tender.publish_date <= publish_to
            )

        if closing_from:
            query = query.filter(
                Tender.closing_date >= closing_from
            )

        if closing_to:
            query = query.filter(
                Tender.closing_date <= closing_to
            )

        # -------------------------
        # Sorting
        # -------------------------

        sortable_columns = {
            "publish_date": Tender.publish_date,
            "closing_date": Tender.closing_date,
            "title": Tender.title,
            "organization": Tender.organization,
            "category": Tender.category,
            "location": Tender.location,
        }

        sort_column = sortable_columns.get(
            sort_by,
            Tender.publish_date,
        )

        if sort_order.lower() == "asc":
            query = query.order_by(sort_column.asc())
        else:
            query = query.order_by(sort_column.desc())

        # -------------------------
        # Pagination
        # -------------------------

        total = query.count()

        tenders = (
            query
            .offset((page - 1) * page_size)
            .limit(page_size)
            .all()
        )

        items = [
            {
                "id": tender.id,
                "tender_no": tender.tender_no,
                "title": tender.title,
                "organization": tender.organization,
                "category": tender.category,
                "location": tender.location,
                "publish_date": tender.publish_date,
                "closing_date": tender.closing_date,
                "status": tender.status,
            }
            for tender in tenders
        ]

        return {
            "page": page,
            "page_size": page_size,
            "total": total,
            "total_pages": math.ceil(total / page_size),
            "items": items,
        }
    
        def get_tender(self, tender_id: int):

            tender = (
                self.db.query(Tender)
                .filter(Tender.id == tender_id)
                .first()
            )   

            if tender is None:
                return None

            return {
                "id": tender.id,
                "website": tender.website,
                "organization": tender.organization,
                "department": tender.department,
                "category": tender.category,
                "reference_number": tender.reference_number,
                "tender_no": tender.tender_no,
                "title": tender.title,
                "publish_date": tender.publish_date,
                "closing_date": tender.closing_date,
                "location": tender.location,
                "status": tender.status,
                "document": tender.document,
                "source_url": tender.source_url,
                "created_at": tender.created_at,
                "updated_at": tender.updated_at
            }
    def close(self):

        self.db.close()


  