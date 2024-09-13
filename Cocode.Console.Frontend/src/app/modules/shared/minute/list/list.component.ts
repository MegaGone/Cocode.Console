import { User } from 'app/core/user/user.types';
import { fuseAnimations } from '@fuse/animations';
import { MinuteService } from '../minute.service';
import {
    Component,
    OnInit,
    ViewEncapsulation,
    ChangeDetectorRef,
    ChangeDetectionStrategy,
    ViewChild,
} from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { IMinute } from 'app/interfaces';
import { UserService } from 'app/core/user/user.service';
import { SnackBarService, transformDate } from 'app/utils';

@Component({
    selector: 'minute-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent implements OnInit {
    @ViewChild(MatPaginator) public _paginator: MatPaginator;
    @ViewChild(MatSort) public _sort: MatSort;

    public user: User;

    public loading: boolean;
    public minutes: IMinute[] = [];
    public minutes$: Observable<IMinute[]>;

    // MAT PAGINATOR
    public page: number = 1;
    public count: number = 0;
    public pages: number = 0;
    public pageSize: number = 10;
    public pageSizeOptions: number[] = [10, 15, 25];

    private _unsubscribeAll: Subject<any>;

    constructor(
        private readonly _user: UserService,
        private readonly _minute: MinuteService,
        private readonly _snackbar: SnackBarService,
        private readonly _changeDetectorRef: ChangeDetectorRef
    ) {
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this._onGetSession();
        this._onGetMinutes();
        this._onListenDialog();
    }

    public disableMinute(id: number) {
        this._minute
            .disable(id)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res) => {
                const message: string =
                    res === 200
                        ? 'Se ha deshabilitado el acta exitósamente'
                        : 'Ha ocurrido un error al deshabilitar el acta.';

                this._onGetMinutes();
                this._snackbar.open(message);
            });
    }

    public downloadMinute(filename: string) {
        this._minute
            .download(filename)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res: Blob) => {
                const sanitizedName = filename?.replace(/.*_/, '');
                const blob = new Blob([res], { type: 'application/pdf' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = sanitizedName;
                a.click();
                window.URL.revokeObjectURL(url);
            });
    }

    public convertDate(date: string): string {
        return transformDate(date);
    }

    private _onGetSession() {
        this._user.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user) => {
                this.user = user;
                console.log(user);
            });
    }

    private _onGetMinutes(page: number = 1, pageSize: number = 10) {
        try {
            this.loading = true;

            this._minute
                .findMinutes({ page, pageSize })
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((res) => {
                    this.loading = false;
                    this.page = res.page;
                    this.count = res.total;
                    this.pages = res.pages;
                    this.minutes = res.minutes;
                    this._changeDetectorRef.markForCheck();
                });

            this.minutes$ = this._minute._minutes$;
        } catch (error) {
            console.log(error);
        }
    }

    private _onListenDialog() {
        this._minute.dialogStatus
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res) => {
                this._onGetMinutes(this.page, this.pageSize);
            });
    }
}
