import { Component, OnInit, Input, Output, OnChanges } from "@angular/core";
import { FormGroup, FormControl, Validators, PatternValidator, AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { EventEmitter } from "@angular/core";
import { InvokeFunctionExpr } from "@angular/compiler";

@Component({
    selector: "app-adding-form",
    templateUrl: "./adding-form.component.html",
    styleUrls: ["./adding-form.component.less"],
})
export class AddingFormComponent implements OnInit {
    formModel: FormGroup;
    validatorsForNames: ValidatorFn[];
    @Input() dataFromParent: {
        surname: string, 
        name: string,
        patronymic: string,
        _dateOfBirth: string,
        avaregeGrade: string,
        index: number,
        updateOrModify: string
    };
    @Output() _submit = new EventEmitter();


    constructor() {}

    ngOnInit() {
        this.validatorsForNames = [Validators.required, Validators.pattern("[A-Za-zа-яА-я]+"), Validators.minLength(2), this.validatePersonInfo];

        this.formModel = new FormGroup({
            person: new FormGroup({
                surname: new FormControl(this.dataFromParent.surname, this.validatorsForNames),
                name: new FormControl(this.dataFromParent.name, this.validatorsForNames),
                patronymic: new FormControl(this.dataFromParent.patronymic, this.validatorsForNames),
            }),
            _dateOfBirth: new FormControl(this.dataFromParent._dateOfBirth, [Validators.required, this.validateDate]),
            avaregeGrade: new FormControl(this.dataFromParent.avaregeGrade, [Validators.required, Validators.pattern("[0-5]")]),
        });
    }

    
    _onSubmit(event: Event): void {
        let item = {
            surname: this.formModel.value.person.surname,
            name: this.formModel.value.person.name,
            patronymic: this.formModel.value.person.patronymic,
            _dateOfBirth: new Date(this.formModel.value._dateOfBirth),
            avaregeGrade: +this.formModel.value.avaregeGrade,
            index: this.dataFromParent.index,
            updateOrModify: this.dataFromParent.updateOrModify
        };

        this._submit.emit(item);
    }

    validateDate(control: AbstractControl): ValidationErrors | null {
        if (control.value !== "") {
            let dateInControl: number = new Date(control.value).getFullYear();
            let validationDate: number = new Date().getFullYear();

            // not very exact way but let it be for now
            if ((validationDate - dateInControl) < 10) {
               return {["wrongAge"]: true};
            }

        }

        return null;
    }


    validatePersonInfo(control: AbstractControl): ValidationErrors | null {
        
        if (control.parent) {
            let name:AbstractControl = control.parent.get("name");
            
            if (name !== control && control.value !== "") {
                if (name.value === control.value) {
                    return {["wrongName"]: true};
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
                control = this.formModel.controls[controlName]
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
                arrayErrors.push("Имя не может совпадать с данным полем");
            }
        }

        return arrayErrors;
    }

    isInvalid(control: AbstractControl) {}
}
