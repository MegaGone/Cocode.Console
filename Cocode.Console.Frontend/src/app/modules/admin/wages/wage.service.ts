import {
    BehaviorSubject,
    catchError,
    map,
    Observable,
    of,
    Subject,
} from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { IGetWages, IGetWagesResponse, IWage } from 'app/interfaces';
const base_url = environment.base_url;

@Injectable({
    providedIn: 'root',
})
export class WageService {
    private _onlistenSubject: Subject<void>;
    private _wages: BehaviorSubject<Array<IWage> | null>;

    constructor(private readonly _http: HttpClient) {
        this._onlistenSubject = new Subject();
        this._wages = new BehaviorSubject(null);
    }

    public get wages$(): Observable<Array<IWage>> {
        return this._wages.asObservable();
    }

    public listenDialog() {
        this._onlistenSubject.next();
    }

    public get dialogStatus() {
        return this._onlistenSubject.asObservable();
    }

    public create(body): Observable<number> {
        return this._http
            .post(`${base_url}/wage/create`, body, this._getHeaders)
            .pipe(
                map((res: { id: number; statusCode: number }) =>
                    res.statusCode ? res.statusCode : 500
                ),
                catchError((err) => of(err.status))
            );
    }

    public updateState(body: {
        id: number;
        status: number;
    }): Observable<number> {
        return this._http
            .put(`${base_url}/wage/status`, body, this._getHeaders)
            .pipe(
                map((res: { updated: boolean; statusCode: number }) =>
                    res.statusCode ? res.statusCode : 500
                ),
                catchError((err) => of(err.status))
            );
    }

    public delete(id: number): Observable<number> {
        return this._http
            .delete(`${base_url}/wage/delete/${id}`, this._getHeaders)
            .pipe(
                map((res: { deleted: boolean; statusCode: number }) =>
                    res.statusCode ? res.statusCode : 500
                ),
                catchError((err) => of(err.status))
            );
    }

    public findWages(request: {
        page: number;
        pageSize: number;
    }): Observable<IGetWages | null> {
        return this._http
            .post(`${base_url}/wage/findPaginated`, request, this._getHeaders)
            .pipe(
                map((res: IGetWagesResponse) => {
                    if (res.statusCode && res.statusCode == 200) {
                        this._wages.next(res.wages);
                        return {
                            page: res.page,
                            total: res.total,
                            pages: res.pages,
                            wages: res.wages,
                        };
                    }

                    return null;
                }),
                catchError((err) => of(null))
            );
    }

    private get _getToken() {
        return localStorage.getItem('x-token') || '';
    }

    private get _getHeaders() {
        return {
            headers: {
                'x-token': this._getToken,
            },
        };
    }
}
