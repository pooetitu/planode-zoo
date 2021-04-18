import express from "express";
import {AccessController} from "../controllers/access.controller";
import {zooAccessMiddleware, zooOpenCheckMiddleware} from "../middlewares/access.middleware";
import {PassController} from "../controllers/pass.controller";
import {AreaController} from "../controllers/area.controller";

const areaRouter = express.Router();

areaRouter.post("/zoo/area", async function (req,res){
    const areaController = await AreaController.getInstance();
    //const name = req.body.
    const area = await areaController.createArea();
    if (area === null) {
        res.status(400).end();
        return;
    }else{
        res.status(400).end();
    }


});

areaRouter.get("/zoo/:areaId", async function (req,res){
    const areaId = req.params.areaId;
    const areaController = await AreaController.getInstance();
    const area = await areaController.getAreaById(areaId);
    if (area === null) {
        res.status(400).end();
        return;
    }else{
        res.status(400).end();
    }


});

areaRouter.put("/zoo/:areaId", async function (req,res){
    const areaId = req.params.areaId;
    const areaController = await AreaController.getInstance();
    const area = await areaController.deleteAreaById(areaId);
    if (area === null) {
        res.status(400).end();
        return;
    }else{
        res.status(400).end();
    }


});

areaRouter.delete("/zoo/:areaId", async function (req,res){
    const areaId = req.params.areaId;
    const areaController = await AreaController.getInstance();
    const area = await areaController.deleteAreaById(areaId);
    if (area === null) {
        res.status(400).end();
        return;
    }else{
    res.status(400).end();
}


});




export {
    areaRouter
};

