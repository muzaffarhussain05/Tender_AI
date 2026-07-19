import random
import time
import re
import requests

from bs4 import BeautifulSoup
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry


class PPRAScraper:

    BASE_URL = "https://epms.ppra.gov.pk/public/tenders/active-tenders"

    DEFAULT_PARAMS = {
        "keyword": "",
        "tender_no": "",
        "closing_date": "",
        "tender_type": "",
        "procurement_category": "",
        "sector": "",
        "tender_nature": "",
        "organization": "",
        "country": "",
        "advertise_date_from": "",
        "advertise_date_to": "",
        "status": "",
        "city": "",
    }

    def __init__(self):

        self.session = requests.Session()

        retry = Retry(
            total=5,
            connect=5,
            read=5,
            backoff_factor=2,
            status_forcelist=[429, 500, 502, 503, 504],
            allowed_methods=["GET"],
        )

        adapter = HTTPAdapter(max_retries=retry)

        self.session.mount("http://", adapter)
        self.session.mount("https://", adapter)

        self.session.headers.update({
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/138.0.0.0 Safari/537.36",
            "Accept-Language": "en-US,en;q=0.9",
            "Connection": "keep-alive",
        })

    def fetch(self, page=1):

        params = self.DEFAULT_PARAMS.copy()
        params["page"] = page

        for attempt in range(5):

            try:

                response = self.session.get(
                    self.BASE_URL,
                    params=params,
                    timeout=30,
                )

                response.raise_for_status()

                time.sleep(random.uniform(1.5, 3.0))

                return BeautifulSoup(response.text, "html.parser")

            except (
                requests.exceptions.ConnectionError,
                requests.exceptions.Timeout,
                requests.exceptions.HTTPError,
            ) as e:

                wait = 2 ** attempt

                print(
                    f"Page {page}: Attempt {attempt+1}/5 failed ({e}). "
                    f"Retrying in {wait}s..."
                )

                time.sleep(wait)

        print(f"Skipping page {page} after 5 failed attempts.")

        return None

    def get_table(self, soup):

        table = soup.find(
            "table",
            class_="table table-hover mb-0"
        )

        if table is None:
            raise Exception("Tender table not found.")

        return table

    def get_total_pages(self, soup):

        text = soup.get_text(" ", strip=True)

        match = re.search(r"Page\s+\d+\s+of\s+(\d+)", text)

        return int(match.group(1)) if match else 1

    def get_rows(self, table):

        rows = table.find_all("tr")

        return rows[1:] if len(rows) > 1 else []

    def scrape(self):

        first_page = self.fetch(1)

        if first_page is None:
            raise Exception("Unable to fetch first page.")

        total_pages = self.get_total_pages(first_page)

        print(f"Total Pages: {total_pages}")

        all_rows = []

        for page in range(1, total_pages + 1):

            print(f"Scraping Page {page}")

            soup = self.fetch(page)

            if soup is None:
                continue

            try:
                table = self.get_table(soup)
                rows = self.get_rows(table)
                all_rows.extend(rows)

            except Exception as e:
                print(f"Skipping page {page}: {e}")

        return all_rows