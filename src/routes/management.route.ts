import express from "express";
import {ManagementController} from "../controllers/management.controller";
import {managementMiddleware} from "../middlewares/management.middleware";
import {EmployeeController} from "../controllers/employee.controller";
import {AnimalController} from "../controllers/animal.controller";
import {AreaController} from "../controllers/area.controller";
import {EmployeeType} from "../models/employee.model";
import {employeeRouter} from "./employee.route";

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
 *     Management:
 *       type: object
 *       required:
 *         - passId
 *       properties:
 *         passId:
 *           type: number
 *           description: The auto-generated id of the Pass
 *       example:
 *         id: 1564
 */

/**
 * @swagger
 * /management/treatment:
 *  post:
 *      summary: Manage Authentification
 *      tags: [Management]
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
managementRouter.post("/treatment/animalId", managementMiddleware(EmployeeType.VETERINARY), async function (req, res) {
    const token = req.headers["authorization"] as string;
    const animalId = req.params.animalId;
    const employeeController = await EmployeeController.getInstance();
    const animalController = await AnimalController.getInstance();
    const veterinary = await employeeController.getEmployeeByToken(token);
    const animal = await animalController.getAnimal(animalId);
    if (veterinary === null || animal === null) {
        res.status(400).end();
        return;
    }
    const managementController = await ManagementController.getInstance();
    const treatment = await managementController.treatAnimal({...req.body}, veterinary, animal);
    if (treatment !== null) {
        res.status(201).json(treatment);
    } else {
        res.status(409).end();
    }
});

/**
 * @swagger
 * /management/maintenance:
 *  post:
 *      summary: Manage Authentification
 *      tags: [Management]
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
managementRouter.post("/maintenance/:areaId", managementMiddleware(EmployeeType.ADMIN), async function (req, res) {
    const token = req.headers["authorization"] as string;
    const maintenanceDate = req.body.maintenanceDate;
    const areaId = req.params.areaId;
    const employeeController = await EmployeeController.getInstance();
    const areaController = await AreaController.getInstance();
    const admin = await employeeController.getEmployeeByToken(token);
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
 * /management/suggest-maintenance-month:
 *  get:
 *      summary: Manage Authentification
 *      tags: [Management]
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
managementRouter.get("/suggest-maintenance-month/:areaId", managementMiddleware(EmployeeType.ADMIN), async function (req, res) {
    const areaId = req.params.areaId;
    if (!areaId) {
        res.status(400).send("you must pass an areaId").end();
        return;
    }
    const managementController = await ManagementController.getInstance();
    try {
        const date = await managementController.suggestedMaintenanceDate(areaId);
        res.status(200).json({"month": date}).end();
    } catch (err) {
        res.status(404).send(err).end();
    }
});

export {
    managementRouter
};
