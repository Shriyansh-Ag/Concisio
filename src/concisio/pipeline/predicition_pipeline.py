from src.concisio.config.configuration import ConfigurationManager
from transformers import AutoTokenizer
from transformers import pipeline
import os

BASE_MODEL = "google/pegasus-cnn_dailymail"


class PredictionPipeline:
    def __init__(self):
        self.config = ConfigurationManager().get_model_evaluation_config()

    def predict(self, text):
        # Use fine-tuned model if available, else fall back to base HF model
        model_path = self.config.model_path
        tokenizer_path = self.config.tokenizer_path

        if os.path.exists(model_path):
            tokenizer = AutoTokenizer.from_pretrained(tokenizer_path)
            model_source = model_path
        else:
            tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL)
            model_source = BASE_MODEL

        gen_kwargs = {"length_penalty": 0.8, "num_beams": 8, "max_length": 128}

        pipe = pipeline("text-generation", model=model_source, tokenizer=tokenizer)

        print("Dialogue:")
        print(text)

        output = pipe(text, **gen_kwargs)[0]["generated_text"]
        print("\nModel Summary:")
        print(output)

        return output