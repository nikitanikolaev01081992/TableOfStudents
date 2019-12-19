import { Component, ChangeDetectionStrategy } from "@angular/core";
import { Student } from "./model";
import { ListOfStudents } from "./model";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
    title = "Таблица Студентов";
    someData: ListOfStudents<Student>;
    valuesToFind: string = "";
    dateValueMin: string = "";
    dateValueMax: string = "";
    gradeValueMin: string = "";
    gradeValueMax: string = "";

    //----------------------------------
    //data bindings for addign form
    _showAddingForm: boolean;
    itemForAddingForm: Student;
    updateOrModify: string;
    //----------------------------------

    constructor() {
        this.someData = new ListOfStudents<Student>(Student);
        this._showAddingForm = false;
    }

    // sortColumn is value of link variable with the same name
    // sortOrder is value of link variable with the same name
    getDataItem(sortColumn: string, sortOrder: string): Array<Student> {
        const copyOfOriginal: Array<Student> = Array.from(this.someData.items);

        function compareFunction(a: Student, b: Student): number {
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

        return sortColumn && sortOrder ? copyOfOriginal.sort(compareFunction) : this.someData.items;
    }

    // filtration for date of birth and avarege grade
    // used in ngClass for 'table__row_hidden' in table
    filterItem(item: Student): boolean {
        const dateValueMin: Date = this.dateValueMin === "" ? new Date("1900-1-1") : new Date(this.dateValueMin);
        const dateValueMax: Date = this.dateValueMax === "" ? new Date() : new Date(this.dateValueMax);
        const gradeValueMin: number = this.gradeValueMin === "" ? 0 : +this.gradeValueMin;
        const gradeValueMax: number = this.gradeValueMax === "" ? Infinity : +this.gradeValueMax;
        let resultDateCheck: boolean = false;
        let resultGradeCheck: boolean = false;

        if (item._dateOfBirth >= dateValueMin && item._dateOfBirth <= dateValueMax) {
            resultDateCheck = true;
        }

        if (item.avaregeGrade >= gradeValueMin && item.avaregeGrade <= gradeValueMax) {
            resultGradeCheck = true;
        }

        return resultDateCheck && resultGradeCheck;
    }

    // delete item from data
    deleteElem(item: Student): void {
        if (confirm(`Удалить студента(ку) ${item.surname} ${item.name} ${item.patronymic} ?`)) {
            this.someData.deleteElement(item);
        }
    }

    //don't allow negative numbers for grade min and max
    validateInputGrade(): void {
        if (+this.gradeValueMin < 0) {
            this.gradeValueMin = "0";
        }
        if (+this.gradeValueMax < 0) {
            this.gradeValueMax = "0";
        }
    }

    // for optimization in ngFor
    getIndex(index: number, item: Student): number {
        return item.index;
    }

    //------------------------------------------------------------------
    //some functions for adding form

    // received event from adding form
    submitFromChild(item: any): void {
        if (item.updateOrModify === "update") {
            this.someData.items.push(new Student(item.surname, item.name, item.patronymic, item._dateOfBirth, item.avaregeGrade));
        } else if (item.updateOrModify === "modify") {
            //find and modify existed student
            for (let student of this.someData.items) {
                if (student.index === item.index) {
                    for (let prop in student) {
                        if (student.hasOwnProperty(prop)) {
                            student[prop] = item[prop];
                        }
                    }
                }
            }
        }
        this._showAddingForm = false;
    }

    // handler to show adding form and initialize info for adding form
    showAddingForm(updateOrModify: string, item?: Student): void {
        this._showAddingForm = true;
        this.updateOrModify = updateOrModify;

        if (item) {
            this.itemForAddingForm = item;
        } else {
            this.itemForAddingForm = new Student("", "", "", undefined, undefined);
        }
    }

    // recieved event to close adding form
    closeChild(): void {
        this._showAddingForm = false;
    }

    //------------------------------------------------------------------
}
