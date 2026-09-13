import crypto from 'crypto';

function generateActivationCode(length = 20) {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = crypto.randomInt(0, characters.length);
        code += characters[randomIndex];
    }

    return code;
}

console.log(generateActivationCode());