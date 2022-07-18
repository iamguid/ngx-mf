import { Component } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
})
export class AppComponent {
    public static form = new FormGroup({
        firstName: new FormControl(''),
        lastName: new FormControl(''),
        email: new FormControl(''),
        age: new FormControl<number | null>(null),
    });

    doThomthingWithForm(f: typeof AppComponent.form) {
        f.value.age == 42
    }
}
