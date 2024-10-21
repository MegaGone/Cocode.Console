import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserDialogComponent } from './dialog/dialog.component';
import { UserService } from './user.service';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
    constructor(public dialog: MatDialog, private _userService: UserService) {}

    ngOnInit(): void {}

    openDialog() {
        const dialogRef = this.dialog.open(UserDialogComponent, {
            width: '500px',
            maxHeight: '650px',
        });

        dialogRef.afterClosed().subscribe((res) => this._userService.foo());
    }
}
