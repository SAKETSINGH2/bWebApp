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
import setApiResponse from "../../utils/setApiresponseType";
import { userAuth } from "../../middlewares/userAuth";
import adminAuth from "../../middlewares/adminAuth";
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

            if (!responseDetails) {
                return setApiResponse(
                    400,
                    false,
                    true,
                    "user not created",
                    res
                );
            }

            let response = {
                name: responseDetails.name,
                mobileNo: responseDetails.mobileNo,
                email: responseDetails.email,
                password: undefined,
            };
            return setApiResponse(200, true, false, response, res);
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

            const validatePassword = await bcrypt.compare(
                password,
                isUserExits.password
            );

            let payload = {
                _id: isUserExits._id,
                name: isUserExits.name,
                mobileNo: isUserExits.mobileNo,
            };

            if (!validatePassword) {
                return setApiResponse(
                    400,
                    false,
                    true,
                    "please enter valid password",
                    res
                );
            }

            let token = jwt.sign(payload, process.env.JWT_SECRET || "");

            let response = {
                id: isUserExits._id,
                name: isUserExits.name,
                mobileNo: isUserExits.mobileNo,
                email: isUserExits.email,
                token: token,
            };

            return setApiResponse(200, true, false, response, res);
        } catch (error) {
            return next(error);
        }
    }
);

// see profile details api

router.get("/profile", userAuth, async (req, res, next) => {
    let responseDetails;

    try {
        responseDetails = await userRespository.getProfile(req.userId);

        if (!responseDetails) {
            return setApiResponse(400, false, true, "Invalid user id", res);
        }

        return setApiResponse(200, true, false, responseDetails, res);
    } catch (error) {
        next(error);
    }
});

// update profile
router.post("/profile_update", userAuth, async (req, res, next) => {
    const { name, email } = req.body;
    let responseDetails;
    try {
        responseDetails = await userRespository.updateUserProfile(req.userId, {
            name,
            email,
        });

        if (!responseDetails) {
            return setApiResponse(400, false, true, {}, res);
        }

        return setApiResponse(200, true, false, responseDetails, res);
    } catch (error) {
        return next(error);
    }
});

router.get(
    "/",
    // adminAuth,
    async (req: Request, res: Response, next: NextFunction) => {
        let responseDetails: any;

        // console.log(req.userId);

        try {
            responseDetails = await userRespository.getAllUser();
        } catch (error) {
            return next(error);
        }
        if (!responseDetails) {
            return setApiResponse(400, false, true, {}, res);
        }

        return setApiResponse(200, true, false, responseDetails, res);
    }
);

export default router;
