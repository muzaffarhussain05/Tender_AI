from app.chat.chatbot import ChatBot


class ChatManager:
    _bot = None

    @classmethod
    def get_bot(cls):
        if cls._bot is None:
            print("=" * 50)
            print("Loading AI models...")
            print("=" * 50)

            cls._bot = ChatBot()

        return cls._bot