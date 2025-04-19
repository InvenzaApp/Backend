import {Organization} from "../models/organization";
import {userFaker} from "./user";

export const organizationFaker = new Organization(
    0,
    "Invenza",
    [userFaker],
    userFaker,
);