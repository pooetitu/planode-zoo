import {AnimalController} from "../controllers/animal.controller";
import express from "express";

const animalRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Animal
 *   description: All actions about animals
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Animal:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the animal
 *       example:
 *         name: chauve souris
 */

/**
 * @swagger
 * /animal/{animalId}:
 *  get:
 *      summary: Get a specific Animal by ID
 *      tags: [Animal]
 *      responses:
 *        200:
 *          description: OK
 *          content:
 *           application/json:
 *              schema:
 *                  $ref: '#/components/schemas/Animal'
 *        400:
 *          description: Bad request.
 *        401:
 *          description: Authorization information is missing or invalid.
 *        5XX:
 *          description: Unexpected error.
 */
animalRouter.get("/:animalId", async function (req, res) {
    const animalId = req.params.animalId;
    const animalController = await AnimalController.getInstance();
    try {
        const animal = await animalController.getAnimal(animalId);
        res.json(animal);
    } catch (err) {
        res.status(400).json(err).end();
    }
});

/**
 * @swagger
 * /animal/:
 *  get:
 *      summary: Get all Animal
 *      tags: [Animal]
 *      responses:
 *        200:
 *          description: The Access Result
 *        404:
 *          description: The Access was not found
 */
animalRouter.get("/", async function (req, res) {
    const animalController = await AnimalController.getInstance();
    const animal = await animalController.getAllAnimals();
    if (animal === null) {
        res.status(400).end();
        return;
    } else {
        res.json(animal);
    }
});

/**
 * @swagger
 * /animal/:
 *  post:
 *      summary: Create a new Animal
 *      tags: [Animal]
 *      requestBody:
 *        description: Data of the Animal
 *        required: true
 *        content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/Animal'
 *      responses:
 *        200:
 *          description: OK
 *          content:
 *           application/json:
 *              schema:
 *                  $ref: '#/components/schemas/Animal'
 *        400:
 *          description: Bad request.
 *        401:
 *          description: Authorization information is missing or invalid.
 *        5XX:
 *          description: Unexpected error.
 */
animalRouter.post("/", async function (req, res) {
    const animalController = await AnimalController.getInstance();
    try {
        const animal = await animalController.createAnimal({...req.body});
        if (animal === null) {
            res.status(400).end();
            return;
        } else {
            res.status(201).json(animal);
        }
    } catch (err) {
        res.status(400).send(err).end();
    }
});

/**
 * @swagger
 * /animal/{animalId}:
 *  put:
 *      summary: Update a specific Animal
 *      tags: [Animal]
 *      parameters:
 *      - in: path
 *        name: animalId
 *        required: true
 *        schema :
 *          type: integer
 *          description: The Animal ID
 *      requestBody:
 *        description: Data of the pass
 *        required: true
 *        content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/Animal'
 *      responses:
 *        200:
 *          description: OK
 *          content:
 *           application/json:
 *              schema:
 *                  $ref: '#/components/schemas/Animal'
 *        400:
 *          description: Bad request.
 *        401:
 *          description: Authorization information is missing or invalid.
 *        404:
 *          description: A Animal with the specified ID was not found.
 *        5XX:
 *          description: Unexpected error.
 */
animalRouter.put("/:animalId", async function (req, res) {
    const animalId = req.params.animalId;

    const animalController = await AnimalController.getInstance();
    if (animalId === undefined) {
        res.status(400).end();
        return;
    }
    await animalController.updateAnimal(animalId, {...req.body});
    res.status(204).end();
});

/**
 * @swagger
 * /animal/{animalId}:
 *  delete:
 *      summary: Delete a specific Animal
 *      tags: [Animal]
 *      parameters:
 *      - in: path
 *        name: animalId
 *        required: true
 *        schema :
 *          type: integer
 *          description: The Animal ID
 *      responses:
 *        200:
 *          description: OK
 *        400:
 *          description: Bad request.
 *        401:
 *          description: Authorization information is missing or invalid.
 *        404:
 *          description: A Animal with the specified ID was not found.
 *        5XX:
 *          description: Unexpected error.
 */
animalRouter.delete("/:animalId", async function (req, res) {
    const animalId = req.params.animalId;

    if (animalId === undefined) {
        res.status(400).end();
        return;
    }
    const animalController = await AnimalController.getInstance();
    await animalController.deleteAnimal(animalId);
    res.status(204).end();
});

export {
    animalRouter
}
