import request from "supertest";
import app from "../src/app";
import { ContractStatusEnum } from "../src/types/enums/contract";

describe("Contracts Controller", () => {
  const profileId = "1";
  const baseUrl = "/contracts";

  describe("GET all contracts", () => {
    it("should return 401 when profile_id header is missing", async () => {
      const response = await request(app).get(baseUrl);

      expect(response.status).toBe(401);
    });

    it("should return all the non terminated contracts that belongs to the given profile", async () => {
      const response = await request(app)
        .get(baseUrl)
        .set("profile_id", profileId);

      expect(response.status).toBe(200);
      expect(
        response.body.every(
          (item: any) => item.status !== ContractStatusEnum.TERMINATED
        )
      );
    });
  });

  describe("GET contract by id", () => {
    const contractId = 1;

    it("should return 401 when profile_id header is missing", async () => {
      const response = await request(app).get(`${baseUrl}/${contractId}`);

      expect(response.status).toBe(401);
    });

    it("should return 403 when the contract doesn't belong to the profile calling", async () => {
      const forbiddenContractId = 3;
      const response = await request(app)
        .get(`${baseUrl}/${forbiddenContractId}`)
        .set("profile_id", profileId);

      expect(response.status).toBe(403);
    });

    it("should return 404 when the contract is not found", async () => {
      const nonExistentContractId = 7777;
      const response = await request(app)
        .get(`${baseUrl}/${nonExistentContractId}`)
        .set("profile_id", profileId);

      expect(response.status).toBe(404);
    });

    it("should return 200 OK", async () => {
      const response = await request(app)
        .get(`${baseUrl}/${contractId}`)
        .set("profile_id", profileId);

      expect(response.status).toBe(200);
    });
  });
});
