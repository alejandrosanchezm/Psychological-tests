from app import app
from flask import render_template

@app.errorhandler(500)
def error500(e):
    return render_template('error/500.html'), 500

@app.errorhandler(404)
def error404(e):
    return render_template('error/404.html'), 404
