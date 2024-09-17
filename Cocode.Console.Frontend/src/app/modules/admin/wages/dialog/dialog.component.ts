import { IService } from 'app/interfaces';
import { SnackBarService } from 'app/utils';
import { WageService } from '../wage.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Component, Inject, OnInit } from '@angular/core';
import { ServicesService } from '../../services/services.service';
import { UserService } from 'app/modules/admin/users/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss'],
})
export class WageDialog implements OnInit {
    public form: FormGroup;
    private _unsubscribeAll: Subject<any>;

    public neighbors: any[];
    public services: Array<IService>;
    public neighbors$: Observable<any[]>;
    public services$: Observable<Array<IService>>;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private readonly _fb: FormBuilder,
        private readonly _user: UserService,
        private readonly _service: WageService,
        private readonly _snackbar: SnackBarService,
        private readonly _services: ServicesService,
        private readonly _dialogRef: MatDialogRef<WageDialog>
    ) {
        this.services = [];
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this._getNeighbors();
        this._getServices();
        this._initForm();
    }

    public registerWage() {
        if (this.form.invalid)
            return Object.values(this.form.controls).forEach((c) =>
                c.markAsTouched()
            );

        this._service
            .create(this.form.getRawValue())
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res) => {
                const message: string =
                    res === 200
                        ? 'Se ha registrado el jornal exitósamente.'
                        : 'Ha ocurrido un error al registrar el jornal.';

                this.onClose(res === 200);
                this._snackbar.open(message);
            });
    }

    public onClose(wasSuccess: boolean = false) {
        this._dialogRef.close(wasSuccess);
    }

    private _initForm() {
        this.form = this._fb.group({
            user: ['', Validators.required],
            amount: ['', Validators.required],
            service: ['', Validators.required],
            description: ['', Validators.required],
        });
    }

    private _getServices(): void {
        this._services
            .findServices({ page: 1, pageSize: 100 })
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res) => {
                this.services = res?.services;
                console.log(this.services);
            });

        this.services$ = this._services.services$;
    }

    private _getNeighbors() {
        this._user
            .getNeighbors()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) => {
                this.neighbors = data;
            });

        this.neighbors$ = this._user.neighbors$;
    }
}
