import { HttpResponse } from './../@model/httpResponse';
import { http } from './http';


class PointApi {

    async getRegisterMemberInformationOfABrand(brandId: string): Promise<HttpResponse<any>> {
        try {
            const header = await http.getAuthorizedHeader();
            const response = await http.get(`point`, header);
            return response;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }


}
export const pointApi = new PointApi();
