class ConversationContextManager:

    MAX_LENGTH = 10000

    @staticmethod
    def create(question, answer):
        return f"""
User:
{question}

Assistant:
{answer}
"""

    @staticmethod
    def update(context, question, answer):

        if context:
            context += f"""

User:
{question}

Assistant:
{answer}
"""
        else:
            context = ConversationContextManager.create(
                question,
                answer
            )

        if len(context) > ConversationContextManager.MAX_LENGTH:
            context = context[-6000:]

        return context