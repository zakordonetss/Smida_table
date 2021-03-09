import { Router } from "express";
import { InfoHistoryService } from "../services/InfoHistoryService";

const infoHistoryService = new InfoHistoryService();
infoHistoryService.setHistory();

export const HistoryController = Router()
    .get('/history', (req, res) => {
        const history = infoHistoryService.filterHistory(req.query);
        if (history) res.status(200).send(history);
        else res.status(404).send('History not found');
    })
    .delete('/history/:id', (req, res) => {
        const { id } = req.params;
        const result = infoHistoryService.deleteHistoryById(id);
        if (result) res.status(200).send('The data deleted successfully');
    })
    .post('/history', (req, res) => {
        const result = infoHistoryService.postHistory(req.query);
        if (result) res.status(200).send('History has been posted successfully');
    })