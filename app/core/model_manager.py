from sentence_transformers import SentenceTransformer


class ModelManager:

    _embedding_model = None

    @classmethod
    def get_embedding_model(cls):

        if cls._embedding_model is None:

            print("Loading Embedding Model...")

            cls._embedding_model = SentenceTransformer(
                "BAAI/bge-small-en-v1.5"
            )

            print("Embedding Model Loaded.")

        return cls._embedding_model