// @ts-nocheck 
import { OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
declare const form: FormGroup<{
    firstName: FormControl<string | null>;
    lastName: FormControl<string | null>;
    email: FormControl<string | null>;
    age: FormControl<number | null>;
}>;
export declare class AppComponent implements OnInit {
    ngOnInit(): void;
    doThomthingWithForm(f: typeof form): void;
}
export {};
//# sourceMappingURL=define-when-init.d.ts.map