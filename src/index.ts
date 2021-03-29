import {config} from "dotenv";
import express, {Express} from "express";
import bodyParser from "body-parser";
import {buildRoutes} from "./routes/index.route";

config();

const app: Express = express();

app.use(bodyParser.json());

buildRoutes(app);

const port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log(`Listening on ${port}...`);
});

