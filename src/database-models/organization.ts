import { appleAddressModel, googleAddressModel, invenzaAddressModel } from "./address";
import {defaultAdminModel, defaultAppleModel, defaultGoogleModel} from "./user";

export const invenzaOrganizationModel = {
    'id': 0,
    'title': 'Invenza',
    'usersIdList': [defaultAdminModel.id, defaultGoogleModel.id, defaultAppleModel.id],
    'adminId': defaultAdminModel.id,
    'address': invenzaAddressModel,
    'locked': true
}

export const googleOrganizationModel = {
    'id': 1,
    'title': 'Google',
    'usersIdList': [defaultAdminModel.id, defaultGoogleModel.id],
    'adminId': defaultAdminModel.id,
    'address': googleAddressModel,
    'locked': true
}

export const appleOrganizationModel = {
    'id': 2,
    'title': 'Apple',
    'usersIdList': [defaultAdminModel.id, defaultAppleModel.id],
    'adminId': defaultAdminModel.id,
    'address': appleAddressModel,
    'locked': true
}