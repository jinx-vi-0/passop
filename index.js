const crypto = require('crypto');


// Function to encrypt password
function encryptPassword(password) {
    const iterations = 100000; // Number of iterations
    const keylen = 64; // Length of the derived key
    const digest = 'sha512'; // Hashing algorithm

    // Derive a key using PBKDF2


function encryptPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex'); 
    const iterations = 100000; 
    const keylen = 64; 
    const digest = 'sha512'; 

    

    const hashedPassword = crypto.pbkdf2Sync(password, salt, iterations, keylen, digest).toString('hex');

    return { salt, hashedPassword };
}


// Function to verify password



function verifyPassword(password, salt, hashedPassword) {
    const keylen = 64;
    const iterations = 100000;
    const digest = 'sha512';
    const derivedKey = crypto.pbkdf2Sync(password, salt, iterations, keylen, digest).toString('hex');


    return derivedKey === hashedPassword; // Compare the derived key with the stored hashed password
}

// Example usage
const password = 'yourPassword123'; // Replace with the password you want to encrypt
const { salt, hashedPassword } = encryptPassword(password);
console.log(`Salt: ${crypto.randomBytes(16).toString('hex')}`);
console.log(`Encrypted Password: ${hashedPassword}`);

    return derivedKey === hashedPassword; 

}
const password = 'yourPassword123'; 
const { salt, hashedPassword } = encryptPassword(password);
console.log(`Salt: ${salt}`);
console.log(`Encrypted Password: ${hashedPassword}`);

const isMatch = verifyPassword(password, salt, hashedPassword);
console.log(`Password Match: ${isMatch}`);

