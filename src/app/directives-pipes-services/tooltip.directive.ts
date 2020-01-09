// assign class 'tooltip' to elem

import { Directive, HostBinding, HostListener } from "@angular/core";

@Directive({
    selector: "[appTooltip]",
})
export class TooltipDirective {
    constructor() {
        this.showToolTip = false;
    }

    @HostBinding("class.tooltip")
    showToolTip: boolean;

    @HostListener("mouseenter") _mouseenter(): void {
        this.reactOnEnter();
    }

    @HostListener("mouseleave") _mouseleave(): void {
        this.reactOnEnter();
    }

    reactOnEnter(): void {
        this.showToolTip = !this.showToolTip;
    }
}
