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
import { IGetMinutes, IGetMinutesResponse, IMinute } from 'app/interfaces';
const base_url = environment.base_url;

@Injectable({
    providedIn: 'root',
})
export class MinuteService {
    private _onlistenSubject: Subject<void>;
    private _minutes: BehaviorSubject<Array<IMinute> | null>;

    constructor(private readonly _http: HttpClient) {
        this._onlistenSubject = new Subject();
        this._minutes = new BehaviorSubject(null);
    }

    public get _minutes$(): Observable<Array<IMinute>> {
        return this._minutes.asObservable();
    }

    public create(formData: FormData): Observable<number> {
        return this._http
            .post(`${base_url}/minute/create`, formData, this._getHeaders)
            .pipe(
                map((res: { id: number; statusCode: number }) =>
                    res.statusCode ? res.statusCode : 500
                ),
                catchError((err) => of(err.status))
            );
    }

    public disable(id: number): Observable<number> {
        return this._http
            .delete(`${base_url}/minute/disable/${id}`, this._getHeaders)
            .pipe(
                map((res: { wasDeleted: boolean; statusCode: number }) =>
                    res.statusCode ? res.statusCode : 500
                ),
                catchError((err) => of(err.status))
            );
    }

    public enable(id: number): Observable<number> {
        return this._http
            .put(`${base_url}/minute/enable/${id}`, null, this._getHeaders)
            .pipe(
                map((res: { enable: boolean; statusCode: number }) =>
                    res.statusCode ? res.statusCode : 500
                ),
                catchError((err) => of(err.status))
            );
    }

    public download(filename: string): Observable<Blob> {
        return this._http.get(
            `${base_url.replace('/api', '')}/uploads/${filename}`,
            {
                responseType: 'blob',
            }
        );
    }

    public findMinutes(request: {
        page: number;
        pageSize: number;
    }): Observable<IGetMinutes | null> {
        return this._http
            .post(`${base_url}/minute/find`, request, this._getHeaders)
            .pipe(
                map((res: IGetMinutesResponse) => {
                    if (res.statusCode && res.statusCode == 200) {
                        this._minutes.next(res.minutes);
                        return {
                            page: res.page,
                            total: res.total,
                            pages: res.pages,
                            minutes: res.minutes,
                        };
                    }

                    return null;
                }),
                catchError((err) => of(null))
            );
    }

    public listenDialog() {
        this._onlistenSubject.next();
    }

    public get dialogStatus() {
        return this._onlistenSubject.asObservable();
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
