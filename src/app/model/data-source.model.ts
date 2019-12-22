export class ListOfStudents<T> {
    static index: number = 0;

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

    modifyElem(elem: T, key: string): void {
        for (const iterItem of this.items) {
            if (iterItem[key] === elem[key]) {
                for (const prop in elem) {
                    if (iterItem.hasOwnProperty(prop)) {
                        iterItem[prop] = elem[prop];
                    }
                }
            }
        }
    }
}

export class Student {
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
        this.index = ListOfStudents.index++;
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
