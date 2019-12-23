import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ChangeElemDirective } from "./change-elem.directive";
import { FormatDatePipe } from "./format-date.pipe";
import { TooltipDirective } from "./tooltip.directive";
import { FormatGradePipe } from "./format-grade.pipe";

@NgModule({
    declarations: [ChangeElemDirective, FormatDatePipe, TooltipDirective, FormatGradePipe],
    imports: [CommonModule],
    exports: [ChangeElemDirective, FormatDatePipe, TooltipDirective, FormatGradePipe],
})
export class DirectivesPipesModule {}
