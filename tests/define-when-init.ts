import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
    form = new FormGroup({
        firstName: new FormControl(''),
        lastName: new FormControl(''),
        email: new FormControl(''),
        age: new FormControl<number | null>(null, this.validator),
    });

    ngOnInit(): void {
    }

    validator() {
        return {}
    }

    doThomthingWithForm(form: typeof this.form) {
        form.value.age == 42
    }
}
