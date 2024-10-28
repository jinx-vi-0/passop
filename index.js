const crypto = require('crypto');


function encryptPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex'); 
    const iterations = 100000; 
    const keylen = 64; 
    const digest = 'sha512'; 

    
    const hashedPassword = crypto.pbkdf2Sync(password, salt, iterations, keylen, digest).toString('hex');

    return { salt, hashedPassword };
}


function verifyPassword(password, salt, hashedPassword) {
    const keylen = 64;
    const iterations = 100000;
    const digest = 'sha512';
    const derivedKey = crypto.pbkdf2Sync(password, salt, iterations, keylen, digest).toString('hex');

    return derivedKey === hashedPassword; 

}
const password = 'yourPassword123'; 
const { salt, hashedPassword } = encryptPassword(password);
console.log(`Salt: ${salt}`);
console.log(`Encrypted Password: ${hashedPassword}`);

const isMatch = verifyPassword(password, salt, hashedPassword);
console.log(`Password Match: ${isMatch}`);
