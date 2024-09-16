export interface IUser {
    data: User[];
    count?: number;
    page?: number;
    pages?: number;
    statusCode: number;
}

export interface User {
    id: number;
    DisplayName: string;
    Role: number;
    Email: string;
    CreatedAt: Date;
    name?: string;
    IsSolvent: boolean;
    dpi?: string;
    Dpi?: string;
    telefono?: string;
    direccion?: string;
}

export interface Users {
    users: User[];
    total: number;
    page: number;
    pages: number;
}

export interface INewUser {
    firstName: string;
    lastName: string;
    role: number;
    email: string;
    password?: string;
    dpi: string;
    telefono: string;
    direccion: string;
}

export interface INewUserResponse {
    user: User;
    statusCode: number;
}

export interface UsersPagination {
    length: number;
    size: number;
    page: number;
    lastPage?: number;
    startIndex?: number;
    endIndex: number;
}
