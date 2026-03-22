import { PviManagementService } from "../services/pviManagementService.js";

const pviManagementService = new PviManagementService();

export class PviController {
    // Controller for adding new pvi and linking user to pvi
    createPviAndLinkUser = async (req, res) => {
        const cognitoSub    = req.user.sub;
        const pviData       = {
                                pviFirstname : req.body.pviFirstname,
                                pviLastname  : req.body.pviLastname,
                                pviGender    : req.body.pviGender,
                            };
        const iotData       = {
                                inputIoTSerialNumber   : req.body.deviceSerialNumber,
                                inputIoTActivationCode : req.body.deviceActivationCode,
                            };
        const relationship  = req.body.relationship;

        const result = await pviManagementService.createPviAndLinkUser(cognitoSub, pviData, iotData, relationship);

        try {
            return res.status(201).json({
                success : true,
                message : 'Pvi register successful',
                result
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                error : err.message
            });
        }
    };

    // Controller for linking a family member to an existing PVI
    linkUserToExistingPvi = async (req, res) => {
        try {
            const cognitoSub = req.user.sub;
            const pviId = req.body.pviId;
            const relationship = req.body.relationship;
            
            const result = await pviManagementService.linkUserToExistingPvi(cognitoSub, pviId, relationship);

            res.status(201).json({
                success: true,
                message : 'Pvi add link successful',
                result
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                error : err.message
            });
        }
    };

    getPvisInfo = async (req, res) => {
        try {
            const cognitoSub = req.user.sub;

            const result = await pviManagementService.getPvisInfo(cognitoSub);

            res.status(200).json({
                success: true,
                message : 'Pvis info retrieval successful',
                result
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                error : err.message
            });
        }
    };

    // Searches pvi
    findPviByPviPublicId = async (req, res) => {
        try {
            const pviPublicId = req.body.pviPublicId;          
            
            const result = await pviManagementService.findPviByPviPublicId(pviPublicId);

            res.status(200).json({
                success: true,
                message : 'Pvi info retrieval successful',
                result
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                error : err.message
            });
        }
    };

    /*
        Updates selected PVI info and relationship of guardian to them 
    */
    updatePviInfoAndRelationship = async (req, res) => {
        try {
            const cognitoSub = req.user.sub;
            const pviId = req.params.id;

            console.log('Update PVI Request received:', { cognitoSub, pviId, body: req.body });

            const result = await pviManagementService.updatePviInfoAndRelationship(cognitoSub, pviId, { ...req.body });

            res.status(200).json({
                success: true,
                message : 'Pvi info update successful',
                result
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                error : err.message
            });   
        }
    };

    // Soft delete pvi, activated iot linked to pvi, user-pvi link
    archivePviAndActiveIoT = async(req, res) => {
        try {
            const cognitoSub = req.user.sub;
            const pviId = req.params.id;

            const result = await pviManagementService.archivePviAndActiveIoT(cognitoSub, pviId);

            res.status(200).json({
                success: true,
                message : 'Pvi archive successful',
                result
            });
        } catch (err) { 
            res.status(500).json({
                success: false,
                error : err.message
            });    
        }
    };
}