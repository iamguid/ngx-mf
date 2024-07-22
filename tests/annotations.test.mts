import "@angular/compiler"

import { FormBuilder } from "@angular/forms";
import { T, G, I, FormElementArray, FormElementControl, FormElementGroup, FormType } from "../src/index.mjs";

describe('Test FormType annotations', () => {
    it('all primitives without annotations', () => {
        interface Model {
            a: number;
            b: number[];
            c: {
                d: number;
            };
        }

        const fb = new FormBuilder();

        type Form = FormType<Model>;

        const form: Form[T] = fb.group<Form[G]>({
            a: fb.nonNullable.control(42),
            b: fb.nonNullable.control([1, 2, 3]),
            c: fb.nonNullable.control({ d: 42 }),
        });

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

        type Form = FormType<Model>;

        const form: Form[T] = fb.array<Form[I]>([
            fb.nonNullable.control(42)
        ]);

        expect(form.value[0]).toBe(42);
        expect(form.controls[0].value).toBe(42);
    })

    it('array annotation', () => {
        type Model = number[];

        const fb = new FormBuilder().nonNullable;

        type Form = FormType<Model, FormElementArray>;

        const form: Form[T] = fb.array<Form[I]>([
            fb.control(42)
        ]);

        expect(form.value[0]).toBe(42);
        expect(form.controls[0].value).toBe(42);
    })

    it('default group annotation', () => {
        interface Model {
            a: number;
        };

        const fb = new FormBuilder().nonNullable;

        type Form = FormType<Model>;

        const form: Form[T] = fb.group<Form[G]>({
            a: fb.control(42)
        });

        expect(form.value.a).toBe(42);
        expect(form.controls.a.value).toBe(42);
    })

    it('group string annotation', () => {
        interface Model {
            a: number;
        };

        const fb = new FormBuilder().nonNullable;

        type Form = FormType<Model, FormElementGroup>;

        const form: Form[T] = fb.group<Form[G]>({
            a: fb.control(42)
        });

        expect(form.value.a).toBe(42);
        expect(form.controls.a.value).toBe(42);
    })

    it('control string annotation', () => {
        interface Model {
            a: number;
        };

        const fb = new FormBuilder().nonNullable;

        type Form = FormType<Model, FormElementControl>;

        const form: Form[T] = fb.control({
            a: 42
        });

        expect(form.value?.a).toBe(42);
    })

    it('control string annotation on array', () => {
        interface Model {
            a: number[];
        };

        const fb = new FormBuilder().nonNullable;

        type Form = FormType<Model, { a: FormElementControl }>;

        const form: Form[T] = fb.group<Form[G]>({
            a: fb.control([42])
        });

        expect(form.value?.a).toStrictEqual([42]);
    })

    it('array inside group', () => {
        interface Model {
            a: number[];
        }

        const fb = new FormBuilder().nonNullable;

        type Form = FormType<Model, { a: FormElementArray }>;

        const form: Form[T] = fb.group<Form[G]>({
            a: fb.array<Form['a'][I]>([
                fb.control(42)
            ]),
        })

        expect(form.value.a![0]).toBe(42);
        expect(form.controls.a.controls[0].value).toBe(42);
    })

    it('group inside array', () => {
        type Model = { a: number }[];

        const fb = new FormBuilder().nonNullable;

        type Form = FormType<Model, [FormElementGroup]>;

        const form: Form[T] = fb.array<Form[I][T]>([
            fb.group<Form[I][G]>({
                a: fb.control(42)
            })
        ]);

        expect(form.value[0].a).toBe(42);
        expect(form.controls[0].controls.a.value).toBe(42);
    })

    it('array inside array', () => {
        type Model = number[][];

        const fb = new FormBuilder().nonNullable;

        type Form = FormType<Model, [[FormElementControl]]>;

        const form: Form[T] = fb.array<Form[I][T]>([
            fb.array<Form[I][I][T]>([
                fb.control(42)
            ])
        ]);

        expect(form.value[0][0]).toBe(42);
        expect(form.controls[0].controls[0].value).toBe(42);
    })

    it('group inside group', () => {
        interface Model {
            a: { b: number; };
        }

        const fb = new FormBuilder().nonNullable;

        type Form = FormType<Model, { a: { b: FormElementControl } }>;

        const form: Form[T] = fb.group<Form[G]>({
            a: fb.group<Form['a'][G]>({
                b: fb.control(42)
            }),
        });

        expect(form.value.a?.b).toBe(42);
        expect(form.controls.a.controls.b.value).toBe(42);
    })

    it('array inside array inside array', () => {
        type Model = number[][][];

        const fb = new FormBuilder().nonNullable;

        type Form = FormType<Model, [[[FormElementControl]]]>;

        const form: Form[T] = fb.array<Form[I][T]>([
            fb.array<Form[I][I][T]>([
                fb.array<Form[I][I][I][T]>([
                    fb.control(42)
                ])
            ])
        ]);

        expect(form.value[0][0][0]).toBe(42);
        expect(form.controls[0].controls[0].controls[0].value).toBe(42);
    })

    it('array inside array inside group', () => {
        interface Model {
            a: Array<Array<number>>;
        }

        const fb = new FormBuilder().nonNullable;

        type Form = FormType<Model, { a: [[FormElementControl]] }>;

        const form: Form[T] = fb.group<Form[G]>({
            a: fb.array<Form['a'][I][T]>([
                fb.array<Form['a'][I][I][T]>([
                    fb.control(42)
                ])
            ])
        });

        expect(form.value.a![0][0]).toBe(42);
        expect(form.controls.a.controls[0].controls[0].value).toBe(42);
    })

    it('array inside group inside group', () => {
        interface Model {
            a: {
                b: number[]
            }
        }

        const fb = new FormBuilder().nonNullable;

        type Form = FormType<Model, { a: { b: FormElementArray } }>;

        const form: Form[T] = fb.group<Form[G]>({
            a: fb.group<Form['a'][G]>({
                b: fb.array<Form['a']['b'][I]>([
                    fb.control(42)
                ])
            })
        });

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

        const fb = new FormBuilder().nonNullable;

        type Form = FormType<Model, { a: { b: FormElementGroup } }>;

        const form: Form[T] = fb.group<Form[G]>({
            a: fb.group<Form['a'][G]>({
                b: fb.group<Form['a']['b'][G]>({
                    c: fb.control(42)
                })
            })
        });

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

        const fb = new FormBuilder().nonNullable;

        type Form = FormType<Model, [{ a: { b: FormElementGroup } }]>;

        const form: Form[T] = fb.array<Form[I][T]>([
            fb.group<Form[I][G]>({
                a: fb.group<Form[I]['a'][G]>({
                    b: fb.group<Form[I]['a']['b'][G]>({
                        c: fb.control(42)
                    })
                })
            })
        ]);

        expect(form.value[0].a?.b?.c).toBe(42);
        expect(form.controls[0].controls.a.controls.b.controls.c.value).toBe(42);
    })

    it('group inside array inside array', () => {
        type Model = {
            a: number;
        }[][]

        const fb = new FormBuilder().nonNullable;

        type Form = FormType<Model, [[FormElementGroup]]>;

        const form: Form[T] = fb.array<Form[I][T]>([
            fb.array<Form[I][I][T]>([
                fb.group<Form[I][I][G]>({
                    a: fb.control(42)
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

        const fb = new FormBuilder().nonNullable;

        type Form = FormType<Model, { a: [FormElementGroup] }>;

        const form: Form[T] = fb.group<Form[G]>({
            a: fb.array<Form['a'][I][T]>([
                fb.group<Form['a'][I][G]>({
                    b: fb.control(42)
                })
            ])
        });

        expect(form.value.a![0].b).toBe(42);
        expect(form.controls.a.controls[0].controls.b.value).toBe(42);
    })

    it('array inside group inside array', () => {
        type Model = Array<{ a: number[] }>

        const fb = new FormBuilder().nonNullable;

        type Form = FormType<Model, [{ a: FormElementArray }]>;

        const form: Form[T] = fb.array<Form[I][T]>([
            fb.group<Form[I][G]>({
                a: fb.array<Form[I]['a'][I]>([
                    fb.control(42)
                ])
            })
        ]);

        expect(form.value[0].a![0]).toBe(42);
        expect(form.controls[0].controls.a.controls[0].value).toBe(42);
    })

    it('group inside group inside array inside group', () => {
        interface Model {
            a: Array<{ b: { c: number } }>
        }

        const fb = new FormBuilder().nonNullable;

        type Form = FormType<Model, { a: [{ b: FormElementGroup }] }>;

        const form: Form[T] = fb.group<Form[G]>({
            a: fb.array<Form['a'][I][T]>([
                fb.group<Form['a'][I][G]>({
                    b: fb.group<Form['a'][I]['b'][G]>({
                        c: fb.control(42)
                    })
                })
            ])
        });

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

        const fb = new FormBuilder().nonNullable;

        type Form = FormType<DeepGroup, { a: { b: [{ c: FormElementGroup }] } }>;

        const form: Form[T] = fb.group<Form[G]>({
            a: fb.group<Form['a'][G]>({
                b: fb.array<Form['a']['b'][I][T]>([
                    fb.group<Form['a']['b'][I][G]>({
                        c: fb.group<Form['a']['b'][I]['c'][G]>({
                            d: fb.control(42)
                        })
                    })
                ])
            })
        });

        expect(form.value.a?.b![0].c?.d).toBe(42);
        expect(form.controls.a.controls.b.controls[0].controls.c.controls.d.value).toBe(42);
    })
});