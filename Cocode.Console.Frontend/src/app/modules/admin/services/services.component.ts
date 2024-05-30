import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ServicesService } from './services.service';
import { ServicesDialogComponent } from './dialog/dialog.component';

@Component({
    selector: 'app-services',
    templateUrl: './services.component.html',
    styleUrls: ['./services.component.scss'],
})
export class ServicesComponent implements OnInit {
    constructor(
        private readonly _dialog: MatDialog,
        private readonly _service: ServicesService
    ) {}

    ngOnInit(): void {}

    public openDialog() {
        this._dialog.open(ServicesDialogComponent, {
            width: '500px',
        });
    }
}
