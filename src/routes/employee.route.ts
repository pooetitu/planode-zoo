import {EmployeeType} from "../models/employee.model";
import {AuthController} from "../controllers/auth.controller";
import {EmployeeController} from "../controllers/employee.controller";
import express from "express";
import {managementMiddleware} from "../middlewares/management.middleware";

const employeeRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Employee
 *   description: Management of the employees
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Employee:
 *       type: object
 *       required:
 *         - firstname
 *         - lastname
 *         - type
 *       properties:
 *         firstname:
 *           type: string
 *           description: The firstname of the employee
 *         lastname:
 *           type: string
 *           description: The lastname of the employee
 *         type:
 *           type: string
 *           description: The type of the employee (ADMIN, USER)
 *       example:
 *         firstname: pooo
 *         lastname: oop
 *         type: ADMIN
 */

/**
 * @swagger
 * /management/employee/{userId}:
 *  post:
 *      security:
 *          - ApiKeyAuth: []
 *      summary: Create a new Employee
 *      tags: [Employee]
 *      parameters:
 *      - in: path
 *        name: userId
 *        required: true
 *        schema :
 *          type: integer
 *          description: The user Id
 *      requestBody:
 *        description: Data of the employee
 *        required: true
 *        content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/Employee'
 *      responses:
 *        200:
 *          description: OK
 *          content:
 *           application/json:
 *              schema:
 *                  $ref: '#/components/schemas/Employee'
 *        400:
 *          description: Bad request.
 *        401:
 *          description: Authorization information is missing or invalid.
 *        5XX:
 *          description: Unexpected error.
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
        res.status(409).send(err).end();
    }
});

/**
 * @swagger
 * /management/employee/{employeeId}:
 *  delete:
 *      summary: Delete a specific Employee
 *      tags: [Employee]
 *      parameters:
 *      - in: path
 *        name: employeeId
 *        required: true
 *        schema :
 *          type: integer
 *          description: The Employee ID
 *      responses:
 *        200:
 *          description: OK
 *        400:
 *          description: Bad request.
 *        401:
 *          description: Authorization information is missing or invalid.
 *        404:
 *          description: A employee with the specified ID was not found.
 *        5XX:
 *          description: Unexpected error.
 */
employeeRouter.delete("/:employeeId", managementMiddleware(EmployeeType.ADMIN), async function (req, res) {
    const employeeId = req.params.employeeId;
    try {
        const employeeController = await EmployeeController.getInstance();
        const isDeleted = await employeeController.deleteEmployee(employeeId);
        if (isDeleted) {
            res.status(204).end();
        } else {
            res.status(400).end();
        }
    } catch (err) {
        res.status(400).send(err).end();
    }
});

/**
 * @swagger
 * /management/employee/{employeeId}:
 *  get:
 *      summary: Get a specific employee by ID
 *      tags: [Employee]
 *      parameters:
 *      - in: path
 *        name: employeeId
 *        required: true
 *        schema :
 *          type: integer
 *          description: The Employee Id
 *      responses:
 *        200:
 *          description: OK
 *          content:
 *           application/json:
 *              schema:
 *                  $ref: '#/components/schemas/Employee'
 *        400:
 *          description: Bad request.
 *        401:
 *          description: Authorization information is missing or invalid.
 *        5XX:
 *          description: Unexpected error.
 */
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
    } catch (err) {
        res.status(404).send(err).end();
    }
});

/**
 * @swagger
 * /management/employee/:
 *  get:
 *      summary: Get all Employee
 *      tags: [Employee]
 *      responses:
 *        200:
 *          description: OK
 *        404:
 *          description: A employee with the specified ID was not found.
 */
employeeRouter.get("/", async function (req, res) {
    const employeeController = await EmployeeController.getInstance();
    const employees = await employeeController.getAllUser();
    if (employees !== null) {
        res.status(201).json(employees);
    } else {
        res.status(404).end();
    }
});

/**
 * @swagger
 * /management/employee/user/{userId}:
 *  get:
 *      summary: Get a specific Employee by User ID
 *      tags: [Employee]
 *      parameters:
 *      - in: path
 *        name: userId
 *        required: true
 *        schema :
 *          type: integer
 *          description: The User Id
 *      responses:
 *        200:
 *          description: OK
 *          content:
 *           application/json:
 *              schema:
 *                  $ref: '#/components/schemas/Employee'
 *        400:
 *          description: Bad request.
 *        401:
 *          description: Authorization information is missing or invalid.
 *        5XX:
 *          description: Unexpected error.
 */
employeeRouter.get("/user/:userId", async function (req, res) {
    const userId = req.params.userId;
    if (userId === undefined) {
        res.status(400).end();
        return;
    }
    const employeeController = await EmployeeController.getInstance();
    try {
        const employee = await employeeController.getEmployeeByUserId(userId);
        res.json(employee).end();
    } catch (err) {
        res.status(404).send(err).end();
    }
});

export {
    employeeRouter
};
