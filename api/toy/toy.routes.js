import express from "express"
import { log } from "../../middlewares/logger.middleware.js"
import { getLabels, getToys } from "./toy.controller.js"

export const toyRoutes = express.Router()

toyRoutes.get("/", log, getToys)
toyRoutes.get("/lables", log, getLabels)
