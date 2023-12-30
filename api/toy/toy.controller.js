import { logger } from "../../services/logger.service.js"
import { toyService } from "./toy.service.js"

export async function getToys(req, res) {
  try {
    const filterBy = {
      txt: req.query.txt,
      maxPrice: +req.query.maxPrice ? +req.query.maxPrice : Infinity,
      inStock: req.query.inStock,
      label: req.query.label ? req.query.label : toyService.labels,
    }
    const toys = await toyService.query(filterBy)
    res.json(toys)
  } catch (err) {
    logger.console.error("Cannot get toys", err)
    res.status(400).send("Cannot get toys")
  }
}

export function getLabels(req, res) {
  res.json(toyService.labels)
}

export async function getToy(req, res) {
  try {
    const { toyId } = req.params
    const toy = await toyService.getById(toyId)
    res.json(toy)
  } catch (err) {
    logger.error("Cannot get toy", err)
    res.status(400).send("Cannot get toy")
  }
}

export async function updateToy(req, res) {
  try {
    const toy = req.body
    console.log("toy:", toy)
    const updatedToy = await toyService.update(toy)
    console.log("updatedToy:", updatedToy)
    res.json(updatedToy)
  } catch (err) {
    logger.error("Failed to update toy", err)
    res.status(500).send({ err: "Failed to update toy" })
  }
}

export async function addToy(req, res) {
  try {
    const toy = req.body
    const addedToy = await toyService.add(toy)
    res.json(addedToy)
  } catch (err) {
    logger.error("Failed to add toy", err)
    res.status(500).send({ err: "Failed to add toy" })
  }
}

export async function removeToy(req, res) {
  try {
    const toyId = req.params.toyId
    await toyService.remove(toyId)
    res.send()
  } catch (err) {
    logger.error("Failed to remove toy", err)
    res.status(500).send({ err: "Failed to remove toy" })
  }
}
