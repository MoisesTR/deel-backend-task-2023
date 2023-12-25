import request from "supertest";
import app from "../src/app";
import { Profile } from "../src/model";

describe("Balance controller", () => {
  const baseUrl = "/balances";
  const profileId = "1";

  describe("POST deposit to client's balance", () => {
    it("should return 401 when profile_id header is missing", async () => {
      const response = await request(app).post(
        `${baseUrl}/deposit/${profileId}`
      );

      expect(response.status).toBe(401);
    });

    it("should return a 401 when a client attempts to deposit into an account that is not their own", async () => {
      const differentClientId = 2;
      const response = await request(app)
        .post(`${baseUrl}/deposit/${differentClientId}`)
        .set("profile_id", profileId);

      expect(response.status).toBe(401);
      expect(response.body.message).toMatch(/Deposit Denied:/);
    });

    it("should return 400 when the deposit amount exceeds the allowed limit of 25% of total unpaid jobs", async () => {
      const depositAmount = 200;
      const response = await request(app)
        .post(`${baseUrl}/deposit/${profileId}`)
        .send({
          depositAmount,
        })

        .set("profile_id", profileId);

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(
        /Deposit amount exceeds the allowed limit of 25% of total unpaid jobs./
      );
    });

    it("should return 200 when the client was able to make a deposit to his own account", async () => {
      const profileBefore = await Profile.findOne({
        where: {
          id: profileId,
        },
      });

      const depositAmount = 10;
      const response = await request(app)
        .post(`${baseUrl}/deposit/${profileId}`)
        .send({
          depositAmount,
        })

        .set("profile_id", profileId);

      const profileAfter = await Profile.findOne({
        where: {
          id: profileId,
        },
      });

      expect(response.status).toBe(200);
      expect((profileBefore?.balance ?? 0) + depositAmount).toBe(
        profileAfter?.balance
      );
    });
  });
});
