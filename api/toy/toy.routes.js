import express from "express"
import { log } from "../../middlewares/logger.middleware.js"
import {
  addToy,
  getLabels,
  getToy,
  getToys,
  removeToy,
  updateToy,
} from "./toy.controller.js"

export const toyRoutes = express.Router()

toyRoutes.get("/", log, getToys)
toyRoutes.get("/labels", log, getLabels)
toyRoutes.get("/:toyId", log, getToy)
toyRoutes.put("/", log, updateToy)
toyRoutes.post("/", addToy)
toyRoutes.delete("/:toyId", removeToy)
