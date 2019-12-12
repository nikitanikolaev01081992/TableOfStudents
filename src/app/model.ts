export class ListOfStudents<T> {
    items: Array<T>;
    constructor(usedClass) {
        this.items = [
            new usedClass("Ivanov", "Ivan", "Ivanovich", new Date(1993, 1, 1), 2.5),
            new usedClass("Kirilov", "Kirill", "Kirillovich", new Date(1992, 4, 4), 4),
            new usedClass("Golovkin", "Evgeney", "Evgenievich", new Date(1992, 2, 6), 3.5),
            new usedClass("Golovkina", "Sveta", "Evgenievich", new Date(1993, 2, 6), 5),
            new usedClass("Kirilova", "Darya", "Nikitina", new Date(1992, 9, 12), 2.9),
        ];
    }

    public deleteElement(item: T): void {
        const index = this.items.indexOf(item);
        if (index > -1) {
            this.items.splice(index, 1);
        }
    }

    static index: number = 0;
}

export class Student {
    surname: string;
    name: string;
    patronymic: string;
    _dateOfBirth: Date;
    avaregeGrade: number;
    isShown: boolean;
    index: number;

    constructor(surname: string, name: string, patronymic: string, dateOfBirth: Date, avaregeGrade: number) {
        this.surname = surname;
        this.name = name;
        this.patronymic = patronymic;
        this._dateOfBirth = dateOfBirth;
        this.avaregeGrade = avaregeGrade;

        this.isShown = true;
        this.index = ListOfStudents.index++;
    }

    // return nice date string
    get dateOfBirth(): string {
        const date = this._dateOfBirth;
        return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    }
}
