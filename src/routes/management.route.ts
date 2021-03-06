import express from "express";
import {ManagementController} from "../controllers/management.controller";
import {managementMiddleware} from "../middlewares/management.middleware";
import {AnimalController} from "../controllers/animal.controller";
import {AreaController} from "../controllers/area.controller";
import {EmployeeType} from "../models/employee.model";
import {employeeRouter} from "./employee.route";
import {User} from "../models/user.model";

const managementRouter = express.Router();

managementRouter.use("/employee", employeeRouter);

/**
 * @swagger
 * tags:
 *   name: Management
 *   description: Manage actions of the park
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Treatment:
 *       type: object
 *       required:
 *         - name
 *         - date
 *         - description
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the animal
 *         date:
 *           type: date
 *           description: The Date of the event
 *         description:
 *           type: string
 *           description: The description of this event
 *       example:
 *         name: vaccin covid tmtc
 *         date: 2021-04-01
 *         description: TMTC le covid c dangereux tout ça faut vacciner meme les chauves souris ces follasses
 */

/**
 * @swagger
 * /management/treatment/{animalId}:
 *  post:
 *      summary: Add treatment to the animals
 *      tags: [Management]
 *      parameters:
 *      - in: path
 *        name: animalId
 *        required: true
 *        schema :
 *          type: string
 *          description: The Animal Id
 *      requestBody:
 *        description: Data of the treatment
 *        required: true
 *        content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/Treatment'
 *      responses:
 *        200:
 *          description: OK
 *          content:
 *           application/json:
 *              schema:
 *                  $ref: '#/components/schemas/Treatment'
 *        400:
 *          description: Bad request.
 *        401:
 *          description: Authorization information is missing or invalid.
 *        5XX:
 *          description: Unexpected error.
 */
managementRouter.post("/treatment/:animalId", managementMiddleware(EmployeeType.VETERINARY), async function (req, res) {
    const animalId = req.params.animalId;
    const animalController = await AnimalController.getInstance();
    const veterinary = (req.user as User).employee;
    try {
        const animal = await animalController.getAnimal(animalId);
        const managementController = await ManagementController.getInstance();
        const treatment = await managementController.treatAnimal({...req.body}, veterinary, animal);
        res.status(201).json(treatment);
    } catch (err) {
        res.status(409).end();
    }
});

/**
 * @swagger
 * /management/maintenance/{areaId}:
 *  post:
 *      summary: Manage maintenance of area
 *      tags: [Management]
 *      parameters:
 *      - in: path
 *        name: areaId
 *        required: true
 *        schema :
 *          type: string
 *          description: The Area Id
 *      requestBody:
 *        description: Data of the Maintenance
 *        required: true
 *        content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                      maintenanceDate:
 *                          type: date
 *              example:
 *                  maintenanceDate: 2021-04
 *      responses:
 *        200:
 *          description: OK
 *          content:
 *           application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                      maintenanceDate:
 *                          type: date
 *              example:
 *                  maintenanceDate: 2021-04
 *        400:
 *          description: Bad request.
 *        401:
 *          description: Authorization information is missing or invalid.
 *        5XX:
 *          description: Unexpected error.
 */
managementRouter.post("/maintenance/:areaId", managementMiddleware(EmployeeType.ADMIN), async function (req, res) {
    const maintenanceDate = req.body.maintenanceDate;
    const areaId = req.params.areaId;
    const areaController = await AreaController.getInstance();
    const admin = (req.user as User).employee;
    const area = await areaController.getAreaById(areaId);
    if (maintenanceDate === undefined ||
        admin === null ||
        area === null) {
        res.status(400).end();
        return;
    }
    const managementController = await ManagementController.getInstance();
    const maintenance = await managementController.setAreaMaintenanceDate({maintenanceDate}, admin, area);
    if (maintenance !== null) {
        res.status(201);
        res.json(maintenance);
    } else {
        res.status(409).end();
    }
});

/**
 * @swagger
 * /management/suggest-maintenance-month/{areaId}:
 *  get:
 *      summary: Know the best month for maintenance
 *      tags: [Management]
 *      parameters:
 *      - in: path
 *        name: areaId
 *        required: true
 *        schema :
 *          type: string
 *          description: The Area Id
 *      responses:
 *        200:
 *          description: OK
 *        400:
 *          description: Bad request.
 *        401:
 *          description: Authorization information is missing or invalid.
 *        404:
 *          description: A area with the specified ID was not found.
 *        5XX:
 *          description: Unexpected error.
 */
managementRouter.get("/suggest-maintenance-month/:areaId", managementMiddleware(EmployeeType.ADMIN), async function (req, res) {
    const areaId = req.params.areaId;
    if (!areaId) {
        res.status(400).send("you must pass an areaId").end();
        return;
    }
    const managementController = await ManagementController.getInstance();
    try {
        const date = await managementController.suggestedMaintenanceDate(areaId);
        res.status(200).json(date).end();
    } catch (err) {
        res.status(404).send(err).end();
    }
});

export {
    managementRouter
};
