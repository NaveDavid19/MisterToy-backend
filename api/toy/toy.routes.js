import express from "express"
import { log } from "../../middlewares/logger.middleware.js"
import {
  addToy,
  addToyMsg,
  getLabels,
  getToy,
  getToys,
  removeToy,
  updateToy,
} from "./toy.controller.js"
import { requireAuth } from "../../middlewares/requireAuth.middleware.js"

export const toyRoutes = express.Router()

toyRoutes.get("/", log, getToys)
toyRoutes.get("/labels", log, getLabels)
toyRoutes.get("/:toyId", log, getToy)
toyRoutes.put("/", log, requireAuth, updateToy)
toyRoutes.post("/", requireAuth, addToy)
toyRoutes.delete("/:toyId", requireAuth, removeToy)

toyRoutes.post("/:id/msg", requireAuth, addToyMsg)
