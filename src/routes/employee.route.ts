import {EmployeeType} from "../models/employee.model";
import {AuthController} from "../controllers/auth.controller";
import {EmployeeController} from "../controllers/employee.controller";
import express from "express";
import {managementMiddleware} from "../middlewares/management.middleware";

const employeeRouter = express.Router();
/**
 * @swagger
 * /management/employee/hire:
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
employeeRouter.post("/:userId", managementMiddleware(EmployeeType.ADMIN), async function (req, res) {
    const userId = req.params.userId;
    try {
        const authController = await AuthController.getInstance();
        const user = await authController.getUserById(userId);
        const employeeController = await EmployeeController.getInstance();
        const employee = await employeeController.createEmployee({...req.body, user});
        res.status(201).json(employee);
    } catch (err) {
        res.status(400).send(err).end();
    }
});

/**
 * @swagger
 * /management/employee/fire:
 *  delete:
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
employeeRouter.delete("/:userId", managementMiddleware(EmployeeType.ADMIN), async function (req, res) {
    const userId = req.params.userId;
    const authController = await AuthController.getInstance();
    try {
        const user = await authController.getUserById(userId);
        const employeeController = await EmployeeController.getInstance();
        const isDeleted = await employeeController.deleteEmployee(user);
        if (isDeleted) {
            res.status(204).end();
        } else {
            res.status(400).end();
        }
    }catch (err){
        res.status(400).end();
    }
});

employeeRouter.get("/:employeeId", async function (req, res) {
    const employeeId = req.params.employeeId;
    if (employeeId === undefined) {
        res.status(400).end();
        return;
    }
    const employeeController = await EmployeeController.getInstance();
    try {
        const employee = await employeeController.getEmployeeById(employeeId);
        res.status(201).json(employee);
    }catch (err){
        res.status(400).end();
    }
});

employeeRouter.get("/", async function (req, res) {
    const employeeController = await EmployeeController.getInstance();
    const employees = await employeeController.getAllUser();
    if (employees !== null) {
        res.status(201).json(employees);
    } else {
        res.status(404).end();
    }
});

employeeRouter.get("/user/:userId", async function (req, res) {
    const userId = req.params.userId;
    if (userId === undefined ) {
        res.status(400).end();
        return;
    }
    const employeeController = await EmployeeController.getInstance();
    try {
        const employee = await employeeController.getEmployeeByUserId(userId);
        if(employee !== null) {
            res.json(employee).end();
        }else{
            res.status(400).end();
        }
    }
    catch (err){
        res.status(400).send(err).end();
    }
});

export {
    employeeRouter
};
