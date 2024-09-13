import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { INewUser, IUser, Users, User, INewUserResponse } from 'app/interfaces';
import { environment } from 'environments/environment';
import {
    Observable,
    catchError,
    map,
    of,
    BehaviorSubject,
    Subject,
} from 'rxjs';
const base_url = environment.base_url;

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private fooSubject = new Subject<void>();
    private _users: BehaviorSubject<User[] | null> = new BehaviorSubject(null);
    private _neighbors: BehaviorSubject<User[] | null> = new BehaviorSubject(
        null
    );

    private path: string;

    constructor(private _http: HttpClient) {
        this.path = `${base_url}/user`;
    }

    get users$(): Observable<User[]> {
        return this._users.asObservable();
    }

    get neighbors$(): Observable<User[]> {
        return this._neighbors.asObservable();
    }

    getUsers(request: {
        roleId: number;
        page: number;
        pageSize: number;
    }): Observable<Users | null> {
        return this._http
            .post(`${this.path}/users`, request, this.getHeaders)
            .pipe(
                map((res: IUser) => {
                    if (res.statusCode && res.statusCode == 200) {
                        this._users.next(res.data);
                        return {
                            users: res.data,
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

    createUser(user: INewUser): Observable<number> {
        return this._http
            .post(`${this.path}/create`, user, this.getHeaders)
            .pipe(
                map((res: INewUserResponse) =>
                    res.statusCode ? res.statusCode : 500
                ),
                catchError((err) => of(err.status))
            );
    }

    updateUser(user: INewUser) {
        return this._http
            .put(`${this.path}/update`, user, this.getHeaders)
            .pipe(
                map((res: { statusCode: number }) =>
                    res ? res.statusCode : 500
                ),
                catchError((err) => of(err.status))
            );
    }

    deleteUser(id: number) {
        return this._http.delete(`${this.path}/${id}`, this.getHeaders).pipe(
            map((res: { statusCode: number }) => (res ? res.statusCode : 500)),
            catchError((err) => of(err.status))
        );
    }

    getNeighbors() {
        return this._http.get(`${this.path}/neighbors`, this.getHeaders).pipe(
            map((res: IUser) => {
                this._neighbors.next(res?.data);
                return res?.data;
            }),
            catchError((err) => of(null))
        );
    }

    public updateNeighborStatus(
        userId: number,
        status: boolean
    ): Observable<number> {
        return this._http
            .put(`${this.path}/status`, { userId, status }, this.getHeaders)
            .pipe(
                map((res: { statusCode: number }) => {
                    return res ? res?.statusCode : 500;
                }),
                catchError((err) => {
                    return of(err?.status);
                })
            );
    }

    // INTERNAL
    get getToken() {
        return localStorage.getItem('x-token') || '';
    }

    get getHeaders() {
        return {
            headers: {
                'x-token': this.getToken,
            },
        };
    }

    foo(): void {
        this.fooSubject.next();
    }

    get onFoo() {
        return this.fooSubject.asObservable();
    }
    // INTERNAL
}
