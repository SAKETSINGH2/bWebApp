import express, { Request, Response, NextFunction, response } from "express";
import AdminRepository from "../../repository/admin/index";
import { requestParamsValidator } from "../../utils/requestParamsValidator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import setApiResponse from "../../utils/setApiresponseType";
import { loginApiValidator } from "./validator/loginApiValidator";
dotenv.config();

const userRespository = new AdminRepository();

const router = express.Router();

router.post(
    "/login",
    loginApiValidator,
    requestParamsValidator,
    async (req: Request, res: Response, next: NextFunction) => {
        const { email, password } = req.body;

        try {
            let isUserExits = await userRespository.validateEmailPassword(
                email,
                password
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
                email: isUserExits.email,
                role: isUserExits.role,
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
                email: isUserExits.email,
                token: token,
            };

            return setApiResponse(200, true, false, response, res);
        } catch (error) {
            return next(error);
        }
    }
);

export default router;
