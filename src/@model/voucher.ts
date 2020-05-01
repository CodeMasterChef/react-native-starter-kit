import { Brand } from './brand';

export interface Voucher {
    id: string;
    brandId: string;
    brand?: Brand;
    title: string;
    content: string;
    url?: string;
    image?: string;
    memberTypeIds?: string;
    limitAmount?: number;
    minAmount?: number;
    limitUsage: number;
    numberUsage: number;
    quantityCodeNew: number;
    quantityCodeUsed: number;
    quantityCodeGot: number;
    value?: number;
    unit: string;
    expDate: number;
    startDate: number;
    createDate: number;
    memberTypes: [];
    values?: number;
    valueErrors?: number;
    active: boolean;
    code: string;
    status: string;
    used: boolean;
    price: number;
}