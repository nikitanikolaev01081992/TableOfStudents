import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";

import { AddingFormComponent } from "./adding-form/adding-form.component";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { DirectivesPipesModule } from "./directives-pipes/directives-pipes.module";

@NgModule({
    declarations: [AppComponent, AddingFormComponent],
    imports: [AppRoutingModule, BrowserModule, DirectivesPipesModule, FormsModule, ReactiveFormsModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
