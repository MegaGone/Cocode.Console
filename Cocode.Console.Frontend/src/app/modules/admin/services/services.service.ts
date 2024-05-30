import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { catchError, map, of } from 'rxjs';
const base_url = environment.base_url;

@Injectable({
    providedIn: 'root',
})
export class ServicesService {
    constructor(private readonly _http: HttpClient) {}

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
