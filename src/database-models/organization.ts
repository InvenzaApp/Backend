import { defaultAddressModel } from "./address";
import {defaultAdminModel, defaultAppleModel, defaultGoogleModel} from "./user";

export const defaultOrganizationModel = {
    'id': 0,
    'title': 'Invenza',
    'usersIdList': [defaultAdminModel.id, defaultGoogleModel.id, defaultAppleModel.id],
    'adminId': defaultAdminModel.id,
    'address': defaultAddressModel,
    'locked': true
}