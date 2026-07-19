from fastapi import FastAPI
from app.database import init_db
from app.api.dashboard import router as dashboard_router
from app.api.tenders import router as tender_router
from app.api.assistant import router as assistant_router
from fastapi.middleware.cors import CORSMiddleware
from app.api.saved_tenders import router as saved_tender_router
from app.api.chat import router as chat_router

app = FastAPI(
    title="Tender AI API",
    version="1.0.0"
)

origins=[
    "http://localhost:5173",
   "http://127.0.0.1:5173",

]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
app.include_router(
    dashboard_router,
    prefix="/api/v1"
)
app.include_router(
    tender_router,
    prefix="/api/v1"
)
app.include_router(
    assistant_router,
    prefix="/api/v1"
)
app.include_router(saved_tender_router, prefix="/api/v1")
app.include_router(chat_router, prefix="/api/v1")
init_db()
print("Database initialized.")

