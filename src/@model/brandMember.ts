import { MemberType } from './memberType';

export interface BrandMember {
    id: string;
    userId: string;
    brandId: string;
    memberBrandCode: string;
    authToken: string;
    memberType: MemberType;
    status: string;
    totalMoney: number;
    point: number;
    description: string;
    reason: string;
    message: string;
    name: string;
    username: string;
    dateOfBirth: number;
    gender: number;
    phone: string;
    email: string;
    address: string;
    urlAvatar: string;
    spamRequestTransaction: boolean;
}