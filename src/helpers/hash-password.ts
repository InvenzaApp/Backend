import crypto from 'crypto';

const hashPassword = (password: string) => {
    return crypto.createHash('md5').update(password).digest('hex');
}

export default hashPassword;