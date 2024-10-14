import mongoose from "mongoose";

const userModelSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        mobileNo: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const userModelSchemaDbclient = mongoose.model("user", userModelSchema);

export default userModelSchemaDbclient;
