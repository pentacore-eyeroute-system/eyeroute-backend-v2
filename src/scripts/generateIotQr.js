import qrCode from 'qrcode';
import { IoTWearableService } from "../services/ioTWearableService.js";
import { AwsService } from '../services/awsService.js';

const ioTWearableService = new IoTWearableService();
const awsService = new AwsService();

export async function massGenerateIotQrCode() {
    try {
        // Get all iots
        const iots = await ioTWearableService.getAllIots();

        const folderName = 'iot-qr-codes';
        const fileMimeType = 'image/png';

        for (let i = 0; i < iots.length; i++) {
            const iot = iots[i];
            const currentSerialNumber = iot.wearable_serial_number;
            const currentActivationCode = iot.wearable_activation_code;

            const serialNumberFileKey = `${folderName}/${currentSerialNumber}-serial.png`;
            const activationCodeFileKey = `${folderName}/${currentSerialNumber}-activation.png`;

            // Checks if serial number qr code exists in aws s3 bucket
            const serialNumberQrExists = await awsService.iotQrCodeExists(serialNumberFileKey);

            if (!serialNumberQrExists) {
                // Generates qr code for serial number
                const qrCodeBuffer = await generateQrCode(currentSerialNumber);

                // Uploads qr code to aws s3 bucket
                await awsService.uploadIotQrCode(serialNumberFileKey, qrCodeBuffer, fileMimeType);
            }

            // Checks if activation qr code exists in aws s3 bucket
            const activationCodeQrExists = await awsService.iotQrCodeExists(activationCodeFileKey);

            if (!activationCodeQrExists) {
                // Generates qr code for activation code
                const qrCodeBuffer = await generateQrCode(String(currentActivationCode));

                // Uploads qr code to aws s3 bucket
                await awsService.uploadIotQrCode(activationCodeFileKey, qrCodeBuffer, fileMimeType);
            }
        }

        console.log("Iot QR Generation Success")
    } catch (err) {
        console.log("Iot QR Generation Failed: ", err);
    }
};

export function generateQrCode(text) {
    const qrCodeBuffer = qrCode.toBuffer(text);

    return qrCodeBuffer;
};

massGenerateIotQrCode();