"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("../../repository/user"));
const userRespository = new user_1.default();
const router = express_1.default.Router();
router.post("/", (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, mobileNo, image } = request.body;
    let responseDetails;
    try {
        responseDetails = yield userRespository.createUser({
            name,
            mobileNo,
            image,
        });
        if (!name && !mobileNo) {
            return response
                .status(400)
                .json({ message: "please give required details" });
        }
    }
    catch (error) {
        return next(error);
    }
    if (!responseDetails) {
        return response.status(400).json({ message: "user not created" });
    }
    return response.status(200).json({ message: "user created successfully" });
}));
exports.default = router;
