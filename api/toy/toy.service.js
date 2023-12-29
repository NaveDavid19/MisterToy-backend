import fs from "fs"
import { logger } from "../../services/logger.service.js"
import { utilService } from "../../services/util.service.js"
import { dbService } from "../../services/db.service.js"

const labels = [
  "On wheels",
  "Box game",
  "Art",
  "Baby",
  "Doll",
  "Puzzle",
  "Outdoor",
  "Battery Powered",
]

export const toyService = {
  query,
  getById,
  remove,
  save,
  labels,
}

const toys = utilService.readJsonFile("data/toy.json")

async function query(filterBy = {}) {
  try {
    const criteria = {
      name: { $regex: filterBy.txt, $options: "i" },
      price: { $lt: filterBy.maxPrice },
      labels: { $in: filterBy.label },
    }
    console.log("criteria:", criteria)
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

function getById(toyId) {
  const toy = toys.find((toy) => toy._id === toyId)
  return Promise.resolve(toy)
}

function remove(toyId) {
  const idx = toys.findIndex((toy) => toy._id === toyId)
  if (idx === -1) return Promise.reject("No Such Toy")
  toys.splice(idx, 1)
  return _saveToysToFile()
}

function save(toy) {
  if (toy._id) {
    const toyToUpdate = toys.find((currToy) => currToy._id === toy._id)
    toyToUpdate.name = toy.name
    toyToUpdate.inStock = toy.inStock
    toyToUpdate.price = toy.price
    toy = toyToUpdate
  } else {
    toy._id = utilService.makeId()
    toys.push(toy)
  }

  return _saveToysToFile().then(() => toy)
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
