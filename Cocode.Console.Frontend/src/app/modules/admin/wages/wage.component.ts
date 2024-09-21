import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WageDialog } from './dialog/dialog.component';
import { Subject, takeUntil } from 'rxjs';
import { WageService } from './wage.service';
import { SnackBarService, transformDate } from 'app/utils';
import * as XLSX from 'xlsx';

@Component({
    selector: 'app-wage',
    templateUrl: './wage.component.html',
    styleUrls: ['./wage.component.scss'],
})
export class WageComponent implements OnInit, OnDestroy {
    private _unsubscribeAll: Subject<any>;

    constructor(
        private readonly _dialog: MatDialog,
        private readonly _service: WageService,
        private readonly _snackbar: SnackBarService
    ) {
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {}

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    public openDialog() {
        const dialogRef = this._dialog.open(WageDialog, {
            width: '500px',
        });

        dialogRef
            .afterClosed()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res) => this._service.listenDialog());
    }

    public async onExportData() {
        const wages = await this._service.findAll();

        if (!wages) {
            return this._snackbar.open('No existen jornales para exportar.');
        }

        const sanitizedWages = wages?.map(({ Id, ...wage }) => {
            return {
                Usuario: wage?.User,
                Servicio: wage?.Service,
                Monto: `Q ${wage?.Amount}`,
                Descripción: wage?.Description,
                Estado: this._translateState(wage?.Status),
                Fecha: this._convertDate(wage?.CreatedAt),
            };
        });

        const filename: string = `${this._getHexadecimalDate()}.xlsx`;

        const ws = XLSX.utils.aoa_to_sheet([]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.sheet_add_json(ws, sanitizedWages);

        XLSX.utils.book_append_sheet(wb, ws, 'COCODE CUILCO - Jornales');
        XLSX.writeFile(wb, filename);
    }

    private _convertDate(date: string): string {
        return transformDate(date);
    }

    private _translateState(state: number): string {
        switch (state) {
            case 3:
                return 'Denegado';
            case 2:
                return 'Pagado';
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
