import {config} from "dotenv";
import express, {Express} from "express";
import bodyParser from "body-parser";
import {buildRoutes} from "./routes/index.route";

import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import {createConnection} from "typeorm";

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
    const app: Express = express();
    app.use(bodyParser.json());
    buildRoutes(app);
    app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
    app.listen(port, function () {
        console.log(`Listening on ${port}...`);
    });
});
