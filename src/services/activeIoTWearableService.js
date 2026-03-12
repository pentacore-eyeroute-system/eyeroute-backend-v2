import { ActiveIoTWearable } from "../models/activeIoTWearableModel.js";

export class ActiveIoTWearableService {
    async addActiveIoT(iotWearableId, pviId, options = {}) {
        const activeIoTWearable = await ActiveIoTWearable.create({
            act_linked_wearable_id : iotWearableId,
            act_linked_pvi_id      : pviId,
        }, { ...options });

        return activeIoTWearable;
    };

    async findByWearableId(iotWearableId) {
        const activeIoTWearable = await ActiveIoTWearable.findOne({ where : { act_linked_wearable_id : iotWearableId } });

        return activeIoTWearable;
    };

    async softDeleteActiveIoT(pviId, options = {}) {
        await ActiveIoTWearable.destroy({ where : { act_linked_pvi_id : pviId }, ...options });
    }
}