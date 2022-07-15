import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";

const form = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl(''),
    age: new FormControl<number | null>(null),
});

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
    ngOnInit(): void {
    }

    doThomthingWithForm(f: typeof form) {
        f.value.age == 42
    }
}
