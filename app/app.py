# Import the necessary libraries
from flask import Flask, render_template

app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")

# import os
# import pandas as pd
# from flask_executor import Executor
# from models.pipeline import Pipeline
# from flask_uploads import UploadSet, configure_uploads
# from flask import Flask, redirect, render_template, request, jsonify, send_from_directory, url_for, make_response
# from config import STATIC_FOLDER, TEMPLATES_FOLDER
# from desktop.gui import Kiosk


# # Configure application
# app = Flask(__name__, static_folder = STATIC_FOLDER, template_folder = TEMPLATES_FOLDER)
# app.config.from_object("config")


# # Configure kiosk
# kiosk = Kiosk(app)


# # Initialise Executor
# executor = Executor(app)

# # Initialise Uploads
# csvs = UploadSet("csvs", ("csv"), lambda app: app.config.get("STORAGE_FOLDER"))
# configure_uploads(app, csvs)


# def delete_files(*files):
#     """
#         Delete files
#     """
#     for file in files:
#         try:
#             os.remove(file)
#         except:
#             pass


# def job(jobDict: dict):
#     """
#         Apply Top2Vec algorithm to the uploaded file and then output the results 
#         as file buffers
#     """
#     feedback = jobDict.get("feedback")
#     upload_path = app.config.get("UPLOAD_PATH")
#     if not feedback or not os.path.isfile(upload_path):
#         return

#     # Read uploaded csv file
#     corpus = pd.read_csv(upload_path, encoding = "ISO-8859-1")
#     field1 = jobDict.get("field1")
#     field2 = jobDict.get("field2")

#     Pipeline(corpus, feedback, field1, field2)


# @app.route("/")
# def home():
#     # Delete all the stored results files
#     delete_files(
#         app.config.get("ZIPPED_PATH"),
#         app.config.get("UPLOAD_PATH"), 
#         app.config.get("RESULTS_PATH"), 
#         app.config.get("SUMMARY_PATH"),
#     )   
#     loggedin = request.cookies.get("loggedin", "is-active")
#     response = make_response(render_template("upload.html", loggedin = loggedin))
#     response.set_cookie(
#         "loggedin",
#         "hidden",
#         samesite = "Strict",
#     )
#     return response


# @app.route("/results", methods = ["GET", "POST"])
# def get_results():
#     if request.method == "GET":
#         executor.futures.pop("job")
#         return render_template("download.html")

#     # Save the uploaded file
#     csvs.save(request.files["csv"], name = app.config.get("UPLOAD_FILE"))

#     # Set job data
#     jobDict = {
#         "feedback": request.form.get("feedback"),
#         "field1": request.form.get("field1"),
#         "field2": request.form.get("field2"),
#     }

#     # Send job to task queue
#     executor.submit_stored("job", job, jobDict)
#     return render_template("progress.html")
    

# @app.route("/query-progress")
# def query_progress():
#     if not executor.futures.done("job"):
#         job_status = executor.futures._state("job")
#         return jsonify({"status": job_status})
#     return jsonify({"status": "done"})
    

# @app.route("/Top2VecResults.zip")
# def download_file():
#     if os.path.isfile(app.config.get("ZIPPED_PATH")):
#         response = make_response(
#             send_from_directory(
#                 directory = app.config.get("STORAGE_FOLDER"),
#                 path = app.config.get("ZIPPED_FILE"),
#                 as_attachment = True,
#                 mimetype = "application/vnd.ms-excel",
#                 ))

#         response.set_cookie(
#             "download",
#             "download-complete",
#             samesite = "Strict",
#         )
#         return response

#     return redirect(url_for("home"))
        

# if __name__ == "__main__":
#     kiosk.run()