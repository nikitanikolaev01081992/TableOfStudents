import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'Таблица Студентов';
  valuesToFind: string = "";
  dateValueMin: string = "";
  dateValueMax: string = "";
  gradeValueMin: string = "";
  gradeValueMax: string = "";

  // sortColumn is value of link variable with the same name
  // sortOrder is value of link variable with the same name
  getDataItem(sortColumn: string, sortOrder: string): Array<Student> {
    let copyOfOriginal: Array<Student> = Array.from(someData);

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

    return sortColumn && sortOrder ? copyOfOriginal.sort(compareFunction) : someData;
  }

  // filtration for date of birth and avarege grade
  // used in ngClass for 'table__row_hidden' in table
  filterItem(item: Student): boolean {
    let dateValueMin: Date = this.dateValueMin === "" ? new Date("1900-1-1") : new Date(this.dateValueMin);
    let dateValueMax: Date = this.dateValueMax === "" ? new Date() : new Date(this.dateValueMax);
    let gradeValueMin: number = this.gradeValueMin === "" ? -Infinity : +this.gradeValueMin;
    let gradeValueMax: number = this.gradeValueMax === "" ? Infinity : +this.gradeValueMax;
    let resultDateCheck: boolean = false;
    let resultGradeCheck: boolean = false;

    if (item._dateOfBirth >= dateValueMin && item._dateOfBirth <= dateValueMax ) {
        resultDateCheck = true;
    }

    if (item.avaregeGrade >= gradeValueMin && item.avaregeGrade <= gradeValueMax ) {
        resultGradeCheck = true;
    }

    return resultDateCheck && resultGradeCheck;
  }


  // delete item from data
  deleteElem(item: Student): void {
      if (confirm(`Удалить студента(ку) ${item.surname} ${item.name} ${item.patronymic} ?`)) {
        let index = someData.indexOf(item);
        index > -1 ? someData.splice(index, 1) : index;
      }
  }


}




class Student {
  surname: string;
  name: string;
  patronymic: string;
  _dateOfBirth: Date;
  avaregeGrade: number;
  isShown: boolean;

  constructor(surname, name, patronymic, dateOfBirth, avaregeGrade) {
    this.surname = surname;
    this.name = name;
    this.patronymic = patronymic;
    this._dateOfBirth = dateOfBirth;
    this.avaregeGrade = avaregeGrade;

    this.isShown = true;
  }

  // return nice date string
  get dateOfBirth(): string {
    let date = this._dateOfBirth;
    return `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`;
  }

 

}


let someData: Array<Student> = [
  new Student("Ivanov", "Ivan", "Ivanovich", new Date(1993, 1, 1), 2.5),
  new Student("Kirilov", "Kirill", "Kirillovich", new Date(1992, 4, 4), 4),
  new Student("Golovkin", "Evgeney", "Evgenievich", new Date(1992, 2, 6), 3.5),
  new Student("Golovkina", "Sveta", "Evgenievich", new Date(1993, 2, 6), 5),
  new Student("Kirilova", "Darya", "Nikitina", new Date(1992, 9, 12), 2.9)
];

