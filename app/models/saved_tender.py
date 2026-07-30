from sqlalchemy import Column, Integer, DateTime, ForeignKey, String
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database import Base


class SavedTender(Base):
    __tablename__ = "saved_tenders"

    id = Column(Integer, primary_key=True, index=True)

    tender_id = Column(
        String(500),
        ForeignKey("tenders.tender_no", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )

    saved_at = Column(
        DateTime,
        server_default=func.now(),
        nullable=False,
    )

    # Relationship
    tender = relationship("Tender", backref="saved_record")