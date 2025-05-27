import { User } from "../features/user/models/user";
import hashPassword from "../helpers/hash-password";
import { adminPermissionsModel, applePermissionsModel, googlePermissionsModel } from "./permissions";

require('dotenv').config();
const defaultUserPassword = process.env.DEFAULT_USER_PASSWORD as string;

export const defaultAdminModel = new User({
    id: 0, 
    name: "Administrator", 
    lastname: "Developer", 
    title: "Administrator Developer", 
    email: "admin@invenza.pl", 
    password: hashPassword(defaultUserPassword), 
    organizationsIdList: [0, 1, 2], 
    groupsIdList: [0, 1],
    groups: null,
    permissions: adminPermissionsModel,
    admin: true,
    superadmin: true,
    locked: true,
});

export const defaultGoogleModel = new User({
    id: 1, 
    name: "Google", 
    lastname: "Tester", 
    title: "Google Tester", 
    email: "googletester@invenza.pl", 
    password: hashPassword(defaultUserPassword), 
    organizationsIdList: [0, 1], 
    groupsIdList: [0],
    groups: null,
    permissions: googlePermissionsModel,
    admin: false,
    superadmin: false,
    locked: true,
});

export const defaultAppleModel = new User({
    id: 2, 
    name: "Apple", 
    lastname: "Tester", 
    title: "Apple Tester", 
    email: "appletester@invenza.pl", 
    password: hashPassword(defaultUserPassword), 
    organizationsIdList: [0, 2], 
    groupsIdList: [1],
    groups: null,
    permissions: applePermissionsModel,
    admin: false,
    superadmin: false,
    locked: true,
});