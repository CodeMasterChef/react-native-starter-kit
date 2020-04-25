import { http } from './http';
import { HttpResponse } from '../@model/httpResponse';


export interface UploadPhotoRequestData {
    type: 'base64';
    fileType: string; // jpg
    contentType: string; // image/jpg
    image: string; // base64 without prefix 'data:image/jpeg;base64,'
}

export interface UploadPhotoResponseData {
    id: string;
    link: string;
    deletehash?: string;
    type: string;
    width?: number;
    height?: number;
    size: number;

}
export class MediaApi {

    async uploadPhoto(requestData: UploadPhotoRequestData): Promise<HttpResponse<UploadPhotoResponseData>> {
        try {
            const header = await http.getAuthorizedHeader();
            const response = await http.post('media/photoUpload/save', requestData, header);
            return response;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }



}

export const mediaApi = new MediaApi();