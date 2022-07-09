import "@angular/compiler";

import { FormBuilder, FormGroup } from "@angular/forms";
import { FormModel } from "..";

describe('Misc tests', () => {
    it('objects inside FormControl', () => {
        interface Model {
            a: Date;
        }

        const fb = new FormBuilder();

        const form: FormModel<Model> = fb.group({
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

        const form: FormModel<Omit<Model, 'a'>> = fb.group({
            b: [42]
        })

        expect(form.value.b).toBe(42);
        expect(form.controls.b.value).toBe(42);
    })

    it.skip('non nullable FormControl', () => {
        interface Model {
            a: number;
        }

        const fb = new FormBuilder();

        // It doesn't work :(
        //
        // @ts-ignore
        const form: FormModel<Model> = fb.group({
            b: fb.control(42, { nonNullable: true })
        })

        expect(form.value.a)
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

        const form1: FormModel<Model> = fb.group({
            a: [42],
            b: [['test']],
            c: [{
                d: {
                    e: [43],
                },
                f: {
                    g: 'test'
                },
            }]
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

        const form2: FormModel<Model, { b: 'array' }> = fb.group({
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
12
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

        const form3: FormModel<Model, { c: 'group' }> = fb.group({
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
3
        expect(form3.controls.a.value).toBe(42);
        expect(form3.controls.b?.value![0]).toBe('test');
        expect(form3.controls.c.controls.d.value).toStrictEqual({ e: [43], });
        expect(form3.controls.c.controls.f.value).toStrictEqual({ g: 'test' });
                    
        const form4: FormModel<Model, { c: { f: 'group' } }> = fb.group({
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
34
        expect(form4.controls.a.value).toBe(42);
        expect(form4.controls.b?.value![0]).toBe('test');
        expect(form4.controls.c.controls.d.value).toStrictEqual({ e: [43] });
        expect(form4.controls.c.controls.f.controls.g.value).toBe('test');

        const form5: FormModel<Model, { c: { d: { e: 'array' } } }> = fb.group({
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
345
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
        }> = fb.group({
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
