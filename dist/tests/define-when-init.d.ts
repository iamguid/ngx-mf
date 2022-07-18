// @ts-nocheck 
import { FormControl, FormGroup } from "@angular/forms";
export declare class AppComponent {
    static form: FormGroup<{
        firstName: FormControl<string | null>;
        lastName: FormControl<string | null>;
        email: FormControl<string | null>;
        age: FormControl<number | null>;
    }>;
    doThomthingWithForm(f: typeof AppComponent.form): void;
}
//# sourceMappingURL=define-when-init.d.ts.map