import { body } from "express-validator";

export const loginApiValidator = [
    body("email").isEmail().withMessage("mobileNo is required"),
    body("password").isString().withMessage("password is required"),
];
