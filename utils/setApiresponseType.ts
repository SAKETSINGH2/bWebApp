import { Response } from "express";

export type ApiResponseType = {
    result: boolean;
    msg?: string;
    data?: any;
};

const setApiResponse = (
    status: number,
    responeFlag: boolean,
    errorFlag: boolean,
    details: any,
    resObj: Response
) => {
    let response: ApiResponseType = {
        result: responeFlag,
    };

    if (errorFlag) {
        response["msg"] = details;
    } else {
        response["data"] = details;
    }
    resObj.status(status).json(response);
    return;
};
export default setApiResponse;
