import {config} from "dotenv";
import express, {Express} from "express";
import bodyParser from "body-parser";
import {buildRoutes} from "./routes/index.route";

import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import {createConnection, getRepository} from "typeorm";
import {configure} from "./config/passport.config";
import passport from "passport";
import {Session} from "./models/session.model";
import {TypeormStore} from "connect-typeorm";

config();

const port = process.env.PORT || 3000;

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: 'PlanodeZoo API',
            description: "Application NodeJs projet ESGI",
            version: '1.0.0',
        },
        servers: [
            {
                url: `http://localhost:${port}`
            }
        ]
    },
    apis: ['./src/routes/*.ts'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

createConnection({
    type: "mysql",
    logging: true,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT!),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [__dirname + "/**/models/*.ts"],
    synchronize: true
}).then(() => {
    configure();
    const app: Express = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(require('cookie-parser')());
    app.use("/", require('express-session')({
        secret: process.env.SECRET,
        resave: true,
        saveUninitialized: true,
        store: new TypeormStore({
            cleanupLimit: 2,
            limitSubquery: false,
            ttl: 259200
        }).connect(getRepository(Session)),
    }));
    app.use("/", passport.initialize());
    app.use("/", passport.session());
    buildRoutes(app);
    app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
    app.listen(port, function () {
        console.log(`Listening on ${port}...`);
    });
});
