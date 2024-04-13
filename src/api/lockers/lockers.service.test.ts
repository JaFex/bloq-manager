import { StatusCodes } from "http-status-codes";
import { BaseResponse } from "../../utils/models/base-response.model";
import { lockersService } from "./lockers.service";
import { Locker } from "./lockers.model";
import {
  ErrorResponse,
  ResponseErrorBody,
} from "../../utils/models/error-response";

jest.mock("./lockers.data", () => ({
  lockers: [
    {
      id: "2191e1b5-99c7-45df-8302-998be394be48",
      bloqId: "c3ee858c-f3d8-45a3-803d-e080649bbb6f",
      status: "CLOSED",
      isOccupied: true,
    },
    {
      id: "6b33b2d1-af38-4b60-a3c5-53a69f70a351",
      bloqId: "484e01be-1570-4ac1-a2a9-02aad3acc54e",
      status: "CLOSED",
      isOccupied: true,
    },
    {
      id: "ea6db2f6-2da7-42ed-9619-d40d718b7bec",
      bloqId: "484e01be-1570-4ac1-a2a9-02aad3acc54e",
      status: "CLOSED",
      isOccupied: false,
    },
  ],
}));

describe("lockers service", () => {
  it("should be defined", () => {
    expect(lockersService).toBeDefined();
  });

  it("should get all lockers of bloq", async () => {
    const response = await lockersService.getAll(
      "484e01be-1570-4ac1-a2a9-02aad3acc54e"
    );
    expect(response.status).toBe(StatusCodes.OK);
    expect(response.data?.length).toBe(2);
  });

  it("should get locker by id", async () => {
    const response = await lockersService.getById(
      "6b33b2d1-af38-4b60-a3c5-53a69f70a351"
    );
    expect(response).toBeInstanceOf(BaseResponse);
    expect(response.status).toBe(StatusCodes.OK);
    expect((response.data as Locker)?.id).toBe(
      "6b33b2d1-af38-4b60-a3c5-53a69f70a351"
    );
    expect((response.data as Locker)?.bloqId).toBe(
      "484e01be-1570-4ac1-a2a9-02aad3acc54e"
    );
    expect((response.data as Locker)?.status).toBe("CLOSED");
    expect((response.data as Locker)?.isOccupied).toBe(true);
  });

  it("should not found locker", async () => {
    const response = await lockersService.getById("not-found-id");
    expect(response).toBeInstanceOf(ErrorResponse);
    expect(response.status).toBe(StatusCodes.NOT_FOUND);
    expect((response.data as ResponseErrorBody)?.error).toBe(
      "Locker (not-found-id) not found."
    );
  });

  it("should update locker", async () => {
    const response = await lockersService.update(
      "6b33b2d1-af38-4b60-a3c5-53a69f70a351",
      {
        status: "OPEN",
      }
    );
    expect(response).toBeInstanceOf(BaseResponse);
    expect(response.status).toBe(StatusCodes.OK);
    expect((response.data as Locker)?.id).toBe(
      "6b33b2d1-af38-4b60-a3c5-53a69f70a351"
    );
    expect((response.data as Locker)?.bloqId).toBe(
      "484e01be-1570-4ac1-a2a9-02aad3acc54e"
    );
    expect((response.data as Locker)?.status).toBe("OPEN");
  });
});
