import { FamilyPviLink } from "../models/familyPviLinkModel.js";

export class FamilyPviLinkService {
    async findByFamId(id) {
        const pvis = await FamilyPviLink.findAll({ where: { relative_linked_fam_id: id } });

        return pvis;
    };

    async setLink(familyMemberId, pviId, relationship, options = {}) { 
        const family_pvi_link = await FamilyPviLink.create({
            relative_linked_fam_id : familyMemberId,
            relative_linked_pvi_id : pviId,
            relative_relationship  : relationship
        }, options);
       
        return family_pvi_link.id;
    };

    async updateRelationship(familyMemberId, pviId, newPviData, options = {}) {
        const family_pvi_link = await FamilyPviLink.findOne({ 
            where: { 
                relative_linked_fam_id : familyMemberId, 
                relative_linked_pvi_id : pviId 
            } 
        });

        console.log('Service: updateRelationship found link:', family_pvi_link ? family_pvi_link.id : 'null');

        await family_pvi_link.update({ 
            relative_relationship : newPviData.relationship
        }, options);

        return family_pvi_link;
    };

    async softDeleteFamilyPviLink(familyMemberId, options = {}) {
        await FamilyPviLink.destroy({ where: { relative_linked_fam_id: familyMemberId } }, options);
    };
}