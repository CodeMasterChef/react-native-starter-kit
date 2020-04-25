import { Category } from './category';


export interface BrandPoint {
    brandId: string;
    accountId: string;
    username: string;
    point: number;
    brandPointCode: string;
    brandName: string;
    conversionRate: number;
    lopPoint: number;
    minValue: number | null;
    maxValue: number | null;
    autoSigning: boolean;
}

export interface BrandPointCategory {
    id: string;
    name: string;
    nameEng: string;
    number: number;
    urlAvatar: string | null;
    description: string;
    subCategories: Category | null;
    brandPoints: BrandPoint[];


}
