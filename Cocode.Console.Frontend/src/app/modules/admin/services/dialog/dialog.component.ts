import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ServicesService } from '../services.service';
import { SnackBarService } from 'app/utils';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss'],
})
export class ServicesDialogComponent implements OnInit {
    public form: FormGroup;
    private _unsubscribeAll: Subject<any>;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private readonly _fb: FormBuilder,
        private readonly _service: ServicesService,
        private readonly _snackbar: SnackBarService,
        private readonly _dialog: MatDialogRef<ServicesDialogComponent>
    ) {
        this._unsubscribeAll = new Subject<any>();
    }

    ngOnInit(): void {
        this._initForm();
    }

    private _initForm() {
        this.form = this._fb.group({
            id: [''],
            name: ['', [Validators.required]],
            createdAt: [''],
        });
    }

    public onCreateService() {
        if (this.form.invalid) {
            return Object.values(this.form.controls).forEach((c) =>
                c.markAsTouched()
            );
        }

        this._service
            .createService(this.form.value)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res) => {
                console.log(res);
            });
    }

    public onKeyDown(event: KeyboardEvent): void {
        if (event.code === 'Space') return event.preventDefault();
    }

    public onCancel(): void {
        return this._dialog.close();
    }
}
