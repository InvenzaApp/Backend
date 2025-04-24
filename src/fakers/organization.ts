import {adminFaker, moderatorFaker, pmFaker, taskPreviewFaker, workerFaker} from "./user";

export const defaultOrganization = {
    'id': 0,
    'title': 'Invenza',
    'usersIdList': [adminFaker.id],
    'adminId': adminFaker.id,
}

export const organizationFaker = {
    'id': 0,
    'title': "Invenza",
    'usersIdList': [adminFaker.id, moderatorFaker.id, pmFaker.id, workerFaker.id, taskPreviewFaker.id],
    'adminId': adminFaker.id,
};