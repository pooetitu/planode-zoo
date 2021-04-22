import {AnimalController} from "../controllers/animal.controller";
import express from "express";

const animalRouter = express.Router();


animalRouter.get("/:animalId", async function (req, res) {
    const animalId = req.params.animalId;
    const animalController = await AnimalController.getInstance();
    try{
        const animal = await animalController.getAnimal(animalId);
        res.json(animal);
    }catch (err){
        res.status(400).json(err).end();
    }
});


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
