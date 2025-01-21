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
import setApiResponse from "../../utils/setApiResponse";
import { resolve } from "path";
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

        // const ipAddress =  (req.headers["x-forwarded-for"] as string || "").split(",")[0] || req.ip;

        // console.log("ipAddress" , ipAddress)

        //         const url =
        //   "https://apiip.net/api/check?ip=" +
        //   ipAddress +
        //   "&accessKey=" +
        //   process.env.API_IP_ACSESS_KEY;

        // const response = await fetch(url);
        // const data = await response.json();
        // const { city, countryName } = data;

        // console.log("response" , response)
        // console.log("data" , data , "city" , city, "countryName" , countryName )

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
                return setApiResponse(400 , false , true , "user not created" , res)
            }

            let response = {name: responseDetails.name,
                mobileNo: responseDetails.mobileNo,
                email: responseDetails.email,
                token: token,
                password: undefined,}
            return setApiResponse(200 , true , false , response , res)
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

           

            let payload = {
                _id: isUserExits._id,
                name: isUserExits.name,
                mobileNo: isUserExits.mobileNo,
            };

            if (!validatePassword) {
                // return res.status(400).json({
                //     success: false,
                //     message: "please enter valid password",
                // });
                return setApiResponse(400 , false , true , "please enter valid password" , res )
            }

            let token = jwt.sign(payload, process.env.JWT_SECRET || "");

            let response = {  name: isUserExits.name,
                mobileNo: isUserExits.mobileNo,
                email: isUserExits.email,
                token: token,}

          return setApiResponse(200 , true , false , response , res)
        } catch (error) {
            return next(error);
        }
    }
);

router.get("/", async (req :Request, res:Response, next : NextFunction) => {
    let responseDetails: any;

    try {
        responseDetails = await userRespository.getAllUser();
    } catch (error) {
        return next(error);
    }
    if (!responseDetails) {
        return setApiResponse(400 , false , true , "user not found" , res)
    }

  return setApiResponse(200 , true , false , responseDetails , res)
});

router.post("/logout", async (req: Request, res:Response, next : NextFunction) => {
    let responseDetails: any;

    try {

      return setApiResponse(200 , true , false , "user Logged out successfully" , res)
       
    } catch (error) {
        
        return setApiResponse(400 , true , false , "issue in logging out process" , res);
    }
   
});

export default router;
