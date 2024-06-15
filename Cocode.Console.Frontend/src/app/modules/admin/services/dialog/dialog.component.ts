import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ServicesService } from '../services.service';
import { SnackBarService } from 'app/utils';
import { Subject, takeUntil } from 'rxjs';
import { IService } from 'app/interfaces';

@Component({
    selector: 'app-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss'],
})
export class ServicesDialogComponent implements OnInit {
    public form: FormGroup;
    public newService: boolean;
    private _unsubscribeAll: Subject<any>;
    public statuses: { id: number; description: string; enabled: boolean }[];

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private readonly _fb: FormBuilder,
        private readonly _service: ServicesService,
        private readonly _snackbar: SnackBarService,
        private readonly _dialog: MatDialogRef<ServicesDialogComponent>
    ) {
        this.newService = true;
        this._unsubscribeAll = new Subject<any>();

        this.statuses = [
            {
                id: 0,
                enabled: false,
                description: 'Inhabilitado',
            },
            {
                id: 1,
                enabled: true,
                description: 'Habilitado',
            },
        ];
    }

    ngOnInit(): void {
        this._initForm();
        this._onSetService();
    }

    private _initForm() {
        this.form = this._fb.group({
            id: [''],
            enabled: [],
            createdAt: [''],
            name: ['', [Validators.required]],
        });
    }

    private _setForm(service: Partial<IService>) {
        this.form.patchValue({
            id: service.id,
            name: service.Name,
            enabled: service.IsEnabled,
            createdAt: service.CreatedAt,
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
                let message: string =
                    'Ha ocurrido un error al crear el servicio.';

                res === 400
                    ? (message = 'Ya existe un servicio con ese nombre.')
                    : (message = 'Se ha creado el servicio de manera correcta');

                this._snackbar.open(message);
                if (res !== 400) this.onCancel();
            });
    }

    public onUpdateService() {
        if (this.form.invalid) {
            return Object.values(this.form.controls).forEach((c) =>
                c.markAsTouched()
            );
        }

        this._service
            .updateService(this.form.value)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((statusCode) => {
                let message: string =
                    statusCode == 200
                        ? 'Se ha actualizado el servicio de manera correcta'
                        : 'Ha ocurrido un error al actualizar el servicio.';

                this._snackbar.open(message);
                this.onCancel();
            });
    }

    public onKeyDown(event: KeyboardEvent): void {
        const inputElement = event.target as HTMLInputElement;
        const value = inputElement.value;

        if (event.code === 'Space' && value.endsWith(' '))
            event.preventDefault();
    }

    public onCancel(): void {
        return this._dialog.close();
    }

    private _onSetService(): void {
        if (this?.data) {
            this.newService = false;
            this._setForm(this?.data);
        }
    }
}
