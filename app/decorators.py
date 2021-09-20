from app import app
from flask import request, redirect, url_for, session, flash
from functools import wraps

def logged(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        if 'id' not in session:
            flash("Tienes que registrarte para acceder ahí.", "Danger")
            return redirect(url_for("form"))     
        return f(*args, **kwargs)
    return wrapper

def authenticate(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        if 'id' not in session:
            flash("Tienes que registrarte para acceder ahí.", "Danger")
            return redirect(url_for("form"))
        else:
            if session['id'] == app.config['ADMIN_ID']:
                return f(*args, **kwargs)
            else:
                flash("Tienes que ser administrador para acceder ahí.", "Danger")
                return redirect(url_for(request.url))              
    return wrapper

@app.after_request
def add_header(r):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also to cache the rendered page for 10 minutes.
    """
    r.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    r.headers["Pragma"] = "no-cache"
    r.headers["Expires"] = "0"
    r.headers['Cache-Control'] = 'public, max-age=0'
    return r
