import request from "supertest";
import app from "../src/app";
import { Contract, Job, Profile } from "../src/model";

interface PartialUnpaidJobResponse {
  paid: boolean;
  paymentDate: Date | null;
}

async function getJobWithContract(jobId: number | null) {
  return Job.findOne({
    where: { id: jobId },
    include: { model: Contract, required: true },
  });
}

async function getProfileById(profileId?: number) {
  return Profile.findOne({ where: { id: profileId } });
}

describe("Job Controller", () => {
  const profileId = "2";
  const baseUrl = "/jobs";
  let unpaidJobId: number | null;

  describe("GET unpaid jobs by profile", () => {
    const path = "/unpaid";
    it("should return 401 when profile_id header is missing", async () => {
      const response = await request(app).get(`${baseUrl}${path}`);

      expect(response.status).toBe(401);
    });

    it("should return a list of unpaid jobs of the given profile", async () => {
      const response = await request(app)
        .get(`${baseUrl}${path}`)
        .set("profile_id", profileId);

      unpaidJobId = response.body[0].id;
      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThan(0);
      response.body.forEach((element: PartialUnpaidJobResponse) => {
        expect(element.paid).toBe(false);
        expect(element.paymentDate).toBeNull;
      });
    });
  });

  describe("POST pay for a job", () => {
    it("should return 401 when profile_id header is missing", async () => {
      const response = await request(app).post(`${baseUrl}/${unpaidJobId}/pay`);

      expect(response.status).toBe(401);
    });

    it("should return 404 when the job to pay is not found", async () => {
      const nonExistentJobId = 9999;
      const response = await request(app)
        .post(`${baseUrl}/${nonExistentJobId}/pay`)
        .set("profile_id", profileId);

      expect(response.status).toBe(404);
    });

    it("should return 400 when is trying to pay for a job that is not linked to the given profileId(client account)", async () => {
      const nonRelatedProfileId = "3";
      const response = await request(app)
        .post(`${baseUrl}/${unpaidJobId}/pay`)
        .set("profile_id", nonRelatedProfileId);

      expect(response.status).toBe(409);
      expect(response.body.message).toMatch(
        /Action permitted only for jobs linked to your client account\./
      );
    });

    it("should return 400 when the client's balance is to low to cover the job cost", async () => {
      const profileWithLowBalance = "4";
      const relatedUnPaidJobId = 5;
      const response = await request(app)
        .post(`${baseUrl}/${relatedUnPaidJobId}/pay`)
        .set("profile_id", profileWithLowBalance);

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/Insufficient funds\./);
    });

    it("should return 200 when it was able to pay for job", async () => {
      const unpaidJobBefore = await getJobWithContract(unpaidJobId);
      const clientProfileBefore = await getProfileById(
        unpaidJobBefore?.Contract.ClientId
      );
      const contractorProfileBefore = await getProfileById(
        unpaidJobBefore?.Contract.ContractorId
      );

      const response = await request(app)
        .post(`${baseUrl}/${unpaidJobId}/pay`)
        .set("profile_id", profileId);

      const unpaidJobAfter = await getJobWithContract(unpaidJobId);
      const clientProfileAfter = await getProfileById(
        unpaidJobAfter?.Contract.ClientId
      );
      const contractorProfileAfter = await getProfileById(
        unpaidJobAfter?.Contract.ContractorId
      );

      expect(response.status).toBe(200);
      expect(unpaidJobAfter?.paid).toBeTruthy();
      expect(unpaidJobAfter?.paymentDate).toBeDefined();

      const expectedContractorBalance =
        (contractorProfileBefore?.balance ?? 0) + (unpaidJobBefore?.price ?? 0);
      expect(contractorProfileAfter?.balance).toBe(expectedContractorBalance);

      const expectedClientBalance =
        (clientProfileBefore?.balance ?? 0) - (unpaidJobBefore?.price ?? 0);
      expect(clientProfileAfter?.balance).toBe(expectedClientBalance);
    });
  });
});
