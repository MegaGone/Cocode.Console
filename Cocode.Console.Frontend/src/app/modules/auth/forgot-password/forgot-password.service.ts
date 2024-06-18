import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from 'environments/environment';
const base_url = environment.base_url;

@Injectable({
    providedIn: 'root',
})
export class ForgotPasswordService {
    constructor(private readonly _http: HttpClient) {}

    public validateUser(request: {
        email: string;
        dpi: string;
    }): Observable<boolean> {
        return this._http.post(`${base_url}/user/validate`, request).pipe(
            map((res: { statusCode: number; exists?: boolean }) => {
                return res?.statusCode && res?.statusCode != 200 ? false : true;
            }),
            catchError((err) => of(false))
        );
    }

    public restorePassword(request: {
        dpi: string;
        email: string;
        password: string;
    }): Observable<boolean> {
        return this._http
            .post(`${base_url}/user/restore-password`, request)
            .pipe(
                map((res: { statusCode: number }) => {
                    return res?.statusCode && res?.statusCode != 200
                        ? false
                        : true;
                }),
                catchError((err) => of(false))
            );
    }
}
