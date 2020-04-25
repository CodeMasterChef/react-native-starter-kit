import { AuthType, BrandStatus } from '../@model/brand';
import faker from 'faker';

export const mockData = {
    brand: {
        "id": "6e45508d-7cec-4660-a46b-ead737b47748",
        "categoryId": "1e3b7a24-f5c4-4860-b3d5-d2a50089725d",
        "category": {
            "id": "1e3b7a24-f5c4-4860-b3d5-d2a50089725d",
            "name": "Khách sạn",
            "nameEng": "Hotel",
            "number": 0,
            "urlAvatar": "https://development.loyaworld.com:4001/media/images/fff143f7-e668-4822-9fc2-a772bc07eccd.png",
            "description": "sdfdf",
            "subCategories": null
        },
        "code": "danh99",
        "services": null,
        "email": "hoangdanh010190@gmail.com",
        "urlWebsite": null,
        "urlAvatar": "https://s28477.pcdn.co/wp-content/uploads/2018/07/vietnam_airlines_new_logo.jpg",
        "name": "Vietnam Airlines",
        "brandOwnerName": "danh99",
        "phone": "0773039761",
        "address": "123",
        "description": null,
        "conversionRate": 1111.0,
        "status": BrandStatus.pending,
        "minValue": 111.0,
        "maxValue": 111.0,
        "reason": null,
        "policy": null,
        "servicePackageId": "a4d41c4a-3fe7-460e-beeb-ddaeefc93664",
        "servicePackage": {
            "id": "a4d41c4a-3fe7-460e-beeb-ddaeefc93664",
            "createDate": 1577687505606,
            "lastUpdate": 1577949598345,
            "name": "Gói 1",
            "services": "5",
            "maxEmployee": 6,
            "active": true,
            "delete": false
        },
        "brandPointCode": "danh",
        "autoSigning": true,
        "createUser": {
            "id": "061a6494-0edb-4fff-ac0c-f41ebe0aac3e",
            "brandId": null,
            "username": "admin",
            "type": "CS",
            "profileId": "686f6ab6-6ade-45ac-b5a6-199601ee14ff",
            "name": "admin",
            "dateOfBirth": null,
            "gender": null,
            "phone": "+84934448782",
            "email": null,
            "address": null,
            "provinceId": null,
            "province": null,
            "urlAvatar": null,
            "description": null,
            "role": "ROLE_ADMIN",
            "walletAddress": null,
            "tokenBalance": null,
            "createDate": 1576834089410,
            "member": false,
        },
        "createDate": 1578293893868,
        "authTypes": [
            AuthType.phone,
            // AuthType.password,
            // AuthType.username,
            // AuthType.email,
            // AuthType.memberId,
            // AuthType.firstName,
            // AuthType.lastName,
            AuthType.pin,
            AuthType.code,
        ]
    },
    wallets: [
        {
            title: faker.commerce.department(),
            id: faker.random.uuid(),
            data: Array(5)
                .fill(0)
                .map(_ => ({
                    id: faker.random.uuid(),
                    name: faker.company.companyName(),
                    lopBalance: faker.commerce.price(),
                    trademarkBalance: faker.commerce.price(),
                    trademarkCurrency: faker.finance.currencyCode(),
                    urlAvatar: faker.image.imageUrl(),
                }))
        },
        {
            title: faker.commerce.department(),
            id: faker.random.uuid(),
            data: Array(10)
                .fill(0)
                .map(_ => ({
                    id: faker.random.uuid(),
                    name: faker.company.companyName(),
                    lopBalance: faker.commerce.price(),
                    trademarkBalance: faker.commerce.price(),
                    trademarkCurrency: faker.finance.currencyCode(),
                    urlAvatar: faker.image.imageUrl(),
                }))
        },
        {
            title: faker.commerce.department(),
            id: faker.random.uuid(),
            data: Array(10)
                .fill(0)
                .map(_ => ({
                    id: faker.random.uuid(),
                    name: faker.company.companyName(),
                    lopBalance: faker.commerce.price(),
                    trademarkBalance: faker.commerce.price(),
                    trademarkCurrency: faker.finance.currencyCode(),
                    urlAvatar: faker.image.imageUrl(),
                }))
        },
    ],
    depositHistoryResponse : {
        "data": {
            "items": [
                {
                    "id": "3cded363-d0a8-4a00-ac42-a4179cf70ac3",
                    "accountId": "a55cfedd-efc0-4c8b-9e13-aa19db97eeb3",
                    "account": {
                        "id": "a55cfedd-efc0-4c8b-9e13-aa19db97eeb3",
                        "brandId": null,
                        "username": "+84832616154",
                        "type": "USER",
                        "profileId": "42eee6a9-e25c-4b5b-afd3-3ee22ae46060",
                        "name": "Ninh Le",
                        "dateOfBirth": null,
                        "gender": null,
                        "phone": "+84832616154",
                        "email": null,
                        "address": null,
                        "provinceId": null,
                        "province": null,
                        "point": 0,
                        "secretKey": null,
                        "urlAvatar": null,
                        "description": null,
                        "role": null,
                        "walletAddress": null,
                        "tokenBalance": null,
                        "createDate": 1577949108377,
                        "member": false
                    },
                    "point": 1.0,
                    "value": 2000.0,
                    "status": "NEW",
                    "code": "ECA27A57",
                    "transactionNo": null,
                    "note": null,
                    "message": "ECA27A57 Ninh Le",
                    "createDate": 1578458321388,
                    "lastUpdate": 1578458321388
                },
                {
                    "id": "039fa290-5f4a-4033-93b1-01ca7ae46e65",
                    "accountId": "a55cfedd-efc0-4c8b-9e13-aa19db97eeb3",
                    "account": {
                        "id": "a55cfedd-efc0-4c8b-9e13-aa19db97eeb3",
                        "brandId": null,
                        "username": "+84832616154",
                        "type": "USER",
                        "profileId": "42eee6a9-e25c-4b5b-afd3-3ee22ae46060",
                        "name": "Ninh Le",
                        "dateOfBirth": null,
                        "gender": null,
                        "phone": "+84832616154",
                        "email": null,
                        "address": null,
                        "provinceId": null,
                        "province": null,
                        "point": 0,
                        "secretKey": null,
                        "urlAvatar": null,
                        "description": null,
                        "role": null,
                        "walletAddress": null,
                        "tokenBalance": null,
                        "createDate": 1577949108377,
                        "member": false
                    },
                    "point": 20.0,
                    "value": 40000.0,
                    "status": "REJECTED",
                    "code": "B210AD2A",
                    "transactionNo": null,
                    "note": null,
                    "message": "B210AD2A Ninh Le",
                    "createDate": 1578458183656,
                    "lastUpdate": 1578458183656
                },
                {
                    "id": "b7560257-d2dc-4e90-928b-8ec60f1d0122",
                    "accountId": "a55cfedd-efc0-4c8b-9e13-aa19db97eeb3",
                    "account": {
                        "id": "a55cfedd-efc0-4c8b-9e13-aa19db97eeb3",
                        "brandId": null,
                        "username": "+84832616154",
                        "type": "USER",
                        "profileId": "42eee6a9-e25c-4b5b-afd3-3ee22ae46060",
                        "name": "Ninh Le",
                        "dateOfBirth": null,
                        "gender": null,
                        "phone": "+84832616154",
                        "email": null,
                        "address": null,
                        "provinceId": null,
                        "province": null,
                        "point": 0,
                        "secretKey": null,
                        "urlAvatar": null,
                        "description": null,
                        "role": null,
                        "walletAddress": null,
                        "tokenBalance": null,
                        "createDate": 1577949108377,
                        "member": false
                    },
                    "point": 10.0,
                    "value": 20000.0,
                    "status": "COMPLETED",
                    "code": "F398837A",
                    "transactionNo": null,
                    "note": null,
                    "message": "F398837A Ninh Le",
                    "createDate": 1578298553112,
                    "lastUpdate": 1578298553112
                }
            ],
            "paging": {
                "totalPages": 5,
                "totalElements": 14
            }
        },
        "status": "SUCCESS",
        "status_code": 991,
        "status_message": "Successful"
    }
}