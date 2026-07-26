import { Request, Response } from "express";
import { Activity, Project } from "../models";
import { Status } from "../interfaces/constants.interfaces";
import { UUID } from "sequelize";

export const createActivitie = async (req: Request, res: Response) => {
  try {
    const uuid = (req as any).uuid;
    const { body, params } = req;

    const newActivitie = await Activity.create({
      ...body,
      id_user: uuid,
      id_project: params.id_project,
      id_user_update: uuid,
    });

    newActivitie.save();

    return res.status(200).json({
      ok: true,
      msg: `Actividad ${body.name} creado correctamente`,
      activitie: newActivitie,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      msg: "Internal Server Error",
    });
  }
};

export const activitieEdit = async (req: Request, res: Response) => {
  try {
    const { body, params } = req;
    const uuid = (req as any).uuid;
    const { id } = params;

    const activitie = await Activity.findOne({
      where: {
        id_activity: id,
      },
    });

    if (!activitie) {
      return res.status(404).json({
        ok: false,
        msg: `The activitie with  id ${id} not found in the database, please validate information`,
      });
    }

    await Activity.update(
      { ...body, id_user_update: uuid },
      {
        where: {
          id_activity: id,
        },
      },
    );

    return res.status(200).json({
      ok: true,
      msg: `Actividad con el id ${id} actualizado correctamente`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      msg: "Internal Server Error",
    });
  }
};

export const activitiesList = async (req: Request, res: Response) => {
  try {
    const { params } = req;
    const { id_project } = params;

    const activities = await Activity.findAll({
      where: { id_project: id_project },
    });

    if (activities.length == 0) {
      return res.status(404).json({
        ok: false,
        msg: `The activities for to project with id ${id_project} not exist`,
      });
    }

    return res.status(200).json({
      ok: true,
      activities,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      msg: "Internal Server Error",
    });
  }
};

export const activitiesById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const activity = await Activity.findOne({ where: { id_activity: id } });

    if (!activity) {
      return res.status(404).json({
        ok: false,
        msg: `The activity with id ${id} not exist`,
      });
    }

    return res.status(200).json({
      ok: true,
      activity,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      msg: "Internal Server Error",
    });
  }
};

export const activitieDelete = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const activity = await Activity.findOne({
      where: {
        id_activity: id,
      },
    });

    if (!activity) {
      return res.status(404).json({
        ok: false,
        msg: `The activity with id ${id} not found in the database, please validate information`,
      });
    }

    await activity.update({ status: Status.DELETE });
    await activity.destroy();

    return res.status(200).json({
      ok: true,
      msg: `Actividad con el id ${id} eliminado correctamente`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      msg: "Internal Server Error",
    });
  }
};
