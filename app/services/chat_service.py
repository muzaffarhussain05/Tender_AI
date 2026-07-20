
from app.services.database_service import DatabaseService
from app.chat.chat_manager import ChatManager

class ChatService:

    def __init__(self):
        # self.bot = ChatBot()
        self.db = DatabaseService()

    def close(self):
        self.db.close()

    def send_message(
    self,
    user_id: int,
    session_id: int | None,
    question: str,
):

        if session_id is None:
            session = self.db.create_session(
                user_id=user_id,
                title="New Chat",
            )

        else:
            session = self.db.get_session(
                session_id,
                user_id,
            )

            if session is None:
                raise ValueError("Chat session not found")

        if session.title == "New Chat":
            title = question.strip()

            if len(title) > 60:
                title = title[:57] + "..."

            self.db.update_session_title(
                session.id,
                title,
            )

            # Optional: keep the object in sync
            session.title = title

        self.db.save_message(
            session.id,
            "user",
            question,
        )

        bot = ChatManager.get_bot()
        response = bot.ask(question)

        answer = response["answer"]
        sources = response.get("sources", [])

        self.db.save_message(
            session.id,
            "assistant",
            answer,
        )

        messages = self.db.get_messages(session.id)

        return {
            "session_id": session.id,
            "title": session.title,
            "answer": answer,
            "messages": messages,
            # "sources": sources,  # Include this if you want to return it
        }

    def create_new_chat(self, user_id: int):

        session = self.db.create_session(
            user_id=user_id,
            title="New Chat"
        )

        return {
            "session_id": session.id,
            "title": session.title,
            "created_at": session.created_at
        }
    def get_history(self, user_id):
        return self.db.get_sessions(user_id)

    def get_conversation(self, session_id):

        session = self.db.get_session(session_id)

        if session is None:
            raise Exception("Session not found")

        messages = self.db.get_messages(session_id)

        return {
            "session_id": session.id,
            "title": session.title,
            "messages": [
                {
                    "role": message.role,
                    "content": message.content,
                    "created_at": message.created_at
                }
                for message in messages
            ]
        }    


    def rename_chat(self, session_id, title):
        return self.db.update_session_title(session_id, title)


    def delete_chat(self, session_id):
        return self.db.delete_session(session_id)

    def clear_chat(
    self,
    session_id: int,
    user_id: int
):

        session = self.db.get_session(
            session_id=session_id,
            user_id=user_id
        )

        if session is None:
            return False

        self.db.clear_messages(session_id)

        return True    