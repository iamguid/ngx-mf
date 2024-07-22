import "@angular/compiler";

import { FormBuilder } from "@angular/forms";
import { FormElementControl, FormElementGroup, FormModel, FormType, T } from "../src";

describe('Misc tests', () => {
    it('undefined nullable optional field should be nonnullalbe', () => {
        interface Model {
            a?: number | null | undefined
        }

        const fb = new FormBuilder().nonNullable;

        type Form = FormModel<Model, FormElementGroup>;

        type t = Form['controls']

        const form: Form = fb.group<Form['controls']>({
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

        type Form = FormModel<Model, { a: FormElementGroup }>;
        type NestedForm = NonNullable<Form['controls']['a']>['controls'];

        const form: Form = fb.group<Form['controls']>({
            a: fb.group<NestedForm>({
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

        type Form = FormModel<Model>

        const form: Form = fb.group<Form['controls']>({
            a: fb.control(new Date('2022-07-08T06:46:28.452Z'))
        })

        expect(form.value.a?.toISOString()).toBe(new Date('2022-07-08T06:46:28.452Z').toISOString());
        expect(form.controls.a.value.toISOString()).toBe(new Date('2022-07-08T06:46:28.452Z').toISOString());
    })

    it('FormModel after Omit', () => {
        interface Model {
            a: number;
            b: number;
        }

        const fb = new FormBuilder().nonNullable;

        type Form = FormModel<Omit<Model, 'a'>>;

        const form: Form = fb.group<Form['controls']>({
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

        type Form = FormModel<Model>

        const form: Form = fb.group<Form['controls']>({
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

        type Form = FormModel<Model, { a: { b: FormElementGroup }, d: { e: FormElementGroup } }>;

        const form: Form = fb.group<Form['controls']>({
            a: fb.group<Form['controls']['a']['controls']>({
                b: fb.group<Form['controls']['a']['controls']['b']['controls']>({
                    c: fb.control(42)
                })
            }),
            d: fb.group<NonNullable<Form['controls']['d']>['controls']>({
                e: fb.group<NonNullable<NonNullable<Form['controls']['d']>['controls']['e']>['controls']>({
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

        type Form = FormModel<Model & { b: string }>;

        const form: Form = fb.group<Form['controls']>({
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

        type Form = FormModel<Model, { a: FormElementGroup }>

        const form: Form = fb.group<Form['controls']>({
            a: fb.group<NonNullable<Form['controls']['a']>['controls']>({
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

        type Form = FormModel<Model, FormElementGroup>

        const form: Form = fb.group<Form['controls']>({
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
    
        type WorkingForm = FormModel<Working>;
        type BrokenForm = FormModel<Broken>;

        const fb = new FormBuilder().nonNullable;
      
        const wf = fb.group<WorkingForm['controls']>({name: fb.control('Name')});
        const bf = fb.group<BrokenForm['controls']>({link: fb.control('Link')}); 
    })

    it('Undefined value and optional property https://github.com/iamguid/ngx-mf/issues/4', () => {
        interface Optional {
            optionalA?: number;
            optionalB?: number;
            optionalC: number | undefined;
            optionalD?: number | undefined;
            optionalE?: number | undefined;
        }
    
        type OptionalForm = FormModel<Optional>;

        const fb = new FormBuilder().nonNullable;
      
        const wf = fb.group<OptionalForm['controls']>({
            // optionalA: fb.control(321),
            optionalB: fb.control(123),
            optionalC: fb.control(undefined),
            optionalD: fb.control(undefined),
            optionalE: fb.control(432),
        });
    })
})
