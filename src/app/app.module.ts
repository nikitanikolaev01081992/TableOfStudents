import { NgModule } from "@angular/core";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule, routeComponents } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { DirectivesPipesModule } from "./directives-pipes-services/directives-pipes.module";
import { StudentsService } from "./directives-pipes-services/students.service";
import { Router, ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";

@NgModule({
    declarations: [AppComponent, routeComponents],
    imports: [AppRoutingModule, BrowserModule, DirectivesPipesModule, FormsModule, ReactiveFormsModule, HttpClientModule],
    providers: [
        {
            provide: StudentsService,
            deps: [HttpClient],
            useFactory: (http: HttpClient) => {
                let debugParam: string = window.location.href.split(";")[1];
                let isDebug: boolean = debugParam ? !!debugParam.split("=")[1] : false;

                return new StudentsService(isDebug, http);
            },
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
