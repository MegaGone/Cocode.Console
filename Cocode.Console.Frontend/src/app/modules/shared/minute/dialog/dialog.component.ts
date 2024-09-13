import { Subject, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MinuteService } from '../minute.service';
import { SnackBarService } from 'app/utils';

@Component({
    selector: 'app-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss'],
})
export class MinuteDialog implements OnInit {
    public form: FormGroup;
    public invalidSize: boolean = false;
    public base64Image: string | undefined;
    public selectedFile: { fileRaw: File; filename: string };
    public invalidExtention: boolean = false;

    private _unsubscribeAll: Subject<any>;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private readonly _fb: FormBuilder,
        private readonly _dialogRef: MatDialogRef<MinuteDialog>,
        private readonly _service: MinuteService,
        private readonly _snackbar: SnackBarService
    ) {
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this.initForm();
    }

    public initForm() {
        this.form = this._fb.group({
            description: ['', Validators.required],
        });
    }

    public uploadMinute() {
        if (this.form.invalid)
            return Object.values(this.form.controls).forEach((c) =>
                c.markAsTouched()
            );

        const { description } = this.form.getRawValue();

        const body = new FormData();
        body.append('description', description);
        body.append(
            'evidence',
            this.selectedFile.fileRaw,
            this.selectedFile.filename
        );

        this._service
            .create(body)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res) => {
                const message: string =
                    res === 200
                        ? 'Se ha cargado el acta exitósamente.'
                        : 'Ha ocurrido un error al cargar el acta.';

                this.onClose(res === 200);
                this._snackbar.open(message);
            });
    }

    public onFileSelected(event: any): void {
        this.selectedFile = null;
        if (event.target.files && event.target.files[0]) {
            const max_size = 2000000;
            const allowed_types = ['application/pdf'];
            const file = event.target.files[0];

            if (file?.size > max_size) {
                this.invalidSize = true;
                return;
            }

            if (!allowed_types.includes(file?.type)) {
                this.invalidExtention = true;
                return;
            }

            this.selectedFile = {
                fileRaw: file,
                filename: file?.name,
            };
        }
    }

    public onClose(wasSuccess: boolean = false) {
        this._dialogRef.close(wasSuccess);
    }
}
