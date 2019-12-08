import { Component } from "@angular/core";
import { Student } from "./model";
import { ListOfStudents } from "./model";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.less"],
})
export class AppComponent {
    title = "Таблица Студентов";
    valuesToFind: string = "";
    dateValueMin: string = "";
    dateValueMax: string = "";
    gradeValueMin: string = "";
    gradeValueMax: string = "";

    someData = new ListOfStudents<Student>(Student);

    // sortColumn is value of link variable with the same name
    // sortOrder is value of link variable with the same name
    getDataItem(sortColumn: string, sortOrder: string): Array<Student> {
        const copyOfOriginal: Array<Student> = this.someData.items;

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
}
