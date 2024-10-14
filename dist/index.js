"use strict";
// import connectDatabase from "./config/dataBaseConnection";
// import express from "express";
// import cors from "cors";
// import apiRouter from "./routes";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
// // const express = require("express")
// const app = express();
// // const port = 3005;
// connectDatabase();
// // app.listen(port => {
// //     console.log(`app is running at port ${port}`)
// // })
// // app.use("/api", apiRouter);
// app.use(cors());
// app.use(express.json());
// // app.use(
// //     "/api",
// //     (req, res, next) => {
// //         console.log(`Received request: ${req.method} ${req.path}`);
// //         next();
// //     },
// //     apiRouter
// // );
// app.get("/test", (req, res) => {
//     res.send("Server is up and running!");
// });
// const port = 4000;
// app.listen(port, (err?: Error) => {
//     if (err) {
//         console.log("Error occurred:", err.message);
//         return;
//     }
//     console.log(`App is running at port ${port}`);
// });
// // app.listen(port, (err?: Error) => {
// //     // Specify the type for err
// //     if (err) {
// //         console.log("Error occurred:", err.message);
// //         return; // Exit if there’s an error
// //     }
// //     console.log("\x1b[32m%s\x1b[0m", `App is running at port ${port}`);
// // });
// export { app };
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const dataBaseConnection_1 = __importDefault(require("./config/dataBaseConnection")); // Import your DB connection
const app = (0, express_1.default)();
exports.app = app;
// Use CORS middleware for cross-origin requests
app.use((0, cors_1.default)());
// Middleware to parse JSON payloads
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
// Connect to the database
(0, dataBaseConnection_1.default)();
// Middleware to log incoming requests (method and path)
app.use((req, res, next) => {
    console.log(`Received request: ${req.method} ${req.path}`);
    next();
});
// Define routes here or import from router files
app.use("/api", routes_1.default);
// Health check route to ensure the server is up
app.get("/test", (req, res) => {
    res.status(200).send("Server is up and running!");
});
// Set the port, and listen for incoming requests
const port = 4000;
app.listen(port, (err) => {
    if (err) {
        console.error(`Error occurred: ${err.message}`);
        return;
    }
    console.log(`App is running at port ${port}`);
});
