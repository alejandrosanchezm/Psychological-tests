from enum import Enum, unique
@unique
class gender(Enum):
    MALE = 1
    FEMALE = 2
    UNDEFINED = 3
    OTHER = 4

class user:

    name: str
    surname: str
    dni: str
    gender: gender
    examinator: str
    ocupation: str
    date: str
    education: str
    id: str

@unique
class test_type(Enum):
    A = 1
    B = 2
    C = 3
    D = 4
    E = 5
    F = 6