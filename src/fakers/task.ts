import {DateTime} from "../helpers/date-time";
import { randomFutureDate } from "./dates";
import { adminFaker, moderatorFaker } from "./user";

export const taskFaker1 = {
    'id': 0,
    'title': "Utworzyć zespół",
    'description': "Dokończyć tworzenie zespołu",
    'deadline': DateTime.getDateTimestamp(randomFutureDate()),
    'groupsIdList': [0],
    'createdAt': DateTime.getFullTimestamp(),
    'createdById': adminFaker.id,
    'status': 'done',
};

export const taskFaker2 = {
    'id': 1,
    'title': "Nadzór",
    'description': "Skończyć nadzór zespołu",
    'deadline': DateTime.getDateTimestamp(randomFutureDate()),
    'groupsIdList': [1],
    'createdAt': DateTime.getFullTimestamp(),
    'createdById': moderatorFaker.id,
    'status': 'inProgress',
};

export const taskFaker3 = {
    'id': 2,
    'title': "Tabela danych",
    'description': "Wpisać wszystkie zarobki do tabelki",
    'deadline': DateTime.getDateTimestamp(randomFutureDate()),
    'groupsIdList': [0, 1, 2, 3],
    'createdAt': DateTime.getFullTimestamp(),
    'createdById': adminFaker.id,
    'status': 'waiting',
};

export const taskFaker4 = {
    'id': 3,
    'title': "Weryfikacja dokumentów",
    'description': "Sprawdzić poprawność wszystkich dokumentów",
    'deadline': DateTime.getDateTimestamp(randomFutureDate()),
    'groupsIdList': [0, 2, 3],
    'createdAt': DateTime.getFullTimestamp(),
    'createdById': moderatorFaker.id,
    'status': 'testing',
};

export const taskFaker5 = {
    'id': 4,
    'title': "Testowanie aplikacji",
    'description': "Przeprowadzić pełne testy wersji beta",
    'deadline': DateTime.getDateTimestamp(randomFutureDate()),
    'groupsIdList': [0, 1, 2, 3],
    'createdAt': DateTime.getFullTimestamp(),
    'createdById': adminFaker.id,
    'status': 'review',
};

export const taskFaker6 = {
    'id': 5,
    'title': "Zebranie zespołu",
    'description': "Zorganizować spotkanie zespołu projektowego",
    'deadline': DateTime.getDateTimestamp(randomFutureDate()),
    'groupsIdList': [0, 1, 2, 3],
    'createdAt': DateTime.getFullTimestamp(),
    'createdById': moderatorFaker.id,
    'status': 'toDo',
};