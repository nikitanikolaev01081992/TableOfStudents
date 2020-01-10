import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
    selector: "app-page-not-found",
    templateUrl: "./page-not-found.component.html",
    styleUrls: ["./page-not-found.component.less"],
})
export class PageNotFoundComponent {
    constructor(private _router: Router, private _route: ActivatedRoute) {}

    navigateBack(): void {
        this._router.navigate(["../"], { relativeTo: this._route });
    }
}
