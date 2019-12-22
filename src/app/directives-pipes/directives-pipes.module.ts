import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ChangeElemDirective } from "./change-elem.directive";
import { FormatDatePipe } from "./format-date.pipe";

@NgModule({
    declarations: [ChangeElemDirective, FormatDatePipe],
    imports: [CommonModule],
    exports: [ChangeElemDirective, FormatDatePipe],
})
export class DirectivesPipesModule {}
