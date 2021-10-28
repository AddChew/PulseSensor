# Import the necessary libraries
from flask import Flask, render_template
# from desktop.gui import Kiosk


app = Flask(__name__)
# kiosk = Kiosk(app)


@app.route("/")
def index():
    return render_template("index.html")


# if __name__ == "__main__":
#     kiosk.run()