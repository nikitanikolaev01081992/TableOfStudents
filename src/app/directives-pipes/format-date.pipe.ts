import { Pipe, PipeTransform } from "@angular/core";
import { Student } from "../model/data-source.model";

@Pipe({
    name: "formatDate",
})
export class FormatDatePipe implements PipeTransform {
    transform(value: Date, item: Student): string {
        return item.getFormatedDate();
    }
}
