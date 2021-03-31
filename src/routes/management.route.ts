import express from "express";
import {ManagementController} from "../controllers/management.controller";
import {maintenanceMiddleware, treatmentMiddleware} from "../middlewares/management.middleware";
import {EmployeeController} from "../controllers/employee.controller";
import {AnimalController} from "../controllers/animal.controller";
import {AreaController} from "../controllers/area.controller";

const managementRouter = express.Router();

managementRouter.post("/treatment", treatmentMiddleware, async function (req, res) {
    const token = req.headers["authorization"] as string;
    const name = req.body.name;
    const date = req.body.date;
    const description = req.body.description;
    const animalId = req.body.animalId;
    const employeeController = await EmployeeController.getInstance();
    const animalController = await AnimalController.getInstance();
    const veterinary = await employeeController.getEmployeeByToken(token);
    const animal = await animalController.getAnimal(animalId);
    if (name === undefined ||
        date === undefined ||
        description === undefined ||
        veterinary === null ||
        animal === null) {
        res.status(400).end();
        return;
    }
    const managementController = await ManagementController.getInstance();
    const treatment = await managementController.treatAnimal({description, date, name}, veterinary, animal);
    if (treatment !== null) {
        res.status(201);
        res.json(treatment);
    } else {
        res.status(409).end();
    }
});

managementRouter.post("/maintenance", maintenanceMiddleware, async function (req, res) {
    const token = req.headers["authorization"] as string;
    const maintenanceDate = req.body.maintenanceDate;
    const areaId = req.body.areaId;
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
    const maintenance = await managementController.lockArea({maintenanceDate}, admin, area);
    if (maintenance !== null) {
        res.status(201);
        res.json(maintenance);
    } else {
        res.status(409).end();
    }
});

export {
    managementRouter
};