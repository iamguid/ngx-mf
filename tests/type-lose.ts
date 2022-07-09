import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
    form!: FormGroup;

    ngOnInit(): void {
        // You losing your types !
        this.form = new FormGroup({
            firstName: new FormControl<string>('', { nonNullable: true }),
            lastName: new FormControl('', { nonNullable: true }),
            email: new FormControl('', { nonNullable: true }),
            age: new FormControl<number | null>(null),
        });
    }
}
