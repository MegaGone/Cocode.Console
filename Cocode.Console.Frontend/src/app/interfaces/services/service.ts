export interface IService {
    Id: number;
    id: number;
    Name: string;
    CreatedAt: string;
    IsEnabled: boolean;
}

export interface IFindServiceResponse {
    page: number;
    pages: number;
    total: number;
    services: Array<IService>;
    statusCode: number;
}
