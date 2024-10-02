import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit {
    constructor(private readonly _router: Router) {}

    ngOnInit(): void {}

    public navigateTo(section: string) {
        if (section === 'home') return this._router.navigateByUrl('home');

        this._router.navigateByUrl('home#' + section);
    }
}
