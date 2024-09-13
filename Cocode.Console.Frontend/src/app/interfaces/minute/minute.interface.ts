export interface IMinute {
    Id: number;
    Author: string;
    Filename: string;
    Description: string;
    CreatedAt?: string | Date;
    DeletedAt?: string | null;
}

export interface IGetMinutes {
    page: number;
    total: number;
    pages: number;
    minutes: Array<IMinute>;
}

export interface IGetMinutesResponse {
    page: number;
    total: number;
    pages: number;
    statusCode: number;
    minutes: Array<IMinute>;
}
