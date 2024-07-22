import "@angular/compiler"

import { FormBuilder, FormGroup } from "@angular/forms";
import { FormElementArray, FormElementGroup, FormModel, FormType, G, I, T } from "../src/index.mjs";

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

    it('Build complicated form using two models', () => {
        interface Model1 {
            a: number
            b: number
        }

        interface Model2 {
            c: number
            d: number | null
        }

        const fb = new FormBuilder().nonNullable;

        type Model1FormPart = FormModel<Model1, null>;
        type Model2FormPart = FormModel<Model2, null>;

        type Form = FormGroup<Model1FormPart['controls'] & Model2FormPart['controls']>;

        // With c and d
        const form1: Form = fb.group<Form['controls']>({
            a: fb.control(42),
            b: fb.control(42),
            c: fb.control(42),
            d: fb.control(null),
        })

        expect(form1.value.a).toBe(42);
        expect(form1.value.b).toBe(42);
        expect(form1.value.c).toBe(42);
        expect(form1.value.d).toBe(null);
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

        type Form1 = FormModel<Model>

        const form1: Form1 = fb.group<Form1['controls']>({
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

        type Form2 = FormModel<Model, { b: FormElementArray }>;

        const form2: Form2 = fb.group<Form2['controls']>({
            a: fb.control(42),
            b: fb.array<Form2['controls']['b']['controls'][0]>([
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

        type Form3 = FormModel<Model, { c: FormElementGroup }>;

        const form3: Form3 = fb.group<Form3['controls']>({
            a: fb.control(42),
            b: fb.control(['test']),
            c: fb.group<Form3['controls']['c']['controls']>({
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

        type Form4 = FormModel<Model, { c: { f: FormElementGroup } }>;

        const form4: Form4 = fb.group<Form4['controls']>({
            a: fb.control(42),
            b: fb.control(['test']),
            c: fb.group({
                d: fb.control({
                    e: [43],
                }),
                f: fb.group({
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

        type Form5 = FormModel<Model, { c: { d: { e: FormElementArray } } }>;

        const form5: Form5 = fb.group<Form5['controls']>({
            a: fb.control(42),
            b: fb.control(['test']),
            c: fb.group({
                d: fb.group({
                    e: fb.array([
                        fb.control(43)
                    ]),
                }),
                f: [{
                    g: 'test'
                }],
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

        type Form6 = FormModel<Model, {
            b: FormElementArray,
            c: {
                d: FormElementGroup,
                f: FormElementGroup,
            },
        }>

        const form6: Form6 = fb.group<Form6['controls']>({
            a: fb.control(42),
            b: fb.array<Form6['controls']['b']['controls'][0]>([
                fb.control('test')
            ]),
            c: fb.group<Form6['controls']['c']['controls']>({
                d: fb.group<Form6['controls']['c']['controls']['d']['controls']>({
                    e: fb.control([43]),
                }),
                f: fb.group<Form6['controls']['c']['controls']['f']['controls']>({
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
