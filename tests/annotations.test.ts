import "@angular/compiler";

import { FormBuilder } from "@angular/forms";
import { FormModel } from "..";

describe('Test FormControlsOf annotations', () => {
    it('all primitives without annotations', () => {
        interface Model {
            a: number;
            b: number[];
            c: {
                d: number;
            };
        }

        const fb = new FormBuilder();

        const form: FormModel<Model> = fb.group({
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

    it('array', () => {
        type Model = number[];

        const fb = new FormBuilder();

        const form: FormModel<Model> = fb.array([42])

        expect(form.value[0]).toBe(42);
        expect(form.controls[0].value).toBe(42);
    })

    it('group', () => {
        interface Model {
            a: number;
        };

        const fb = new FormBuilder();

        const form: FormModel<Model> = fb.group({ a: [42] })

        expect(form.value.a).toBe(42);
        expect(form.controls.a.value).toBe(42);
    })

    it('array inside group', () => {
        interface Model {
            a: number[];
        }

        const fb = new FormBuilder();

        const form: FormModel<Model, { a: 'array' }> = fb.group({
            a: fb.array([42]),
        })

        expect(form.value.a![0]).toBe(42);
        expect(form.controls.a.controls[0].value).toBe(42);
    })

    it('group inside array', () => {
        type Model = { a: number }[];

        const fb = new FormBuilder();

        const form: FormModel<Model, ['group']> = fb.array([fb.group({ a: [42] })]);

        expect(form.value[0].a).toBe(42);
        expect(form.controls[0].controls.a.value).toBe(42);
    })

    it('array inside array', () => {
        type Model = number[][];

        const fb = new FormBuilder();

        const form: FormModel<Model, [['control']]> = fb.array([fb.array([42])])

        expect(form.value[0][0]).toBe(42);
        expect(form.controls[0].controls[0].value).toBe(42);
    })

    it('group inside group', () => {
        interface Model {
            a: { b: number; };
        }

        const fb = new FormBuilder();

        const form: FormModel<Model, { a: 'group' }> = fb.group({
            a: fb.group({ 
                b: [42]
            }),
        })

        expect(form.value.a?.b).toBe(42);
        expect(form.controls.a.controls.b.value).toBe(42);
    })

    it('array inside array inside array', () => {
        type Model = number[][][];

        const fb = new FormBuilder();

        const form: FormModel<Model, [[['control']]]> = fb.array([
            fb.array([
                fb.array([42])
            ])
        ])

        expect(form.value[0][0][0]).toBe(42);
        expect(form.controls[0].controls[0].controls[0].value).toBe(42);
    })

    it('array inside array inside group', () => {
        interface Model {
            a: Array<Array<number>>;
        }

        const fb = new FormBuilder();

        const form: FormModel<Model, { a: [['control']] }> = fb.group({
            a: fb.array([fb.array([42])])
        })

        expect(form.value.a![0][0]).toBe(42);
        expect(form.controls.a.controls[0].controls[0].value).toBe(42);
    })

    it('array inside group inside group', () => {
        interface Model {
            a: {
                b: number[]
            }
        }

        const fb = new FormBuilder();

        const form: FormModel<Model, { a: { b: 'array' } }> = fb.group({
            a: fb.group({
                b: fb.array([
                    fb.control(42)
                ])
            })
        })

        expect(form.value.a?.b![0]).toBe(42);
        expect(form.controls.a.controls.b.controls[0].value).toBe(42);
    })

    it('group inside group inside group', () => {
        interface Model {
            a: {
                b: {
                    c: number;
                }
            }
        }

        const fb = new FormBuilder();

        const form: FormModel<Model, { a: { b: 'group' } }> = fb.group({
            a: fb.group({
                b: fb.group({
                    c: [42]
                })
            })
        })

        expect(form.value.a?.b?.c).toBe(42);
        expect(form.controls.a.controls.b.controls.c.value).toBe(42);
    })

    it('group inside group inside array', () => {
        type Model = {
            a: {
                b: {
                    c: number;
                }
            }
        }[]

        const fb = new FormBuilder();

        const form: FormModel<Model, [{ a: { b: 'group' } }]> = fb.array([
            fb.group({
                a: fb.group({
                    b: fb.group({
                        c: [42]
                    })
                })
            })
        ])

        expect(form.value[0].a?.b?.c).toBe(42);
        expect(form.controls[0].controls.a.controls.b.controls.c.value).toBe(42);
    })

    it('group inside array inside array', () => {
        type Model = {
            a: number;
        }[][]

        const fb = new FormBuilder();

        const form: FormModel<Model, [['group']]> = fb.array([
            fb.array([
                fb.group({
                    a: [42]
                })
            ])
        ])

        expect(form.value[0][0].a).toBe(42);
        expect(form.controls[0].controls[0].controls.a.value).toBe(42);
    })

    it('group inside array inside group', () => {
        interface Model {
            a: Array<{ b: number }>;
        }

        const fb = new FormBuilder();

        const form: FormModel<Model, { a: ['group'] }> = fb.group({
            a: fb.array([ fb.group({ b: [42] }) ])
        })

        expect(form.value.a![0].b).toBe(42);
        expect(form.controls.a.controls[0].controls.b.value).toBe(42);
    })

    it('array inside group inside array', () => {
        type Model = Array<{ a: number[] }>

        const fb = new FormBuilder();

        const form: FormModel<Model, [{ a: 'array' }]> = fb.array([
            fb.group({
                a: fb.array([42])
            })
        ])

        expect(form.value[0].a![0]).toBe(42);
        expect(form.controls[0].controls.a.controls[0].value).toBe(42);
    })

    it('group inside group inside array inside group', () => {
        interface Model {
            a: Array<{ b: { c: number } }>
        }

        const fb = new FormBuilder();

        const form: FormModel<Model, { a: [{ b: 'group' }] }> = fb.group({
            a: fb.array([
                fb.group({
                    b: fb.group({
                        c: [42]
                    })
                })
            ])
        })

        expect(form.value.a![0].b?.c).toBe(42);
        expect(form.controls.a.controls[0].controls.b.controls.c.value).toBe(42);
    })

    it('group inside array inside group inside group', () => {
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

        const form: FormModel<DeepGroup, { a: { b: [{ c: 'group' }] } }> = fb.group({
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

        expect(form.value.a?.b![0].c?.d).toBe(42);
        expect(form.controls.a?.controls.b.controls[0].controls.c.controls.d.value).toBe(42);
    })
});