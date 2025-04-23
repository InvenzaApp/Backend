import {userFaker} from "./user";

export const organizationFaker = {
    'id': 0,
    'title': "Invenza",
    'usersIdList': [userFaker.id],
    'adminId': userFaker.id,
};