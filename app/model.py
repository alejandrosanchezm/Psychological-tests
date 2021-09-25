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
