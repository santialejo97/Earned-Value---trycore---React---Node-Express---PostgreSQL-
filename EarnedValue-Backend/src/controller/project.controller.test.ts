import { Project } from "../models";
import { Status } from "../interfaces/constants.interfaces";
import {
  projectById,
  projectCreate,
  projectDelete,
  projectEdit,
  projectList,
} from "./project.controller";
import { createMockRequest, createMockResponse } from "../test/test-utils";

jest.mock("../models", () => ({
  Project: {
    create: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
  },
}));

const mockProject = {
  id: "proj-1",
  name: "Proyecto Test",
  description: "Descripción",
  status: Status.PENDING,
  id_user: "user-1",
  dataValues: {
    id: "proj-1",
    name: "Proyecto Test",
    id_user: "user-1",
  },
  update: jest.fn(),
  destroy: jest.fn(),
  save: jest.fn(),
};

describe("project.controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("projectCreate", () => {
    it("crea un proyecto correctamente", async () => {
      const created = { ...mockProject, save: jest.fn() };
      jest.mocked(Project.create).mockResolvedValue(created as never);

      const req = createMockRequest({
        body: { name: "Proyecto Test", description: "Descripción" },
      });
      (req as any).uuid = "user-1";
      const res = createMockResponse();

      await projectCreate(req, res);

      expect(Project.create).toHaveBeenCalledWith(
        expect.objectContaining({ id_user: "user-1" }),
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ ok: true, project: created }),
      );
    });

    it("retorna 500 ante error interno", async () => {
      jest.mocked(Project.create).mockRejectedValue(new Error("DB error"));
      const req = createMockRequest({ body: { name: "Test" } });
      (req as any).uuid = "user-1";
      const res = createMockResponse();

      await projectCreate(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("projectEdit", () => {
    it("retorna 404 si el proyecto no existe", async () => {
      jest.mocked(Project.findOne).mockResolvedValue(null);
      const req = createMockRequest({
        params: { id: "proj-1" },
        body: { name: "Updated" },
      });
      (req as any).uuid = "user-1";
      const res = createMockResponse();

      await projectEdit(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("retorna 404 si el proyecto no pertenece al usuario", async () => {
      jest.mocked(Project.findOne).mockResolvedValue({
        ...mockProject,
        dataValues: { ...mockProject.dataValues, id_user: "other-user" },
      } as never);

      const req = createMockRequest({
        params: { id: "proj-1" },
        body: { name: "Updated" },
      });
      (req as any).uuid = "user-1";
      const res = createMockResponse();

      await projectEdit(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ msg: expect.stringContaining("does not match") }),
      );
    });

    it("actualiza proyecto correctamente", async () => {
      jest.mocked(Project.findOne).mockResolvedValue(mockProject as never);
      jest.mocked(Project.update).mockResolvedValue([
        1,
        [{ dataValues: { id: "proj-1", name: "Updated" } }],
      ] as never);

      const req = createMockRequest({
        params: { id: "proj-1" },
        body: { name: "Updated" },
      });
      (req as any).uuid = "user-1";
      const res = createMockResponse();

      await projectEdit(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          ok: true,
          project: { id: "proj-1", name: "Updated" },
        }),
      );
    });

    it("retorna 500 ante error interno", async () => {
      jest.mocked(Project.findOne).mockRejectedValue(new Error("DB error"));
      const req = createMockRequest({ params: { id: "proj-1" }, body: {} });
      (req as any).uuid = "user-1";
      const res = createMockResponse();

      await projectEdit(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("projectDelete", () => {
    it("retorna 404 si el proyecto no existe", async () => {
      jest.mocked(Project.findOne).mockResolvedValue(null);
      const req = createMockRequest({ params: { id: "proj-1" } });
      (req as any).uuid = "user-1";
      const res = createMockResponse();

      await projectDelete(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("elimina proyecto correctamente", async () => {
      const project = {
        ...mockProject,
        update: jest.fn().mockResolvedValue(undefined),
        destroy: jest.fn().mockResolvedValue(undefined),
      };
      jest.mocked(Project.findOne).mockResolvedValue(project as never);

      const req = createMockRequest({ params: { id: "proj-1" } });
      (req as any).uuid = "user-1";
      const res = createMockResponse();

      await projectDelete(req, res);

      expect(project.update).toHaveBeenCalledWith({ status: Status.DELETE });
      expect(project.destroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("retorna 500 ante error interno", async () => {
      jest.mocked(Project.findOne).mockRejectedValue(new Error("DB error"));
      const req = createMockRequest({ params: { id: "proj-1" } });
      (req as any).uuid = "user-1";
      const res = createMockResponse();

      await projectDelete(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("projectList", () => {
    it("retorna 404 si no hay proyectos", async () => {
      jest.mocked(Project.findAll).mockResolvedValue([]);
      const req = createMockRequest();
      (req as any).uuid = "user-1";
      const res = createMockResponse();

      await projectList(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("retorna lista de proyectos", async () => {
      jest.mocked(Project.findAll).mockResolvedValue([mockProject] as never);
      const req = createMockRequest();
      (req as any).uuid = "user-1";
      const res = createMockResponse();

      await projectList(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        ok: true,
        projects: [mockProject],
      });
    });

    it("retorna 500 ante error interno", async () => {
      jest.mocked(Project.findAll).mockRejectedValue(new Error("DB error"));
      const req = createMockRequest();
      (req as any).uuid = "user-1";
      const res = createMockResponse();

      await projectList(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("projectById", () => {
    it("retorna 404 si el proyecto no existe", async () => {
      jest.mocked(Project.findOne).mockResolvedValue(null);
      const req = createMockRequest({ params: { id: "proj-1" } });
      (req as any).uuid = "user-1";
      const res = createMockResponse();

      await projectById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("retorna proyecto por id", async () => {
      jest.mocked(Project.findOne).mockResolvedValue(mockProject as never);
      const req = createMockRequest({ params: { id: "proj-1" } });
      (req as any).uuid = "user-1";
      const res = createMockResponse();

      await projectById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        ok: true,
        project: mockProject,
      });
    });

    it("retorna 500 ante error interno", async () => {
      jest.mocked(Project.findOne).mockRejectedValue(new Error("DB error"));
      const req = createMockRequest({ params: { id: "proj-1" } });
      (req as any).uuid = "user-1";
      const res = createMockResponse();

      await projectById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
