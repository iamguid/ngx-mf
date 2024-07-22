import "@angular/compiler"

import { FormBuilder } from "@angular/forms";
import { FormElementControl, FormElementGroup, FormType, G, T } from "../src/index.mjs";

describe('Misc tests', () => {
    it('undefined nullable optional field should be nonnullalbe', () => {
        interface Model {
            a?: number | null | undefined
        }

        const fb = new FormBuilder().nonNullable;

        type Form = FormType<Model, FormElementGroup>;

        const form: Form[T] = fb.group<Form[G]>({
            a: fb.control(42)
        })

        expect(form.value.a).toBe(42);
        expect(form.controls.a?.value).toBe(42);
    })

    it('nested undefined nullable optional fields should be nonnullable', () => {
        interface Model {
            a?: {
                b?: number | null;
            } | null;
        }

        const fb = new FormBuilder().nonNullable;

        type Form = FormType<Model, { a: FormElementGroup }>;
        type NestedForm = Form['a'];

        const form: Form[T] = fb.group<Form[G]>({
            a: fb.group<NestedForm[G]>({
                b: fb.control(42)
            })
        })

        expect(form.value.a?.b).toBe(42);
        expect(form.controls.a?.controls.b?.value).toBe(42);
    })

    it('Date inside FormControl', () => {
        interface Model {
            a: Date;
        }

        const fb = new FormBuilder().nonNullable;

        type Form = FormType<Model>

        const form: Form[T] = fb.group<Form[G]>({
            a: fb.control(new Date('2022-07-08T06:46:28.452Z'))
        })

        expect(form.value.a?.toISOString()).toBe(new Date('2022-07-08T06:46:28.452Z').toISOString());
        expect(form.controls.a.value.toISOString()).toBe(new Date('2022-07-08T06:46:28.452Z').toISOString());
    })

    it('FormType after Omit', () => {
        interface Model {
            a: number;
            b: number;
        }

        const fb = new FormBuilder().nonNullable;

        type Form = FormType<Omit<Model, 'a'>>;

        const form: Form[T] = fb.group<Form[G]>({
            b: fb.control(42)
        })

        expect(form.value.b).toBe(42);
        expect(form.controls.b.value).toBe(42);
    })

    it('nonNullable FormControl', () => {
        interface Model {
            a: number | null;
        }

        const fb = new FormBuilder();

        type Form = FormType<Model>

        const form: Form[T] = fb.group<Form[G]>({
            a: fb.control(42)
        })

        expect(form.value.a).toBe(42);
        expect(form.controls.a.value).toBe(42);
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

        const fb = new FormBuilder().nonNullable;

        type Form = FormType<Model, { a: { b: FormElementGroup }, d: { e: FormElementGroup } }>;

        const form: Form[T] = fb.group<Form[G]>({
            a: fb.group<Form['a'][G]>({
                b: fb.group<Form['a']['b'][G]>({
                    c: fb.control(42)
                })
            }),
            d: fb.group<Form['d'][G]>({
                e: fb.group<Form['d']['e'][G]>({
                    f: fb.control(42)
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

        const fb = new FormBuilder().nonNullable;

        type Form = FormType<Model & { b: string }>;

        const form: Form[T] = fb.group<Form[G]>({
            a: fb.control(42),
            b: fb.control('test'),
        })

        expect(form.value.a).toBe(42);
        expect(form.value.b).toBe('test');

        expect(form.controls.a.value).toBe(42);
        expect(form.controls.b.value).toBe('test');
    })

    it('get conntrols inside optional fields', () => {
        interface Model {
            a: {
                b: number
            }
        }

        const fb = new FormBuilder().nonNullable;

        type Form = FormType<Model, { a: FormElementGroup }>

        const form: Form[T] = fb.group<Form[G]>({
            a: fb.group<Form['a'][G]>({
                b: fb.control(42)
            })
        })

        expect(form.value.a?.b).toBe(42);
        expect(form.controls.a.controls.b.value).toBe(42);
    })

    it('corrupting objects', () => {
        interface Model {
            a: {
                b: {
                    c: number
                }
            }
        }

        const fb = new FormBuilder().nonNullable;

        type Form = FormType<Model, FormElementGroup>

        const form: Form[T] = fb.group<Form[G]>({
            a: fb.control({
                b: {
                    c: 42
                }
            })
        })

        expect(form.value.a?.b).toStrictEqual({ c: 42 });
        expect(form.controls.a.value.b).toStrictEqual({ c: 42 });
    })

    it('Two interfaces one in another', () => {
        interface Model2 {
            a?: number;
            b?: number;
        }

        interface Model {
            a?: {
                b?: Model2 | null
            }
        }

        const fb = new FormBuilder().nonNullable;

        type Form = FormType<Model, { a: { b: FormElementControl } }>;

        const form: Form[T] = fb.group<Form[T]['controls']>({
            a: fb.group<Form['a'][T]['controls']>({
                b: fb.control(null)
            })
        })

        expect(form.value.a?.b).toBeNull();
        expect(form.controls.a?.controls.b?.value).toBeNull();
    })

    it('Link property https://github.com/iamguid/ngx-mf/issues/5', () => {
        interface Working {
            name: string;
        }

        interface Broken {
            link: string;
        }
    
        type WorkingForm = FormType<Working>;
        type BrokenForm = FormType<Broken>;

        const fb = new FormBuilder().nonNullable;
      
        const wf = fb.group<WorkingForm[G]>({name: fb.control('Name')});
        const bf = fb.group<BrokenForm[G]>({link: fb.control('Link')}); 
    })

    it('Undefined value and optional property https://github.com/iamguid/ngx-mf/issues/4', () => {
        interface Optional {
            optionalA?: number;
            optionalB?: number;
            optionalC: number | undefined;
            optionalD?: number | undefined;
            optionalE?: number | undefined;
        }
    
        type OptionalForm = FormType<Optional>;

        const fb = new FormBuilder().nonNullable;
      
        const wf: OptionalForm[T] = fb.group<OptionalForm[G]>({
            // optionalA: fb.control(321),
            optionalB: fb.control(123),
            optionalC: fb.control(undefined),
            optionalD: fb.control(undefined),
            optionalE: fb.control(432),
        });
    })
})
