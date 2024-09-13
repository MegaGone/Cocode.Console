import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { Subject, takeUntil } from 'rxjs';
import { MinuteDialog } from './dialog/dialog.component';
import { MinuteService } from './minute.service';

@Component({
    selector: 'app-minute',
    templateUrl: './minute.component.html',
    styleUrls: ['./minute.component.scss'],
})
export class MinuteComponent implements OnInit, OnDestroy {
    public user: User;

    private _unsubscribeAll: Subject<any> = new Subject();
    constructor(
        private readonly _user: UserService,
        private readonly _dialog: MatDialog,
        private readonly _minute: MinuteService
    ) {}

    ngOnInit(): void {
        this._onGetSession();
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    public openDialog() {
        const dialogRef = this._dialog.open(MinuteDialog, {
            width: '500px',
        });

        dialogRef
            .afterClosed()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res) => this._minute.listenDialog());
    }

    private _onGetSession() {
        this._user.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user) => {
                this.user = user;
            });
    }
}
