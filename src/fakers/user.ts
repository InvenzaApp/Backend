import { User } from "../models/user";
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
    organizationId: 0, 
    groupsIdList: [0],
    groups: null,
    permissions: adminPermissions,
    admin: true,
    locked: true,
});