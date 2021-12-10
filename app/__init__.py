from flask import Flask
from pymongo import MongoClient
from flask_cors import CORS
from config import ProductionConfig
import datetime
import json
import numpy as np
from datetime import date

app = Flask(__name__,template_folder='templates', static_folder='static')

app.config.from_object(ProductionConfig)

app.permanent_session_lifetime = datetime.timedelta(days=1)

tests_data = dict((v['test_type'], v) for v in list(json.load(open(app.config['TEST_FILE'],))['data']['tests'].values()))

tests_data["F"]["data"]["n_test"] = list(np.asarray(tests_data["F"]["data"]["table_test"]).reshape(-1)).count(tests_data["F"]["data"]["target_symbol"])
tests_data["F"]["data"]["n_training"] = list(np.asarray(tests_data["F"]["data"]["table_training"]).reshape(-1)).count(tests_data["F"]["data"]["target_symbol"])
tests_data["F"]["data"]["table_training"] = [["svg" + str(x) + ".html" for x in i ] for i in tests_data["F"]["data"]["table_training"]]
tests_data["F"]["data"]["table_test"] = [["svg" + str(x) + ".html" for x in i ] for i in tests_data["F"]["data"]["table_test"]]

last_db_update =  date.today()
last_file_update = date.today() - datetime.timedelta(days=1)

CORS(app)
db = MongoClient("mongodb+srv://admin:XXXXX@cluster0.nh98u.mongodb.net/trail_making_test?retryWrites=true&w=majority")

from app import views, error
