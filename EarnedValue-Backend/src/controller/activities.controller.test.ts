import { Activity } from "../models";
import { Status } from "../interfaces/constants.interfaces";
import {
  activitieDelete,
  activitieEdit,
  activitiesById,
  activitiesList,
  createActivitie,
} from "./activities.controller";
import { createMockRequest, createMockResponse } from "../test/test-utils";

jest.mock("../models", () => ({
  Activity: {
    create: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
  },
}));

const mockActivity = {
  id_activity: "act-1",
  name: "Actividad Test",
  description: "Descripción",
  budgetCompletion: 1000,
  percentagePlanned: 50,
  percentageCompleted: 40,
  actualCost: 300,
  status: Status.PENDING,
  id_project: "proj-1",
  id_user: "user-1",
  id_user_update: "user-1",
  startDate: new Date("2024-01-01"),
  endDate: new Date("2024-06-01"),
  update: jest.fn(),
  destroy: jest.fn(),
  save: jest.fn(),
};

describe("activities.controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createActivitie", () => {
    it("crea actividad con fechas en timestamp", async () => {
      const created = { ...mockActivity, save: jest.fn() };
      jest.mocked(Activity.create).mockResolvedValue(created as never);

      const req = createMockRequest({
        params: { id_project: "proj-1" },
        body: {
          name: "Actividad Test",
          description: "Descripción",
          budgetCompletion: 1000,
          percentagePlanned: 50,
          percentageCompleted: 40,
          actualCost: 300,
          startDate: "1704067200000",
          endDate: "1717200000000",
        },
      });
      (req as any).uuid = "user-1";
      const res = createMockResponse();

      await createActivitie(req, res);

      expect(Activity.create).toHaveBeenCalledWith(
        expect.objectContaining({
          id_project: "proj-1",
          id_user: "user-1",
          startDate: expect.any(Date),
          endDate: expect.any(Date),
        }),
      );
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("crea actividad sin convertir fechas nulas", async () => {
      const created = { ...mockActivity, save: jest.fn() };
      jest.mocked(Activity.create).mockResolvedValue(created as never);

      const req = createMockRequest({
        params: { id_project: "proj-1" },
        body: {
          name: "Actividad Test",
          startDate: null,
          endDate: null,
        },
      });
      (req as any).uuid = "user-1";
      const res = createMockResponse();

      await createActivitie(req, res);

      expect(Activity.create).toHaveBeenCalledWith(
        expect.objectContaining({
          startDate: null,
          endDate: null,
        }),
      );
    });

    it("retorna 500 ante error interno", async () => {
      jest.mocked(Activity.create).mockRejectedValue(new Error("DB error"));
      const req = createMockRequest({
        params: { id_project: "proj-1" },
        body: { name: "Test" },
      });
      (req as any).uuid = "user-1";
      const res = createMockResponse();

      await createActivitie(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("activitieEdit", () => {
    it("retorna 404 si la actividad no existe", async () => {
      jest.mocked(Activity.findOne).mockResolvedValue(null);
      const req = createMockRequest({
        params: { id: "act-1" },
        body: { name: "Updated" },
      });
      (req as any).uuid = "user-1";
      const res = createMockResponse();

      await activitieEdit(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("actualiza actividad correctamente", async () => {
      jest
        .mocked(Activity.findOne)
        .mockResolvedValueOnce(mockActivity as never)
        .mockResolvedValueOnce({ ...mockActivity, name: "Updated" } as never);
      jest.mocked(Activity.update).mockResolvedValue([1] as never);

      const req = createMockRequest({
        params: { id: "act-1" },
        body: {
          name: "Updated",
          startDate: "1704067200000",
          endDate: null,
        },
      });
      (req as any).uuid = "user-1";
      const res = createMockResponse();

      await activitieEdit(req, res);

      expect(Activity.update).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Updated",
          id_user_update: "user-1",
          startDate: expect.any(Date),
          endDate: null,
        }),
        expect.any(Object),
      );
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("retorna 500 ante error interno", async () => {
      jest.mocked(Activity.findOne).mockRejectedValue(new Error("DB error"));
      const req = createMockRequest({ params: { id: "act-1" }, body: {} });
      (req as any).uuid = "user-1";
      const res = createMockResponse();

      await activitieEdit(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("activitiesList", () => {
    it("retorna 404 si no hay actividades", async () => {
      jest.mocked(Activity.findAll).mockResolvedValue([]);
      const req = createMockRequest({ params: { id_project: "proj-1" } });
      const res = createMockResponse();

      await activitiesList(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("retorna lista de actividades", async () => {
      jest.mocked(Activity.findAll).mockResolvedValue([mockActivity] as never);
      const req = createMockRequest({ params: { id_project: "proj-1" } });
      const res = createMockResponse();

      await activitiesList(req, res);

      expect(Activity.findAll).toHaveBeenCalledWith({
        where: { id_project: "proj-1" },
      });
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("retorna 500 ante error interno", async () => {
      jest.mocked(Activity.findAll).mockRejectedValue(new Error("DB error"));
      const req = createMockRequest({ params: { id_project: "proj-1" } });
      const res = createMockResponse();

      await activitiesList(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("activitiesById", () => {
    it("retorna 404 si la actividad no existe", async () => {
      jest.mocked(Activity.findOne).mockResolvedValue(null);
      const req = createMockRequest({ params: { id: "act-1" } });
      const res = createMockResponse();

      await activitiesById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("retorna actividad por id", async () => {
      jest.mocked(Activity.findOne).mockResolvedValue(mockActivity as never);
      const req = createMockRequest({ params: { id: "act-1" } });
      const res = createMockResponse();

      await activitiesById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        ok: true,
        activity: mockActivity,
      });
    });

    it("retorna 500 ante error interno", async () => {
      jest.mocked(Activity.findOne).mockRejectedValue(new Error("DB error"));
      const req = createMockRequest({ params: { id: "act-1" } });
      const res = createMockResponse();

      await activitiesById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("activitieDelete", () => {
    it("retorna 404 si la actividad no existe", async () => {
      jest.mocked(Activity.findOne).mockResolvedValue(null);
      const req = createMockRequest({ params: { id: "act-1" } });
      const res = createMockResponse();

      await activitieDelete(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("elimina actividad correctamente", async () => {
      const activity = {
        ...mockActivity,
        update: jest.fn().mockResolvedValue(undefined),
        destroy: jest.fn().mockResolvedValue(undefined),
      };
      jest.mocked(Activity.findOne).mockResolvedValue(activity as never);

      const req = createMockRequest({ params: { id: "act-1" } });
      const res = createMockResponse();

      await activitieDelete(req, res);

      expect(activity.update).toHaveBeenCalledWith({ status: Status.DELETE });
      expect(activity.destroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("retorna 500 ante error interno", async () => {
      jest.mocked(Activity.findOne).mockRejectedValue(new Error("DB error"));
      const req = createMockRequest({ params: { id: "act-1" } });
      const res = createMockResponse();

      await activitieDelete(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
