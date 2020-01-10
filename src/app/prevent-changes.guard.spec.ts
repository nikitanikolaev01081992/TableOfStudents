import { inject, TestBed } from "@angular/core/testing";

import { PreventChangesGuard } from "./prevent-changes.guard";

describe("PreventChangesGuard", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [PreventChangesGuard],
        });
    });

    it("should ...", inject([PreventChangesGuard], (guard: PreventChangesGuard) => {
        expect(guard).toBeTruthy();
    }));
});
