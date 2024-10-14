import dbClient from "./dbClient";

class UserRepository {
    async createUser(userDetails: any) {
        const result = await dbClient.create({
            name: userDetails.name,
            mobileNo: userDetails.mobileNo,
            password: userDetails.password,
            email: userDetails.email,
        });
        console.log(result);
        return result ?? null;
    }

    async getAllUser() {
        const result = await dbClient.find(
            {},
            {
                _id: 1,
                name: 1,
                email: 1,
                mobileNo: 1,
            }
        );
        return result;
    }

    async isUserAlredayRegistred(mobileNo: string) {
        const result = await dbClient.findOne(
            { mobileNo: mobileNo },
            {
                _id: 1,
                name: 1,
                email: 1,
                mobileNo: 1,
                password: 1,
            }
        );

        return result;
    }
}
export default UserRepository;
