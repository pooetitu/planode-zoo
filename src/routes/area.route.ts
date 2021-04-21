import express from "express";
import {AreaController} from "../controllers/area.controller";

const areaRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Area
 *   description: Area actions
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Area:
 *       type: object
 *       required:
 *         - areaId
 *         - name
 *         - type
 *         - description
 *         - capacity
 *         - duration
 *         - openingTime
 *         - disabledAccess
 *       properties:
 *         areaId:
 *           type: number
 *           description: The auto-generated id of the Area
 *         name:
 *           type: string
 *           description: The name of the Area
 *         type:
 *           type: string
 *           description: The type of the Area
 *         description:
 *           type: string
 *           description: The description of the Area
 *         capacity:
 *           type: number
 *           description: The capacity of the Area
 *         duration:
 *           type: number
 *           description: The duration of the Area
 *         openingTime:
 *           type: Date
 *           description: The opening time of the Area
 *         disabledAccess:
 *           type: boolean
 *           description: To know if an area is open or closed
 *       example:
 *         id: 1564
 *         name: Place des lions
 *         type: Area classique
 *         description: La place des lions
 *         capacity: 6
 *         duration: 15
 *         openingTime: 21/04/2021
 *         disabledAccess: 1
 */

/**
 * @swagger
 * /area/zoo/{areaId}/{passId}:
 *  post:
 *      summary: Create an area
 *      tags: [Area]
 *      parameters:
 *      - in: path
 *        name: passId
 *        schema :
 *          type: integer
 *          required: true
 *          description: The Pass Id
 *      responses:
 *        200:
 *          description: The Access Result
 *        404:
 *          description: The Access was not found
 */
areaRouter.post("/zoo/area", async function (req, res) {
    //TODO à tester
    const areaController = await AreaController.getInstance();
    const id = req.body.id;
    const name = req.body.name;
    const type = req.body.type;
    const description = req.body.description;
    const capacity = req.body.capacity;
    const duration = req.body.duration;
    const openingTime = req.body.openingTime;
    const disabledAccess = req.body.disabledAccess;
    const area = await areaController.createArea(req.body);
    if (area === null) {
        res.status(400).end();
        return;
    } else {
        res.status(400).end();
    }


});

/**
 * @swagger
 * /area/zoo/{areaId}/{passId}:
 *  get:
 *      summary: Create an area
 *      tags: [Area]
 *      parameters:
 *      - in: path
 *        name: passId
 *        schema :
 *          type: integer
 *          required: true
 *          description: The Pass Id
 *      responses:
 *        200:
 *          description: The Access Result
 *        404:
 *          description: The Access was not found
 */
areaRouter.get("/zoo/:areaId", async function (req, res) {
    const areaId = req.params.areaId;
    const areaController = await AreaController.getInstance();
    const area = await areaController.getAreaById(areaId);
    if (area === null) {
        res.status(400).end();
        return;
    } else {
        res.status(400).end();
    }


});

/**
 * @swagger
 * /area/zoo/{areaId}/{passId}:
 *  put:
 *      summary: Create an area
 *      tags: [Area]
 *      parameters:
 *      - in: path
 *        name: passId
 *        schema :
 *          type: integer
 *          required: true
 *          description: The Pass Id
 *      responses:
 *        200:
 *          description: The Access Result
 *        404:
 *          description: The Access was not found
 */
areaRouter.put("/zoo/:areaId", async function (req, res) {
    //TODO put area


});

/**
 * @swagger
 * /area/zoo/{areaId}/{passId}:
 *  delete:
 *      summary: Create an area
 *      tags: [Area]
 *      parameters:
 *      - in: path
 *        name: passId
 *        schema :
 *          type: integer
 *          required: true
 *          description: The Pass Id
 *      responses:
 *        200:
 *          description: The Access Result
 *        404:
 *          description: The Access was not found
 */
areaRouter.delete("/zoo/:areaId", async function (req, res) {
    const areaId = req.params.areaId;
    const areaController = await AreaController.getInstance();
    const area = await areaController.deleteAreaById(areaId);
    if (area === null) {
        res.status(400).end();
        return;
    } else {
        res.status(400).end();
    }


});


export {
    areaRouter
};

