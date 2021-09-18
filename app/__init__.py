from flask import Flask
from pymongo import MongoClient
from flask_cors import CORS
from config import ProductionConfig
import datetime
import json
import numpy as np

app = Flask(__name__,static_folder='static')
app.config.from_object(ProductionConfig)
app.permanent_session_lifetime = datetime.timedelta(days=1)

tests_data = dict((v['test_type'], v) for v in list(json.load(open(app.config['TEST_FILE'],))['data']['tests'].values()))

tests_data["F"]["data"]["n_test"] = list(np.asarray(tests_data["F"]["data"]["table_test"]).reshape(-1)).count(tests_data["F"]["data"]["target_symbol"])
tests_data["F"]["data"]["n_training"] = list(np.asarray(tests_data["F"]["data"]["table_training"]).reshape(-1)).count(tests_data["F"]["data"]["target_symbol"])
tests_data["F"]["data"]["table_training"] = [["svg" + str(x) + ".html" for x in i ] for i in tests_data["F"]["data"]["table_training"]]
tests_data["F"]["data"]["table_test"] = [["svg" + str(x) + ".html" for x in i ] for i in tests_data["F"]["data"]["table_test"]]

CORS(app)
#db = MongoClient('127.0.0.1', 27017)
db = MongoClient("mongodb+srv://admin:eKB139Mm@cluster0.nh98u.mongodb.net/trail_making_test?retryWrites=true&w=majority")

from app import views