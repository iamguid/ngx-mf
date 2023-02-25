import "@angular/compiler";

import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms"
import { FormElementArray, FormElementGroup, FormModel, InferModeNullable, InferModeRequired } from "../src"

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
            const form: FormModel<SimpleModel, null, InferModeNullable & InferModeRequired> = new FormGroup({
                a: new FormControl(42)
            })

            expect(form.value.a).toBe(42);
            expect(form.controls.a.value).toBe(42);
        })

        it('FormBuilder syntax', () => {
            const fb = new FormBuilder();

            const form: FormModel<SimpleModel, null, InferModeNullable & InferModeRequired> = fb.group({
                a: fb.control(42)
            })

            expect(form.value.a).toBe(42);
            expect(form.controls.a.value).toBe(42);
        })

        it('array syntax', () => {
            const fb = new FormBuilder();

            const form: FormModel<SimpleModel, null, InferModeNullable & InferModeRequired> = fb.group({
                a: [42]
            })

            expect(form.value.a).toBe(42);
            expect(form.controls.a.value).toBe(42);
        })
    })

    describe('Nested FormGroup', () => {
        it('constructor syntax', () => {
            const form: FormModel<NestedModel, { a: FormElementGroup }, InferModeNullable & InferModeRequired> = new FormGroup({
                a: new FormGroup({
                    b: new FormControl(42)
                })
            })

            expect(form.value.a?.b).toBe(42);
            expect(form.controls.a.controls.b.value).toBe(42);
        })

        it('FormBuilder syntax', () => {
            const fb = new FormBuilder();

            const form: FormModel<NestedModel, { a: FormElementGroup }, InferModeNullable & InferModeRequired> = fb.group({
                a: fb.group({
                    b: fb.control(42)
                })
            })

            expect(form.value.a?.b).toBe(42);
            expect(form.controls.a.controls.b.value).toBe(42);
        })

        it('array syntax', () => {
            const fb = new FormBuilder();

            const form: FormModel<NestedModel, { a: FormElementGroup }, InferModeNullable & InferModeRequired> = fb.group({
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
            const form: FormModel<ArrayModel, { a: FormElementArray }, InferModeNullable & InferModeRequired> = new FormGroup({
                a: new FormArray([
                    new FormControl(42)
                ])
            })

            expect(form.value.a![0]).toBe(42);
            expect(form.controls.a.controls[0].value).toBe(42);
        })

        it('FormBuilder syntax', () => {
            const fb = new FormBuilder();

            const form: FormModel<ArrayModel, { a: FormElementArray }, InferModeNullable & InferModeRequired> = fb.group({
                a: fb.array([
                    fb.control(42)
                ])
            })

            expect(form.value.a![0]).toBe(42);
            expect(form.controls.a.controls[0].value).toBe(42);
        })
    })

    describe('from with validators', () => {
        it('constructor syntax', () => {
            const form: FormModel<SimpleModel, null, InferModeNullable & InferModeRequired> = new FormGroup({
                a: new FormControl(42, [Validators.required])
            })

            expect(form.value.a).toBe(42);
            expect(form.controls.a.value).toBe(42);
        })

        it('FormBuilder syntax', () => {
            const fb = new FormBuilder();

            const form: FormModel<SimpleModel, null, InferModeNullable & InferModeRequired> = fb.group({
                a: fb.control(42, [Validators.required])
            })

            expect(form.value.a).toBe(42);
            expect(form.controls.a.value).toBe(42);
        })

        it('array syntax', () => {
            const fb = new FormBuilder();

            const form: FormModel<SimpleModel, null, InferModeNullable & InferModeRequired> = fb.group({
                a: [42, [Validators.required]]
            })

            expect(form.value.a).toBe(42);
            expect(form.controls.a.value).toBe(42);
        })
    })

    describe('value as FormControlState', () => {
        it('constructor syntax', () => {
            const form: FormModel<SimpleModel, null, InferModeNullable & InferModeRequired> = new FormGroup({
                a: new FormControl({ value: 42, disabled: false })
            })

            expect(form.value.a).toBe(42);
            expect(form.controls.a.value).toBe(42);
        })

        it('FormBuilder syntax', () => {
            const fb = new FormBuilder();

            const form: FormModel<SimpleModel, null, InferModeNullable & InferModeRequired> = fb.group({
                a: fb.control({ value: 42, disabled: false })
            })

            expect(form.value.a).toBe(42);
            expect(form.controls.a.value).toBe(42);
        })

        it.skip('array syntax', () => {
            const fb = new FormBuilder();

            // TODO: Doesn't work :(
            // @ts-ignore
            const form: FormModel<SimpleModel, null, InferModeNullable & InferModeRequired> = fb.group({
                a: [{ value: 42, disabled: false }]
            })

            expect(form.value.a).toBe(42);
            expect(form.controls.a.value).toBe(42);
        })
    })
})