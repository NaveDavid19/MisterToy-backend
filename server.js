import express from "express"
import cors from "cors"
import path, { dirname } from "path"
import { fileURLToPath } from "url"
import cookieParser from "cookie-parser"
import { logger } from "./services/logger.service.js"
import { authRoutes } from "./api/auth/auth.routes.js"
import { userRoutes } from "./api/user/user.routes.js"
import { toyRoutes } from "./api/toy/toy.routes.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

logger.info("server.js loaded...")

const app = express()

// Express App Config
app.use(cookieParser())
app.use(express.json())
app.use(express.static("public"))

if (process.env.NODE_ENV === "production") {
  // Express serve static files on production environment
  app.use(express.static(path.resolve(__dirname, "public")))
  console.log("__dirname: ", __dirname)
} else {
  // Configuring CORS
  const corsOptions = {
    // Make sure origin contains the url your frontend is running on
    origin: [
      "http://127.0.0.1:5173",
      "http://localhost:5173",
      "http://127.0.0.1:3000",
      "http://localhost:3000",
    ],
    credentials: true,
  }
  app.use(cors(corsOptions))
}

app.use("/api/toy", toyRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)

app.get("/**", (req, res) => {
  res.sendFile(path.resolve("public/index.html"))
})

const port = process.env.PORT || 3030

app.listen(port, () => {
  logger.info("Server is running on port: " + port)
})
