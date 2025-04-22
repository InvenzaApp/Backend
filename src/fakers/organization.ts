import {userFaker} from "./user";

export const organizationFaker = {
    'id': 0,
    'name': "Invenza",
    'usersIdList': [userFaker.id],
    'adminId': userFaker.id,
};