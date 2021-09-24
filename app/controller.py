import pandas as pd
from app import app,db,tests_data
import os

def update_results_files():

    users =  pd.DataFrame(data = list(db.trail_making_test.users.find()))
    results =  pd.DataFrame(data = list(db.trail_making_test.results.find()))

    if users.empty:
        return None

    elif results.empty:
        return None

    else:
        users = users.set_index('id').drop('_id',axis="columns")
        results = results.set_index('id').drop('_id',axis="columns")

    to_join = [results[results['type'] == x].add_suffix('_' + x) for x in ["A","B","C","D","E","F"]]
    to_join.append(users)

    if to_join != None:
        tmp = pd.concat(to_join, axis=1)

        to_remove = ['type_' + x for x in ["A","B","C","D","E","F"]]+ ['errors_' + x for x in ["A","B","C","D","E"]] + ['n_test_' + x for x in ["A","B","C","D","E"]] + ['n_errors_F','times_F']
        for x in to_remove:
            if x in tmp.columns:
                del tmp[x]

        tmp.to_excel(os.getcwd() + app.config["RESULTS_FILE"])
        tmp.to_pickle(os.getcwd() + app.config['PICKLE'])
        return True

    else:
        return None

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

def isCompleted(x,completed):
    if x['test_type'] in completed:
        x['completed'] = True
    else:
        x['completed'] = False
    return x