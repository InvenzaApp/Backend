import { User } from "../features/user/models/user";
import hashPassword from "../helpers/hash-password";
import { adminPermissions } from "./permissions";

require('dotenv').config();
const defaultUserPassword = process.env.DEFAULT_USER_PASSWORD as string;

export const adminFaker = new User({
    id: 0, 
    name: "Administrator", 
    lastname: "Developer", 
    title: "Administrator Developer", 
    email: "admin@invenza.pl", 
    password: hashPassword(defaultUserPassword), 
    organizationsIdList: [0], 
    groupsIdList: [0],
    groups: null,
    permissions: adminPermissions,
    admin: true,
    superadmin: true,
    locked: true,
});