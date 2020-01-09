export interface IStudent {
    surname: string;
    name: string;
    patronymic: string;
    dateOfBirth: Date;
    avaregeGrade: number;
    index: number;

    getFormatedDate?(): string;
}
