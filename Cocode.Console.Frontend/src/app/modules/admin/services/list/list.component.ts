import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { IService } from 'app/interfaces';
import { Observable, Subject, map, merge, switchMap, takeUntil } from 'rxjs';
import { ServicesService } from '../services.service';
import { MatDialog } from '@angular/material/dialog';
import { ServicesDialogComponent } from '../dialog/dialog.component';

@Component({
    selector: 'services-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit, AfterViewInit, OnDestroy {
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    @ViewChild(MatPaginator) public paginator: MatPaginator;
    @ViewChild(MatSort) public sort: MatSort;

    public services$: Observable<Array<IService>>;
    public services: Array<IService>;
    public loading: boolean;

    public pageSize: number = 10;
    public page: number = 1;
    public count: number = 0;
    public pages: number = 0;
    public pageSizeOptions: number[] = [10, 15, 25];

    constructor(
        private readonly _dialog: MatDialog,
        private readonly _cdr: ChangeDetectorRef,
        private readonly _service: ServicesService
    ) {
        this.services = [];
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this._getServices();
        this._onListenDialog();
    }

    ngAfterViewInit(): void {
        if (this.sort && this.paginator) {
            this.sort.sort({
                id: 'id',
                start: 'asc',
                disableClear: true,
            });

            this._cdr.markForCheck();

            merge(this.sort.sortChange, this.paginator.page)
                .pipe(
                    switchMap(() => {
                        this.loading = true;
                        this.pageSize = this.paginator.pageSize;

                        return this._service.findServices({
                            page: this.paginator.pageIndex + 1,
                            pageSize: this.paginator.pageSize,
                        });
                    }),
                    map(() => (this.loading = false))
                )
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe();
        }
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    public openDialog(service: IService) {
        const dialogRef = this._dialog.open(ServicesDialogComponent, {
            width: '500px',
            data: service,
        });

        dialogRef
            .afterClosed()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result) => {
                this._getServices();
            });
    }

    private _getServices(page: number = 1, pageSize: number = 10): void {
        this.loading = true;
        this._service
            .findServices({ page, pageSize })
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res) => {
                this.page = res.page;
                this.loading = false;
                this.count = res.total;
                this.pages = res.pages;
                this.services = res?.services;
                this._cdr.markForCheck();
            });

        this.services$ = this._service.services$;
    }

    private _onListenDialog() {
        this._service.onDialog
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res) => {
                this._getServices();
            });
    }
}
