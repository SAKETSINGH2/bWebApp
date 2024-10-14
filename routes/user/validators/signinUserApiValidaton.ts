import { body } from "express-validator";

export const signinUserApiValidator = [
    body("name").isString().withMessage("name is required"),
    body("mobileNo").isInt().withMessage("mobileNo is required"),
    body("password").isString().withMessage("password is required"),
    body("email").isString().withMessage("email is required"),
];

export const loginApiValidator = [
    body("mobileNo").isInt().withMessage("mobileNo is required"),
    body("email").isString().withMessage("email is required"),
];
