

from app.core.model_manager import ModelManager

class EmbeddingService:

    def __init__(self):


        self.model = ModelManager.get_embedding_model()

    def generate_embeddings(self, texts):

        return self.model.encode(
            texts,
            batch_size=512,
            normalize_embeddings=True,
            convert_to_numpy=True,
            show_progress_bar=False
        )