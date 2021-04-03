import {config} from "dotenv";
import express, {Express} from "express";
import bodyParser from "body-parser";
import {buildRoutes} from "./routes/index.route";

import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';

config();

const app: Express = express();

app.use(bodyParser.json());

buildRoutes(app);

const port = process.env.PORT || 3000;

const swaggerOptions = {
    explorer: true,
    swaggerDefinition:{
        info:{
            title:'PlanodeZoo API',
            version:'1.0.0'
        }
    },
    apis: ['./src/routes/*.ts'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


app.listen(port, function () {
    console.log(`Listening on ${port}...`);
});

