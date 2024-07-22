import "@angular/compiler"

import { FormBuilder, FormGroup } from "@angular/forms";
import { FormElementArray, FormElementGroup, FormType, G, I, T } from "../src/index.mjs";

describe('Complicated test', () => {
    it('Two models', () => {
        interface Model1 {
            a?: number | null,
            b?: Array<Model2>
        }

        interface Model2 {
            a?: string | null;
            b?: string | null;
        }

        const fb = new FormBuilder();

        type Form = FormType<Model1, { b: [FormElementGroup] }>;

        const form: Form[T] = fb.group<Form[G]>({
            b: fb.array<Form['b'][I][T]>([
                fb.group<Form['b'][I][G]>({
                    a: fb.control('test'),
                    b: fb.control('test')
                })
            ])
        })

        expect(form.value.a).toBe(undefined);
        expect(form.value.b![0].a).toBe('test');
        expect(form.value.b![0].b).toBe('test');
    })

    it('Build complicated form using union with two models', () => {
        interface Model1 {
            a: number
            b: number
        }

        interface Model2 {
            c: number
            d: number | null
        }

        const fb = new FormBuilder().nonNullable;

        type Form1 = FormType<Model1>;
        type Form2 = FormType<Model2>;
        type Form = FormType<Model1 & Model2>;

        // form by Model1
        const form1: Form1[T] = fb.group<Form1[G]>({
            a: fb.control(42),
            b: fb.control(42),
        })

        expect(form1.value.a).toBe(42);
        expect(form1.value.b).toBe(42);

        // Form by Model2
        const form2: Form2[T] = fb.group<Form2[G]>({
            c: fb.control(42),
            d: fb.control(null),
        })

        expect(form2.value.c).toBe(42);
        expect(form2.value.d).toBe(null);

        // Form with all fields
        const form: Form[T] = fb.group<Form[G]>({
            a: fb.control(42),
            b: fb.control(42),
            c: fb.control(42),
            d: fb.control(null),
        })

        expect(form.value.a).toBe(42);
        expect(form.value.b).toBe(42);
        expect(form.value.c).toBe(42);
        expect(form.value.d).toBe(null);
    })

    it('Complex form with different annotations', () => {
        interface Model {
            a: number;
            b: string[];
            c: {
                d: {
                    e: number[];
                }
                f: {
                    g: string;
                }
            }
        }

        const fb = new FormBuilder().nonNullable;

        type Form1 = FormType<Model>

        const form1: Form1[T] = fb.group<Form1[G]>({
            a: fb.control(42),
            b: fb.control(['test']),
            c: fb.control({
                d: {
                    e: [43],
                },
                f: {
                    g: 'test'
                },
            })
        });

        expect(form1.value.a).toBe(42);
        expect(form1.value.b![0]).toBe('test');
        expect(form1.value.c?.d?.e![0]).toBe(43);
        expect(form1.value.c?.f?.g).toBe('test');

        expect(form1.controls.a.value).toBe(42);
        expect(form1.controls.b.value![0]).toBe('test');
        expect(form1.controls.c.value).toStrictEqual({
            d: {
                e: [43],
            },
            f: {
                g: 'test'
            },
        });

        type Form2 = FormType<Model, { b: FormElementArray }>;

        const form2: Form2[T] = fb.group<Form2[G]>({
            a: fb.control(42),
            b: fb.array<Form2['b'][I]>([
                fb.control('test')
            ]),
            c: fb.control({
                d: {
                    e: [43],
                },
                f: {
                    g: 'test'
                },
            })
        });

        expect(form2.value.a).toBe(42);
        expect(form2.value.b![0]).toBe('test');
        expect(form2.value.c?.d?.e![0]).toBe(43);
        expect(form2.value.c?.f?.g).toBe('test');

        expect(form2.controls.a.value).toBe(42);
        expect(form2.controls.b.controls[0].value).toBe('test');
        expect(form2.controls.c.value).toStrictEqual({
            d: {
                e: [43],
            },
            f: {
                g: 'test'
            },
        });

        type Form3 = FormType<Model, { c: FormElementGroup }>;

        const form3: Form3[T] = fb.group<Form3[G]>({
            a: fb.control(42),
            b: fb.control(['test']),
            c: fb.group<Form3['c'][G]>({
                d: fb.control({
                    e: [43],
                }),
                f: fb.control({
                    g: 'test'
                }),
            })
        });

        expect(form3.value.a).toBe(42);
        expect(form3.value.b![0]).toBe('test');
        expect(form3.value.c?.d?.e![0]).toBe(43);
        expect(form3.value.c?.f?.g).toBe('test');

        expect(form3.controls.a.value).toBe(42);
        expect(form3.controls.b?.value![0]).toBe('test');
        expect(form3.controls.c.controls.d.value).toStrictEqual({ e: [43], });
        expect(form3.controls.c.controls.f.value).toStrictEqual({ g: 'test' });

        type Form4 = FormType<Model, { c: { f: FormElementGroup } }>;

        const form4: Form4[T] = fb.group<Form4[G]>({
            a: fb.control(42),
            b: fb.control(['test']),
            c: fb.group<Form4['c'][G]>({
                d: fb.control({
                    e: [43],
                }),
                f: fb.group<Form4['c']['f'][G]>({
                    g: fb.control('test')
                }),
            })
        });

        expect(form4.value.a).toBe(42);
        expect(form4.value.b![0]).toBe('test');
        expect(form4.value.c?.d?.e![0]).toBe(43);
        expect(form4.value.c?.f?.g).toBe('test');

        expect(form4.controls.a.value).toBe(42);
        expect(form4.controls.b?.value![0]).toBe('test');
        expect(form4.controls.c.controls.d.value).toStrictEqual({ e: [43] });
        expect(form4.controls.c.controls.f.controls.g.value).toBe('test');

        type Form5 = FormType<Model, { c: { d: { e: FormElementArray } } }>;

        const form5: Form5[T] = fb.group<Form5[G]>({
            a: fb.control(42),
            b: fb.control(['test']),
            c: fb.group<Form5['c'][G]>({
                d: fb.group<Form5['c']['d'][G]>({
                    e: fb.array<Form5['c']['d']['e'][I]>([
                        fb.control(43)
                    ]),
                }),
                f: fb.control({ g: 'test' }),
            })
        });

        expect(form5.value.a).toBe(42);
        expect(form5.value.b![0]).toBe('test');
        expect(form5.value.c?.d?.e![0]).toBe(43);
        expect(form5.value.c?.f?.g).toBe('test');

        expect(form5.controls.a.value).toBe(42);
        expect(form5.controls.b?.value![0]).toBe('test');
        expect(form5.controls.c.controls.d.controls.e.controls[0].value).toStrictEqual(43);
        expect(form5.controls.c.controls.f.value).toStrictEqual({ g: 'test' });

        type Form6 = FormType<Model, {
            b: FormElementArray,
            c: {
                d: FormElementGroup,
                f: FormElementGroup,
            },
        }>

        const form6: Form6[T] = fb.group<Form6[G]>({
            a: fb.control(42),
            b: fb.array<Form6['b'][I]>([
                fb.control('test')
            ]),
            c: fb.group<Form6['c'][G]>({
                d: fb.group<Form6['c']['d'][G]>({
                    e: fb.control([43]),
                }),
                f: fb.group<Form6['c']['f'][G]>({
                    g: fb.control('test')
                }),
            })
        })

        expect(form6.value.a).toBe(42);
        expect(form6.value.b![0]).toBe('test');
        expect(form6.value.c?.d?.e![0]).toBe(43);
        expect(form6.value.c?.f?.g).toBe('test');

        expect(form6.controls.a.value).toBe(42);
        expect(form6.controls.b?.controls![0].value).toBe('test');
        expect(form6.controls.c.controls.d.controls.e.value![0]).toBe(43);
        expect(form6.controls.c.controls.f.controls.g.value).toBe('test');
    })
})
