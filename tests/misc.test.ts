import "@angular/compiler";

import { FormBuilder } from "@angular/forms";
import { FormElementControl, FormElementGroup, FormModel, InferModeFromModel, InferModeNonNullable, InferModeNullable, InferModeOptional, InferModeRequired } from "../src";

describe('Misc tests', () => {
    it('undefined nullable optional field should be nonnullalbe', () => {
        interface Model {
            a?: number | null | undefined
        }

        const fb = new FormBuilder();

        type Form = FormModel<Model, null, InferModeFromModel & InferModeNonNullable>;

        const form: Form = fb.group<Form['controls']>({
            a: fb.control(42, { nonNullable: true })
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

        const fb = new FormBuilder();

        type Form = FormModel<Model, { a: FormElementGroup }, InferModeFromModel & InferModeNonNullable>;
        type NestedForm = NonNullable<NonNullable<Form['controls']['a']>['controls']>;

        const form: Form = fb.group<Form['controls']>({
            a: fb.group<NestedForm>({
                b: fb.control(42, { nonNullable: true })
            })
        })

        expect(form.value.a?.b).toBe(42);
        expect(form.controls.a?.controls.b?.value).toBe(42);
    })

    it('Date inside FormControl', () => {
        interface Model {
            a: Date;
        }

        const fb = new FormBuilder();

        type Form = FormModel<Model, null, InferModeFromModel & InferModeNonNullable>

        const form: Form = fb.group<Form['controls']>({
            a: fb.control(new Date('2022-07-08T06:46:28.452Z'), { nonNullable: true })
        })

        expect(form.value.a?.toISOString()).toBe(new Date('2022-07-08T06:46:28.452Z').toISOString());
        expect(form.controls.a.value.toISOString()).toBe(new Date('2022-07-08T06:46:28.452Z').toISOString());
    })

    it('FormModel after Omit', () => {
        interface Model {
            a: number;
            b: number;
        }

        const fb = new FormBuilder();

        type Form = FormModel<Omit<Model, 'a'>, null, InferModeFromModel & InferModeNullable>;

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

        type Form = FormModel<Model, null, InferModeFromModel & InferModeNonNullable>

        const form: Form = fb.group<Form['controls']>({
            a: fb.control(42, { nonNullable: true })
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

        const fb = new FormBuilder();

        type Form = FormModel<Model, { a: { b: FormElementGroup }, d: { e: FormElementGroup } }, InferModeNullable & InferModeRequired>;

        const form: Form = fb.group<Form['controls']>({
            a: fb.group<Form['controls']['a']['controls']>({
                b: fb.group<Form['controls']['a']['controls']['b']['controls']>({
                    c: fb.control(42)
                })
            }),
            d: fb.group<Form['controls']['d']['controls']>({
                e: fb.group<Form['controls']['d']['controls']['e']['controls']>({
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

        const fb = new FormBuilder();

        type Form = FormModel<Model & { b: string }, null, InferModeNullable & InferModeRequired>;

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

        const fb = new FormBuilder();

        type Form = FormModel<Model, { a: FormElementGroup }, InferModeNullable & InferModeOptional>

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

        type Form = FormModel<Model, FormElementGroup, InferModeNullable & InferModeOptional>

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

    it('Two interfaces one in another', () => {
        interface Model2 {
            a?: number;
            b?: number;
        }

        interface Model {
            a?: {
                b?: Model2
            }
        }

        const fb = new FormBuilder();

        type Form = FormModel<Model, { a: { b: FormElementControl } }>;

        const form: Form = fb.group<Form['controls']>({
            a: fb.group<Form['controls']['a']['controls']>({
                b: fb.control(null)
            })
        })

        expect(form.value.a?.b).toBeNull();
        expect(form.controls.a.controls.b.value).toBeNull();
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

        const fb = new FormBuilder();
      
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
    
        type OptionalForm = FormModel<Optional, null, InferModeFromModel & InferModeNonNullable>;

        const fb = new FormBuilder().nonNullable;
      
        const wf = fb.group<OptionalForm['controls']>({
            // optionalA - when field is optinal, control should be optional
            optionalB: fb.control(123), // when field is optinal, control should be optional
            optionalC: fb.control(undefined), // when undefined on value, control value should be undefinable too
            optionalD: fb.control(undefined), // when undefined on value and field is optional, control value should be undefinable too
            // optionalE - when undefined on value and field is optional, control should be optional
        });
    })
})
