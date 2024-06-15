import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { fuseAnimations } from '@fuse/animations';
import { UserService } from 'app/core/user/user.service';
import { IPayment, IService } from 'app/interfaces';
import { Observable, Subject, takeUntil } from 'rxjs';
import { PaymentService } from '../payment.service';
import { transformDate } from 'app/utils';
import { PaymentDialog } from '../dialog/dialog.component';
import { User } from 'app/core/user/user.types';
import { ServicesService } from 'app/modules/admin/services/services.service';

@Component({
    selector: 'payment-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent implements OnInit, OnDestroy {
    private _unsubscribeAll: Subject<any> = new Subject();

    @ViewChild(MatPaginator) public _paginator: MatPaginator;
    @ViewChild(MatSort) public _sort: MatSort;

    public payments$: Observable<IPayment[]>;
    public payments: IPayment[] = [];
    public loading: boolean;

    // MAT PAGINATOR
    public pageSize: number = 10;
    public page: number = 1;
    public count: number = 0;
    public pages: number = 0;
    public pageSizeOptions: number[] = [10, 15, 25];

    public userId: number;
    public user: User;

    public services: Array<IService>;
    public services$: Observable<Array<IService>>;

    constructor(
        public dialog: MatDialog,
        private readonly _user: UserService,
        private readonly _payment: PaymentService,
        private readonly _services: ServicesService,
        private readonly _changeDetectorRef: ChangeDetectorRef
    ) {
        this.services = [];
    }

    ngOnInit(): void {
        this._onGetSession();
        this._getServices();
        this.onListenDialog();
        this.onChangeNeighbors();
        this.getPayments();
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    private getPayments(
        userId?: number,
        page: number = 1,
        pageSize: number = 10
    ) {
        try {
            const user: number = !userId ? parseInt(this.user?.id) : userId;

            this.loading = true;
            this._payment
                .getPayments({ page, pageSize, userId: user })
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((res) => {
                    this.payments = res.payments;
                    this.page = res.page;
                    this.count = res.total;
                    this.pages = res.pages;
                    this.loading = false;
                    this._changeDetectorRef.markForCheck();
                });

            this.payments$ = this._payment.payments$;
        } catch (error) {
            console.log(error);
        }
    }

    private _onGetSession() {
        this._user.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user) => {
                this.user = user;
            });
    }

    private onListenDialog() {
        this._payment.dialogStatus
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res) => {
                this.getPayments(this.userId, this.page, this.pageSize);
            });
    }

    private _getServices(): void {
        this._services
            .findServices({ page: 1, pageSize: 100 })
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res) => {
                this.services = res?.services;
            });

        this.services$ = this._services.services$;
    }

    public onChangeNeighbors() {
        this._payment.userId$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res) => {
                this.userId = res;
                this.getPayments(res);
            });
    }

    public convertDate(date: string): string {
        return transformDate(date);
    }

    public convertMonth(month: number): string {
        const months = this._payment.getMonths();
        return months.find((m) => m.value == month)?.description;
    }

    public openDialog(payment: IPayment) {
        this.dialog.open(PaymentDialog, {
            width: '500px',
            data: { payment },
        });
    }

    public translateService(serviceId: number): string {
        return this.services.find((s) => s.id === serviceId)?.Name || '';
    }
}
