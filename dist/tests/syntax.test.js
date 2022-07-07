import "@angular/compiler";
import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
describe('Test different form definition syntax', () => {
    describe('Plain forms', () => {
        it('constructor syntax', () => {
            const form = new FormGroup({
                a: new FormControl(42)
            });
            expect(form.value.a).toBe(42);
            expect(form.controls.a.value).toBe(42);
        });
        it('FormBuilder syntax', () => {
            const fb = new FormBuilder();
            const form = fb.group({
                a: fb.control(42)
            });
            expect(form.value.a).toBe(42);
            expect(form.controls.a.value).toBe(42);
        });
        it('array syntax', () => {
            const fb = new FormBuilder();
            const form = fb.group({
                a: [42]
            });
            expect(form.value.a).toBe(42);
            expect(form.controls.a.value).toBe(42);
        });
    });
    describe('Nested FormGroup', () => {
        it('constructor syntax', () => {
            const form = new FormGroup({
                a: new FormGroup({
                    b: new FormControl(42)
                })
            });
            expect(form.value.a?.b).toBe(42);
            expect(form.controls.a.controls.b.value).toBe(42);
        });
        it('FormBuilder syntax', () => {
            const fb = new FormBuilder();
            const form = fb.group({
                a: fb.group({
                    b: fb.control(42)
                })
            });
            expect(form.value.a?.b).toBe(42);
            expect(form.controls.a.controls.b.value).toBe(42);
        });
        it('array syntax', () => {
            const fb = new FormBuilder();
            const form = fb.group({
                a: fb.group({
                    b: [42]
                })
            });
            expect(form.value.a?.b).toBe(42);
            expect(form.controls.a.controls.b.value).toBe(42);
        });
    });
    describe('Nested FormArray', () => {
        it('constructor syntax', () => {
            const form = new FormGroup({
                a: new FormArray([
                    new FormControl(42)
                ])
            });
            expect(form.value.a[0]).toBe(42);
            expect(form.controls.a.controls[0].value).toBe(42);
        });
        it('FormBuilder syntax', () => {
            const fb = new FormBuilder();
            const form = fb.group({
                a: fb.array([
                    fb.control(42)
                ])
            });
            expect(form.value.a[0]).toBe(42);
            expect(form.controls.a.controls[0].value).toBe(42);
        });
    });
});
