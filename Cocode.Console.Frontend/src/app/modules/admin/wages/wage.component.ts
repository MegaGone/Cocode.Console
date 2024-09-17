import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WageDialog } from './dialog/dialog.component';
import { Subject, takeUntil } from 'rxjs';
import { WageService } from './wage.service';

@Component({
    selector: 'app-wage',
    templateUrl: './wage.component.html',
    styleUrls: ['./wage.component.scss'],
})
export class WageComponent implements OnInit {
    private _unsubscribeAll: Subject<any>;

    constructor(
        private readonly _dialog: MatDialog,
        private readonly _service: WageService
    ) {
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {}

    public openDialog() {
        const dialogRef = this._dialog.open(WageDialog, {
            width: '500px',
        });

        dialogRef
            .afterClosed()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res) => this._service.listenDialog());
    }
}
