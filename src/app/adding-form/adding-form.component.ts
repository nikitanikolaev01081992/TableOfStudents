import { Component, OnInit, Input, Output, OnChanges } from "@angular/core";
import { FormGroup, FormControl, Validators, PatternValidator, AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { EventEmitter } from "@angular/core";

@Component({
    selector: "app-adding-form",
    templateUrl: "./adding-form.component.html",
    styleUrls: ["./adding-form.component.less"],
})
export class AddingFormComponent implements OnInit {
    formModel: FormGroup;
    validatorsForNames: ValidatorFn[] = [Validators.required, Validators.pattern("[A-Za-zа-яА-я]+"), Validators.minLength(2)];

    constructor() {}

    ngOnInit() {
        this.formModel = new FormGroup({
            person: new FormGroup({
                surname: new FormControl("", this.validatorsForNames),
                name: new FormControl("", this.validatorsForNames),
                patronymic: new FormControl("", this.validatorsForNames),
            }),
            _dateOfBirth: new FormControl("", [Validators.required, this.validateDate]),
            avaregeGrade: new FormControl("", [Validators.required, Validators.pattern("[0-5]")]),
        });
    }

    @Output() _submit = new EventEmitter();

    _onSubmit(event: Event): void {
        let item = {
            surname: this.formModel.value.person.surname,
            name: this.formModel.value.person.name,
            patronymic: this.formModel.value.person.patronymic,
            _dateOfBirth: new Date(this.formModel.value._dateOfBirth),
            avaregeGrade: +this.formModel.value.avaregeGrade,
        };

        this._submit.emit(item);
    }

    validateDate(control: AbstractControl): ValidationErrors | null {
        let dateInControl: Date = new Date(control.value);
        let validationDate: Date = new Date();

        return null;
    }

    getErrorText(controlName: string): string {
        let errorText: string = "";
        let form: FormGroup;

        switch (controlName) {
            case "surname":
            case "name":
            case "patronymic":
                form = <FormGroup>this.formModel.controls.person;
                break;

            default:
                form = this.formModel;
        }
        let control: AbstractControl = form.controls[controlName];

        if (control && control.invalid && control.touched) {
            let errors: string[] = this.getErrorMessages(control.errors);
            errorText = errors.join("\n");
        }
        return errorText;
    }

    private getErrorMessages(errors: ValidationErrors): string[] {
        let arrayErrors: string[] = [];

        if (errors.minLength) {
            arrayErrors.push("Недостаточная длина");
        }
        if (errors.required) {
            arrayErrors.push("Заполните поле");
        }
        if (errors.pattern) {
            arrayErrors.push("Неподходящее значение");
        }

        return arrayErrors;
    }

    isInvalid(control: AbstractControl) {}
}
