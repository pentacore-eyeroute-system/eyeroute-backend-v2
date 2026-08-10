export function otpEmailTemplate(otp) {
    return {
        subject: 'Verify Your Account',
        body: `
Hello,

Use the verification code below to complete your registration:

${otp}

This code expires in 5 minutes.

For your security, please do not share this code with anyone.

If you did not request this code, please ignore this email.

Best regards,
EyeRoute Team
        `
    };
};