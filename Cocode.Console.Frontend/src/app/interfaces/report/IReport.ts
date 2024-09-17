export interface IReport {
    id?: number;
    incidentName: string;
    description: string;
    incidentEvidence: string;
    user: string;
}

export interface IGetReports {
    reports: IReport[];
    total: number;
    page: number;
    pages: number;
}

export interface IGetReportsResponse {
    data: IReport[];
    count: number;
    page: number;
    pages: number;
    statusCode: number;
}
