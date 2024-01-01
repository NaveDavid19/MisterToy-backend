import fs from "fs"
import { asyncLocalStorage } from "./als.service.js"
const logsDir = "./logs"
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir)
}

export const logger = {
  debug(...args) {
    if (process.env.NODE_NEV === "production") return
    _doLog("DEBUG", ...args)
  },
  info(...args) {
    _doLog("INFO", ...args)
  },
  warn(...args) {
    _doLog("WARN", ...args)
  },
  error(...args) {
    _doLog("ERROR", ...args)
  },
}

function _getTime() {
  let now = new Date()
  return now.toLocaleString("he") //define the time format
}

function _isError(e) {
  return e && e.stack && e.message
}

function _doLog(level, ...args) {
  const strs = args.map((arg) =>
    typeof arg === "string" || _isError(arg) ? arg : JSON.stringify(arg)
  )

  var line = strs.join(" | ")
  const store = asyncLocalStorage.getStore()
  const userId = store?.loggedinUser?._id
  const str = userId ? `(userId: ${userId})` : ""
  line = `${_getTime()} - ${level} - ${line} ${str}\n`
  console.log(line)
  fs.appendFile("./logs/backend.log", line, (err) => {
    if (err) console.log("FATAL: cannot write to log file")
  })
}
