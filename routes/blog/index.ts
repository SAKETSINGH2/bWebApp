import express, { Request, Response, NextFunction, response } from "express";
import BlogRepository from "../../repository/blog";
import dotenv from "dotenv";
import setApiResponse from "../../utils/setApiresponseType";
dotenv.config();

const blogRepository = new BlogRepository();

const router = express.Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    const { title, description, author } = req.body;
    let responseDetails: any;

    try {
        responseDetails = await blogRepository.addBlog({
            title,
            description,
            author,
        });
    } catch (error) {
        return next(error);
    }
    if (!responseDetails) {
        return setApiResponse(400, false, true, {}, res);
    }

    return setApiResponse(200, true, false, responseDetails, res);
});

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    let responseDetails: any;

    try {
        responseDetails = await blogRepository.getBlog();
    } catch (error) {
        return next(error);
    }
    if (!responseDetails) {
        return setApiResponse(400, false, true, {}, res);
    }

    return setApiResponse(200, true, false, responseDetails, res);
});

export default router;
