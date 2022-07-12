import "@angular/compiler";

import { FormBuilder } from "@angular/forms"
import { FormModel, InferModeFromModel, InferModeNonNullable, InferModeNullable, InferModeSaveOptional } from "..";

describe('Test InferModes', () => {
    it('default behavior', () => {
        interface Model {
            a?: number | null,
            b: number | null
        }

        const fb = new FormBuilder();

        type Form = FormModel<Model>

        const form: Form = fb.group<Form['controls']>({
            a: fb.control(42),
            b: fb.control(42)
        })

        expect(form.value.a).toBe(42);
        expect(form.value.b).toBe(42);
        expect(form.controls.a.value).toBe(42);
        expect(form.controls.b.value).toBe(42);
    })

    it('non nullable', () => {
        interface Model {
            a?: number | null,
            b: number | null
        }

        const fb = new FormBuilder().nonNullable;

        const form: FormModel<Model, null, InferModeNonNullable> = fb.group({
            a: [42],
            b: [42]
        })

        expect(form.value.a).toBe(42);
        expect(form.value.b).toBe(42);
        expect(form.controls.a.value).toBe(42);
        expect(form.controls.b.value).toBe(42);
    })

    it('nullable', () => {
        interface Model {
            a?: number,
            b: number
        }

        const fb = new FormBuilder().nonNullable;

        const form: FormModel<Model, null, InferModeNullable> = fb.group({
            a: [<number | null>42],
            b: [<number | null>42]
        })

        expect(form.value.a).toBe(42);
        expect(form.value.b).toBe(42);
        expect(form.controls.a.value).toBe(42);
        expect(form.controls.b.value).toBe(42);
    })

    it('from model', () => {
        interface Model {
            a?: number,
            b: number | null
        }

        const fb = new FormBuilder();

        type Form = FormModel<Model, null, InferModeFromModel>;

        const form: Form = fb.group<Form['controls']>({
            a: fb.control(42, { nonNullable: true }),
            b: fb.control(42)
        })

        expect(form.value.a).toBe(42);
        expect(form.value.b).toBe(42);
        expect(form.controls.a?.value).toBe(42);
        expect(form.controls.b.value).toBe(42);

        // Without field a
        const form2: Form = fb.group<Form['controls']>({
            b: fb.control(42)
        })

        expect(form2.value.a).toBeUndefined();
        expect(form2.value.b).toBe(42);
        expect(form2.controls.a).toBeUndefined();
        expect(form2.controls.b.value).toBe(42);
    })

    it('non nullalbe & save optionals', () => {
        interface Model {
            a?: number,
            b: number
        }

        const fb = new FormBuilder().nonNullable;

        type Form = FormModel<Model, null, InferModeNonNullable & InferModeSaveOptional>;

        // With field a
        const form1: Form = fb.group<Form['controls']>({
            a: fb.control(42),
            b: fb.control(42)
        })

        expect(form1.value.a).toBe(42);
        expect(form1.value.b).toBe(42);
        expect(form1.controls.a?.value).toBe(42);
        expect(form1.controls.b.value).toBe(42);

        // Without field a
        const form2: Form = fb.group<Form['controls']>({
            b: fb.control(42)
        })

        expect(form2.value.a).toBeUndefined();
        expect(form2.value.b).toBe(42);
        expect(form2.controls.a?.value).toBeUndefined();
        expect(form2.controls.b.value).toBe(42);
    })

    it('nullalbe & save optionals', () => {
        interface Model {
            a?: number,
            b: number
        }

        const fb = new FormBuilder().nonNullable;

        type Form = FormModel<Model, null, InferModeNullable & InferModeSaveOptional>;

        // With field a
        const form1: Form = fb.group<Form['controls']>({
            a: fb.control(42),
            b: fb.control(42)
        })

        expect(form1.value.a).toBe(42);
        expect(form1.value.b).toBe(42);
        expect(form1.controls.a?.value).toBe(42);
        expect(form1.controls.b.value).toBe(42);

        // Without field a
        const form2: Form = fb.group<Form['controls']>({
            b: fb.control(42)
        })

        expect(form2.value.a).toBeUndefined();
        expect(form2.value.b).toBe(42);
        expect(form2.controls.a?.value).toBeUndefined();
        expect(form2.controls.b.value).toBe(42);
    })

    it('from model & save optionals', () => {
        interface Model {
            a?: number | null,
            b: number | null
        }

        const fb = new FormBuilder().nonNullable;

        type Form = FormModel<Model, null, InferModeNullable & InferModeSaveOptional>;

        // With field a
        const form1: Form = fb.group<Form['controls']>({
            a: fb.control(42),
            b: fb.control(42)
        })

        expect(form1.value.a).toBe(42);
        expect(form1.value.b).toBe(42);
        expect(form1.controls.a?.value).toBe(42);
        expect(form1.controls.b.value).toBe(42);

        // Without field a
        const form2: Form = fb.group<Form['controls']>({
            b: fb.control(42)
        })

        expect(form2.value.a).toBeUndefined();
        expect(form2.value.b).toBe(42);
        expect(form2.controls.a?.value).toBeUndefined();
        expect(form2.controls.b.value).toBe(42);
    })
})