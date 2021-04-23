import express from "express";
import {AuthController} from "../controllers/auth.controller";
import {authMiddleware} from "../middlewares/auth.middleware";

const authRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authentification
 *   description: Authentification actions
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Authentification:
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
 * /auth/signup:
 *  post:
 *      summary: Manage Authentification
 *      tags: [Authentification]
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
authRouter.post("/signup", async function (req, res) {
    const authController = await AuthController.getInstance();
    try {
        const user = await authController.subscribe({...req.body});
        res.status(201).json(user);
    }catch (err) {
        res.status(409).send(err).end();
    }
});

/**
 * @swagger
 * /auth/login:
 *  post:
 *      summary: Create an area
 *      tags: [Authentification]
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
authRouter.post("/login", async function (req, res) {
    const login = req.body.login;
    const password = req.body.password;
    if (login === undefined || password === undefined) {
        res.status(400).end();
        return;
    }
    const authController = await AuthController.getInstance();
    const session = await authController.login(login, password);
    if (session === null) {
        res.status(404).end();
        return;
    } else {
        res.json({
            token: session.token
        });
    }
});

/**
 * @swagger
 * /auth/logout:
 *  delete:
 *      summary: Create an area
 *      tags: [Authentification]
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
authRouter.delete("/logout", authMiddleware, async function (req, res) {
    const token = req.headers["authorization"] as string;
    try {
        const authController = await AuthController.getInstance();
        await authController.logout(token);
        res.send("Session close");
    }
    catch (err){
        res.status(400).send("Impossible de fermer la session");
    }
});

export {
    authRouter
};
