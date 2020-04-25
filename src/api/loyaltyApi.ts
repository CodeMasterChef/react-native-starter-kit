import { RequestEarnPoint } from './../@model/requestEarnPoint';
import { BrandMemberSetting } from './../@model/brandMemberSetting';
import { EarnPointTransaction } from './../@model/earnPointTransaction';
import { Voucher } from './../@model/voucher';
import { HttpPagingListResponse } from '../@model/httpListResponse';
import { http } from './http';
import { HttpResponse } from '../@model/httpResponse';
import { BrandMember } from '../@model/brandMember';

export class LoyaltyApi {

    async createEarnPointRequest(requestEarnPoint: RequestEarnPoint): Promise<HttpResponse<RequestEarnPoint>> {
        try {
            const header = await http.getAuthorizedHeader();
            const body = requestEarnPoint;
            const response = await http.post('loyalty/requestTransaction', body, header);
            return response;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async getBrandMemberInfo(brandId: string): Promise<HttpResponse<BrandMember>> {
        try {
            const header = await http.getAuthorizedHeader();

            const uri = `loyalty/memberBrand?brandId=${brandId}`;
            const response = await http.get(uri, header);
            return response;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async getBrandMemberSetting(brandId: string): Promise<HttpResponse<BrandMemberSetting>> {
        try {
            const header = await http.getAuthorizedHeader();

            const uri = `loyalty/settingMemberBrand?brandId=${brandId}`;
            const response = await http.get(uri, header);
            return response;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async getVoucherById(voucherId: string): Promise<HttpResponse<Voucher>> {
        try {
            const header = await http.getAuthorizedHeader();
            const params = {
                voucherId,
            };
            const uri = `loyalty/voucher?${http.objectToQueryParams(params)}`;
            const response = await http.get(uri, header);
            return response;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    

    async getBrandVouchers(brandId?: string, offset?: number, limit?: number): Promise<HttpPagingListResponse<Voucher>> {
        try {
            const header = await http.getAuthorizedHeader();
            let params = {} as any;

            if(brandId) { 
                params.brandId = brandId;
            }
           
            if (offset !== null && offset !== undefined) {
                params.offset = offset
            }

            if (limit) {
                params.limit = limit;
            }

            const uri = `loyalty/voucher?${http.objectToQueryParams(params)}`;
            const response = await http.get(uri, header);
            return response;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async receiveVoucher(voucherId: string): Promise<HttpResponse<Voucher>> {
        try {
            const header = await http.getAuthorizedHeader();
            const body = {
                voucherId,
            };
            const response = await http.put('loyalty/voucher/value', body, header);
            return response;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async getAllReceivedVouchers(isUsedAndExpired: boolean): Promise<HttpPagingListResponse<Voucher>> {
        try {
            const header = await http.getAuthorizedHeader();
            // 0 -> new vouchers, 1 -> used & expired voucher , 2 -> all vouchers
            const isUsed = isUsedAndExpired ? 1 : 0;
            const uri = `/loyalty/voucher/value?isUsed=${isUsed}`;
            const response = await http.get(uri, header);
            return response;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async geEarnPointTransactionHistory(offset: number, limit: number): Promise<HttpPagingListResponse<EarnPointTransaction>> {
        try {
            const header = await http.getAuthorizedHeader();
            const params = {
                offset,
                limit,
            };

            const uri = `loyalty/transaction?${http.objectToQueryParams(params)}`;
            const response = await http.get(uri, header);
            return response;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

}

export const loyaltyApi = new LoyaltyApi();