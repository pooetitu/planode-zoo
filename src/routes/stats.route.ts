import express from "express";
import {StatsController, StatsPeriods} from "../controllers/stats.controller";
import {AreaController} from "../controllers/area.controller";

const statsRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Stats
 *   description: Stats actions of the park
 */

statsRouter.get("/zoo/realtime", async function (req, res) {
    const statsController = await StatsController.getInstance();
    res.json({"attendance": await statsController.getZooRealtimeAttendance()});
});

statsRouter.get("/zoo/week/:date", async function (req, res) {
    const date = req.params.date;
    if (date === undefined) {
        res.status(400).end();
        return;
    }
    const statsController = await StatsController.getInstance();
    res.json({"attendance": await statsController.getZooAttendance(new Date(date), StatsPeriods.WEEK)});
});

statsRouter.get("/zoo/day/:date", async function (req, res) {
    const date = req.params.date;
    if (date === undefined) {
        res.status(400).end();
        return;
    }
    const statsController = await StatsController.getInstance();
    res.json({"attendance": await statsController.getZooAttendance(new Date(date), StatsPeriods.DAY)});
});

statsRouter.get("/area/realtime/:areaId", async function (req, res) {
    const areaId = req.params.areaId;
    if (areaId === null) {
        res.status(400).end();
        return;
    }
    const areaController = await AreaController.getInstance();
    const area = await areaController.getAreaById(areaId);
    if (area === null) {
        res.status(404).end();
        return;
    }
    const statsController = await StatsController.getInstance();
    res.json({"attendance": await statsController.getAreaRealtimeAttendance(area)});
});

statsRouter.get("/area/day/:areaId/:date", async function (req, res) {
    const areaId = req.params.areaId;
    const date = req.params.date;
    if (areaId === null || date === undefined) {
        res.status(400).end();
        return;
    }
    const areaController = await AreaController.getInstance();
    const area = await areaController.getAreaById(areaId);
    if (area === null) {
        res.status(404).end();
        return;
    }
    const statsController = await StatsController.getInstance();
    res.json({"attendance": await statsController.getAreaAttendance(new Date(date), StatsPeriods.DAY, area)});
});

statsRouter.get("/area/week/:areaId/:date", async function (req, res) {
    const areaId = req.params.areaId;
    const date = req.params.date;
    if (areaId === undefined || date === undefined) {
        res.status(400).end();
        return;
    }
    const areaController = await AreaController.getInstance();
    const area = await areaController.getAreaById(areaId);
    if (area === null) {
        res.status(404).end();
        return;
    }
    const statsController = await StatsController.getInstance();
    res.json({"attendance": await statsController.getAreaAttendance(new Date(date), StatsPeriods.WEEK, area)});
});

export {
    statsRouter
};
