import { StatusCodes } from "http-status-codes";
import { BaseResponse } from "../../utils/models/base-response.model";
import { rentService } from "./rents.service";
import { Rent } from "./rents.model";
import {
  ErrorResponse,
  ResponseErrorBody,
} from "../../utils/models/error-response";
import { lockersService } from "../lockers/lockers.service";
import { Locker } from "../lockers/lockers.model";

jest.mock("./rents.data", () => ({
  rents: [
    {
      id: "40efc6fd-f10c-4561-88bf-be916613377c",
      lockerId: "1b8d1e89-2514-4d91-b813-044bf0ce8d20",
      weight: 7,
      size: "L",
      status: "WAITING_PICKUP",
    },
    {
      id: "84ba232e-ce23-4d8f-ae26-68616600df48",
      lockerId: "6b33b2d1-af38-4b60-a3c5-53a69f70a351",
      weight: 10,
      size: "XL",
      status: "WAITING_DROPOFF",
    },
    {
      id: "feb72a9a-258d-49c9-92de-f90b1f11984d",
      lockerId: "6b33b2d1-af38-4b60-a3c5-53a69f70a351",
      weight: 30,
      size: "XL",
      status: "DELIVERED",
    },
    {
      id: "c4705b02-45be-4fd7-8d82-d336df1fa493",
      lockerId: "3139e8ce-ff98-4cb4-9e00-7f9d8b20e732",
      weight: 5,
      size: "S",
      status: "CREATED",
    },
  ],
}));

describe("Rents Service", () => {
  test("should get all rents of a locker", async () => {
    const response = await rentService.getAll(
      "1b8d1e89-2514-4d91-b813-044bf0ce8d20"
    );
    expect(response.status).toBe(StatusCodes.OK);
    expect(response.data?.length).toBe(1);
  });

  test("should get rent by id", async () => {
    const response = await rentService.getById(
      "feb72a9a-258d-49c9-92de-f90b1f11984d"
    );
    expect(response).toBeInstanceOf(BaseResponse);
    expect(response.status).toBe(StatusCodes.OK);
    expect((response.data as Rent)?.id).toBe(
      "feb72a9a-258d-49c9-92de-f90b1f11984d"
    );
    expect((response.data as Rent)?.lockerId).toBe(
      "6b33b2d1-af38-4b60-a3c5-53a69f70a351"
    );
    expect((response.data as Rent)?.status).toBe("DELIVERED");
    expect((response.data as Rent)?.weight).toBe(30);
    expect((response.data as Rent)?.size).toBe("XL");
  });

  test("should not found rent", async () => {
    const response = await rentService.getById("not-found-id");
    expect(response).toBeInstanceOf(ErrorResponse);
    expect(response.status).toBe(StatusCodes.NOT_FOUND);
    expect((response.data as ResponseErrorBody)?.error).toBe(
      "Rent (not-found-id) not found."
    );
  });

  test("should create rent", async () => {
    const response = await rentService.create({
      lockerId: "75f03ea9-c825-4e76-9484-f8b7f0a1d125",
      weight: 5,
      size: "S",
    });
    expect(response).toBeInstanceOf(BaseResponse);
    expect(response.status).toBe(StatusCodes.CREATED);
    expect((response.data as Rent)?.id).toBeDefined();
    expect((response.data as Rent)?.lockerId).toBe(
      "75f03ea9-c825-4e76-9484-f8b7f0a1d125"
    );
    expect((response.data as Rent)?.status).toBe("CREATED");
    expect((response.data as Rent)?.weight).toBe(5);
    expect((response.data as Rent)?.size).toBe("S");
  });

  test("should not create rent on a occupied locker", async () => {
    const response = await rentService.create({
      lockerId: "6b33b2d1-af38-4b60-a3c5-53a69f70a351",
      weight: 5,
      size: "S",
    });
    expect(response).toBeInstanceOf(ErrorResponse);
    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    expect((response.data as ResponseErrorBody)?.error).toBe(
      "Locker (6b33b2d1-af38-4b60-a3c5-53a69f70a351) is occupied."
    );
  });

  test("should update rent weight and size", async () => {
    const createRes = await rentService.create({
      lockerId: "c4705b02-45be-4fd7-8d82-d336df1fa493",
      weight: 5,
      size: "S",
    });
    const id = (createRes.data as Rent).id;
    const response = await rentService.update(id, {
      weight: 8,
      size: "L",
    });
    expect(response).toBeInstanceOf(BaseResponse);
    expect(response.status).toBe(StatusCodes.OK);
    expect((response.data as Rent)?.id).toBe(id);
    expect((response.data as Rent)?.lockerId).toBe(
      "c4705b02-45be-4fd7-8d82-d336df1fa493"
    );
    expect((response.data as Rent)?.status).toBe("CREATED");
    expect((response.data as Rent)?.weight).toBe(8);
    expect((response.data as Rent)?.size).toBe("L");
  });

  test("should not update rent status to same status", async () => {
    const response = await rentService.update(
      "c4705b02-45be-4fd7-8d82-d336df1fa493",
      {
        status: "CREATED",
      }
    );
    expect(response).toBeInstanceOf(ErrorResponse);
    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    expect((response.data as ResponseErrorBody)?.error).toBe(
      "Rent (c4705b02-45be-4fd7-8d82-d336df1fa493) status is already CREATED."
    );
  });

  test("should update rent status to WAITING_DROPOFF", async () => {
    const response = await rentService.update(
      "c4705b02-45be-4fd7-8d82-d336df1fa493",
      {
        status: "WAITING_DROPOFF",
      }
    );
    expect(response).toBeInstanceOf(BaseResponse);
    expect(response.status).toBe(StatusCodes.OK);
    expect((response.data as Rent)?.id).toBe(
      "c4705b02-45be-4fd7-8d82-d336df1fa493"
    );
    expect((response.data as Rent)?.lockerId).toBe(
      "3139e8ce-ff98-4cb4-9e00-7f9d8b20e732"
    );
    expect((response.data as Rent)?.status).toBe("WAITING_DROPOFF");
    expect((response.data as Rent)?.weight).toBe(5);
    expect((response.data as Rent)?.size).toBe("S");
  });

  test("locker should be occupied", async () => {
    const response = await lockersService.getById(
      "3139e8ce-ff98-4cb4-9e00-7f9d8b20e732"
    );
    expect(response.status).toBe(StatusCodes.OK);
    expect((response.data as Locker)?.isOccupied).toBe(true);
  });

  test("should not update rent status to a previus status", async () => {
    const response = await rentService.update(
      "c4705b02-45be-4fd7-8d82-d336df1fa493",
      {
        status: "CREATED",
      }
    );
    expect(response).toBeInstanceOf(ErrorResponse);
    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    expect((response.data as ResponseErrorBody)?.error).toBe(
      "Rent (c4705b02-45be-4fd7-8d82-d336df1fa493) status cannot be updated to CREATED."
    );
  });

  test("should update rent status to WAITING_PICKUP", async () => {
    const response = await rentService.update(
      "c4705b02-45be-4fd7-8d82-d336df1fa493",
      {
        status: "WAITING_PICKUP",
      }
    );
    expect(response).toBeInstanceOf(BaseResponse);
    expect(response.status).toBe(StatusCodes.OK);
    expect((response.data as Rent)?.id).toBe(
      "c4705b02-45be-4fd7-8d82-d336df1fa493"
    );
    expect((response.data as Rent)?.lockerId).toBe(
      "3139e8ce-ff98-4cb4-9e00-7f9d8b20e732"
    );
    expect((response.data as Rent)?.status).toBe("WAITING_PICKUP");
    expect((response.data as Rent)?.weight).toBe(5);
    expect((response.data as Rent)?.size).toBe("S");
  });

  test("should update rent status to DELIVERED", async () => {
    const response = await rentService.update(
      "c4705b02-45be-4fd7-8d82-d336df1fa493",
      {
        status: "DELIVERED",
      }
    );
    expect(response).toBeInstanceOf(BaseResponse);
    expect(response.status).toBe(StatusCodes.OK);
    expect((response.data as Rent)?.id).toBe(
      "c4705b02-45be-4fd7-8d82-d336df1fa493"
    );
    expect((response.data as Rent)?.lockerId).toBe(
      "3139e8ce-ff98-4cb4-9e00-7f9d8b20e732"
    );
    expect((response.data as Rent)?.status).toBe("DELIVERED");
    expect((response.data as Rent)?.weight).toBe(5);
    expect((response.data as Rent)?.size).toBe("S");
  });

  test("should not update rent status to a any other status", async () => {
    const response = await rentService.update(
      "c4705b02-45be-4fd7-8d82-d336df1fa493",
      {
        status: "WAITING_DROPOFF",
      }
    );
    expect(response).toBeInstanceOf(ErrorResponse);
    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    expect((response.data as ResponseErrorBody)?.error).toBe(
      "Rent (c4705b02-45be-4fd7-8d82-d336df1fa493) status cannot be updated to WAITING_DROPOFF."
    );
  });

  test("locker should not be occupied", async () => {
    const response = await lockersService.getById(
      "3139e8ce-ff98-4cb4-9e00-7f9d8b20e732"
    );
    expect(response.status).toBe(StatusCodes.OK);
    expect((response.data as Locker)?.isOccupied).toBe(false);
  });
});
