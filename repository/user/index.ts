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

    async getProfile(userId: string) {
        const result = await dbClient.findById(userId, {
            _id: 0,
            name: 1,
            email: 1,
            mobileNo: 1,
        });

        if (!result) {
            return null;
        }
        return result;
    }

    async updateUserProfile(userId: string, updatedDetails: any) {
        const result = await dbClient.findByIdAndUpdate(
            userId,
            {
                $set: {
                    name: updatedDetails.name,
                    email: updatedDetails.email,
                },
            },
            { new: true }
        );

        return result ? true : false;
    }
}
export default UserRepository;
