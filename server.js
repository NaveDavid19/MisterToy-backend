import express from 'express'
import cors from 'cors'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import cookieParser from 'cookie-parser'
import { toyRoutes } from './api/toy/toy.routes.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

import { logger } from './services/logger.service.js'
logger.info('server.js loaded...')

import { toyService } from './api/toy/toy.service.js'

const app = express()

// Express App Config
app.use(cookieParser())
app.use(express.json())
app.use(express.static('public'))

if (process.env.NODE_ENV === 'production') {
    // Express serve static files on production environment
    app.use(express.static(path.resolve(__dirname, 'public')))
    console.log('__dirname: ', __dirname)
} else {
    // Configuring CORS
    const corsOptions = {
        // Make sure origin contains the url your frontend is running on
        origin: ['http://127.0.0.1:5173', 'http://localhost:5173', 'http://127.0.0.1:3000', 'http://localhost:3000'],
        credentials: true
    }
    app.use(cors(corsOptions))
}


app.use('/api/toy', toyRoutes)

// REST API for Toys

// Toy LIST
// app.get('/api/toy', (req, res) => {
//     const filterBy = {
//         txt: req.query.txt || '',
//         maxPrice: +req.query.maxPrice || 0,
//         inStock: req.query.inStock || 'all',
//         label: req.query.label || []
//     }
//     toyService.query(filterBy)
//         .then((toys) => {
//             res.send(toys)
//         })
//         .catch((err) => {
//             logger.error('Cannot get toys', err)
//             res.status(400).send('Cannot get toys')
//         })
// })

// Toy READ
app.get('/api/toy/:toyId', (req, res) => {
    const { toyId } = req.params
    toyService.getById(toyId)
        .then((toy) => {
            res.send(toy)
        })
        .catch((err) => {
            logger.error('Cannot get toy', err)
            res.status(400).send('Cannot get toy')
        })
})

// Toy CREATE
app.post('/api/toy', (req, res) => {
    const toy = {
        name: req.body.name,
        price: +req.body.price,
        labels: req.body.labels,
        createdAt: +req.body.createdAt,
        inStock: +req.body.inStock,
        img: req.body.img
    }
    toyService.save(toy)
        .then((savedToy) => {
            res.send(savedToy)
        })
        .catch((err) => {
            logger.error('Cannot save toy', err)
            res.status(400).send('Cannot save toy')
        })

})

// Toy UPDATE
app.put('/api/toy', (req, res) => {
    const toy = {
        _id: req.body._id,
        name: req.body.name,
        inStock: req.body.inStock,
        price: +req.body.price,
    }
    toyService.save(toy)
        .then((savedToy) => {
            res.send(savedToy)
        })
        .catch((err) => {
            logger.error('Cannot save toy', err)
            res.status(400).send('Cannot save toy')
        })

})

// Toy DELETE
app.delete('/api/toy/:toyId', (req, res) => {
    const { toyId } = req.params
    toyService.remove(toyId)
        .then(() => {
            logger.info(`Toy ${toyId} removed`)
            res.send('Removed!')
        })
        .catch((err) => {
            logger.error('Cannot remove toy', err)
            res.status(400).send('Cannot remove toy')
        })

})



app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})

const port = process.env.PORT || 3030

app.listen(port, () => {
    logger.info('Server is running on port: ' + port)
})
