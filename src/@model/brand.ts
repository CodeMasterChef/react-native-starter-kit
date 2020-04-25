import { Category } from './category';

export enum BrandStatus {
    pending = 'PENDING',
    verified = 'VERIFIED',
    rejected = 'REJECTED',
    blocked = 'BLOCKED',
}

export enum AuthType {
    phone = 'PHONE',
    username = 'USERNAME',
    email = 'EMAIL',
    memberId = 'MEMBER_ID',
    password = 'PASSWORD',
    firstName = 'FIRST_NAME',
    lastName = 'LAST_NAME',
    fullName = 'FULL_NAME',
    pin = 'PIN',
    code = 'CODE',
}

export enum RegisterMemberType {
    name = 'NAME',
    nameRequired = 'NAME_REQUIRED',
    birthday = 'BIRTHDAY',
    birthdayRequired = 'BIRTHDAY_REQUIRED',
    idCard = 'ID_CARD',
    idCardRequired = 'ID_CARD_REQUIRED',
    phone = 'PHONE',
    phoneRequired = 'PHONE_REQUIRED',
    email = 'EMAIL',
    emailRequired = 'EMAIL_REQUIRED',
    address = 'ADDRESS',
    addressRequired = 'ADDRESS_REQUIRED',
    gender = 'GENDER',
    genderRequired = 'GENDER_REQUIRED',
}

export interface Brand {
    id: string;
    brandId: string;
    categoryId: string;
    category: Category;
    code: string,
    services?: string | null;
    email: string;
    urlWebsite?: string | null;
    urlAvatar?: string | null;
    name: string;
    brandOwnerName: string;
    phone: string;
    address: string;
    description?: string | null;
    conversionRate: number;
    status: BrandStatus;
    minValue: number;
    maxValue: number;
    reason?: string | null;
    policy: string | null;
    servicePackageId: string;
    servicePackage: any;
    brandPointCode: string;
    autoSigning: boolean;
    createUser: any;
    createDate: number;
    authTypes: AuthType[];
    registerMemberTypes: RegisterMemberType[];
    linked?: boolean; // for view display only: the brand is linked with user or not.
    point: number;// for view display only: brand point
    lopPoint: number; // for view display only: Loyal One point
    brandName: string; // for view display only
    isRefreshing: boolean; // for view display only: loading icon
    banner: string;
}