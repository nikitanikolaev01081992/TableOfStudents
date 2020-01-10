import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { IStudent } from "../student";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class StudentsService {
    private _url = "../../assets/students.json";
    static index: number = 0;

    private items: IStudent[] = [];
    observervableForData: Observable<IStudent[]>;

    constructor(private isDebug: boolean, private _http: HttpClient) {
        this.observervableForData = new Observable((observer) => {
            if (this.items.length !== 0) {
                observer.next(this.items);
            } else if (this.isDebug) {
                this.items = [
                    new Student("Ivanov", "Ivan", "Ivanovich", new Date("1993, 1, 1"), 2.5),
                    new Student("Kirilov", "Kirill", "Kirillovich", new Date("1992, 4, 4"), 4),
                    new Student("Golovkin", "Evgeney", "Evgenievich", new Date("1992, 2, 6"), 3.5),
                    new Student("Golovkina", "Sveta", "Evgenievich", new Date("1993, 2, 6"), 5),
                    new Student("Kirilova", "Darya", "Nikitina", new Date("1992, 9, 12"), 2.9),
                ];
                observer.next(this.items);
            } else {

                this._http.get<IStudent[]>(this._url).subscribe(data => {
                    for (let key in data) {
                        this.createElem(data[key]);
                    }
                    observer.next(this.items);
                });
            }
        })
        
    }

    // public getData(): Observable<IStudent[]> {
    public getData(): Observable<IStudent[]> {
        return this.observervableForData;
    }

    public getStudent(id: number): Observable<IStudent> {
        return new Observable(observer => {
            let items: IStudent[] = this.items.filter(item => {
                return item.index === id;
            });
            observer.next(items[0]);
        });
    }

    public createElem(item: IStudent) {
        this.items.push(new Student(item.surname, item.name, item.patronymic, new Date(item.dateOfBirth), item.avaregeGrade));
    }

    public deleteElement(id: number): IStudent[] {
        let items: IStudent[] = this.items.filter(item => {
            return item.index !== id;
        });

        this.items = items;
        return this.items;
    }

    public modifyElem(elem: IStudent, id: number): void {
        this.getStudent(id).subscribe(student => {
            for (const prop in student) {
                if (student.hasOwnProperty(prop)) {
                    student[prop] = elem[prop];
                }
            }
        });
    }
}

export class Student implements IStudent {
    surname: string;
    name: string;
    patronymic: string;
    dateOfBirth: Date;
    avaregeGrade: number;
    isShown: boolean;
    index: number;

    constructor(surname: string, name: string, patronymic: string, dateOfBirth: Date, avaregeGrade: number) {
        this.surname = surname;
        this.name = name;
        this.patronymic = patronymic;
        this.dateOfBirth = dateOfBirth;
        this.avaregeGrade = avaregeGrade;

        this.isShown = true;
        this.index = StudentsService.index++;
    }

    getFormatedDate(): string {
        const date: Date = this.dateOfBirth;

        if (date) {
            const dateMonth: string = date.getMonth() < 9 ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`;
            const dateDay: string = date.getDate() < 9 ? `0${date.getDate()}` : `${date.getDate()}`;
            return `${date.getFullYear()}-${dateMonth}-${dateDay}`;
        }

        return "";
    }
}
