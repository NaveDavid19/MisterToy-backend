import fs from "fs"
import { logger } from "../../services/logger.service.js"
import { utilService } from "../../services/util.service.js"
import { dbService } from "../../services/db.service.js"
import { ObjectId } from "mongodb"

const labels = utilService.readJsonFile("data/labels.json")
export const toyService = {
  query,
  getById,
  remove,
  update,
  add,
  labels,
}

async function query(filterBy = {}) {
  try {
    const criteria = {
      name: { $regex: filterBy.txt, $options: "i" },
      price: { $lt: filterBy.maxPrice },
      labels: { $in: filterBy.label },
    }
    if (filterBy.inStock) {
      if (filterBy.inStock === "inStock") {
        criteria.inStock = true
      } else if (filterBy.inStock === "outOfStock") {
        criteria.inStock = { $ne: true }
      }
    }
    const collection = await dbService.getCollection("toys")
    const toys = await collection.find(criteria).toArray()
    return toys
  } catch (err) {
    logger.error("cannot find toys", err)
    throw err
  }
}

async function getById(toyId) {
  try {
    const collection = await dbService.getCollection("toys")
    const toy = await collection.findOne({ _id: new ObjectId(toyId) })
    return toy
  } catch (err) {
    logger.error(`while finding toy ${toyId}`, err)
    throw err
  }
}

async function remove(toyId) {
  try {
    const collection = await dbService.getCollection("toys")
    await collection.deleteOne({ _id: new ObjectId(toyId) })
  } catch (err) {
    logger.error(`cannot remove toy ${toyId}`, err)
    throw err
  }
}

async function update(toy) {
  try {
    const toyToSave = {
      name: toy.name,
      inStock: toy.inStock,
      price: toy.price,
    }
    const collection = await dbService.getCollection("toys")
    await collection.updateOne(
      { _id: new ObjectId(toy._id) },
      { $set: toyToSave }
    )
    return toy
  } catch (err) {
    logger.error(`cannot update toy ${toy._id}`, err)
    throw err
  }
}

async function add(toy) {
  try {
    const collection = await dbService.getCollection("toys")
    await collection.insertOne(toy)
    return toy
  } catch (err) {
    logger.error("cannot insert toy", err)
    throw err
  }
}

function _saveToysToFile() {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(toys, null, 4)
    fs.writeFile("data/toy.json", data, (err) => {
      if (err) {
        logger.error("Cannot write to toys file", err)
        return reject(err)
      }
      resolve()
    })
  })
}
