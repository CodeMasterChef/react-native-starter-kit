import { http } from './http';
import { HttpResponse } from '../@model/httpResponse';
import { RegisterResponseData } from '../@model/registerResponseData';
import { Account } from '../@model/account';

export enum SocialMethodEnum {
    phone = 'phone',
    google = 'google',
    facebook = 'facebook'
}

export interface RegisterRequestBody {
    phone: string;
    password: string;
    socialMethod: SocialMethodEnum;
    name: string;
    sessionInfo: string | null;
    code: string;
}

export interface ResetPasswordRequestBody {
    phone: string;
    password: string;
    socialMethod: SocialMethodEnum;
    sessionInfo: string | null;
    code: string;
    type: string;
}


export interface LoginRequestBody {
    username: string;
    password: string;
    socialMethod: SocialMethodEnum;
    type: string;
}

class AuthApi {

    async resetPassword(body: ResetPasswordRequestBody): Promise<HttpResponse<RegisterResponseData>> {
        try {
            let response = await http.post('auth/account/forgotPassword', body, null);
            return response;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async register(body: RegisterRequestBody): Promise<HttpResponse<RegisterResponseData>> {

        try {
            let response = await http.post('auth/account/register', body, null);
            return response;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async login(body: LoginRequestBody): Promise<HttpResponse<RegisterResponseData>> {
        try {
            let response = await http.post('auth/account/login', body, null);
            return response;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async getUserProfile(): Promise<HttpResponse<Account>> {
        try {
            const header = await http.getAuthorizedHeader();
            const uri = `/auth/profile`;
            const response = await http.get(uri, header);
            return response;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }


    async updateProfile(account: Account): Promise<HttpResponse<Account>> {
        try {
            const header = await http.getAuthorizedHeader();
            let response = await http.put('auth/profile', account, header);
            return response;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
}
export const authApi = new AuthApi();
