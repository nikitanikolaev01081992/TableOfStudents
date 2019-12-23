// catch event from elem and make new event
// reciever should provide function for changing elem

import { Directive, EventEmitter, HostListener, Input, Output } from "@angular/core";
import { Student } from "../model/data-source.model";

@Directive({
    selector: "[appChangeElem]",
})
export class ChangeElemDirective {
    @Input("appChangeElem") currentElem: Student;
    @Output() changeItem = new EventEmitter<Student>();

    @HostListener("click", ["$event.target"]) domClickOnElem(elem: HTMLElement): void {
        if (elem.tagName !== "INPUT") {
            this.changeItem.emit(this.currentElem);
        }
    }
}
