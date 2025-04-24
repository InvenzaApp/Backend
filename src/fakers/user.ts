import { User } from "../models/user";
import hashPassword from "../helpers/hash-password";
import { adminPermissions, moderatorPermissions, PMPermissions, PreviewTaskPermissions, WorkerPermissions } from "./permissions";

require('dotenv').config();
const defaultUserPassword = process.env.DEFAULT_USER_PASSWORD as string;


export const adminFaker = new User(
    0, 
    "Administrator", 
    "Developer", 
    "Administrator Developer", 
    "admin@invenza.pl", 
    hashPassword(defaultUserPassword), 
    0, 
    [0],
    adminPermissions,
);

export const moderatorFaker = new User(
    1, 
    "Jan", 
    "Kowalski", 
    "Jan Kowalski", 
    "jan.kowalski@invenza.pl", 
    hashPassword('pswd123123'), 
    0, 
    [0],
    moderatorPermissions,
);

export const pmFaker = new User(
    2, 
    "Anna", 
    "Nowak", 
    "Anna Nowak", 
    "anna.nowak@invenza.pl", 
    hashPassword('pswd123123'), 
    0, 
    [0],
    PMPermissions,
);

export const workerFaker = new User(
    3, 
    "Piotr", 
    "Wiśniewski", 
    "Piotr Wiśniewski", 
    "piotr.wisniewski@invenza.pl", 
    hashPassword('pswd123123'), 
    0, 
    [0],
    WorkerPermissions,
);

export const taskPreviewFaker = new User(
    4, 
    "Krzysztof", 
    "kowalczyk", 
    "Krzysztof Kowalczyk", 
    "krzysztof.kowalczyk@invenza.pl", 
    hashPassword('pswd123123'), 
    0, 
    [0],
    PreviewTaskPermissions,
);