import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IAlert, User } from 'app/interfaces';
import { UserService } from '../user.service';
import { SnackBarService, roles, splitName } from 'app/utils';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss'],
})
export class UserDialogComponent implements OnInit {
    public newUser: boolean = true;
    public userForm: FormGroup;
    public alert: IAlert;
    public roles: { id: number; description: string }[] = [];
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    private _phoneRegex: RegExp;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _formBuilder: FormBuilder,
        private dialogRef: MatDialogRef<UserDialogComponent>,
        private _userService: UserService,
        private _snackBarService: SnackBarService
    ) {
        this.roles = roles;
        this._phoneRegex = new RegExp(/^[256789]\d{7}$/);
    }

    ngOnInit(): void {
        this.initForm();

        if (this?.data?.user) {
            this.newUser = false;
            this.setForm(this?.data?.user);
        }
    }

    initForm() {
        this.newUser = true;
        this.userForm = this._formBuilder.group({
            id: [],
            firstName: ['', [Validators.required]],
            lastName: ['', [Validators.required]],
            role: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]],
            direccion: ['', Validators.required],
            telefono: [
                '',
                [Validators.required, Validators.pattern(this._phoneRegex)],
            ],
            dpi: [
                '',
                [
                    Validators.required,
                    Validators.minLength(13),
                    Validators.maxLength(13),
                    Validators.pattern(/^\d{13}$/),
                ],
            ],
        });
    }

    setForm(user: User) {
        this.userForm.patchValue({
            id: user.id,
            firstName: splitName(user.DisplayName)[0],
            lastName: splitName(user.DisplayName)[1],
            role: user.Role,
            email: user.Email,
            password: '',
            dpi: user?.Dpi,
            telefono: user?.Telefono,
            direccion: user?.Direccion,
        });

        this.userForm.controls.password.clearValidators();
        this.userForm.controls.direccion.clearValidators();
    }

    createUser() {
        if (this.userForm.invalid)
            return Object.values(this.userForm.controls).forEach((c) =>
                c.markAsTouched()
            );

        this._userService
            .createUser(this.userForm.value)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res) => {
                if (res == 200) {
                    this.onCancel();
                    return this._snackBarService.open(
                        'El usuario se ha creado exitósamente'
                    );
                }

                this.onCancel();
                return this._snackBarService.open(
                    'Ha ocurrido un error al crear el usuario'
                );
            });
    }

    updateUser() {
        if (this.userForm.invalid)
            return Object.values(this.userForm.controls).forEach((c) =>
                c.markAsTouched()
            );

        const { password, ...user } = this.userForm.value;

        if (password) {
            user.password = password;
        }

        this._userService
            .updateUser(user)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res) => {
                if (res == 402) {
                    this.onCancel();
                    return this._snackBarService.open(
                        'No te puedes actualizar a ti mismo.'
                    );
                } else if (res == 200) {
                    this.onCancel();
                    return this._snackBarService.open(
                        'Se ha actualizado el usuario.'
                    );
                }

                this.onCancel();
                return this._snackBarService.open(
                    'Ha ocurrido un error al actualizar el usuario'
                );
            });
    }

    onKeyDown(event: KeyboardEvent) {
        if (event.code === 'Space') {
            event.preventDefault();
        }
    }

    onCancel() {
        this.dialogRef.close();
    }
}
