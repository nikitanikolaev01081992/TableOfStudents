import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
    selector: "app-page-not-found",
    templateUrl: "./page-not-found.component.html",
    styleUrls: ["./page-not-found.component.less"],
})
export class PageNotFoundComponent implements OnInit {
    constructor(private _router: Router, private _route: ActivatedRoute) {}

    ngOnInit() {}

    navigateBack() {
        this._router.navigate(["../"], { relativeTo: this._route });
    }
}
