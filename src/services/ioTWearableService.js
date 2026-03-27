import { IoTWearable } from "../models/iotWearableModel.js";

export class IoTWearableService {
    async findIotBySerialNumber(iotSerialNumber) {
        const iotWearable = await IoTWearable.findOne({ where: { wearable_serial_number: iotSerialNumber } });

        return iotWearable;
    };

    async findIotById(iotId) {
        const iotWearable = await IoTWearable.findByPk(iotId);

        return iotWearable;
    };

    async verifyActivationCode(iotWearable, inputIotActivationCode, options = {}) {
        console.log('DEBUG: Verifying activation code:', {
            dbCode: iotWearable.wearable_activation_code,
            dbType: typeof iotWearable.wearable_activation_code,
            inputCode: inputIotActivationCode,
            inputType: typeof inputIotActivationCode
        });

        if (iotWearable.wearable_activation_code != inputIotActivationCode) { // Using != to allow type conversion if needed
            throw new Error('Invalid device activation code');
        }

        await iotWearable.update({
            wearable_activated_at : new Date(),
        }, { ...options });

        return iotWearable;
    };
}