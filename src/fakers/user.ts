import {User} from "../models/user";
import hashPassword from "../helpers/hash-password";

require('dotenv').config();
const defaultUserPassword = process.env.DEFAULT_USER_PASSWORD as string;


export const userFaker = new User(
    0, "Administrator", "Developer", "admin@invenza.pl", hashPassword(defaultUserPassword), 0, [0]
);