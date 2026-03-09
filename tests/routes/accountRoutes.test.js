import request from 'supertest';
import { jest } from '@jest/globals';
import app from '../../src/app.js';
import { AccountService } from '../../src/services/accountService.js';

describe("GET /get-fam-member-info", () => {
    it("should return a json of text data of a user when cognito JWT is valid", async () => {
        const mockResult = { 
            id                   : 1, 
            fam_cognito_sub      : "6f0d9a7e-8c41-4e93-bb8e-2f5b9d1c8a22", 
            fam_first_name       : "Rishaye", 
            fam_last_name        : "Melad", 
            fam_gender           : "Female", 
            fam_profile_pic_path : null,  
        };
        const token = '6f0d9a7e-8c41-4e93-bb8e-2f5b9d1c8a22';

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

    it("should a json with error message when cognito JWT is invalid", async () => {
        const mockResult = 'Invalid or expired token';
        const token = '6f0d9a7e-8c41-4e93-bb8e-2f5b9d1c8a2';

        jest
            .spyOn(AccountService.prototype, 'getFamilyMemberInfo')
            .mockRejectedValue(new Error(mockResult));

        const res = await request(app)
            .get("/api/account/get-fam-member-info")
            .set("Authorization", `Bearer ${token}`)
            .expect("Content-Type", /json/)
            .expect(500);

        expect(res.body).toEqual({
            success : false,
            error   : mockResult
        });
    });
});