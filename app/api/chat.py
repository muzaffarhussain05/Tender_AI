from fastapi import APIRouter, HTTPException

from app.schemas.chat import (
    ChatRequest,
    ChatResponse,
    ChatHistoryResponse,
    RenameChatRequest,
    NewChatResponse,
    ConversationResponse
)

from app.services.chat_service import ChatService

router = APIRouter(
    prefix="/chat",
    tags=["AI Assistant"]
)

# Temporary until authentication is added
USER_ID = 1


@router.post(
    "",
    response_model=ChatResponse,
    summary="Send Message"
)
async def send_message(request: ChatRequest):

    service = ChatService()

    try:

        return service.send_message(
            user_id=USER_ID,
            session_id=request.session_id,
            question=request.message
        )

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e)
        )  

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

    finally:
        service.close()

@router.post(
    "/new",
    response_model=NewChatResponse,
    summary="Create New Chat"
)
async def new_chat():

    service = ChatService()

    try:

        return service.create_new_chat(
            user_id=USER_ID
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

    finally:
        service.close()
@router.get(
    "/history",
    response_model=ChatHistoryResponse,
    summary="Chat History"
)
async def get_history():

    service = ChatService()

    try:

        sessions = service.get_history(USER_ID)

        return {
            "total": len(sessions),
            "items": sessions
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

    finally:
        service.close()        




@router.get(
    "/{session_id}",
    response_model=ConversationResponse,
    summary="Get Conversation"
)
async def get_conversation(session_id: int):

    service = ChatService()

    try:

        conversation = service.get_conversation(
            session_id=session_id,
            
        )

        if conversation is None:
            raise HTTPException(
                status_code=404,
                detail="Chat session not found"
            )

        return conversation

    finally:
        service.close()

@router.put(
    "/{session_id}",
    summary="Rename Chat"
)
async def rename_chat(
    session_id: int,
    request: RenameChatRequest
):

    service = ChatService()

    try:

        session = service.rename_chat(
            session_id=session_id,
            title=request.title
        )

        if session is None:

            raise HTTPException(
                status_code=404,
                detail="Chat session not found"
            )

        return {
            "message": "Chat renamed successfully"
        }

    finally:
        service.close()               

@router.delete(
    "/{session_id}/messages",
    summary="Clear Chat Messages"
)
async def clear_chat(session_id: int):

    service = ChatService()

    try:

        cleared = service.clear_chat(
            session_id=session_id,
            user_id=USER_ID
        )

        if not cleared:

            raise HTTPException(
                status_code=404,
                detail="Chat session not found"
            )

        return {
            "message": "Chat cleared successfully"
        }

    except HTTPException:
        raise

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

    finally:
        service.close()




@router.delete(
    "/{itemid}",
    
    summary="Remove Chat ",
)
async def remove_saved_tender(itemid: int):

    service = ChatService()

    try:

        deleted = service.delete_chat(itemid)


        if not deleted:
                    
                    raise HTTPException(
                        status_code=404,
                        
                        detail="Saved tender not found.",
                    )


        return {
                        "message": "Chat Removed successfully"
                    }
        

       

    finally:
        service.close()