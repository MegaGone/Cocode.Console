export interface IService {
    Id: number;
    id: number;
    Name: string;
    CreatedAt: string;
    IsEnabled: boolean;
    Price: number;
}

export interface IFindServiceResponse {
    page: number;
    pages: number;
    total: number;
    services: Array<IService>;
    statusCode: number;
}
