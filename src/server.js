import express from 'express'
import listEndpoints from 'express-list-endpoints'
import cors from 'cors'
import { badRequestMiddleware, catchAllErrorsMiddleware, notFoundMiddleware } from './errorMiddlewares.js'
import { sequelize } from './db/models/index.js'



const port = process.env.PORT || 3001

const server = express()

// ===================== MIDDLEWARES =============================
server.use(cors())
server.use(express.json())

// ===================== ROUTES  =================================

// ===================== ERROR HANDLERS ==========================
server.use(notFoundMiddleware)
server.use(badRequestMiddleware)
server.use(catchAllErrorsMiddleware)
// ===============================================================

console.table(listEndpoints(server))

sequelize.sync({})
    .then(() => {
        server.listen(port, () => {
            console.log(" ✅  Server is running on port: " + port)
        })
        server.on('error', (error) => {
            console.log(" 🚫 Server crashed due to: ", error);
        })
    })
    .catch((e) => console.log(e))