import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import apiRouter from "./routes";
import connect from "./config/dataBaseConnection";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
dotenv.config();

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

let users: Record<string, string> = {};

io.on("connection", (socket) => {
    socket.on("user", (userId) => {
        users[userId] = socket.id;
        console.log("connected users", users);
    });

    io.emit("updateUserStatus", users);
    console.log("socketId", socket.id);
    socket.on("message", ({ senderId, receiverId, message }) => {
        const receiverSocketId = users[receiverId];
        console.log("message", message);
        console.log("userId", senderId);
        console.log("receiverId", receiverId);
        console.log("receiverSocketId", receiverSocketId);

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("msg", {
                senderId,
                receiverId,
                message,
            });
        }
        socket.on("disconnect", () => {
            const userId = Object.keys(users).find(
                (key) => users[key] === socket.id
            );
            console.log("userId", userId);
            if (userId) {
                delete users[userId]; // Remove user from list
                console.log(`User ${userId} disconnected`);
                io.emit("updateUserStatus", users); // Notify all clients
            }
        });
    });
});

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

connect();

app.use("/api", apiRouter);

app.get("/test", (req: Request, res: Response) => {
    res.status(200).send("Server is up and running!");
});

const port = 4000;
server.listen(port, (err?: Error) => {
    if (err) {
        console.error(`Error occurred: ${err.message}`);
        return;
    }
    console.log(`App is running at port ${port}`);
});

export { app };
