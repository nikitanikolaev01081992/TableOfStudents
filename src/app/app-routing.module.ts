import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { PreventChangesGuard } from "./prevent-changes.guard";
import { AddingFormComponent } from "./table/adding-form/adding-form.component";
import { TableComponent } from "./table/table.component";

const routes: Routes = [
    {
        path: "students",
        component: TableComponent,
        canActivateChild: [PreventChangesGuard],
        children: [
            { path: "create", component: AddingFormComponent },
            { path: ":id", redirectTo: "edit/:id", pathMatch: "full" },
            { path: "edit/:id", component: AddingFormComponent },
        ],
    },
    { path: "", redirectTo: "/students", pathMatch: "full" },
    { path: "**", component: PageNotFoundComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
export const routeComponents = [PageNotFoundComponent, TableComponent, AddingFormComponent];
