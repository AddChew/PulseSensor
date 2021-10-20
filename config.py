# Import the necessary libraries
import os
import sys

# Config for auto reload of templates
TEMPLATES_AUTO_RELOAD = True

# Config for flask executor
EXECUTOR_TYPE = "thread"
EXECUTOR_MAX_WORKERS = None
EXECUTOR_PROPAGATE_EXCEPTIONS = True

# Config for max file upload size
MAX_CONTENT_LENGTH = 2 * 1024 * 1024

# Config for base path
BASE_PATH = os.getcwd()
if getattr(sys, "frozen", False):
    BASE_PATH = getattr(sys, "_MEIPASS", os.path.dirname(os.path.abspath(__file__))) 

# Config for static and templates folder
STATIC_FOLDER = os.path.join(BASE_PATH, "static")
TEMPLATES_FOLDER = os.path.join(BASE_PATH, "templates")

# Config for app icon
ICON_PATH = os.path.join(STATIC_FOLDER, "images", "appicon.png")

# Config for model and tokenizer
MODEL_FOLDER = os.path.join(BASE_PATH, "models")
MODEL_PATH = os.path.join(MODEL_FOLDER, "sent-transformer.onnx")
VOCAB_PATH = os.path.join(MODEL_FOLDER, "vocab.txt")

# Config for file storage
STORAGE_FOLDER = os.path.join(BASE_PATH, "storage")
ZIPPED_FILE = "Top2VecResults.zip"
UPLOAD_FILE = "upload.csv"
UPLOAD_PATH = os.path.join(STORAGE_FOLDER, UPLOAD_FILE)
ZIPPED_PATH = os.path.join(STORAGE_FOLDER, ZIPPED_FILE)
RESULTS_PATH = os.path.join(STORAGE_FOLDER, "results.xlsx")
SUMMARY_PATH = os.path.join(STORAGE_FOLDER, "summary.xlsx")