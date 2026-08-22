/*
    FCM: New service added for push notifications.

    Owns the device_tokens table: registering a device when the app signs in,
    removing it on sign out, and resolving which tokens should receive a push for
    a given PVI.
*/
import { DeviceToken } from "../models/deviceTokenModel.js";
import { FamilyPviLink } from "../models/familyPviLinkModel.js";

export class DeviceTokenService {
    /*
        Stores a token for a family member.

        Uses "find then move" rather than a plain create because FCM can reissue
        a token that already exists in the table: after a reinstall, or when a
        second account signs in on the same handset. In that case the row has to
        be reassigned to the current owner, otherwise the previous owner would
        keep receiving that device's notifications.
    */
    async registerToken(familyMemberId, token, platform) {
        const existingToken = await DeviceToken.findOne({
            where: { dvt_token: token },
            paranoid: false, // also match a soft-deleted row so it can be revived
        });

        if (existingToken) {
            await existingToken.restore().catch(() => {}); // no-op when not soft-deleted

            await existingToken.update({
                dvt_linked_fam_id: familyMemberId,
                dvt_platform: platform ?? existingToken.dvt_platform,
            });

            return existingToken.id;
        }

        const deviceToken = await DeviceToken.create({
            dvt_linked_fam_id: familyMemberId,
            dvt_token: token,
            dvt_platform: platform,
        });

        return deviceToken.id;
    };

    /*
        Removes one device's token, on sign out. Scoped to the family member so
        one account cannot unregister another account's device.
    */
    async removeToken(familyMemberId, token) {
        return DeviceToken.destroy({
            where: {
                dvt_linked_fam_id: familyMemberId,
                dvt_token: token,
            },
        });
    };

    /*
        Every token belonging to the family members linked to [pviId].

        A PVI can be linked to more than one family member, so a device event
        notifies all of them. Reads family_pvi_links directly (rather than
        through FamilyPviLinkService) to keep this FCM-only addition from
        changing existing services.
    */
    async findTokensByPviId(pviId) {
        const links = await FamilyPviLink.findAll({
            where: { relative_linked_pvi_id: pviId },
            attributes: ['relative_linked_fam_id'],
            raw: true,
        });

        if (links.length === 0) {
            return [];
        }

        const familyMemberIds = [
            ...new Set(links.map(link => link.relative_linked_fam_id))
        ];

        const deviceTokens = await DeviceToken.findAll({
            where: { dvt_linked_fam_id: familyMemberIds },
            attributes: ['dvt_token'],
            raw: true,
        });

        return deviceTokens.map(deviceToken => deviceToken.dvt_token);
    };

    /*
        Drops tokens FCM has reported as dead (uninstalled app, expired
        registration). Without this the same failures are retried on every
        notification forever.
    */
    async removeTokens(tokens) {
        if (!tokens || tokens.length === 0) {
            return 0;
        }

        return DeviceToken.destroy({ where: { dvt_token: tokens } });
    };
}
