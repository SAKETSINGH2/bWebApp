"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userModelSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    mobileNo: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
});
const userModelSchemaDbclient = mongoose_1.default.model("user", userModelSchema);
exports.default = userModelSchemaDbclient;
