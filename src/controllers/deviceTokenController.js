/*
    FCM: New controller added for push notifications.

    Lets the app hand its FCM registration token to the backend after sign-in,
    and take it back on sign-out so a shared handset stops receiving the previous
    account's notifications.
*/
import { FamilyMemberService } from "../services/familyMemberService.js";
import { DeviceTokenService } from "../services/deviceTokenService.js";

const familyMemberService = new FamilyMemberService();
const deviceTokenService = new DeviceTokenService();

export class DeviceTokenController {
    registerDeviceToken = async (req, res) => {
        try {
            const cognitoSub = req.user.sub;
            const token = req.body.token;
            const platform = req.body.platform;

            if (!token) {
                return res.status(400).json({
                    success: false,
                    error: 'token is required',
                });
            }

            const familyMember = await familyMemberService.getFamilyMember(cognitoSub);

            if (!familyMember) {
                throw new Error('User not found');
            }

            const result = await deviceTokenService.registerToken(
                familyMember.id,
                token,
                platform
            );

            res.status(201).json({
                success: true,
                message: 'Device token registration success',
                result,
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                error: err.message,
            });
        }
    };

    unregisterDeviceToken = async (req, res) => {
        try {
            const cognitoSub = req.user.sub;
            const token = req.body.token;

            if (!token) {
                return res.status(400).json({
                    success: false,
                    error: 'token is required',
                });
            }

            const familyMember = await familyMemberService.getFamilyMember(cognitoSub);

            if (!familyMember) {
                throw new Error('User not found');
            }

            await deviceTokenService.removeToken(familyMember.id, token);

            res.status(200).json({
                success: true,
                message: 'Device token removal success',
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                error: err.message,
            });
        }
    };
}
