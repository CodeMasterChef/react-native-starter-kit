import { Category } from './../@model/category';
import { Province } from './../@model/province';
import { http } from './http';
import { HttpListResponse } from '../@model/httpListResponse';


export interface LoyalBank {
    id: string;
    createDate: number;
    lastUpdate: number;
    delete: boolean;
    description: string | null;
    bankCode: string;
    bankName: string;
    bankAccountNo: string;
    name: string;
    branchName: string;

}

class UtilityApi {

    async getLoyalOneBanks(): Promise<HttpListResponse<LoyalBank>> {
        try {
            const header = await http.getAuthorizedHeader();
            const response = await http.get('utility/bankingLoya', header);
            return response;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async getProvinces(nationCode: string = 'VN'): Promise<HttpListResponse<Province>> {
        try {
            const header = await http.getAuthorizedHeader();
            const response = await http.get(`utility/province?nationCode=${nationCode}`, header);
            return response;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async getAllCategories(): Promise<HttpListResponse<Category>> {
        try {
            const header = await http.getAuthorizedHeader();
            const response = await http.get(`utility/category`, header);
            return response;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
}
export const utilityApi = new UtilityApi();
