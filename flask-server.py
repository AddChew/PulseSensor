from threading import Timer
from webbrowser import open_new_tab
from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def main():
    return render_template('App.html')

if __name__=='__main__':
    Timer(1, open_new_tab('http://127.0.0.1:5000/')).start()
    app.run(debug=False)