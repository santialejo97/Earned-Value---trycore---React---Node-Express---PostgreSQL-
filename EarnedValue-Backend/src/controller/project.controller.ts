import { Request, Response } from "express";
import { Project } from "../models";
import { Status } from "../interfaces/constants.interfaces";

export const projectCreate = async (req: Request, res: Response) => {
  try {
    const { body } = req;
    const uuid = (req as any).uuid;

    const newProject = await Project.create({ ...body, id_user: uuid });
    newProject.save();

    return res.status(200).json({
      ok: true,
      msg: `Projecto ${body.name} creado correctamente`,
      project: newProject,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      msg: "Internal Server Error",
    });
  }
};

export const projectEdit = async (req: Request, res: Response) => {
  try {
    const { body, params } = req;
    const uuid = (req as any).uuid;
    const { id } = params;

    const project = await Project.findOne({
      where: {
        id,
        id_user: uuid,
      },
    });

    if (!project) {
      return res.status(404).json({
        ok: false,
        msg: `The project with  id ${id} not found in the database, please validate information`,
      });
    }

    await Project.update(
      { ...body },
      {
        where: {
          id,
        },
      },
    );

    return res.status(200).json({
      ok: true,
      msg: `Proyecto con el id ${id} actualizado correctamente`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      msg: "Internal Server Error",
    });
  }
};

export const projectDelete = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const uuid = (req as any).uuid;

    const project = await Project.findOne({
      where: {
        id,
        id_user: uuid,
      },
    });

    if (!project) {
      return res.status(404).json({
        ok: false,
        msg: `The project with id ${id} not found in the database, please validate information`,
      });
    }

    await project.update({ status: Status.DELETE });
    await project.destroy();

    return res.status(200).json({
      ok: true,
      msg: `Proyecto con el id ${id} eliminado correctamente`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      msg: "Internal Server Error",
    });
  }
};

export const projectList = async (req: Request, res: Response) => {
  try {
    const uuid = (req as any).uuid;

    const projects = await Project.findAll({ where: { id_user: uuid } });

    if (projects.length == 0) {
      return res.status(404).json({
        ok: false,
        msg: `The projects for to user with id ${uuid} not exist`,
      });
    }

    return res.status(200).json({
      ok: true,
      projects,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      msg: "Internal Server Error",
    });
  }
};

export const projectById = async (req: Request, res: Response) => {
  try {
    const uuid = (req as any).uuid;
    const { id } = req.params;

    const project = await Project.findOne({ where: { id_user: uuid, id } });

    if (!project) {
      return res.status(404).json({
        ok: false,
        msg: `The project with id ${id} not exist`,
      });
    }

    return res.status(200).json({
      ok: true,
      project,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      msg: "Internal Server Error",
    });
  }
};
