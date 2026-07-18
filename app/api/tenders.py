from fastapi import APIRouter, HTTPException
from datetime import datetime

from app.schemas.tender import (
    TenderListResponse,
    TenderDetailResponse,
)

from app.services.tender_service import TenderService

router = APIRouter(
    prefix="/tenders",
    tags=["Tenders"],
)


@router.get(
    "",
    response_model=TenderListResponse,
    summary="List / Search / Filter Tenders",
)
async def get_tenders(

    # Search
    q: str | None = None,

    # Filters
    category: str | None = None,
    organization: str | None = None,
    location: str | None = None,
    status: str | None = None,

    publish_from: datetime | None = None,
    publish_to: datetime |None = None,

    closing_from: datetime | None = None,
    closing_to: datetime | None = None,

    # Sorting
    sort_by: str = "publish_date",
    sort_order: str = "desc",

    # Pagination
    page: int = 1,
    page_size: int = 20,
):
    service = TenderService()

    try:
        return service.get_tenders(
            q=q,

            category=category,
            organization=organization,
            location=location,
            status=status,

            publish_from=publish_from,
            publish_to=publish_to,

            closing_from=closing_from,
            closing_to=closing_to,

            sort_by=sort_by,
            sort_order=sort_order,

            page=page,
            page_size=page_size,
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e),
        )

    finally:
        service.close()