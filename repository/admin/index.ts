import dbClient from "./dbClient";

class adminRepository {
    validateEmailPassword = async (email: string, password: string) => {
        const result = await dbClient.findOne(
            { email, password },
            {
                _id: 1,
                email: 1,
                password: 1,
                role: 1,
            }
        );

        return result;
    };
}

export default adminRepository;
