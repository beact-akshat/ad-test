//admin route
const MerchantRoute = require('./routes/merchantRoute')


module.exports = [
    MerchantRoute
]
const crypto = require('crypto')
const algorithm = 'AES-256-GCM'
const secretKey = process.env.ENCRYPTION_SECRET_KEY
const key = crypto.createHash('sha256').update(secretKey, 'ascii').digest()
const iv = 'dc3870dcb8dfde1d'// crypto.randomBytes(8).toString('hex')


const encryptionKey = process.env.encryptionKey || crypto.randomBytes(32); // 256-bit key


// Function to encrypt data using AES-256-CCM
const encrypt = ({ originalData, encryptionKey }) => {
    const nonce = crypto.randomBytes(12); // 12-byte nonce
    const cipher = crypto.createCipheriv('aes-256-ccm', encryptionKey, nonce, {
        authTagLength: 16 // 16-byte authentication tag
    });


    let encryptedData = cipher.update(originalData, 'utf8', 'hex')
    encryptedData += cipher.final('hex')
    const authTag = cipher.getAuthTag();


    return ${nonce.toString('hex')}.${encryptedData.toString('hex')}.${authTag.toString('hex')}
};


// Function to decrypt data using AES-256-CCM
const decrypt = ({ encryptedData, encryptionKey }) => {
    const inputData = encryptedData.split('.')
    if (inputData.length != 3) throw new Error('Invalid Data Format!')
    const nonce = inputData[0], string = inputData[1], authTag = inputData[2]


    const decipher = crypto.createDecipheriv('aes-256-ccm', encryptionKey, Buffer.from(nonce, 'hex'), {
        authTagLength: 16 // 16-byte authentication tag
    });


    decipher.setAuthTag(Buffer.from(authTag, 'hex'));


    let decryptedBuffer = decipher.update(string, 'hex', 'utf8')
    decryptedBuffer += decipher.final('utf8')


    return decryptedBuffer.toString('utf8');
};


// Example usage
const originalData = 'hellow'


// Encrypt the data
const encryptedData = encrypt({ originalData: JSON.stringify(originalData), encryptionKey });
console.log({ 'Encrypted Data': encryptedData });


// Decrypt the data
const decryptedData = decrypt({ encryptedData, encryptionKey });
console.log({ 'Decrypted Data': JSON.parse(decryptedData) });


module.exports = {
    encrypt,
    decrypt
}
const testCheck = Joi.extend((joi) => ({
    type: 'objectId',
    base: joi.string(),
    messages: {
        'objectId.base': '{{#label}} must be valid ObjectID'
    },
    validate(value, helpers) {
        if (!ObjectId.isValid(value)) {
            return { value, errors: helpers.error('objectId.base') }
        }
    }
}))
