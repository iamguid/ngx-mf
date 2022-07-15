import "@angular/compiler";

import { FormBuilder, FormGroup } from "@angular/forms";
import { FormModel, InferModeFromModel, InferModeNonNullable, InferModeNullable, InferModeOptional } from "../src";

describe('Misc tests', () => {
    it('undefined nullable optional field', () => {
        interface Model {
            a?: number | null | undefined
        }

        const fb = new FormBuilder();

        type Form = FormModel<Model, null, InferModeNullable>;

        const form: Form = fb.group<Form['controls']>({
            a: fb.control(42)
        })

        expect(form.value.a).toBe(42);
        expect(form.controls.a.value).toBe(42);
    })

    it('nested undefined nullable optional fields', () => {
        interface Model {
            a?: {
                b?: number | null;
            } | null;
        }

        const fb = new FormBuilder();

        type Form = FormModel<Model, { a: 'group' }, InferModeNullable>;
        type NestedForm = NonNullable<Form['controls']['a']['controls']>;

        const form: Form = fb.group<Form['controls']>({
            a: fb.group<NestedForm>({
                b: fb.control(42)
            })
        })

        expect(form.value.a?.b).toBe(42);
        expect(form.controls.a?.controls?.b.value).toBe(42);
    })

    it('Date inside FormControl', () => {
        interface Model {
            a: Date;
        }

        const fb = new FormBuilder();

        const form: FormModel<Model, null, InferModeNullable> = fb.group({
            a: [new Date('2022-07-08T06:46:28.452Z')]
        })

        expect(form.value.a?.toISOString()).toBe(new Date('2022-07-08T06:46:28.452Z').toISOString());
        expect(form.controls.a.value?.toISOString()).toBe(new Date('2022-07-08T06:46:28.452Z').toISOString());
    })

    it('FormModel after Omit', () => {
        interface Model {
            a: number;
            b: number;
        }

        const fb = new FormBuilder();

        const form: FormModel<Omit<Model, 'a'>, null, InferModeNullable> = fb.group({
            b: [42]
        })

        expect(form.value.b).toBe(42);
        expect(form.controls.b.value).toBe(42);
    })

    it('non nullable FormControl', () => {
        interface Model {
            a: number | null;
        }

        const fb = new FormBuilder();

        type Form = FormModel<Model, null, InferModeNonNullable>

        const form: Form = fb.group<Form['controls']>({
            a: fb.control(42, { nonNullable: true })
        })

        expect(form.value.a).toBe(42);
        expect(form.controls.a.value).toBe(42);
    })

    it('complex form', () => {
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

    it('bubbling', () => {
        interface Model {
            a: {
                b: {
                    c: number;
                }
            },
            d?: {
                e?: {
                    f?: number
                }
            }
        }

        const fb = new FormBuilder();

        const form: FormModel<Model, { a: { b: 'group' }, d: { e: 'group' } }, InferModeNullable> = fb.group({
            a: fb.group({
                b: fb.group({
                    c: [42]
                })
            }),
            d: fb.group({
                e: fb.group({
                    f: [42]
                })
            })
        })

        expect(form.value.a?.b?.c).toBe(42);
        expect(form.value.d?.e?.f).toBe(42);
    })

    it('additional field', () => {
        interface Model {
            a: number;
        } 

        const fb = new FormBuilder();

        const form: FormModel<Model & { b: string }, null, InferModeNullable> = fb.group({
            a: [42],
            b: ['test'],
        })

        expect(form.value.a).toBe(42);
        expect(form.value.b).toBe('test');

        expect(form.controls.a.value).toBe(42);
        expect(form.controls.b.value).toBe('test');
    })

    it('forms union where some fields are required and some is optional', () => {
        interface ModelA {
            a?: number;
        }

        interface ModelB {
            b?: number;
        }

        type Form1 = FormModel<ModelA, null, InferModeNonNullable>;
        type Form2 = FormModel<ModelB, null, InferModeNullable & InferModeOptional>;
        type UnionFormGroupControls = Form1['controls'] & Form2['controls'];

        const fb = new FormBuilder();

        // Without field b
        const form1: FormGroup<UnionFormGroupControls> = fb.group<UnionFormGroupControls>({
            a: fb.control(42, { nonNullable: true })
        })

        expect(form1.value.a).toBe(42);
        expect(form1.value.b).toBeUndefined();
        expect(form1.controls.a.value).toBe(42);
        expect(form1.controls.b?.value).toBeUndefined();

        // With field b
        const form2: FormGroup<UnionFormGroupControls> = fb.group<UnionFormGroupControls>({
            a: fb.control(42, { nonNullable: true }),
            b: fb.control(42)
        })

        expect(form2.value.a).toBe(42);
        expect(form2.value.b).toBe(42);
        expect(form2.controls.a.value).toBe(42);
        expect(form2.controls.b?.value).toBe(42);
    })

    it('get conntrols inside optional fields', () => {
        interface Model {
            a: {
                b: number
            }
        }

        const fb = new FormBuilder();

        type Form = FormModel<Model, { a: 'group' }, InferModeNullable & InferModeOptional>

        const form: Form = fb.group<Form['controls']>({
            a: fb.group<NonNullable<Form['controls']['a']>['controls']>({
                b: fb.control(42)
            })
        })

        expect(form.value.a?.b).toBe(42);
        expect(form.controls.a?.controls.b?.value).toBe(42);
    })

    it('corrupting objects', () => {
        interface Model {
            a: {
                b: {
                    c: number
                }
            }
        }

        const fb = new FormBuilder();

        type Form = FormModel<Model, 'group', InferModeNullable & InferModeOptional>

        const form: Form = fb.group<Form['controls']>({
            a: fb.control({
                b: {
                    c: 42
                }
            })
        })

        expect(form.value.a?.b).toStrictEqual({ c: 42 });
        expect(form.controls.a?.value?.b).toStrictEqual({ c: 42 });
    })
})
