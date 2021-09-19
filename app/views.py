from app import app, db, tests_data, last_db_update, last_file_update
from flask import render_template, request, redirect, url_for, session, send_file, flash, abort, Markup
import json
import uuid
import pandas as pd
import re
from functools import wraps
from datetime import date
import os
from jinja2 import TemplateNotFound
from hashlib import sha256

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

@app.route("/dashboard", methods = ["GET"])
@logged
def dashboard():
        
    # Buscamos qué test han sido ya copletados por el usuario
    completed = [x['type'] for x in db.trail_making_test.results.find({'id': session['id']})]

    def isCompleted(x,completed):
        if x['test_type'] in completed:
            x['completed'] = True
        else:
            x['completed'] = False
        return x

    my_data = [isCompleted(x,completed) for x in tests_data.values()]

    # Preparamos los argumentos de la página
    args = {
        'title':'Prototipo',
        'tests':my_data
    }

    if session['id'] == app.config['ADMIN_ID']:
        args['admin'] = True

    return render_template("index.html",args=args)

@app.route("/tests/<test_type>", methods = ["GET"])
@logged
def tests(test_type):

    # Si no existen resultados del test en la base de datos, lo realizamos
    if db.trail_making_test.results.find_one({'id': session['id'], 'type': test_type}) == None:

        # Buscamos qué plantilla se tiene que renderizar
        template = tests_data[test_type]['template']

        # 
        args = prepare_args(test_type)

        # Renderizamos la plantilla
        return render_template(template,args=args)

    # Si ya se ha realizado el test
    else:

        flash("Ya has completado este test.", "Warning")
        return redirect(url_for("dashboard"))

@app.route('/store_data', methods=["POST"])
def store_data():

    if 'id' in session:
        
        if 'results' in request.form:

            data = json.loads(request.form['results'])
            try:

                # Añadimos a los datos a guardar el identificador del usuario
                data['id'] = session['id']

                # Guardamos los datos en bbdd
                db.trail_making_test.results.insert_one(data)

                last_db_update = date.today()

                return "OK", 200

            except Exception as e:
                
                return "fail", 500
        else:
            return "Not valid request", 400

    else:

        return "Not valid request", 400

@app.route("/",methods=["GET", "POST"])
def form():

    if request.method == "GET":

        args = {
            'title': 'Prototipo1'
        }
        return render_template("form.html", args = args)
        
    elif request.method == "POST":
        
        # Eliminamos los espacios de la cadena de nombres y apellidos
        data = {x: re.sub(' +', ' ', v.strip()) for x, v in dict(request.values).items()}

        if db.trail_making_test.users.find_one(data) != None:

            flash("Este usuario ya se ha registrado. Por favor, crea otro nuevo.","Danger")
            return redirect(request.url)

        # Añadimos el identificador de sesión a las cookies y a la bbdd
        data['id'] = session['id'] = str(uuid.uuid4())

        data['date'] =  date.today().strftime("%d/%m/%Y")

        # Guardamos los datos en la bbdd
        db.trail_making_test.users.insert_one(data)

        last_db_update = date.today()

        # Lo redirigimos al dashboard
        return redirect(url_for("dashboard"))

@app.route("/check_if_valid_data", methods=["POST"])
def check_if_valid_data():
    
    # Eliminamos los espacios de la cadena de nombres y apellidos
    data = {x: re.sub(' +', ' ', v.strip()) for x, v in dict(request.values).items()}
    
    # Comprobamos si existe un usuario con el nombre y los apellidos introducidos
    res = db.trail_making_test.users.find_one(data)

    # Si no existe, es válido
    if res == None:

        return "valid", 200

    # Si existe, es inválido
    else:

        return "invalid", 200

@app.route("/logout")
def logout():

    # Limpiamos la sessión y lo redirigimos al form
    session.clear()
    return redirect(url_for("form"))

@app.route("/download_results", methods = ["GET"])
@logged
@authenticate
def download_results():

    if last_db_update != last_file_update:

        update_results_files()

    return send_file(os.getcwd() + app.config["RESULTS_FILE"])


@app.errorhandler(500)
def error500(e):
    return render_template('error/500.html'), 500

@app.errorhandler(404)
def error404(e):
    return render_template('error/404.html'), 404

def prepare_args(test_type):

    # Obtenemos las instrucciones correspondientes
    # instructions = [x for x in tests_data if x['test_type'] == test_type][0]

    if 'instructions' in tests_data[test_type]:
        instructions = tests_data[test_type]['instructions']
    else:
        instructions = None

    if test_type != 'F':

        args = {
            'title': "Prototipo 1",
            'test_type': test_type,
            'instructions': instructions,
        }

    else:

        args = {
            'title': "Prototipo 1",
            'test_type': test_type,
            'instructions': instructions,
            'table_training': tests_data["F"]["data"]["table_training"],
            'n_training':tests_data["F"]["data"]["n_training"],
            'table_test': tests_data["F"]["data"]["table_test"],
            'n_test':tests_data["F"]["data"]["n_test"],
            'target_symbol': "svg" + str(tests_data["F"]["data"]["target_symbol"])  + ".html" ,
            'target_number': tests_data["F"]["data"]["target_symbol"]
        }

    return args

@app.route('/login', methods=['GET','POST'])
def login():

    # Si se hace una petición GET
    if request.method == 'GET':
        try:
            return render_template('login.html')
        except TemplateNotFound:
            abort(404)

    # Si se hace una petición POST
    elif request.method == 'POST':

        # Recogemos los valores del formulario
        user = request.values['user']
        password =  request.values['password']

        # Comprobamos si existe en la base de datos
        if user == app.config['ADMIN_USER'] and password == app.config['ADMIN_PASS']:

            # Establecemos una cookie de sesión con el identificador del usuario
            session['id'] = app.config['ADMIN_ID']

            # Si existe, lo redirigimos al dasboard
            return redirect(url_for('dashboard'))

        # En caso de que no exista, lanzamos una alerta y lo redirigimos al login
        else:
            flash("Usuario no encontrado.", "Warning")
            return redirect(url_for('login'))

@app.route('/show_results', methods=['GET','POST'])
@logged
@authenticate
def show_results():

    if last_db_update != last_file_update:

        update_results_files()

    df = pd.read_pickle(os.getcwd() + app.config["PICKLE"], compression='infer', storage_options=None)

    html = Markup(df.to_html(classes=["table-bordered", "table-striped", "table-hover"]))

    # Preparamos los argumentos de la página
    args = {
        'title':'Prototipo',
        'html':html,
        'user_number':df['name'].count(),
        'A_number':df['endTime_A'].count(),
        'B_number':df['endTime_B'].count(),
        'C_number':df['endTime_C'].count(),
        'D_number':df['endTime_D'].count(),
        'E_number':df['endTime_E'].count(),
        'F_number':df['endTime_F'].count()
    }


    if session['id'] == app.config['ADMIN_ID']:
        args['admin'] = True

    return render_template("results.html", args = args)

def update_results_files():

    users =  pd.DataFrame(data = list(db.trail_making_test.users.find()))
    results =  pd.DataFrame(data = list(db.trail_making_test.results.find()))

    if users.empty:
        return "Todavía no se han registrado usuarios.", 200

    elif results.empty:
        return "Todavía no hay resultados de tests.", 200

    else:
        users = users.set_index('id').drop('_id',axis="columns")
        results = results.set_index('id').drop('_id',axis="columns")

    to_join = [results[results['type'] == x].add_suffix('_' + x) for x in ["A","B","C","D","E","F"]]
    to_join.append(users)
    tmp = pd.concat(to_join, axis=1)

    to_remove = ['type_' + x for x in ["A","B","C","D","E","F"]]+ ['errors_' + x for x in ["A","B","C","D","E"]] + ['n_test_' + x for x in ["A","B","C","D","E"]] + ['n_errors_F','times_F']
    for x in to_remove:
        if x in tmp.columns:
            del tmp[x]

    tmp.to_excel(os.getcwd() + app.config["RESULTS_FILE"])
    tmp.to_pickle(os.getcwd() + app.config['PICKLE'])