import express from "express"
import { json, urlencoded } from "body-parser";
import cors from "cors";
import helmet from 'helmet';
import { HistoryController } from "./controllers/history";
import { PORT } from "./units/config";
import { globalErrorHandler, notFoundErrorHandler } from "./controllers/errors";

const app = express();

app
    .use(json())
    .use(urlencoded({ extended: true }))
	.use(cors({ credentials: true, origin: true }))
    .use(helmet())
    .use(HistoryController)
    .use(globalErrorHandler)
    .use(notFoundErrorHandler)
    .listen(PORT, () => console.log(`Server has been started at port: ${PORT}`))