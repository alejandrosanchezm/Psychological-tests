class Config(object):

    DEBUG = False
    TESTING = False
    SECRET_KEY = "OCML3BRawWEUeaxcuKHLpw"
    SESSION_COOKIE_SECURE = True
    TEST_FILE ="static/tests.json"
    CANCELLATION_FILE ="static/cancellation_config.json"
    SEND_FILE_MAX_AGE_DEFAULT = 0

class ProductionConfig(Config):
    pass