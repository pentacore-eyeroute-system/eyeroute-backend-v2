import { PVI } from '../models/personWithVisualImpairmentModel.js'

export class PersonWithVisualImpairmentService {
    async generatePviPublicId() {
        let lastPvi = await PVI.findOne({
            order: [['id', 'DESC']],
            paranoid: false,
        });

        if (!lastPvi) return "0000001";

        const lastPviJson = lastPvi.toJSON();
        const lastPviId = parseInt(lastPviJson.id);
        const nextPviId = lastPviId + 1;

        return nextPviId.toString().padStart(6, "0");
    };

    async createPvi(data, publicId, options = {}) {
        const pvi = await PVI.create({
            pvi_public_id   : publicId,
            pvi_first_name  : data.pviFirstname,
            pvi_last_name   : data.pviLastname,
            pvi_gender      : data.pviGender,
        }, { ...options });

        return pvi.id;
    };

    async findByPviPublicId(publicId) {
        const pvi = await PVI.findOne({ where: { pvi_public_id : publicId }});

        if (!pvi) return null;
        
        return pvi;
    };

    async findByPviId(id) {
        const pvi = await PVI.findByPk(id);
        
        return pvi;
    };


    async updatePviInfo(id, newPviData, options = {}) {
        const pvi = await PVI.findByPk(id);
        console.log('Service: updatePviInfo found pvi:', pvi ? pvi.id : 'null');

        await pvi.update({ 
            pvi_first_name  : newPviData.firstname,
            pvi_last_name   : newPviData.lastname,
            pvi_gender      : newPviData.gender,
        }, { ...options });

        return pvi;
    };

    async softDeletePvi(pviId, options = {}) {
        const deletedPviCount = await PVI.destroy({ where: { id : pviId }, ...options });

        if (deletedPviCount === 0) {
            throw new Error('PVI not found');
        };
    };
}