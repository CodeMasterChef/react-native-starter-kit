import { Brand } from './brand';

export interface EarnPointTransaction {
    id: string;
    branchId: string;
    brand: Brand;
    number?: string;
    memberBrandId: string;
    totalAmount: number;
    point: number;
    message?: string;
    createDate: number;
}