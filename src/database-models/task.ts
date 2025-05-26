import { DateTime } from "../helpers/date-time";

export const invenzaGoogleTaskModel = {
    'id': 0,
    'title': 'Publish app',
    'description': 'Finish and publish app to PlayStore',
    'deadline': '2025-05-30T18:00:00.000',
    'groupsIdList': [0],
    'groupsList': null,
    'createdAt': DateTime.getFullTimestamp(),
    'createdById': 0,
    'status': 'inProgress',
    'locked': true,
    'comments': [],
    'commentsEnabled': false
}

export const invenzaAppleTaskModel = {
    'id': 1,
    'title': 'Publish app',
    'description': 'Finish and publish app to AppStore',
    'deadline': '2025-05-30T18:00:00.000',
    'groupsIdList': [1],
    'groupsList': null,
    'createdAt': DateTime.getFullTimestamp(),
    'createdById': 0,
    'status': 'inProgress',
    'locked': true,
    'comments': [],
    'commentsEnabled': false
}