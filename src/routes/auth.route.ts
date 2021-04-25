import express from "express";
import passport from "passport";
import {AuthController} from "../controllers/auth.controller";
import {ensureLoggedIn, ensureLoggedOut} from "../middlewares/auth.middleware";

const authRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authentification
 *   description: All Authentification actions
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Authentification:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: The username
 *         email:
 *           type: string
 *           description: The email
 *         password:
 *           type: string
 *           description: The password
 *       example:
 *         username: noEmployee
 *         email: noEmployee@gmail.com
 *         password: popo
 */

/**
 * @swagger
 * /auth/signup:
 *  post:
 *      summary: Request for signup
 *      tags: [Authentification]
 *      requestBody:
 *        description: SignUp Informations
 *        required: true
 *        content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/Authentification'
 *      responses:
 *        200:
 *          description: OK
 *          content:
 *           application/json:
 *              schema:
 *                  $ref: '#/components/schemas/Authentification'
 *        400:
 *          description: Bad request.
 *        401:
 *          description: Authorization information is missing or invalid.
 *        5XX:
 *          description: Unexpected error.
 */
authRouter.post("/signup", ensureLoggedOut, async function (req, res) {
    const authController = await AuthController.getInstance();
    try {
        const user = await authController.subscribe({...req.body});
        res.status(201).json(user);
    } catch (err) {
        res.status(409).send(err).end();
    }
});

/**
 * @swagger
 * /auth/login:
 *  post:
 *      summary: Request for login
 *      tags: [Authentification]
 *      requestBody:
 *        description: Login information
 *        required: true
 *        content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/Authentification'
 *              example:
 *                  username: noEmployee
 *                  password: popo
 *      responses:
 *        200:
 *          description: OK
 *        400:
 *          description: Bad request.
 *        401:
 *          description: Authorization information is missing or invalid.
 *        5XX:
 *          description: Unexpected error.
 */
authRouter.post('/login', ensureLoggedOut, passport.authenticate('local'), async function (req, res) {
    res.json(req.user);
});

/**
 * @swagger
 * /auth/logout:
 *  delete:
 *      security:
 *          - ApiKeyAuth: []
 *      summary: Request for Logout
 *      tags: [Authentification]
 *      responses:
 *        200:
 *          description: OK
 *        400:
 *          description: Bad request.
 *        401:
 *          description: Authorization information is missing or invalid.
 *        5XX:
 *          description: Unexpected error.
 */
authRouter.delete('/logout', ensureLoggedIn, async function (req, res) {
    req.logout();
    res.status(204).end();
});

export {
    authRouter
};
