import request from 'supertest';
import { jest } from '@jest/globals';
import app from '../../src/app.js';
import { AccountService } from '../../src/services/accountService.js';
import * as firebaseConfig from '../../src/config/firebase.js';

describe("Account Controller & Routes", () => {
    it("should return a json of text data of a user when Firebase JWT is valid", async () => {
        const mockResult = { 
            id                   : 1, 
            fam_cognito_sub      : "6f0d9a7e-8c41-4e93-bb8e-2f5b9d1c8a22", 
            fam_first_name       : "Rishaye", 
            fam_last_name        : "Melad", 
            fam_gender           : "Female", 
            fam_profile_pic_path : null,  
        };
        const token = 'valid-firebase-jwt-token';

        jest.spyOn(firebaseConfig.firebaseAuth, 'verifyIdToken').mockResolvedValue({
            uid: '6f0d9a7e-8c41-4e93-bb8e-2f5b9d1c8a22',
            sub: '6f0d9a7e-8c41-4e93-bb8e-2f5b9d1c8a22',
        });

        jest
            .spyOn(AccountService.prototype, 'getFamilyMemberInfo')
            .mockResolvedValue(mockResult);

        const res = await request(app)
            .get("/api/account/get-fam-member-info")
            .set("Authorization", `Bearer ${token}`)
            .expect("Content-Type", /json/)
            .expect(200);

        expect(res.body).toEqual({
            success : true,
            message : 'Account info retrieval successful',
            result  : mockResult 
        });
    });

    it("should return a json with error message when Firebase JWT is invalid", async () => {
        const token = 'invalid-token';

        jest.spyOn(firebaseConfig.firebaseAuth, 'verifyIdToken').mockRejectedValue(new Error('Invalid token'));

        const res = await request(app)
            .get("/api/account/get-fam-member-info")
            .set("Authorization", `Bearer ${token}`)
            .expect("Content-Type", /json/)
            .expect(401);

        expect(res.body).toEqual({
            message: 'Invalid or expired token'
        });
    });

    it("should archive user account successfully with Firebase UID", async () => {
        const token = 'valid-firebase-jwt-token';

        jest.spyOn(firebaseConfig.firebaseAuth, 'verifyIdToken').mockResolvedValue({
            uid: 'firebase-user-uid-999',
            sub: 'firebase-user-uid-999',
        });

        jest
            .spyOn(AccountService.prototype, 'archiveFamilyMemberAccount')
            .mockResolvedValue();

        const res = await request(app)
            .put("/api/account/archive-fam-member")
            .set("Authorization", `Bearer ${token}`)
            .expect("Content-Type", /json/)
            .expect(200);

        expect(res.body).toEqual({
            success: true,
            message: "Account archive successful",
        });
    });
});