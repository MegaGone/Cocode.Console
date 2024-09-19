import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IGetPayments, IGetPaymentsResponse, IPayment } from 'app/interfaces';
import {
    BehaviorSubject,
    Observable,
    Subject,
    catchError,
    map,
    of,
} from 'rxjs';
import { environment } from 'environments/environment';
const base_url = environment.base_url;

@Injectable({
    providedIn: 'root',
})
export class PaymentService {
    private _payments: BehaviorSubject<IPayment[] | null>;
    private onlistenSubject: Subject<void>;
    public userId: Subject<number>;

    constructor(private readonly _http: HttpClient) {
        this.userId = new Subject<number>();
        this.onlistenSubject = new Subject<void>();
        this._payments = new BehaviorSubject(null);
    }

    public get userId$(): Observable<number> {
        return this.userId.asObservable();
    }

    public get payments$(): Observable<IPayment[]> {
        return this._payments.asObservable();
    }

    public getPayments(request: {
        page: number;
        userId: number;
        pageSize: number;
    }): Observable<IGetPayments | null> {
        return this._http
            .post(`${base_url}/payment/payments`, request, this.getHeaders)
            .pipe(
                map((res: IGetPaymentsResponse) => {
                    if (res.statusCode && res.statusCode == 200) {
                        this._payments.next(res.data);
                        return {
                            payments: res.data,
                            total: res.count,
                            page: res.page,
                            pages: res.pages,
                        };
                    }

                    return null;
                }),
                catchError((err) => of(null))
            );
    }

    public createPayment(
        payment: IPayment
    ): Observable<{ statusCode: number; filename: string }> {
        return this._http
            .post<{ id: number; statusCode: number; recipe: string }>(
                `${base_url}/payment/create`,
                payment,
                this.getHeaders
            )
            .pipe(
                map((res) => ({
                    statusCode: res?.statusCode || 500,
                    filename: res?.recipe,
                })),
                catchError((err) =>
                    of({ statusCode: err.status, filename: '' })
                )
            );
    }

    public getMonths() {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;

        const months = [
            { description: 'Enero', value: 1 },
            { description: 'Febrero', value: 2 },
            { description: 'Marzo', value: 3 },
            { description: 'Abril', value: 4 },
            { description: 'Mayo', value: 5 },
            { description: 'Junio', value: 6 },
            { description: 'Julio', value: 7 },
            { description: 'Agosto', value: 8 },
            { description: 'Septiembre', value: 9 },
            { description: 'Octubre', value: 10 },
            { description: 'Noviembre', value: 11 },
            { description: 'Diciembre', value: 12 },
        ];

        return months.slice(0, currentMonth);
    }

    public download(filename: string): Observable<Blob> {
        return this._http.get(
            `${base_url.replace('/api', '')}/uploads/${filename}`,
            {
                responseType: 'blob',
            }
        );
    }

    public getAmounts() {
        return [{ description: 'Q 800.00', value: 800 }];
    }

    // INTERNAL
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

    public listenDialog() {
        this.onlistenSubject.next();
    }

    public get dialogStatus() {
        return this.onlistenSubject.asObservable();
    }
}
