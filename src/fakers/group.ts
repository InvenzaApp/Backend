import {Group} from "../models/group";

export const adminGroupFaker = new Group(
    0,
    "Administratorzy",
    [0],
);

export const moderatorGroupFaker = new Group(
    1,
    "Moderatorzy",
    [0, 1],
);

export const pmGroupFaker = new Group(
    2,
    "Menagerzy",
    [0, 1, 2],
);

export const workerGroupFaker = new Group(
    3,
    "Pracownicy",
    [0, 1, 2, 3],
);

export const taskPreviewGroupFaker = new Group(
    4,
    "Zadania",
    [0, 1, 2, 3, 4],
);