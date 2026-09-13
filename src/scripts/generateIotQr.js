import qrCode from 'qrcode';
import { IoTWearableService } from "../services/ioTWearableService.js";
import { AwsService } from '../services/awsService.js';

const ioTWearableService = new IoTWearableService();
const awsService = new AwsService();

export async function massGenerateIotQrCode(options = {}) {
    // Set forceOverwrite: true to replace/overwrite existing S3 QR codes, or false to skip existing ones
    const { forceOverwrite = false } = options;
     
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

            // Check if serial number qr code exists in aws s3 bucket unless forceOverwrite is true
            const serialNumberQrExists = forceOverwrite
                ? false
                : await awsService.iotQrCodeExists(serialNumberFileKey);

            if (!serialNumberQrExists) {
                // Generates qr code for serial number
                const qrCodeBuffer = await generateQrCode(currentSerialNumber);

                // Uploads qr code to aws s3 bucket
                await awsService.uploadIotQrCode(serialNumberFileKey, qrCodeBuffer, fileMimeType);
            }

            // Check if activation qr code exists in aws s3 bucket unless forceOverwrite is true
            const activationCodeQrExists = forceOverwrite
                ? false
                : await awsService.iotQrCodeExists(activationCodeFileKey);

            if (!activationCodeQrExists) {
                // Generates qr code for activation code
                const qrCodeBuffer = await generateQrCode(String(currentActivationCode));

                // Uploads qr code to aws s3 bucket
                await awsService.uploadIotQrCode(activationCodeFileKey, qrCodeBuffer, fileMimeType);
            }
        }

        console.log("Iot QR Generation Success");
    } catch (err) {
        console.log("Iot QR Generation Failed: ", err);
    }
};

export function generateQrCode(text) {
    const qrCodeBuffer = qrCode.toBuffer(text);

    return qrCodeBuffer;
};

massGenerateIotQrCode();