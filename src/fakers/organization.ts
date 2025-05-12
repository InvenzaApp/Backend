import { addressFaker } from "./address";
import {adminFaker} from "./user";

export const defaultOrganization = {
    'id': 0,
    'title': 'Invenza',
    'usersIdList': [adminFaker.id],
    'adminId': adminFaker.id,
    'address': addressFaker,
    'locked': false
}