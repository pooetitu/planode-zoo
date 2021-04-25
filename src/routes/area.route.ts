import express from "express";
import {AreaController} from "../controllers/area.controller";
import {AnimalController} from "../controllers/animal.controller";
import {managementMiddleware} from "../middlewares/management.middleware";
import {EmployeeType} from "../models/employee.model";
import {ensureLoggedIn} from "../middlewares/auth.middleware";

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
 *     schedule:
 *       type: object
 *       required:
 *         - openTime
 *         - closeTime
 *       properties:
 *         openTime:
 *           type: date
 *           description: Opening time
 *         closeTime:
 *           type: date
 *           description: Closing time
 *       example:
 *         openTime: 2000-01-01T08:00:00.000Z
 *         closeTime: 2000-01-01T08:00:00.000Z
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     image:
 *       type: object
 *       required:
 *         - link
 *       properties:
 *         link:
 *           type: string
 *           description: link of the picture
 *       example:
 *         link: http://link/ppicture.png
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Area:
 *       type: object
 *       required:
 *         - name
 *         - type
 *         - description
 *         - capacity
 *         - duration
 *         - disabledAccess
 *         - schedules
 *       properties:
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
 *         disabledAccess:
 *           type: boolean
 *           description: To know if an area is open or closed
 *         images:
 *           type: array
 *           items:
 *              $ref: '#/components/schemas/image'
 *           description: Images of the area
 *         schedules:
 *           type: array
 *           items:
 *              $ref: '#/components/schemas/schedule'
 *           description: Opening time of the area
 *       example:
 *         name: aqualand
 *         type: aquatique
 *         description: La place des dauphins
 *         capacity: 1000
 *         duration: 20
 *         disabledAccess: false
 *         images: [{"link":"https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Delphinapterus_leucas_2.jpg/1200px-Delphinapterus_leucas_2.jpg"}]
 *         schedules: [{"openTime":"2000-01-01T14:00:00.000Z","closeTime":"2000-01-01T22:00:00.000Z"}]
 */

/**
 * @swagger
 * /area/:
 *  post:
 *      summary: Create an area
 *      tags: [Area]
 *      requestBody:
 *        description: Data of the area
 *        required: true
 *        content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/Area'
 *      responses:
 *        200:
 *          description: OK
 *          content:
 *           application/json:
 *              schema:
 *                  $ref: '#/components/schemas/Area'
 *        400:
 *          description: Bad request.
 *        401:
 *          description: Authorization information is missing or invalid.
 *        5XX:
 *          description: Unexpected error.
 */
areaRouter.post("/", ensureLoggedIn, managementMiddleware(EmployeeType.ADMIN), async function (req, res) {
    const areaController = await AreaController.getInstance();
    try {
        const area = await areaController.createArea({...req.body});
        res.status(201).json(area);
    } catch (err) {
        res.status(400).send(err).end();
        return;
    }
});

/**
 * @swagger
 * /area/{areaId}:
 *  get:
 *      summary: Get a specific Pass by ID
 *      tags: [Area]
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
 *          content:
 *           application/json:
 *              schema:
 *                  $ref: '#/components/schemas/Area'
 *        400:
 *          description: Bad request.
 *        401:
 *          description: Authorization information is missing or invalid.
 *        5XX:
 *          description: Unexpected error.
 */
areaRouter.get("/:areaId", async function (req, res) {
    const areaId = req.params.areaId;
    const areaController = await AreaController.getInstance();
    try {
        const area = await areaController.getAreaById(areaId);
        res.json(area);
    } catch (err) {
        res.status(400).send(err).end();
    }
});

/**
 * @swagger
 * /area/:
 *  get:
 *      summary: Get all Areas
 *      tags: [Area]
 *      responses:
 *        200:
 *          description: The Access Result
 *        404:
 *          description: A area with the specified ID was not found.
 */
areaRouter.get("/", async function (req, res) {
    const areaController = await AreaController.getInstance();
    const area = await areaController.getAll();
    if (area === null) {
        res.status(400).end();
        return;
    } else {
        res.json(area);
    }
});

/**
 * @swagger
 * /area/{areaId}:
 *  put:
 *      summary: Update an area
 *      tags: [Area]
 *      parameters:
 *      - in: path
 *        name: areaId
 *        required: true
 *        schema :
 *          type: string
 *          description: The Pass ID
 *      requestBody:
 *        description: Data of the area
 *        required: true
 *        content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/Area'
 *      responses:
 *        200:
 *          description: OK
 *          content:
 *           application/json:
 *              schema:
 *                  $ref: '#/components/schemas/Area'
 *        400:
 *          description: Bad request.
 *        401:
 *          description: Authorization information is missing or invalid.
 *        404:
 *          description: A pass with the specified ID was not found.
 *        5XX:
 *          description: Unexpected error.
 */
areaRouter.put("/:areaId", ensureLoggedIn, managementMiddleware(EmployeeType.ADMIN), async function (req, res) {
    const areaId = req.params.areaId;
    const areaController = await AreaController.getInstance();
    if (areaId === undefined) {
        res.status(400).end();
        return;
    }
    try {
        await areaController.updateArea(areaId, {...req.body});
        res.status(204).end();
    } catch (err) {
        res.status(400).send(err).end();
    }
});

/**
 * @swagger
 * /area/{areaId}/{animalId}:
 *  put:
 *      summary: Add an animal to an area
 *      tags: [Area]
 *      parameters:
 *      - in: path
 *        name: areaId
 *        required: true
 *        schema :
 *          type: string
 *          description: The Pass ID
 *      - in: path
 *        name: animalId
 *        required: true
 *        schema :
 *          type: string
 *          description: The Animal ID
 *      responses:
 *        200:
 *          description: OK
 *        400:
 *          description: Bad request.
 *        401:
 *          description: Authorization information is missing or invalid.
 *        404:
 *          description: A pass with the specified ID was not found.
 *        5XX:
 *          description: Unexpected error.
 */
areaRouter.put("/:areaId/:animalId", ensureLoggedIn, managementMiddleware(EmployeeType.ADMIN), async function (req, res) {
    const areaId = req.params.areaId;
    const animalId = req.params.animalId;
    const areaController = await AreaController.getInstance();
    const area = await areaController.getAreaById(areaId);
    if (area === null) {
        res.status(400).end();
        return;
    }
    const animalController = await AnimalController.getInstance();
    const animal = await animalController.getAnimal(animalId);
    if (animal === null) {
        res.status(400).end();
        return;
    }
    await areaController.addAnimal(area, animal);
    res.status(204).end();
});

/**
 * @swagger
 * /area/{areaId}:
 *  delete:
 *      summary: Delete an area
 *      tags: [Area]
 *      parameters:
 *      - in: path
 *        name: areaId
 *        required: true
 *        schema :
 *          type: string
 *          description: The Pass Id
 *      responses:
 *        200:
 *          description: OK
 *        400:
 *          description: Bad request.
 *        401:
 *          description: Authorization information is missing or invalid.
 *        404:
 *          description: A pass with the specified ID was not found.
 *        5XX:
 *          description: Unexpected error.
 */
areaRouter.delete("/:areaId", ensureLoggedIn, managementMiddleware(EmployeeType.ADMIN), async function (req, res) {
    const areaId = req.params.areaId;
    const areaController = await AreaController.getInstance();
    const area = await areaController.deleteAreaById(areaId);
    if (area) {
        res.status(400).end();
        return;
    } else {
        res.status(204).send("Deleted area").end();
    }
});

export {
    areaRouter
};

