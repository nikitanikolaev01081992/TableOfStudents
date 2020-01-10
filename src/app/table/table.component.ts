import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { StudentsService } from "../directives-pipes-services/students.service";
import { IStudent } from "../student";

@Component({
    selector: "app-table",
    templateUrl: "./table.component.html",
    styleUrls: ["./table.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent implements OnInit {
    title = "Таблица Студентов";
    // someData: ListOfStudents<Student>;
    valuesToFind: string = "";
    dateValueMin: string = "";
    dateValueMax: string = "";
    gradeValueMin: string = "";
    gradeValueMax: string = "";
    students: IStudent[] = [];

    // ----------------------------------
    // data bindings for addign form
    // _showAddingForm: boolean;
    // itemForAddingForm: Student;
    updateOrModify: string;
    // ----------------------------------

    constructor(private _ref: ChangeDetectorRef, private _router: Router, private _route: ActivatedRoute, private _studentSerive: StudentsService) {
        // this.someData = new ListOfStudents<Student>(Student);
        // this._showAddingForm = false;
        // this.students= this._studentSerive.getData();
    }

    ngOnInit(): void {
        this._studentSerive.getData().subscribe(data => {
            this.students = data;
            this._ref.markForCheck();
        });
    }

    // sortColumn is value of link variable with the same name
    // sortOrder is value of link variable with the same name
    getDataItem(sortColumn: string, sortOrder: string): Array<IStudent> {
        // const copyOfOriginal: Array<Student> = Array.from(this.someData.items);
        const copyOfOriginal: Array<IStudent> = Array.from(this.students);

        function compareFunction(a: IStudent, b: IStudent): number {
            let innerSortOrder: string = sortOrder;

            // hack for date
            // with standart '>' or '<' year '1993' is bigger than '1992'
            if (a[sortColumn] instanceof Date) {
                innerSortOrder = sortOrder === "asc" ? "desc" : "asc";
            }

            if (a[sortColumn] < b[sortColumn]) {
                return innerSortOrder === "asc" ? -1 : 1;
            }
            if (a[sortColumn] > b[sortColumn]) {
                return innerSortOrder === "asc" ? 1 : -1;
            }

            return 0;
        }

        return sortColumn && sortOrder ? copyOfOriginal.sort(compareFunction) : this.students;
    }

    // filtration for date of birth and avarege grade
    // used in ngClass for 'table__row_hidden' in table
    filterItem(item: IStudent): boolean {
        const dateValueMin: Date = this.dateValueMin === "" ? new Date("1900-1-1") : new Date(this.dateValueMin);
        const dateValueMax: Date = this.dateValueMax === "" ? new Date() : new Date(this.dateValueMax);
        const gradeValueMin: number = this.gradeValueMin === "" ? 0 : +this.gradeValueMin;
        const gradeValueMax: number = this.gradeValueMax === "" ? Infinity : +this.gradeValueMax;
        let resultDateCheck: boolean = false;
        let resultGradeCheck: boolean = false;

        if (item.dateOfBirth >= dateValueMin && item.dateOfBirth <= dateValueMax) {
            resultDateCheck = true;
        }

        if (item.avaregeGrade >= gradeValueMin && item.avaregeGrade <= gradeValueMax) {
            resultGradeCheck = true;
        }

        return resultDateCheck && resultGradeCheck;
    }

    // delete item from data
    public deleteElem(id: number): void {
        this._studentSerive.getStudent(id).subscribe(student => {
            if (confirm(`Удалить студента(ку) ${student.surname} ${student.name} ${student.patronymic} ?`)) {
                this.students = this._studentSerive.deleteElement(id);
                this._ref.markForCheck();
            }
        });
    }

    // don't allow negative numbers for grade min and max
    validateInputGrade(): void {
        if (+this.gradeValueMin < 0) {
            this.gradeValueMin = "0";
        }
        if (+this.gradeValueMax < 0) {
            this.gradeValueMax = "0";
        }
    }

    // for optimization in ngFor
    getIndex(index: number, item: IStudent): number {
        return item.index;
    }

    // ------------------------------------------------------------------
    // some functions for adding form

    // received event from adding form
    // submitFromChild(item: { student: IStudent; updateOrModify: string }): void {
    //     const student = item.student;
    //     if (item.updateOrModify === "update") {
    //         this._studentSerive.createElem(student);
    //         // this.students.push(new Student(student));
    //     } else if (item.updateOrModify === "modify") {
    //         // modify existed student
    //         this._studentSerive.modifyElem(student, "index");
    //     }
    //     // this._showAddingForm = false;
    //     this._ref.detectChanges();
    // }

    // handler to navigate to adding form
    showAddingForm(item?: IStudent): void {
        // this._showAddingForm = true;
        // this.updateOrModify = updateOrModify;

        // this.itemForAddingForm = item ? item : new Student("", "", "", undefined, undefined);

        if (item) {
            this._router.navigate(["edit", item.index], { relativeTo: this._route });
        } else {
            this._router.navigate(["create"], { relativeTo: this._route });
        }
    }

    // recieved event to close adding form
    // closeChild(): void {
    //     // this._showAddingForm = false;
    // }

    // ------------------------------------------------------------------

    gotoNotFoundPage(): void {
        this._router.navigate(["/PageNotFound"]);
    }
}
