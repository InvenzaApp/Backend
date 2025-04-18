import {Task} from "../models/task";
import {userFaker} from "./user";
import {DateTime} from "../helpers/date-time";

export const taskFaker = new Task(
    0,
    "Przykładowe zadanie",
    "Przykładowy opis podstawowego zadania",
    null,
    [0],
    DateTime.getFullTimestamp(),
    userFaker,
);