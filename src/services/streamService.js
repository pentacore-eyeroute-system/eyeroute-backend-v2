import { Stream } from "../models/streamModel.js";

export class StreamService {
    async upsertStream(activeWearableId, streamUrl) {
        await Stream.upsert({
            str_linked_active_wearable_id: activeWearableId,
            str_url: streamUrl,
        });
    };

    async getStream(activeWearableId) {
        const stream = Stream.findOne({ where : { str_linked_active_wearable_id: activeWearableId } });

        return stream;
    };
}