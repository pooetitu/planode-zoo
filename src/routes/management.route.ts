import express from "express";
import {ManagementController} from "../controllers/management.controller";
import {managementMiddleware} from "../middlewares/management.middleware";
import {EmployeeController} from "../controllers/employee.controller";
import {AnimalController} from "../controllers/animal.controller";
import {AreaController} from "../controllers/area.controller";
import {AuthController} from "../controllers/auth.controller";
import {EmployeeType} from "../models/employee.model";

const managementRouter = express.Router();

managementRouter.post("/treatment", managementMiddleware(EmployeeType.VETERINARY), async function (req, res) {
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

managementRouter.post("/maintenance", managementMiddleware(EmployeeType.ADMIN), async function (req, res) {
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

managementRouter.post("/hire", managementMiddleware(EmployeeType.ADMIN), async function (req, res) {
    const userId = req.body.userId;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const type = req.body.type;

    const authController = await AuthController.getInstance();
    const user = await authController.getUserById(userId);
    if (firstname === undefined || lastname === undefined || type === undefined || user === null) {
        res.status(400).end();
        return;
    }
    const employeeController = await EmployeeController.getInstance();
    const employee = await employeeController.createEmployee({firstname, lastname, type}, user);
    console.log(employee);
    await employee?.getUser().then(async a => a.getEmployee().then(async b => console.log(b)));
    if (employee !== null) {
        res.status(201);
        res.json(employee);
    } else {
        res.status(409).end();
    }
});

managementRouter.delete("/fire", managementMiddleware(EmployeeType.ADMIN), async function (req, res) {
    const userId = req.body.userId;
    const authController = await AuthController.getInstance();
    const user = await authController.getUserById(userId);
    if (userId === undefined || user === null) {
        res.status(400).end();
        return;
    }
    const employeeController = await EmployeeController.getInstance();
    const isDeleted = await employeeController.deleteEmployee(user);
    if (isDeleted) {
        res.status(204).end();
    } else {
        res.status(400).end();
    }
});

managementRouter.get("/suggest-maintenance-month", managementMiddleware(EmployeeType.ADMIN), async function (req, res) {
    const areaId = req.body.areaId;
    const areaController = await AreaController.getInstance();
    const area = await areaController.getAreaById(areaId);
    if (area === null) {
        res.status(400).end();
        return;
    }
    const managementController = await ManagementController.getInstance();
    const date = await managementController.suggestedMaintenanceDate(area);
    res.status(200);
    res.json({"month": date});
});

export {
    managementRouter
};
