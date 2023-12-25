import request from "supertest";
import app from "../src/app";

interface BestClientsResponse {
  fullName: string;
  id: number;
  paid: number;
}

describe("Admin Controller", () => {
  describe("GET best profession", () => {
    const baseProfessionUrl = "/admin/best-profession";
    it("should return 400 when either the start date or end date are not provided", async () => {
      const response = await request(app).get(baseProfessionUrl);

      expect(response.status).toBe(400);
    });

    it("should return 400 when the start date is before the end date", async () => {
      const response = await request(app)
        .get(baseProfessionUrl)
        .query({ start: "2020-08-01", end: "2020-07-20" });

      expect(response.status).toBe(400);
    });

    it("should return the best profession when the range time is valid", async () => {
      const response = await request(app)
        .get(baseProfessionUrl)
        .query({ start: "2020-08-01", end: "2020-08-20" });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("profession");
      expect(response.body).toHaveProperty("totalEarnings");
      expect(typeof response.body.profession).toBe("string");
      expect(typeof response.body.totalEarnings).toBe("number");
    });
  });

  describe("GET best clients", () => {
    const baseClientsUrl = "/admin/best-clients";
    it("should return 400 when either the start date or end date are not provided", async () => {
      const response = await request(app).get(baseClientsUrl);

      expect(response.status).toBe(400);
    });

    it("should return 400 when the start date is before the end date", async () => {
      const response = await request(app)
        .get(baseClientsUrl)
        .query({ start: "2020-08-01", end: "2020-07-20" });

      expect(response.status).toBe(400);
    });

    it("should return 400 when limit is a not a positive number", async () => {
        const response = await request(app)
          .get(baseClientsUrl)
          .query({ start: "2020-08-01", end: "2020-08-20" })
          .query({ limit: -1 });
  
        expect(response.status).toBe(400);
      });

    it("should return the best clients when the range time is valid", async () => {
      const response = await request(app)
        .get(baseClientsUrl)
        .query({ start: "2020-08-01", end: "2020-08-20" });

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      response.body.forEach((client: BestClientsResponse) => {
        expect(client).toHaveProperty("fullName");
        expect(client).toHaveProperty("id");
        expect(client).toHaveProperty("paid");
      });
    });

    it("should return only one best client when limit is set to 1", async () => {
      const response = await request(app)
        .get(baseClientsUrl)
        .query({ start: "2020-08-01", end: "2020-08-20" })
        .query({ limit: 1 });

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      response.body.forEach((client: BestClientsResponse) => {
        expect(client).toHaveProperty("fullName");
        expect(client).toHaveProperty("id");
        expect(client).toHaveProperty("paid");
      });
    });
  });
});
