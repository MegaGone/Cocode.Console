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
    public optionSelected: any;

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
        this._getServices();
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
        this._user
            .getNeighbors()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) => {
                this.neighbors = data;
                this.searchInputControl.setValue(data[0]?.id);
                this.optionSelected = data[0];
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
                    Monto: payment?.amount,
                    Descripcion: payment?.description,
                    Fecha: this._convertDate(payment?.payedAt),
                    Mes: this._convertMonth(parseInt(payment?.month)),
                    Servicio: this._translateService(payment?.serviceId),
                    Estado: this._translateState(payment?.state),
                };
            }
        );

        const total = this.payments?.reduce(
            (acc, payment) =>
                acc + ((payment.state == 2 ? payment.amount : 0) || 0),
            0
        );

        const baseName: string = !this.optionSelected?.DisplayName
            ? this.user?.name
            : this.optionSelected?.DisplayName;
        const baseDpi: string = !this.optionSelected?.Dpi
            ? this.user?.dpi
            : this.optionSelected?.Dpi;
        const baseAddress: string = !this.optionSelected?.Direccion
            ? this.user?.direccion
            : this.optionSelected?.Direccion;
        const basePhone: string = !this.optionSelected?.Telefono
            ? this.user?.telefono
            : this.optionSelected?.Telefono;

        const fileName: string = `${baseName?.replace(
            ' ',
            '_'
        )}_${this._getHexadecimalDate()}.xlsx`;

        const ws = XLSX.utils.aoa_to_sheet([]);

        XLSX.utils.sheet_add_aoa(ws, [['Usuario: ' + baseName]], {
            origin: 'A1',
        });
        XLSX.utils.sheet_add_aoa(
            ws,
            [['Documento Personal de Identificación : ' + baseDpi]],
            {
                origin: 'A2',
            }
        );
        XLSX.utils.sheet_add_aoa(ws, [['Dirección: ' + baseAddress]], {
            origin: 'A3',
        });
        XLSX.utils.sheet_add_aoa(ws, [['Telefono: ' + basePhone]], {
            origin: 'A4',
        });
        XLSX.utils.sheet_add_aoa(
            ws,
            [['Subotal (Aprobados y pendientes): Q' + total]],
            {
                origin: 'A5',
            }
        );

        XLSX.utils.sheet_add_aoa(ws, [[]], { origin: -1 });
        XLSX.utils.sheet_add_json(ws, payments, { origin: -1 });

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'COCODE CUILCO');
        XLSX.writeFile(wb, fileName);
    }

    public onOptionSelection($event: MatSelectChange) {
        this.optionSelected = this.neighbors.find((n) => n.id == $event.value);
        this._payments.userId.next($event.value);
    }

    public openDialog() {
        const dialogRef = this._dialog.open(PaymentDialog, {
            width: '500px',
            data: { user: this.optionSelected },
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

    private _translateState(state: number): string {
        switch (state) {
            case 2:
                return 'Aprobado';
            case 3:
                return 'Rechazado';
            case 4:
                return 'Anulado';
            default:
                return 'Pendiente';
        }
    }

    private _getHexadecimalDate(): string {
        const timestamp = Date.now();
        const uniqueHex = timestamp.toString(16);
        return uniqueHex;
    }
}
