import { NextFunction, Request, Response } from "express";
import setApiResponse from "../utils/setApiresponseType";
import jwt from "jsonwebtoken";

export type TokenType = {
    _id: string;
};

export const userAuth = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
        return setApiResponse(400, false, true, "token not found", res);
    }

    let verifiedToken;

    try {
        verifiedToken = jwt.verify(token, process.env.JWT_SECRET!) as TokenType;

        req.userId = verifiedToken._id;

        next();
    } catch (error) {
        return setApiResponse(401, false, true, "Invalid token", res);
    }
};
