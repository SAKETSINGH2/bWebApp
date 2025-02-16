import dbClient from "./dbClient";

class BlogRepository {
    addBlog = async (blogDetails: any) => {
        const result = await dbClient.create({
            title: blogDetails.title,
            description: blogDetails.description,
            author: blogDetails.author,
        });

        return result._id ?? null;
    };
    getBlog = async () => {
        const result = await dbClient.find(
            {},
            {
                id: 1,
                title: 1,
                content: 1,
                authorName: 1,
                image: 1,
                createdAt: 1,
                updatedAt: 1,
            }
        );

        if (!result) {
            return false;
        }

        return result;
    };
    updateBlog = () => {};
    deleteBlog = () => {};
}

export default BlogRepository;
