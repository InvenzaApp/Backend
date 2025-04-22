import {userFaker} from "./user";
import {DateTime} from "../helpers/date-time";

export const taskFaker = {
    'id': 0,
    'title': "Przykładowe zadanie",
    'description': "Przykładowy opis podstawowego zadania",
    'deadline': null,
    'groupsIdList': [0],
    'createdAt': DateTime.getFullTimestamp(),
    'createdById': userFaker.id,
};