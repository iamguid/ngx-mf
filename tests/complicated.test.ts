import "@angular/compiler";

import { FormBuilder, FormGroup } from "@angular/forms";
import { FormModel, InferModeNonNullable, InferModeNullable, InferModeOptional, InferModeRequired } from "../src";

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

        type Form = FormModel<Model1, { b: ['group'] }, InferModeNullable & InferModeRequired>;

        const form: Form = fb.group<Form['controls']>({
            a: fb.control(42),
            b: fb.array<Form['controls']['b']['controls'][0]>([
                fb.group<Form['controls']['b']['controls'][0]['controls']>({
                    a: fb.control('test'),
                    b: fb.control('test')
                })
            ])
        })

        expect(form.value.a).toBe(42);
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
            d: number
        }

        const fb = new FormBuilder();

        type Model1FormPart = FormModel<Model1, null, InferModeNonNullable & InferModeRequired>;
        type Model2FormPart = FormModel<Model2, null, InferModeNullable & InferModeOptional>;

        type Form = FormGroup<Model1FormPart['controls'] & Model2FormPart['controls']>;

        // With c and d
        const form1: Form = fb.group<Form['controls']>({
            a: fb.control(42, { nonNullable: true }),
            b: fb.control(42, { nonNullable: true }),
            c: fb.control(42),
            d: fb.control(null),
        })

        expect(form1.value.a).toBe(42);
        expect(form1.value.b).toBe(42);
        expect(form1.value.c).toBe(42);
        expect(form1.value.d).toBe(null);

        // Without c and d
        const form2: Form = fb.group<Form['controls']>({
            a: fb.control(42, { nonNullable: true }),
            b: fb.control(42, { nonNullable: true }),
        })

        expect(form2.value.a).toBe(42);
        expect(form2.value.b).toBe(42);
        expect(form2.value.c).toBeUndefined();
        expect(form2.value.d).toBeUndefined();
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

        const fb = new FormBuilder();

        type Form = FormModel<Model, null, InferModeNullable>

        const form1: Form = fb.group<Form['controls']>({
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

        const form2: FormModel<Model, { b: 'array' }, InferModeNullable> = fb.group({
            a: [42],
            b: fb.array([['test']]),
            c: [{
                d: {
                    e: [43],
                },
                f: {
                    g: 'test'
                },
            }]
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

        const form3: FormModel<Model, { c: 'group' }, InferModeNullable> = fb.group({
            a: [42],
            b: [['test']],
            c: fb.group({
                d: {
                    e: [43],
                },
                f: {
                    g: 'test'
                },
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
                    
        const form4: FormModel<Model, { c: { f: 'group' } }, InferModeNullable> = fb.group({
            a: [42],
            b: [['test']],
            c: fb.group({
                d: [{
                    e: [43],
                }],
                f: fb.group({
                    g: 'test'
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

        const form5: FormModel<Model, { c: { d: { e: 'array' } } }, InferModeNullable> = fb.group({
            a: [42],
            b: [['test']],
            c: fb.group({
                d: fb.group({
                    e: fb.array([[43]]),
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

        const form6: FormModel<Model, {
            b: 'array',
            c: {
                d: 'group',
                f: 'group',
            },
        }, InferModeNullable> = fb.group({
            a: [42],
            b: fb.array([['test']]),
            c: fb.group({
                d: fb.group({
                    e: [[43]],
                }),
                f: fb.group({
                    g: ['test']
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
