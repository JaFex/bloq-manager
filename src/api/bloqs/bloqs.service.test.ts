import { StatusCodes } from "http-status-codes";
import { bloqsService } from "./bloqs.service";
import { Bloq } from "./bloqs.model";
import { BaseResponse } from "../../utils/models/base-response.model";
import { lockersService } from "../lockers/lockers.service";
import {
  ErrorResponse,
  ResponseErrorBody,
} from "../../utils/models/error-response";

jest.mock("./bloqs.data", () => ({
  bloqs: [
    {
      id: "c3ee858c-f3d8-45a3-803d-e080649bbb6f",
      title: "Luitton Vouis Champs Elysées",
      address: "101 Av. des Champs-Élysées, 75008 Paris, France",
    },
    {
      id: "484e01be-1570-4ac1-a2a9-02aad3acc54e",
      title: "Riod Eixample",
      address: "Pg. de Gràcia, 74, L'Eixample, 08008 Barcelona, Spain",
    },
  ],
}));

describe("bloqs service", () => {
  it("should be defined", () => {
    expect(bloqsService).toBeDefined();
  });

  it("should get all bloqs", async () => {
    const response = await bloqsService.getAll();
    expect(response.status).toBe(StatusCodes.OK);
    expect(response.data?.length).toBe(2);
  });

  it("should get bloq by id", async () => {
    const response = await bloqsService.getById(
      "c3ee858c-f3d8-45a3-803d-e080649bbb6f"
    );
    expect(response).toBeInstanceOf(BaseResponse);
    expect(response.status).toBe(StatusCodes.OK);
    expect((response.data as Bloq)?.id).toBe(
      "c3ee858c-f3d8-45a3-803d-e080649bbb6f"
    );
    expect((response.data as Bloq)?.title).toBe("Luitton Vouis Champs Elysées");
    expect((response.data as Bloq)?.address).toBe(
      "101 Av. des Champs-Élysées, 75008 Paris, France"
    );
  });

  it("should not found bloq", async () => {
    const response = await bloqsService.getById("not-found-id");
    expect(response).toBeInstanceOf(ErrorResponse);
    expect(response.status).toBe(StatusCodes.NOT_FOUND);
    expect((response.data as ResponseErrorBody)?.error).toBe(
      "Bloq (not-found-id) not found."
    );
  });

  it("should create bloq", async () => {
    const response = await bloqsService.create({
      title: "Luitton Vouis Champs Elysées",
      address: "101 Av. des Champs-Élysées, 75008 Paris, France",
      numberOfLockers: 2,
    });
    expect(response).toBeInstanceOf(BaseResponse);
    expect(response.status).toBe(StatusCodes.CREATED);
    expect((response.data as Bloq)?.id).toBeDefined();
    expect((response.data as Bloq)?.title).toBe("Luitton Vouis Champs Elysées");
    expect((response.data as Bloq)?.address).toBe(
      "101 Av. des Champs-Élysées, 75008 Paris, France"
    );

    const lockersResponse = await lockersService.getAll(
      (response.data as Bloq)?.id
    );
    expect(lockersResponse.status).toBe(StatusCodes.OK);
    expect(lockersResponse.data?.length).toBe(2);
  });

  it("should update bloq", async () => {
    const response = await bloqsService.update(
      "c3ee858c-f3d8-45a3-803d-e080649bbb6f",
      {
        title: "Luitton Vouis Champs Elysées Updated",
        address: "102 Av. des Champs-Élysées, 75008 Paris, France",
      }
    );
    expect(response).toBeInstanceOf(BaseResponse);
    expect(response.status).toBe(StatusCodes.OK);
    expect((response.data as Bloq)?.id).toBeDefined();
    expect((response.data as Bloq)?.title).toBe(
      "Luitton Vouis Champs Elysées Updated"
    );
    expect((response.data as Bloq)?.address).toBe(
      "102 Av. des Champs-Élysées, 75008 Paris, France"
    );
  });

  it("should not update bloq", async () => {
    const response = await bloqsService.update("not-found-id", {
      title: "Luitton Vouis Champs Elysées Updated",
      address: "102 Av. des Champs-Élysées, 75008 Paris, France",
    });
    expect(response).toBeInstanceOf(ErrorResponse);
    expect(response.status).toBe(StatusCodes.NOT_FOUND);
    expect((response.data as ResponseErrorBody)?.error).toBe(
      "Bloq (not-found-id) not found."
    );
  });

  it("should delete bloq", async () => {
    const response = await bloqsService.delete(
      "c3ee858c-f3d8-45a3-803d-e080649bbb6f"
    );
    expect(response).toBeInstanceOf(BaseResponse);
    expect(response.status).toBe(StatusCodes.OK);
    expect((response.data as Bloq)?.id).toBeDefined();
    expect((response.data as Bloq)?.title).toBe(
      "Luitton Vouis Champs Elysées Updated"
    );
    expect((response.data as Bloq)?.address).toBe(
      "102 Av. des Champs-Élysées, 75008 Paris, France"
    );

    const lockersResponse = await lockersService.getAll(
      (response.data as Bloq)?.id
    );
    expect(lockersResponse.status).toBe(StatusCodes.OK);
    expect(lockersResponse.data?.length).toBe(0);
  });

  it("should not delete bloq", async () => {
    const response = await bloqsService.delete("not-found-id");
    expect(response).toBeInstanceOf(ErrorResponse);
    expect(response.status).toBe(StatusCodes.NOT_FOUND);
    expect((response.data as ResponseErrorBody)?.error).toBe(
      "Bloq (not-found-id) not found."
    );
  });
});
