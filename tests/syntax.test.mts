import "@angular/compiler"

import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms"
import { FormElementArray, FormElementGroup, FormType, G, I, T } from "../src/index.mjs"

interface SimpleModel {
    a: number;
}

interface NestedModel {
    a: {
        b: number;
    }
}

interface ArrayModel {
    a: number[];
}

describe('Test different form definition syntax', () => {
    describe('Plain forms', () => {
        it('constructor syntax', () => {
            type Form = FormType<SimpleModel>

            const form: Form[T] = new FormGroup<Form[G]>({
                a: new FormControl(42, { nonNullable: true })
            })

            expect(form.value.a).toBe(42);
            expect(form.controls.a.value).toBe(42);
        })

        it('FormBuilder syntax', () => {
            type Form = FormType<SimpleModel>

            const fb = new FormBuilder().nonNullable;

            const form: Form[T] = fb.group<Form[G]>({
                a: fb.control(42)
            })

            expect(form.value.a).toBe(42);
            expect(form.controls.a.value).toBe(42);
        })

        it('array syntax', () => {
            type Form = FormType<SimpleModel>

            const fb = new FormBuilder().nonNullable;

            const form: Form[T] = fb.group({
                a: [42]
            })

            expect(form.value.a).toBe(42);
            expect(form.controls.a.value).toBe(42);
        })
    })

    describe('Nested FormGroup', () => {
        it('constructor syntax', () => {
            type Form = FormType<NestedModel, { a: FormElementGroup }>

            const form: Form[T] = new FormGroup<Form[G]>({
                a: new FormGroup<Form['a'][G]>({
                    b: new FormControl(42, { nonNullable: true })
                })
            })

            expect(form.value.a?.b).toBe(42);
            expect(form.controls.a.controls.b.value).toBe(42);
        })

        it('FormBuilder syntax', () => {
            type Form = FormType<NestedModel, { a: FormElementGroup }>

            const fb = new FormBuilder().nonNullable;

            const form: Form[T] = fb.group<Form[G]>({
                a: fb.group<Form['a'][G]>({
                    b: fb.control(42)
                })
            })

            expect(form.value.a?.b).toBe(42);
            expect(form.controls.a.controls.b.value).toBe(42);
        })

        it('array syntax', () => {
            type Form = FormType<NestedModel, { a: FormElementGroup }>

            const fb = new FormBuilder().nonNullable;

            const form: Form[T] = fb.group<Form[G]>({
                a: fb.group({
                    b: [42]
                })
            })

            expect(form.value.a?.b).toBe(42);
            expect(form.controls.a.controls.b.value).toBe(42);
        })
    })

    describe('Nested FormArray', () => {
        it('constructor syntax', () => {
            type Form = FormType<ArrayModel, { a: FormElementArray }>

            const form: Form[T] = new FormGroup<Form[G]>({
                a: new FormArray<Form['a'][I]>([
                    new FormControl(42, { nonNullable: true })
                ])
            })

            expect(form.value.a![0]).toBe(42);
            expect(form.controls.a.controls[0].value).toBe(42);
        })

        it('FormBuilder syntax', () => {
            type Form = FormType<ArrayModel, { a: FormElementArray }>

            const fb = new FormBuilder();

            const form: Form[T] = fb.group<Form[G]>({
                a: fb.array<Form['a'][I]>([
                    fb.control(42, { nonNullable: true })
                ])
            })

            expect(form.value.a![0]).toBe(42);
            expect(form.controls.a.controls[0].value).toBe(42);
        })
    })

    describe('from with validators', () => {
        it('constructor syntax', () => {
            type Form = FormType<SimpleModel>

            const form: Form[T] = new FormGroup<Form[G]>({
                a: new FormControl(42, { nonNullable: true, validators: [Validators.required] })
            })

            expect(form.value.a).toBe(42);
            expect(form.controls.a.value).toBe(42);
        })

        it('FormBuilder syntax', () => {
            type Form = FormType<SimpleModel>

            const fb = new FormBuilder().nonNullable;

            const form: Form[T] = fb.group<Form[G]>({
                a: fb.control(42, [Validators.required])
            })

            expect(form.value.a).toBe(42);
            expect(form.controls.a.value).toBe(42);
        })

        it('array syntax', () => {
            type Form = FormType<SimpleModel>

            const fb = new FormBuilder().nonNullable;

            const form: Form[T] = fb.group({
                a: [42, [Validators.required]]
            })

            expect(form.value.a).toBe(42);
            expect(form.controls.a.value).toBe(42);
        })
    })

    describe('value as FormControlState', () => {
        it('constructor syntax', () => {
            type Form = FormType<SimpleModel>

            const form: Form[T] = new FormGroup<Form[G]>({
                a: new FormControl({ value: 42, disabled: false }, { nonNullable: true })
            })

            expect(form.value.a).toBe(42);
            expect(form.controls.a.value).toBe(42);
        })

        it('FormBuilder syntax', () => {
            type Form = FormType<SimpleModel>

            const fb = new FormBuilder().nonNullable;

            const form: Form[T] = fb.group<Form[G]>({
                a: fb.control({ value: 42, disabled: false })
            })

            expect(form.value.a).toBe(42);
            expect(form.controls.a.value).toBe(42);
        })

        it('array syntax', () => {
            type Form = FormType<SimpleModel>

            const fb = new FormBuilder().nonNullable;

            const form: Form[T] = fb.group({
                a: [{ value: 42, disabled: false }]
            })

            expect(form.value.a).toBe(42);
            expect(form.controls.a.value).toBe(42);
        })
    })
})