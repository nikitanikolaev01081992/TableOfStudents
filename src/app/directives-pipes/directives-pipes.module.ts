import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ChangeElemDirective } from "./change-elem.directive";
import { FormatDatePipe } from "./format-date.pipe";
import { TooltipDirective } from "./tooltip.directive";

@NgModule({
    declarations: [ChangeElemDirective, FormatDatePipe, TooltipDirective],
    imports: [CommonModule],
    exports: [ChangeElemDirective, FormatDatePipe, TooltipDirective],
})
export class DirectivesPipesModule {}
