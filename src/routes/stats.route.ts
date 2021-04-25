import express from "express";
import {StatsController} from "../controllers/stats.controller";
import {AreaController} from "../controllers/area.controller";

const statsRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Stats
 *   description: Statistics of the park
 */

/**
 * @swagger
 * /stats/zoo/realtime:
 *  get:
 *      summary: Statistic to get the realTime attendance
 *      tags: [Stats]
 *      responses:
 *        200:
 *          description: OK
 *        400:
 *          description: Bad request.
 *        401:
 *          description: Authorization information is missing or invalid.
 *        5XX:
 *          description: Unexpected error.
 */
statsRouter.get("/zoo/realtime", async function (req, res) {
    const statsController = await StatsController.getInstance();
    res.json({"attendance": await statsController.getZooRealtimeAttendance()});
});

/**
 * @swagger
 * /stats/zoo/week/{date}:
 *  get:
 *      summary: Statistic to get the week attendance
 *      tags: [Stats]
 *      parameters:
 *      - in: path
 *        name: date
 *        required: true
 *        schema :
 *          type: date
 *          description: The Date
 *      responses:
 *        200:
 *          description: OK
 *        400:
 *          description: Bad request.
 *        401:
 *          description: Authorization information is missing or invalid.
 *        5XX:
 *          description: Unexpected error.
 */
statsRouter.get("/zoo/week/:date", async function (req, res) {
    const date = req.params.date;
    if (date === undefined) {
        res.status(400).end();
        return;
    }
    const statsController = await StatsController.getInstance();
    res.json({"attendance": await statsController.getZooAttendance(new Date(date), "WEEK")});
});

/**
 * @swagger
 * /stats/zoo/day/{date}:
 *  get:
 *      summary: Statistic to get the day attendance
 *      tags: [Stats]
 *      parameters:
 *      - in: path
 *        name: date
 *        required: true
 *        schema :
 *          type: date
 *          description: The Date
 *      responses:
 *        200:
 *          description: OK
 *        400:
 *          description: Bad request.
 *        401:
 *          description: Authorization information is missing or invalid.
 *        5XX:
 *          description: Unexpected error.
 */
statsRouter.get("/zoo/day/:date", async function (req, res) {
    const date = req.params.date;
    if (date === undefined) {
        res.status(400).end();
        return;
    }
    const statsController = await StatsController.getInstance();
    res.json({"attendance": await statsController.getZooAttendance(new Date(date), "DATE")});
});

/**
 * @swagger
 * /stats/area/realtime/{areaId}:
 *  get:
 *      summary: Statistic to get the area realtime attendance
 *      tags: [Stats]
 *      parameters:
 *      - in: path
 *        name: areaId
 *        required: true
 *        schema :
 *          type: number
 *          description: The area ID
 *      responses:
 *        200:
 *          description: OK
 *        400:
 *          description: Bad request.
 *        401:
 *          description: Authorization information is missing or invalid.
 *        5XX:
 *          description: Unexpected error.
 */
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

/**
 * @swagger
 * /stats/area/day/{areaId}/{date}:
 *  get:
 *      summary: Statistic to get the area day attendance
 *      tags: [Stats]
 *      parameters:
 *      - in: path
 *        name: areaId
 *        required: true
 *        schema :
 *          type: number
 *          description: The area ID
 *      - in: path
 *        name: date
 *        required: true
 *        schema :
 *          type: date
 *          description: The Date
 *      responses:
 *        200:
 *          description: OK
 *        400:
 *          description: Bad request.
 *        401:
 *          description: Authorization information is missing or invalid.
 *        5XX:
 *          description: Unexpected error.
 */
statsRouter.get("/area/day/:areaId/:date", async function (req, res) {
    const areaId = req.params.areaId;
    const date = req.params.date;
    if (areaId === null || date === undefined) {
        res.status(400).end();
        return;
    }
    const statsController = await StatsController.getInstance();
    res.json({"attendance": await statsController.getAreaAttendance(new Date(date), "DATE", areaId)});
});

/**
 * @swagger
 * /stats/area/week/{areaId}/{date}:
 *  get:
 *      summary: Statistic to get the area week attendance
 *      tags: [Stats]
 *      parameters:
 *      - in: path
 *        name: areaId
 *        required: true
 *        schema :
 *          type: number
 *          description: The area ID
 *      - in: path
 *        name: date
 *        required: true
 *        schema :
 *          type: date
 *          description: The Date
 *      responses:
 *        200:
 *          description: OK
 *        400:
 *          description: Bad request.
 *        401:
 *          description: Authorization information is missing or invalid.
 *        5XX:
 *          description: Unexpected error.
 */
statsRouter.get("/area/week/:areaId/:date", async function (req, res) {
    const areaId = req.params.areaId;
    const date = req.params.date;
    if (areaId === undefined || date === undefined) {
        res.status(400).end();
        return;
    }
    const statsController = await StatsController.getInstance();
    res.json({"attendance": await statsController.getAreaAttendance(new Date(date), "WEEK", areaId)});
});

export {
    statsRouter
};
