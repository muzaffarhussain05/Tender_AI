from sqlalchemy.orm import joinedload

from app.database import SessionLocal
from app.models.tender import Tender
from app.models.saved_tender import SavedTender


class SavedTenderService:

    def __init__(self):
        self.db = SessionLocal()

    def close(self):
        self.db.close()

    def save_tender(self, tender_id: int):

        tender = (
            self.db.query(Tender)
            .filter(Tender.id == tender_id)
            .first()
        )

        if tender is None:
            return None

        exists = (
            self.db.query(SavedTender)
            .filter(SavedTender.tender_id == tender_id)
            .first()
        )

        if exists:
            return "exists"

        saved = SavedTender(
            tender_id=tender_id
        )

        self.db.add(saved)
        self.db.commit()
        self.db.refresh(saved)

        return saved

    def remove_saved_tender(self, tender_id: int):

        saved = (
            self.db.query(SavedTender)
            .filter(SavedTender.tender_id == tender_id)
            .first()
        )

        if saved is None:
            return False

        self.db.delete(saved)
        self.db.commit()

        return True

    def get_saved_tenders(self):

        saved_tenders = (
            self.db.query(SavedTender)
            .options(
                joinedload(SavedTender.tender)
            )
            .order_by(
                SavedTender.saved_at.desc()
            )
            .all()
        )

        items = []

        for saved in saved_tenders:

            tender = saved.tender

            items.append({
                "id": saved.id,
                "tender_id": tender.id,
                "title": tender.title,
                "organization": tender.organization,
                "category": tender.category,
                "location": tender.location,
                "publish_date": tender.publish_date,
                "closing_date": tender.closing_date,
                "status": tender.status,
                "saved_at": saved.saved_at,
            })

        return {
            "total": len(items),
            "items": items,
        }