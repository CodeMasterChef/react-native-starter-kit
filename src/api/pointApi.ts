import { Account } from './../@model/account';
import { BrandPoint } from './../@model/brandPointCategory';
import { HttpResponse } from './../@model/httpResponse';
import { BrandPointCategory } from '../@model/brandPointCategory';
import { HttpListResponse, HttpPagingListResponse } from './../@model/httpListResponse';
import { http } from './http';
import { Brand, AuthType, BrandStatus } from '../@model/brand';

export interface LoyalPointBalanceResponseData {
    id: string;
    createDate: number;
    lastUpdate: number;
    accountId: string;
    value: number;
    delete: boolean;
}

export enum UtilType {
    loyaPointConversionRate = 'LOYA_POINT_CONVERSION_RATE',
}

export interface LoyalPointConversionRateResponseData {
    id: string;
    createDate: number;
    lastUpdate: number;
    type: UtilType;
    value: string;
    delete: boolean;
}

export enum PaymentTypeEnum {
    cash = 'CASH',
    vnpay = 'VNPAY_PAYMENT',
}

export interface CreateLoyalPointsDepositRequestData {
    point: number;
    remoteAddress?: string;
    paymentType: PaymentTypeEnum;

}

export enum ExchangeTransactionStatusEnum {
    new = 'NEW',
    cancelled = 'CANCELLED',
    rejected = 'REJECTED',
    completed = 'COMPLETED',
}

export interface LoyalPointDepositTransaction {
    id: string;
    createDate: number;
    lastUpdate: number;
    delete: boolean;
    point: number;
    value: number;
    status: ExchangeTransactionStatusEnum;
    code: string;
    transactionNo: string | null;
    note: string | null;
    accountId: string;
    message: string;
    vnPayLink: string;
    paymentType: PaymentTypeEnum;
}




export interface CategoryWithBrands {
    id: string;
    name: string;
    nameEng: string;
    number: number;
    urlAvatar: string;
    description: string;
    subCategories?: any;
    brands: Brand[];
    authTypes: AuthType[];
}

export interface LinkBrandRequestData {
    brandId: string;
    phone: string | null;
    username: string | null;
    email: string | null;
    memberId: string | null;
    password: string | null;
    firstName: string | null;
    lastName: string | null;
    fullName: string | null;
    pin: string | null;
    code: string | null;
}

export interface GetConversionRateRequestParams {
    fromId: string;
    toId: string;
    toPoint?: number;
    fromPoint?: number;
}
export interface GetConversionRateResponseData {
    fromId: string;
    toId: string;
    fromRate: number;
    toRate: number;
    fromPoint: number;
    toPoint: number;
    lopPoint: number;
}

export enum ExchangeType {
    topUp = 'TOP_UP',
    withdraw = 'WITHDRAW',
}

export interface ExchangeTransaction {
    id: string;
    createDate: number;
    lastUpdate: number;
    delete: boolean;
    point: number;
    brandPoint: number;
    value: number;
    status: ExchangeTransactionStatusEnum;
    code: string;
    transactionNo: string | null;
    note: string | null;
    accountId: string;
    account: Account;
    message: string;
    type: ExchangeType;
    brand: Brand;

}


export interface ExchangePointBetweenTwoBrandRequestData {
    fromId: string;
    toId: string;
    toPoint: number;
    fromPoint: number;
    fromRate: number;
    toRate: number;
    lopPoint: number;
}


export interface ExchangePointBetweenTwoBrandResponseData extends ExchangePointBetweenTwoBrandRequestData {
    exchangeTransactions: ExchangeTransaction[];
}

export enum UpdateDepositRequestStatus {
    cancelled = 'CANCELLED',
}
export interface UpdateDepositRequest {
    id: string;
    status: UpdateDepositRequestStatus;
    note?: string;
}

export interface payWithVNPayRequest {
    id: string;
    remoteAddress?: string;
    bankCode?: string;
}

export interface RegisterMemberRequestData {
    brandId: string;
    name: string | null;
    dateOfBirth: number | null; // millisecond
    idCard: string | null;
    phone: string | null;
    email: string | null;
    address: string | null;
    gender: number | null;
}

export enum RegisterMemberStatus {
    pending = 'PENDING',
    verified = 'VERIFIED',
    rejected = 'REJECTED',
}
export interface RegisterMemberResponseData extends RegisterMemberRequestData {
    status: RegisterMemberStatus;
    reason: string;
}


class PointApi {

    async getRegisterMemberInformationOfABrand(brandId: string): Promise<HttpResponse<RegisterMemberResponseData>> {
        try {
            const header = await http.getAuthorizedHeader();
            const response = await http.get(`point/brand/registerMember?brandId=${brandId}`, header);
            return response;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async registerMember(body: RegisterMemberRequestData): Promise<HttpResponse<RegisterMemberResponseData>> {
        try {
            const header = await http.getAuthorizedHeader();
            const response = await http.post('point/brand/registerMember', body, header);
            return response;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async payWithVnpay(body: payWithVNPayRequest): Promise<HttpResponse<LoyalPointDepositTransaction>> {
        try {
            const header = await http.getAuthorizedHeader();
            const response = await http.post('point/wallet/deposit/payment/vpcPayment', body, header);
            return response;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }


    async getExchangeTransactionHistory(offset: number, limit: number): Promise<HttpPagingListResponse<ExchangeTransaction>> {
        try {
            const header = await http.getAuthorizedHeader();
            const params = {
                offset,
                limit,
            };

            const uri = `point/exchange?${http.objectToQueryParams(params)}`;
            const response = await http.get(uri, header);
            return response;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async exchangePointBetweenTwoBrand(requestData: ExchangePointBetweenTwoBrandRequestData): Promise<HttpResponse<ExchangePointBetweenTwoBrandResponseData>> {
        try {
            const header = await http.getAuthorizedHeader();
            const response = await http.post('point/exchange', requestData, header);
            return response;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async getConversionRate(params: GetConversionRateRequestParams): Promise<HttpResponse<GetConversionRateResponseData>> {
        try {
            const header = await http.getAuthorizedHeader();
            const response = await http.get(`point/exchange/conversionRate?${http.objectToQueryParams(params)}`, header);
            return response;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async getLoyalPoints(): Promise<HttpResponse<LoyalPointBalanceResponseData>> {
        try {
            const header = await http.getAuthorizedHeader();
            const response = await http.get('point/wallet/loyalPoint', header);
            return response;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async getLoyalPointConversionRate(): Promise<HttpResponse<LoyalPointConversionRateResponseData>> {
        try {
            const params = {
                type: UtilType.loyaPointConversionRate,
            }
            const uri = `/point/utils?${http.objectToQueryParams(params)}`;
            const response = await http.get(uri, null);
            return response;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async createLoyalPointDeposit(body: CreateLoyalPointsDepositRequestData): Promise<HttpResponse<LoyalPointDepositTransaction>> {
        try {
            const header = await http.getAuthorizedHeader();
            const response = await http.post('point/wallet/deposit', body, header);
            return response;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async getAllBrandsSeparatedByCategory(status?: BrandStatus): Promise<HttpListResponse<CategoryWithBrands>> {
        let params = {} as any;
        if (status) {
            params.status = status;
        }
        const uri = `point/brand/all?${http.objectToQueryParams(params)}`;
     
        try {
            const header = await http.getAuthorizedHeader();
            const response = await http.get(uri, header);
            return response;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    /**
    /* 
    /* @param brandId: undefined for get all or uid for get a specific one.
    */
    async getBrandPoint(brandId: string): Promise<HttpResponse<BrandPoint>> {
        try {
            const header = await http.getAuthorizedHeader();
            let uri = `point/wallet/brand?brandId=${brandId}`;
            const response = await http.get(uri, header);
            return response;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }


    async getAllBrandPointCategories(): Promise<HttpListResponse<BrandPointCategory>> {
        try {
            const header = await http.getAuthorizedHeader();
            let uri = 'point/wallet/brand';
            const response = await http.get(uri, header);
            return response;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async linkBrand(body: LinkBrandRequestData): Promise<HttpResponse<any>> {
        try {
            const header = await http.getAuthorizedHeader();
            const response = await http.post('point/brand/link', body, header);
            return response;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async getLOPDepositTransactions(offset: number, limit: number): Promise<HttpPagingListResponse<LoyalPointDepositTransaction>> {
        try {
            const header = await http.getAuthorizedHeader();
            const params = {
                offset,
                limit,
            };

            const uri = `point/wallet/deposit?${http.objectToQueryParams(params)}`;
            const response = await http.get(uri, header);
            return response;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async getLOPDepositTransaction(id: string): Promise<HttpResponse<LoyalPointDepositTransaction>> {
        try {
            const header = await http.getAuthorizedHeader();
            const params = {
                id,
            };
            const uri = `point/wallet/deposit?${http.objectToQueryParams(params)}`;
            const response = await http.get(uri, header);
            return response;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async getBrandDetails(brandId: string): Promise<HttpResponse<Brand>> {
        try {
            const header = await http.getAuthorizedHeader();
            const params = {
                detail: true,
                brandId,
            };

            const uri = `point/brand?${http.objectToQueryParams(params)}`;
            const response = await http.get(uri, header);
            return response;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }



    async updateDeposit(requestData: UpdateDepositRequest): Promise<HttpResponse<LoyalPointDepositTransaction>> {
        try {
            const header = await http.getAuthorizedHeader();
            const response = await http.put('point/wallet/deposit', requestData, header);
            return response;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

}
export const pointApi = new PointApi();
