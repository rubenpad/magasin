import { Test } from "@nestjs/testing";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { FIND_CLOSEST_STORE_PORT } from "../../../configuration/findClosestStoreToken";
import { StoresController } from "./findClosestStoreController";

describe("StoresController", () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [StoresController],
      providers: [
        {
          provide: FIND_CLOSEST_STORE_PORT,
          useValue: { execute: async () => ({}) },
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("returns an empty object for the closest-store route", async () => {
    const response = await app
      .getHttpAdapter()
      .getInstance()
      .inject("/v1/stores/closest?latitude=4.7110&longitude=-74.0721");

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({});
  });
});
