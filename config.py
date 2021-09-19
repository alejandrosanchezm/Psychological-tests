class Config(object):

    DEBUG = False
    TESTING = False
    SECRET_KEY = "OCML3BRawWEUeaxcuKHLpw"
    SESSION_COOKIE_SECURE = True
    RESULTS_FILE = '/app/tmp/results.xlsx'
    TEST_FILE ="./app/static/tests.json"
    SEND_FILE_MAX_AGE_DEFAULT = 0
    ADMIN_USER = "admin"
    ADMIN_PASS = "password"
    ADMIN_ID = "21396"
    PICKLE = '/app/tmp/pickle.pkl'

class ProductionConfig(Config):
    pass