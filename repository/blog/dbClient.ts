import mongoose from "mongoose";

const blogModelSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        authorName: {
            type: String,
            required: true,
        },
        image: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const blogDbClient = mongoose.model("blog", blogModelSchema);

export default blogDbClient;
