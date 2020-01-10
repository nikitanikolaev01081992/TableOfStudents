import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { StudentsService } from "./directives-pipes-services/students.service";
import { IStudent } from "./student";

@Injectable({
    providedIn: "root",
})
export class PreventChangesGuard implements CanActivateChild {
    currentStudent: IStudent;

    constructor(private studentService: StudentsService, private _router: Router) {}

    canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        if (next.url[0].path === "edit") {
            return this.checkStudentGrade(next);
        }
        return true;
    }

    checkStudentGrade(next: ActivatedRouteSnapshot): Observable<boolean> {
        const id = +next.url[1].path;
        return new Observable(observer => {
            this.studentService.getStudent(id).subscribe(item => {
                if (item && item.avaregeGrade === 5) {
                    observer.next(false);
                    this._router.navigate(["/students"]);
                } else {
                    observer.next(true);
                }
            });
        });
    }
}
