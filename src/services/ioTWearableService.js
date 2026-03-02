import { IoTWearable } from "../models/iotWearableModel.js";

export class IoTWearableService {
    async findIotBySerialNumber(iotSerialNumber) {
        const iotWearable = await IoTWearable.findOne({ where: { wearable_serial_number: iotSerialNumber } });

        return iotWearable;
    };

    async verifyActivationCode(iotWearable, inputIotActivationCode, options = {}) {
        if (iotWearable.wearable_activation_code !== inputIotActivationCode) {
            throw new Error('Invalid device activation code');
        }

        await iotWearable.update({
            wearable_activated_at : new Date(),
        }, options);

        return iotWearable;
    };
}