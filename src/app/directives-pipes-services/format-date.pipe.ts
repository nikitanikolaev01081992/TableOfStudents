import { Pipe, PipeTransform } from "@angular/core";
import { IStudent } from "../student";

@Pipe({
    name: "formatDate",
})
export class FormatDatePipe implements PipeTransform {
    transform(value: Date, item: IStudent): string {
        return item.getFormatedDate();
    }
}
