import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ChangeDetectorRef } from "@angular/core";
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";

import { StudentsService } from "src/app/directives-pipes-services/students.service";
import { IStudent } from "src/app/student";

@Component({
    selector: "app-adding-form",
    templateUrl: "./adding-form.component.html",
    styleUrls: ["./adding-form.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddingFormComponent implements OnInit {
    studentId: number;
    dataOfStudent: IStudent;
    isEditMode: boolean;

    formModel: FormGroup;
    validatorsForNames: ValidatorFn[];
    // @Input() dataOfStudent: Student;
    // @Input() updateOrModify: string;
    // @Output() _submit: EventEmitter<object> = new EventEmitter();
    // @Output() _close: EventEmitter<void> = new EventEmitter();

    constructor(private _ref: ChangeDetectorRef, private _router: Router, private _route: ActivatedRoute, private _studentSerive: StudentsService) {}

    ngOnInit(): void {
        //create validators for names
        this.validatorsForNames = [Validators.required, Validators.pattern("[A-Za-zа-яА-я]+"), Validators.minLength(2), this.validatePersonInfo];

        //create objects of forms
        this.formModel = new FormGroup({
            person: new FormGroup({
                surname: new FormControl("", this.validatorsForNames),
                name: new FormControl("", this.validatorsForNames),
                patronymic: new FormControl("", this.validatorsForNames),
            }),
            dateOfBirth: new FormControl("", [Validators.required, this.validateDate]),
            avaregeGrade: new FormControl("", [Validators.required, this.validateAvaregeGrade]),
        });

        //get id of student
        this._route.paramMap.subscribe(params => {
            this.studentId = params.get("id") ? +params.get("id") : null;

            if (this.studentId !== null) {
                this.isEditMode = true;
            } else {
                this.isEditMode = false;
            }

            console.log("ID is " + this.studentId);
        });

        //get data for specific student
        this._studentSerive.getStudent(this.studentId).subscribe(data => {
            this.dataOfStudent = data;

            if (this.dataOfStudent) {
                this.formModel.setValue({
                    person: {
                        surname: this.dataOfStudent.surname,
                        name: this.dataOfStudent.name,
                        patronymic: this.dataOfStudent.patronymic,
                    },
                    dateOfBirth: this.dataOfStudent.dateOfBirth,
                    avaregeGrade: this.dataOfStudent.avaregeGrade,
                });
            }
        });
    }

    _onSubmit(event: Event): void {
        const item: IStudent = Object.assign({}, this.dataOfStudent);
        item.surname = this.formModel.get("person.surname").value;
        item.name = this.formModel.get("person.name").value;
        item.patronymic = this.formModel.get("person.patronymic").value;
        item.dateOfBirth = new Date(this.formModel.get("dateOfBirth").value);
        item.avaregeGrade = +this.formModel.get("avaregeGrade").value;

        // const outPutItem = {
        //     student: item,
        //     // updateOrModify: this.updateOrModify,
        // };

        // this._submit.emit(outPutItem);
        if (this.isEditMode) {
            this.navigateBack("edit", item, this.studentId);
        } else {
            this.navigateBack("create", item);
        }
    }

    navigateBack(mode: string, item?: IStudent, id?: number): void {
        let routeToNavigate: string;

        if (this.isEditMode) {
            //we are in edit mode, url looks like edit/0
            routeToNavigate = "../../";
        } else {
            routeToNavigate = "../";
        }

        switch (mode) {
            case "edit":
                this._studentSerive.modifyElem(item, id);
                break;

            case "create":
                this._studentSerive.createElem(item);
                break;
        }

        this._ref.detectChanges();
        this._router.navigate([routeToNavigate], { relativeTo: this._route });
    }

    validateDate(control: AbstractControl): ValidationErrors | null {
        if (control.value !== "") {
            const dateInControl: number = new Date(control.value).getFullYear();
            const validationDate: number = new Date().getFullYear();

            // not very exact way but let it be for now
            if (validationDate - dateInControl < 10) {
                return { ["wrongAge"]: true };
            }
        }

        return null;
    }

    validateAvaregeGrade(control: AbstractControl): ValidationErrors | null {
        if (+control.value < 0 || +control.value > 5) {
            return { ["wrongAvaregeGrade"]: true };
        }
    }

    validatePersonInfo(control: AbstractControl): ValidationErrors | null {
        if (control.parent) {
            const name: AbstractControl = control.parent.get("name");

            if (name !== control && control.value !== "") {
                if (name.value.toLowerCase() === control.value.toLowerCase()) {
                    return { ["wrongName"]: true };
                }
            } else if (name === control) {
                control.parent.get("surname").updateValueAndValidity();
                control.parent.get("patronymic").updateValueAndValidity();
            }
        }

        return null;
    }

    getErrorText(controlName: string): string {
        let errorText: string = "";
        let control: AbstractControl;

        switch (controlName) {
            case "surname":
            case "name":
            case "patronymic":
                control = this.formModel.controls.person.get(controlName);
                break;

            default:
                control = this.formModel.controls[controlName];
        }

        if (control && control.invalid && control.touched) {
            const errors: string[] = this.getErrorMessages(control.errors);
            errorText = errors.join("\n");
        }
        return errorText;
    }

    private getErrorMessages(errors: ValidationErrors): string[] {
        const arrayErrors: string[] = [];

        if (errors) {
            if (errors.minlength) {
                arrayErrors.push("Требуется минимум 2 символа");
            }
            if (errors.required) {
                arrayErrors.push("Заполните поле");
            }
            if (errors.pattern) {
                arrayErrors.push("Неподходящее значение");
            }
            if (errors.wrongAge) {
                arrayErrors.push("Неверный возраст");
            }
            if (errors.wrongName) {
                arrayErrors.push("Поле не должно совпадать с именем");
            }
            if (errors.wrongAvaregeGrade) {
                arrayErrors.push("Средний балл должен быть от 0 до 5");
            }
        }

        return arrayErrors;
    }
}
