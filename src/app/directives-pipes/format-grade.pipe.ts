import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "formatGrade",
})
export class FormatGradePipe implements PipeTransform {
    transform(value: number): any {
        if (value === 5) {
            return `${value} - Отлично`;
        }
        if (value >= 4 && value < 5) {
            return `${value} - Хорошо`;
        }
        if (value >= 3 && value < 4) {
            return `${value} - Удовлетворительно`;
        }
        if (value >= 2 && value < 3) {
            return `${value} - Неудовлетворительно`;
        }
        if (value < 2) {
            return `${value} - Посредственно`;
        }
    }
}
