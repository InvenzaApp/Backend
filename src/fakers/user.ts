import { User } from "../models/user";
import hashPassword from "../helpers/hash-password";
import { adminPermissions } from "./permissions";

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
    true,
    true,
);