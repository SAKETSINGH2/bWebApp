import { Request, Response, NextFunction } from "express";
import setApiResponse from "../utils/setApiresponseType";
import jwt from "jsonwebtoken";

export type TokenType = {
    _id: string;
};

const adminAuth = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    console.log("token In admin auth", token);

    if (!token) {
        return setApiResponse(400, false, true, "access denied", res);
    }

    try {
        let decodedData = jwt.verify(
            token,
            process.env.JWT_SECRET!
        ) as TokenType;

        req.userId = decodedData._id;
        next();
    } catch (error) {
        console.log("authentication failed ");
        return next(error);
    }
};

export default adminAuth;
