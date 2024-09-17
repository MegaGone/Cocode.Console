export interface IWage {
    Id: number;
    User: string;
    Status: number;
    Amount: number;
    Service: string;
    CreatedAt: string;
    DeletedAt: string;
    Description: string;
}

export interface IGetWages {
    page: number;
    total: number;
    pages: number;
    wages: Array<IWage>;
}

export interface IGetWagesResponse extends IGetWages {
    statusCode: number;
}
