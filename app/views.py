from app import *
from app.decorators import *
from app.controller import *
from flask import render_template, request, redirect, url_for, session, send_file, flash, abort, Markup

import json
import uuid
import pandas as pd
import re
from datetime import date
import os
from jinja2 import TemplateNotFound

@app.route("/download_results", methods = ["GET"])
@logged
@authenticate
def download_results():

    if last_db_update != last_file_update:

        res = update_results_files()
        if res == None:
        
            flash("Todavía no hay suficientes datos.","Warning")
            return redirect(url_for("dashboard"))

    return send_file(os.getcwd() + app.config["RESULTS_FILE"])

@app.route('/login', methods=['GET','POST'])
def login():

    # Si se hace una petición GET
    if request.method == 'GET':
        try:
            return render_template('private/login.html')
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
            return redirect(url_for('admin_login'))

@app.route('/show_results', methods=['GET','POST'])
@logged
@authenticate
def show_results():

    if last_db_update != last_file_update:

        res = update_results_files()
        if res == None:
        
            flash("Todavía no hay suficientes datos.","Warning")
            return redirect(url_for("dashboard"))


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

@app.route("/tests/<test_type>", methods = ["GET"])
@logged
def tests(test_type):

    # Si no existen resultados del test en la base de datos, lo realizamos
    if db.trail_making_test.results.find_one({'id': session['id'], 'type': test_type}) == None:

        # Buscamos qué plantilla se tiene que renderizar
        template = tests_data[test_type]['template']

        # Preparamos los argumentos
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
                setCompleted(id, data['type'])

                last_db_update = date.today()

                return "OK", 200

            except Exception as e:
                
                return "fail", 500
        else:
            return "Not valid request", 400

    else:

        return "Not valid request", 400

@app.route("/dashboard", methods = ["GET"])
@logged
def dashboard():

    # Buscamos qué test han sido ya copletados por el usuario
    completed = [x['type'] for x in db.trail_making_test.results.find({'id': session['id']})]
    my_data = [isCompleted(x,completed) for x in tests_data.values()]
    #completed = getCompleted(id)

    # Preparamos los argumentos de la página
    args = {
        'title':'Prototipo',
        'tests':my_data
    }

    if session['id'] == app.config['ADMIN_ID']:
        args['admin'] = True

    return render_template("public/dashboard.html",args=args)

@app.route("/",methods=["GET", "POST"])
def form():

    if request.method == "GET":

        args = {'title': 'Neuropsycological Test'}
        return render_template("public/form.html", args = args)
        
    elif request.method == "POST":
        
        # Eliminamos los espacios de la cadena de nombres y apellidos
        data = {x: re.sub(' +', ' ', v.strip()) for x, v in dict(request.values).items()}

        if db.trail_making_test.users.find_one(data) != None:

            flash("Este usuario ya se ha registrado. Por favor, crea otro nuevo.","Danger")
            return redirect(request.url)

        # Añadimos el identificador de sesión a las cookies y a la bbdd
        data['id'] = session['id'] = str(uuid.uuid4())

        # Añadimos la fecha de creación del usuario
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

@app.route("/logout", methods=["GET"])
def logout():

    # Limpiamos la sessión y lo redirigimos al form
    session.clear()
    return redirect(url_for("form"))

