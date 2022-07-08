import "@angular/compiler";

import { FormBuilder, FormGroup } from "@angular/forms";
import { FormControlsOf } from "..";

describe('Misc tests', () => {
    it('objects inside FormControl', () => {
        interface ModelWithDate {
            a: Date;
        }

        const fb = new FormBuilder();

        const form: FormGroup<FormControlsOf<ModelWithDate>> = fb.group({
            a: [new Date('2022-07-08T06:46:28.452Z')]
        })

        expect(form.value.a?.toISOString()).toBe(new Date('2022-07-08T06:46:28.452Z').toISOString());
        expect(form.controls.a.value?.toISOString()).toBe(new Date('2022-07-08T06:46:28.452Z').toISOString());
    })
})
