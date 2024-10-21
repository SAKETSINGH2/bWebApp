import express, { Request, Response, NextFunction, response } from "express";
import UserRepository from "../../repository/user";
import {
    loginApiValidator,
    signinUserApiValidator,
} from "./validators/signinUserApiValidaton";
import { requestParamsValidator } from "../../utils/requestParamsValidator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const userRespository = new UserRepository();

const router = express.Router();

router.post(
    "/",
    signinUserApiValidator,
    requestParamsValidator,
    async (req: Request, res: Response, next: NextFunction) => {
        const { name, mobileNo, password, email } = req.body;
        let responseDetails: any;

        try {
            const isUserExits = await userRespository.isUserAlredayRegistred(
                mobileNo
            );
            if (isUserExits) {
                return res.status(400).json({
                    success: false,
                    message: "user already registered",
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            responseDetails = await userRespository.createUser({
                name,
                mobileNo,
                password: hashedPassword,
                email,
            });

            const payload = {
                _id: responseDetails._id,
                name: responseDetails.name,
                mobileNo: responseDetails.mobileNo,
            };

            // create token
            let token = await jwt.sign(payload, process.env.JWT_SECRET || "");

            if (!responseDetails) {
                return res.status(400).json({
                    message: "user not created",
                });
            }
            return res.status(200).json({
                message: "user created successfully",
                success: true,
                name: responseDetails.name,
                mobileNo: responseDetails.mobileNo,
                email: responseDetails.email,
                token: token,
                password: undefined,
            });
        } catch (error) {
            return next(error);
        }
    }
);

router.post(
    "/login",
    loginApiValidator,
    requestParamsValidator,
    async (req: Request, res: Response, next: NextFunction) => {
        const { mobileNo, password } = req.body;

        try {
            let isUserExits = await userRespository.isUserAlredayRegistred(
                mobileNo
            );
            if (!isUserExits) {
                return res.status(400).json({
                    success: false,
                    message: "please registered first",
                });
            }

            console.log(isUserExits.password);

            const validatePassword = await bcrypt.compare(
                password,
                isUserExits.password
            );

            console.log("validatePassword", validatePassword);

            let payload = {
                _id: isUserExits._id,
                name: isUserExits.name,
                mobileNo: isUserExits.mobileNo,
            };

            if (!validatePassword) {
                return res.status(400).json({
                    success: false,
                    message: "please enter valid password",
                });
            }

            let token = jwt.sign(payload, process.env.JWT_SECRET || "");

            return res.status(200).json({
                success: true,
                message: "user log in successfully",
                name: isUserExits.name,
                mobileNo: isUserExits.mobileNo,
                email: isUserExits.email,
                token: token,
            });
        } catch (error) {
            return next(error);
        }
    }
);

router.get("/", async (request, response, next) => {
    let responseDetails: any;

    try {
        responseDetails = await userRespository.getAllUser();
    } catch (error) {
        return next(error);
    }
    if (!responseDetails) {
        return response.status(400).json({ message: "users not found" });
    }

    return response
        .status(200)
        .json({ message: "user found successfully", data: responseDetails });
});

// router.get("/", async (request, response, next) => {
//     let responseDetails: any;

//     try {
//         responseDetails = await userRespository.getAllUser();
//     } catch (error) {
//         return next(error);
//     }
//     if (!responseDetails) {
//         return response.status(400).json({ message: "users not found" });
//     }

//     return response
//         .status(200)
//         .json({ message: "user found successfully", data: responseDetails });
// });

export default router;
