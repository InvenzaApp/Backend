const admin = require('firebase-admin');
const serviceAccount = require('../../fcmServiceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const messaging = admin.messaging();

export default messaging;