import "@angular/compiler";

import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { FormControlsOf } from "..";

interface PrimitivesModel {
    a: number;
    b: number[];
    c: {
        d: number;
    };
}

describe('Test FormControlsOf annotations', () => {
    it('all primitives without annotations', () => {
        const fb = new FormBuilder();

        const form: FormGroup<FormControlsOf<PrimitivesModel>> = fb.group({
            a: [42],
            b: [[1, 2, 3]],
            c: [{ d: 42 }],
        })

        expect(form.value.a).toBe(42);
        expect(form.value.b).toStrictEqual([1, 2, 3]);
        expect(form.value.c).toStrictEqual({ d: 42 });
        expect(form.controls.a.value).toBe(42);
        expect(form.controls.b.value).toStrictEqual([1, 2, 3]);
        expect(form.controls.c.value).toStrictEqual({ d: 42 });
    })

    it('nested array', () => {
        const fb = new FormBuilder();

        const form: FormGroup<FormControlsOf<PrimitivesModel, { b: 'array' }>> = fb.group({
            a: [42],
            b: fb.array([1, 2, 3]),
            c: [{ d: 42 }],
        })

        expect(form.value.a).toBe(42);
        expect(form.value.b).toStrictEqual([1, 2, 3]);
        expect(form.value.c).toStrictEqual({ d: 42 });
        expect(form.controls.a.value).toBe(42);
        expect(form.controls.b.value).toStrictEqual([1, 2, 3]);
        expect(form.controls.c.value).toStrictEqual({ d: 42 });
    })

    it('nested group', () => {
        const fb = new FormBuilder();

        const form: FormGroup<FormControlsOf<PrimitivesModel, { c: 'group' }>> = fb.group({
            a: [42],
            b: [[1, 2, 3]],
            c: fb.group({ d: [42] }),
        })

        expect(form.value.a).toBe(42);
        expect(form.value.b).toStrictEqual([1, 2, 3]);
        expect(form.value.c).toStrictEqual({ d: 42 });
        expect(form.controls.a.value).toBe(42);
        expect(form.controls.b.value).toStrictEqual([1, 2, 3]);
        expect(form.controls.c.controls.d.value).toStrictEqual(42);
    })

    it('array inside array', () => {
        interface ArrayOfArray {
            a: Array<Array<number>>;
        }

        const fb = new FormBuilder();

        // Empty form
        const form1: FormGroup<FormControlsOf<ArrayOfArray, { a: [['control']] }>> = fb.group({
            a: fb.array<FormArray<FormControl<number | null>>>([])
        })

        expect(form1.value.a).toStrictEqual([]);
        expect(form1.controls.a.value).toStrictEqual([]);

        // Filled form
        const form2: FormGroup<FormControlsOf<ArrayOfArray, { a: [['control']] }>> = fb.group({
            a: fb.array([fb.array([42])])
        })

        expect(form2.value.a).toStrictEqual([[42]]);
        expect(form2.controls.a.controls[0].controls[0].value).toStrictEqual(42);
    })

    it('array inside group', () => {
        interface ArrayInsideGroup {
            a: {
                b: number[]
            }
        }

        const fb = new FormBuilder();

        // Empty form
        const form1: FormGroup<FormControlsOf<ArrayInsideGroup, { a: { b: 'array' } }>> = fb.group({
            a: fb.group({
                b: fb.array<FormControl<number | null>>([])
            })
        })

        expect(form1.value.a?.b).toStrictEqual([]);
        expect(form1.controls.a.controls.b.value).toStrictEqual([]);

        // Filled form
        const form2: FormGroup<FormControlsOf<ArrayInsideGroup, { a: { b: 'array' } }>> = fb.group({
            a: fb.group({
                b: fb.array([
                    fb.control(42)
                ])
            })
        })

        expect(form2.value.a?.b![0]).toStrictEqual(42);
        expect(form2.controls.a.controls.b.controls[0].value).toStrictEqual(42);
    })

    it('group inside array', () => {
        interface GroupInsideArray {
            a: Array<{ b: { c: number } }>
        }

        const fb = new FormBuilder();

        // Empty form
        const form1: FormGroup<FormControlsOf<GroupInsideArray, { a: [{ b: 'group' }] }>> = fb.group({
            a: fb.array<FormGroup<{ b: FormGroup<{ c: FormControl<number | null> }> }>>([])
        })

        expect(form1.value.a).toStrictEqual([]);
        expect(form1.controls.a.value).toStrictEqual([]);

        // Filled form
        const form2: FormGroup<FormControlsOf<GroupInsideArray, { a: [{ b: 'group' }] }>> = fb.group({
            a: fb.array([
                fb.group({
                    b: fb.group({
                        c: [42]
                    })
                })
            ])
        })

        expect(form2.value.a![0].b?.c).toStrictEqual(42);
        expect(form2.controls.a.controls[0].controls.b.controls.c.value).toStrictEqual(42);
    })

    it('group inside group', () => {
        interface GroupInsideGroup {
            a: {
                b: {
                    c: number;
                }
            }
        }

        const fb = new FormBuilder();

        const form: FormGroup<FormControlsOf<GroupInsideGroup, { a: { b: 'group' } }>> = fb.group({
            a: fb.group({
                b: fb.group({
                    c: [42]
                })
            })
        })

        expect(form.value.a?.b?.c).toBe(42);
        expect(form.controls.a.controls.b.controls.c.value).toBe(42);
    })

    it('group inside array inside group', () => {
        interface DeepGroup {
            a: {
                b: Array<{
                    c: {
                        d: number;
                    }
                }>
            }
        }

        const fb = new FormBuilder();

        // Empty form
        const form1: FormGroup<FormControlsOf<DeepGroup, { a: { b: [{ c: 'group' }] } }>> = fb.group({
            a: fb.group({
                b: fb.array<FormGroup<{ c: FormGroup<{ d: FormControl<number | null> }> }>>([])
            })
        })

        expect(form1.value.a?.b).toStrictEqual([]);
        expect(form1.controls.a?.controls.b.value).toStrictEqual([]);

        // Filled form
        const form2: FormGroup<FormControlsOf<DeepGroup, { a: { b: [{ c: 'group' }] } }>> = fb.group({
            a: fb.group({
                b: fb.array([
                    fb.group({
                        c: fb.group({
                            d: [42]
                        })
                    })
                ])
            })
        })

        expect(form2.value.a?.b![0].c?.d).toBe(42);
        expect(form2.controls.a?.controls.b.controls[0].controls.c.controls.d.value).toBe(42);
    })
});