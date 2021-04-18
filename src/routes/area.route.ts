import express from "express";
import {AccessController} from "../controllers/access.controller";
import {zooAccessMiddleware, zooOpenCheckMiddleware} from "../middlewares/access.middleware";
import {PassController} from "../controllers/pass.controller";
import {AreaController} from "../controllers/area.controller";

const areaRouter = express.Router();

areaRouter.post("/zoo/area", async function (req,res){
    //TODO à tester
    const areaController = await AreaController.getInstance();
    const id = req.body.id;
    const name = req.body.name;
    const type = req.body.type;
    const description = req.body.description;
    const capacity = req.body.capacity;
    const duration = req.body.duration;
    const openingTime = req.body.openingTime;
    const disabledAccess = req.body.disabledAccess;
    const area = await areaController.createArea(req.body);
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
    //TODO put area


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

