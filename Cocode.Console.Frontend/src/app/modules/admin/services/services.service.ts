import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IFindServiceResponse, IService } from 'app/interfaces';
import { environment } from 'environments/environment';
import {
    BehaviorSubject,
    Observable,
    Subject,
    catchError,
    map,
    of,
} from 'rxjs';
const base_url = environment.base_url;

@Injectable({
    providedIn: 'root',
})
export class ServicesService {
    private dialogSubject: Subject<void>;
    private _services: BehaviorSubject<Array<IService> | null>;

    constructor(private readonly _http: HttpClient) {
        this.dialogSubject = new Subject<void>();
        this._services = new BehaviorSubject(null);
    }

    public get services$(): Observable<Array<IService>> {
        return this._services.asObservable();
    }

    public createService(name: string) {
        return this._http
            .post(`${base_url}/service/create`, name, this.getHeaders)
            .pipe(
                map((res: { id: number; statusCode: number }) =>
                    res.statusCode ? res.statusCode : 500
                ),
                catchError((err) => of(err.status))
            );
    }

    public updateService(request: {
        id: number;
        name: string;
        budget: number;
        enabled: boolean;
    }): Observable<number> {
        return this._http
            .put(`${base_url}/service/update`, request, this.getHeaders)
            .pipe(
                map((res: { statusCode: number }) => {
                    return res?.statusCode ? res?.statusCode : 500;
                }),
                catchError((err) => {
                    console.log(err);
                    return of(500);
                })
            );
    }

    public findServices(request: {
        page: number;
        pageSize: number;
    }): Observable<Partial<IFindServiceResponse> | null> {
        return this._http
            .post(`${base_url}/service/find`, request, this.getHeaders)
            .pipe(
                map((res: Partial<IFindServiceResponse>) => {
                    if (res?.statusCode && res?.statusCode == 200) {
                        this._services.next(res?.services);
                        return {
                            page: res?.page,
                            total: res.total,
                            pages: res?.pages,
                            services: res.services,
                        };
                    }
                    return null;
                }),
                catchError((err) => of(null))
            );
    }

    public dialog(): void {
        this.dialogSubject.next();
    }

    public get onDialog() {
        return this.dialogSubject.asObservable();
    }

    private get getToken() {
        return localStorage.getItem('x-token') || '';
    }

    private get getHeaders() {
        return {
            headers: {
                'x-token': this.getToken,
            },
        };
    }
}
