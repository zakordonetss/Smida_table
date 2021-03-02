import { Router } from "express";
import { InfoHistoryService } from "../services/InfoHistoryService";

const infoHistoryService = new InfoHistoryService();
infoHistoryService.setHistoryInfo();

export const HistoryController = Router()
    .get('/history', (req, res) => {
        res.status(200).send(infoHistoryService.history)
    })