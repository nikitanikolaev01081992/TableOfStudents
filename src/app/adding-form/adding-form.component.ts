import { Component, OnInit, Input, Output, OnChanges, ChangeDetectionStrategy } from "@angular/core";
import { FormGroup, FormControl, Validators, PatternValidator, AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { EventEmitter } from "@angular/core";
import { InvokeFunctionExpr } from "@angular/compiler";
import { Student } from "../model";

@Component({
    selector: "app-adding-form",
    templateUrl: "./adding-form.component.html",
    styleUrls: ["./adding-form.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddingFormComponent implements OnInit {
    formModel: FormGroup;
    validatorsForNames: ValidatorFn[];
    @Input() dataFromParent: Student;
    @Input() updateOrModify: string;
    @Output() _submit = new EventEmitter();
    @Output() _close = new EventEmitter();

    constructor() {}

    ngOnInit() {
        this.validatorsForNames = [Validators.required, Validators.pattern("[A-Za-zа-яА-я]+"), Validators.minLength(2), this.validatePersonInfo];

        this.formModel = new FormGroup({
            person: new FormGroup({
                surname: new FormControl(this.dataFromParent.surname, this.validatorsForNames),
                name: new FormControl(this.dataFromParent.name, this.validatorsForNames),
                patronymic: new FormControl(this.dataFromParent.patronymic, this.validatorsForNames),
            }),
            _dateOfBirth: new FormControl(this.dataFromParent.dateOfBirth, [Validators.required, this.validateDate]),
            avaregeGrade: new FormControl(this.dataFromParent.avaregeGrade, [Validators.required, this.validateAvaregeGrade]),
        });
    }

    _onSubmit(event: Event): void {
        let item: Student = Object.assign({}, this.dataFromParent, { updateOrModify: this.updateOrModify });
        item.surname = this.formModel.get("person.surname").value;
        item.name = this.formModel.get("person.name").value;
        item.patronymic = this.formModel.get("person.patronymic").value;
        item._dateOfBirth = new Date(this.formModel.get("_dateOfBirth").value);
        item.avaregeGrade = +this.formModel.get("avaregeGrade").value;
        this._submit.emit(item);
    }

    closeMe(): void {
        this._close.emit();
    }

    validateDate(control: AbstractControl): ValidationErrors | null {
        if (control.value !== "") {
            let dateInControl: number = new Date(control.value).getFullYear();
            let validationDate: number = new Date().getFullYear();

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
            let name: AbstractControl = control.parent.get("name");

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
        let form: FormGroup;
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
            let errors: string[] = this.getErrorMessages(control.errors);
            errorText = errors.join("\n");
        }
        return errorText;
    }

    private getErrorMessages(errors: ValidationErrors): string[] {
        let arrayErrors: string[] = [];

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

    isInvalid(control: AbstractControl) {}
}
