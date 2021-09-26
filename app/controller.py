import pandas as pd
from app import app,db,tests_data
import os
import traceback
from app.model import *
from flask import session

def update_results_files() -> bool:
    
    # Creamos los dataframes
    users =  pd.DataFrame(data = list(db.trail_making_test.users.find()))
    results =  pd.DataFrame(data = list(db.trail_making_test.results.find()))

    # Si alguno de los dos está vacío, devolvemos nulo
    if users.empty or results.empty:
        return None

    # En caso contrario
    else:

        try:

            users = users.drop('_id',axis="columns").set_index('id')
            results = results.drop('_id',axis="columns")

            to_join = []
            for x in ["A","B","C","D","E","F"]:
                tmp = results[results['type'] == x]
                tmp.columns = ['{}{}'.format(c, '' if c == "id" else '_' + tmp['type'].unique()[0]) for c in results.columns]
                to_join.append(tmp.set_index("id"))
                
            to_join.append(users)
            final = to_join[0]
            for i in range(1,len(to_join)):
                final = pd.merge(final, to_join[i], left_index=True, right_index=True, how="outer")

            final.to_excel(os.getcwd() + app.config["RESULTS_FILE"])
            final.to_pickle(os.getcwd() + app.config['PICKLE'])
            
            return True

        except Exception as e:

            return None

def prepare_test_args(test_type: test_type) -> dict:

    # Si existen instrucciones, se añadem
    if 'instructions' in tests_data[test_type]:
        instructions = tests_data[test_type]['instructions']
    else:
        instructions = None

    # En caso de que el test sea el tipo F
    if test_type != 'F':

        args = {
            'title': "Neuropsychological Test",
            'test_type': test_type,
            'instructions': instructions,
        }

    # En caso de que sea de otro tipo
    else:

        args = {
            'title': "Neuropsychological Test",
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

def prepare_dashboard_args() -> dict:

    if session['id'] == app.config['ADMIN_ID']:
        return {
            'title':'Neuropsychology test',
            'admin':True,
            'user_number': db.trail_making_test.users.count(),
            'A_number': db.trail_making_test.users.find({'type': 'A'}).count(),
            'B_number': db.trail_making_test.results.find({'type': 'B'}).count(),
            'C_number': db.trail_making_test.users.find({'type': 'C'}).count(),
            'D_number': db.trail_making_test.users.find({'type': 'D'}).count(),
            'E_number': db.trail_making_test.users.find({'type': 'E'}).count(),
            'F_number': db.trail_making_test.users.find({'type': 'F'}).count(),                        
        }
    else:
        return {
            'title':'Neuropsychology test',
            'tests':get_test_completed(),
            'admin':False
        }

def is_completed(x: list, completed: list) -> list:
    if x['test_type'] in completed:
        x['completed'] = True
    else:
        x['completed'] = False
    return x

def get_test_completed() -> list:
    
    # Buscamos qué test han sido ya copletados por el usuario
    completed = [x['type'] for x in db.trail_making_test.results.find({'id': session['id']})]
    return [is_completed(x,completed) for x in tests_data.values()]