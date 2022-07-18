import "@angular/compiler";

import { FormBuilder } from "@angular/forms";
import { FormModel } from "../src";

describe('Complicated test', () => {
    it('FUCK 1', () => {
        interface Model1 {
            a?: number | null,
            b?: Array<Model2>
        }

        interface Model2 {
            a?: string | null;
            b?: string | null;
        }

        const fb = new FormBuilder();

        type Form = FormModel<Model1, { b: ['group'] }>;

        const form: Form = fb.group<Form['controls']>({
            a: fb.control(42),
            b: fb.array<Form['controls']['b']['controls'][0]>([
                fb.group<Form['controls']['b']['controls'][0]['controls']>({
                    a: fb.control('test'),
                    b: fb.control('test')
                })
            ])
        })

        expect(form.value.a).toBe(42);
        expect(form.value.b![0].a).toBe('test');
        expect(form.value.b![0].b).toBe('test');
    })
})