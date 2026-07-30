from fastapi import APIRouter, HTTPException, status

from app.schemas.saved_tender import (
    SavedTenderListResponse,
    SaveTenderResponse,
)

from app.services.saved_tender_service import SavedTenderService

router = APIRouter(
    prefix="/saved-tenders",
    tags=["Saved Tenders"],
)


@router.get(
    "",
    response_model=SavedTenderListResponse,
    summary="Get Saved Tenders",
)
async def get_saved_tenders():

    service = SavedTenderService()

    try:
        return service.get_saved_tenders()

    finally:
        service.close()


@router.post(
    "/{tender_id}",
    response_model=SaveTenderResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Save Tender",
)
async def save_tender(tender_id):

    service = SavedTenderService()

    try:

        result = service.save_tender(tender_id)

        if result is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tender not found.",
            )

        if result == "exists":
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Tender already saved.",
            )

        return {
            "message": "Tender saved successfully."
        }

    finally:
        service.close()


@router.delete(
    "/{tender_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Remove Saved Tender",
)
async def remove_saved_tender(tender_id):

    service = SavedTenderService()

    try:

        deleted = service.remove_saved_tender(tender_id)

        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Saved tender not found.",
            )

    finally:
        service.close()