import express from "express";
import userRouter from "./user/index";
import adminRouter from "./admin/index";
import blogRouter from "./blog/index";

const router = express.Router();

router.use("/user", userRouter);
router.use("/admin", adminRouter);
router.use("/admin", blogRouter);
export default router;
