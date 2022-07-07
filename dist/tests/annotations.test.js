import "@angular/compiler";
import { FormBuilder } from "@angular/forms";
describe('Test FormControlsOf annotations', () => {
    it('all primitives without annotations', () => {
        const fb = new FormBuilder();
        const form = fb.group({
            a: [42],
            b: [[1, 2, 3]],
            c: [{ d: 42 }],
        });
        expect(form.value.a).toBe(42);
        expect(form.value.b).toStrictEqual([1, 2, 3]);
        expect(form.value.c).toStrictEqual({ d: 42 });
        expect(form.controls.a.value).toBe(42);
        expect(form.controls.b.value).toStrictEqual([1, 2, 3]);
        expect(form.controls.c.value).toStrictEqual({ d: 42 });
    });
    it('nested array', () => {
        const fb = new FormBuilder();
        const form = fb.group({
            a: [42],
            b: fb.array([1, 2, 3]),
            c: [{ d: 42 }],
        });
        expect(form.value.a).toBe(42);
        expect(form.value.b).toStrictEqual([1, 2, 3]);
        expect(form.value.c).toStrictEqual({ d: 42 });
        expect(form.controls.a.value).toBe(42);
        expect(form.controls.b.value).toStrictEqual([1, 2, 3]);
        expect(form.controls.c.value).toStrictEqual({ d: 42 });
    });
    it('nested group', () => {
        const fb = new FormBuilder();
        const form = fb.group({
            a: [42],
            b: [[1, 2, 3]],
            c: fb.group({ d: [42] }),
        });
        expect(form.value.a).toBe(42);
        expect(form.value.b).toStrictEqual([1, 2, 3]);
        expect(form.value.c).toStrictEqual({ d: 42 });
        expect(form.controls.a.value).toBe(42);
        expect(form.controls.b.value).toStrictEqual([1, 2, 3]);
        expect(form.controls.c.controls.d.value).toStrictEqual(42);
    });
    it('array inside array', () => {
        const fb = new FormBuilder();
        // Empty form
        const form1 = fb.group({
            a: fb.array([])
        });
        expect(form1.value.a).toStrictEqual([]);
        expect(form1.controls.a.value).toStrictEqual([]);
        // Filled form
        const form2 = fb.group({
            a: fb.array([fb.array([42])])
        });
        expect(form2.value.a).toStrictEqual([[42]]);
        expect(form2.controls.a.controls[0].controls[0].value).toStrictEqual(42);
    });
    it('array inside group', () => {
        const fb = new FormBuilder();
        // Empty form
        const form1 = fb.group({
            a: fb.group({
                b: fb.array([])
            })
        });
        expect(form1.value.a?.b).toStrictEqual([]);
        expect(form1.controls.a.controls.b.value).toStrictEqual([]);
        // Filled form
        const form2 = fb.group({
            a: fb.group({
                b: fb.array([
                    fb.control(42)
                ])
            })
        });
        expect(form2.value.a?.b[0]).toStrictEqual(42);
        expect(form2.controls.a.controls.b.controls[0].value).toStrictEqual(42);
    });
    it('group inside array', () => {
        const fb = new FormBuilder();
        // Empty form
        const form1 = fb.group({
            a: fb.array([])
        });
        expect(form1.value.a).toStrictEqual([]);
        expect(form1.controls.a.value).toStrictEqual([]);
        // Filled form
        const form2 = fb.group({
            a: fb.array([
                fb.group({
                    b: fb.group({
                        c: [42]
                    })
                })
            ])
        });
        expect(form2.value.a[0].b?.c).toStrictEqual(42);
        expect(form2.controls.a.controls[0].controls.b.controls.c.value).toStrictEqual(42);
    });
    it('group inside group', () => {
        const fb = new FormBuilder();
        const form = fb.group({
            a: fb.group({
                b: fb.group({
                    c: [42]
                })
            })
        });
        expect(form.value.a?.b?.c).toBe(42);
        expect(form.controls.a.controls.b.controls.c.value).toBe(42);
    });
    it('group inside array inside group', () => {
        const fb = new FormBuilder();
        // Empty form
        const form1 = fb.group({
            a: fb.group({
                b: fb.array([])
            })
        });
        expect(form1.value.a?.b).toStrictEqual([]);
        expect(form1.controls.a?.controls.b.value).toStrictEqual([]);
        // Filled form
        const form2 = fb.group({
            a: fb.group({
                b: fb.array([
                    fb.group({
                        c: fb.group({
                            d: [42]
                        })
                    })
                ])
            })
        });
        expect(form2.value.a?.b[0].c?.d).toBe(42);
        expect(form2.controls.a?.controls.b.controls[0].controls.c.controls.d.value).toBe(42);
    });
});
