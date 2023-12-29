import { logger } from "../../services/logger.service.js"
import { toyService } from "./toy.service.js"

export async function getToys(req, res) {
  try {
    const filterBy = {
      txt: req.query.txt,
      maxPrice: +req.query.maxPrice ? +req.query.maxPrice : Infinity,
      inStock: req.query.inStock,
      label: req.query.label ? req.query.label : getLabels(),
    }
    const toys = await toyService.query(filterBy)
    console.log("toys controller:", toys)
    res.json(toys)
  } catch (err) {
    logger.console.error("Cannot get toys", err)
    res.status(400).send("Cannot get toys")
  }
}

export function getLabels() {
  return toyService.labels
}
