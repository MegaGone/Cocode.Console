import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ServicesService } from 'app/modules/admin/services/services.service';
import { UserService as SessionService } from 'app/core/user/user.service';
import { UserService } from 'app/modules/admin/users/user.service';
import { SnackBarService, transformDate } from 'app/utils';
import { Observable, Subject, takeUntil } from 'rxjs';
import { PaymentService } from './payment.service';
import { User } from 'app/core/user/user.types';
import { MatSelectChange } from '@angular/material/select';
import { PaymentDialog } from './dialog/dialog.component';
import { IPayment, IService } from 'app/interfaces';
import * as XLSX from 'xlsx';

@Component({
    selector: 'app-payment',
    templateUrl: './payment.component.html',
})
export class PaymentComponent implements OnInit, OnDestroy {
    public neighbors$: Observable<any[]>;
    public neighbors: any[];

    public searchInputControl: FormControl;

    private _unsubscribeAll: Subject<null>;
    public user: User;

    public payments: Array<IPayment>;
    public services: Array<IService>;
    public services$: Observable<Array<IService>>;

    constructor(
        private readonly _user: UserService,
        private readonly _dialog: MatDialog,
        private readonly _session: SessionService,
        private readonly _payments: PaymentService,
        private readonly _snackbar: SnackBarService,
        private readonly _services: ServicesService
    ) {
        this.services = [];
        this.payments = [];
        this._unsubscribeAll = new Subject();
        this.searchInputControl = new FormControl();
    }

    ngOnInit(): void {
        this.onValidateRole();
        this._onChangeSelection();
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    public onValidateRole() {
        this._session.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user) => {
                this.user = user;

                if (user?.role !== 1) return;

                this.onGetNeighbor();
            });
    }

    public async onGetNeighbor() {
        if (this.user.role !== 1) return;

        this._getServices();

        this._user
            .getNeighbors()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) => {
                this.neighbors = data;
                this.searchInputControl.setValue(data[0]?.id);
            });

        this.neighbors$ = this._user.neighbors$;
    }

    public onExportData() {
        if (!this.payments.length) {
            return this._snackbar.open(
                'No existen datos para este usuario a exportar.'
            );
        }

        const payments = this.payments?.map(
            ({ id, userId, photo, ...payment }) => {
                return {
                    monto: payment?.amount,
                    descripcion: payment?.description,
                    fecha: this._convertDate(payment?.payedAt),
                    mes: this._convertMonth(parseInt(payment?.month)),
                    servicio: this._translateService(payment?.serviceId),
                };
            }
        );

        const fileName: string = `${this.user?.name?.replace(
            ' ',
            ''
        )}${this._getHexadecimalDate()}.xlsx`;

        const ws = XLSX.utils.json_to_sheet(payments);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Placeholder');
        XLSX.writeFile(wb, fileName);
    }

    public onOptionSelection($event: MatSelectChange) {
        this._payments.userId.next($event.value);
    }

    public openDialog() {
        const dialogRef = this._dialog.open(PaymentDialog, {
            width: '500px',
        });

        dialogRef
            .afterClosed()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res) => this._payments.listenDialog());
    }

    private _onChangeSelection() {
        this._payments.payments$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res) => {
                this.payments = res;
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

    private _convertDate(date: string): string {
        return transformDate(date);
    }

    private _convertMonth(month: number): string {
        const months = this._payments.getMonths();
        return months.find((m) => m.value == month)?.description;
    }

    private _translateService(serviceId: number): string {
        return this.services.find((s) => s.id === serviceId)?.Name || '';
    }

    private _getHexadecimalDate(): string {
        const timestamp = Date.now();
        const uniqueHex = timestamp.toString(16);
        return uniqueHex;
    }
}
