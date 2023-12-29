import 'dotenv/config'
import express from "express";
import {errorHandler} from './middleware/errorMiddleware.js'
import bankRoutes from './routes/bankRoutes.js'
import cors from 'cors'

const server = express();

//use cors in case of react app as a client 

server.use(cors())

//middleware for JSON parsing
server.use(express.json())

//Bank route
server.use('/api/v1/banks',bankRoutes)

//Error handling middleware
server.use(errorHandler)

const PORT = process.env.PORT || 3000
server.listen(PORT,()=>{
    console.log(`Server is listening on Port: ${PORT}`);
})