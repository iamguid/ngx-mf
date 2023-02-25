import "@angular/compiler";

import { FormBuilder } from "@angular/forms"
import { FormElementArray, FormElementGroup, FormModel, InferModeFromModel, InferModeNonNullable, InferModeNullable, InferModeOptional, InferModeRequired } from "../src";

describe('InferModeFromModel', () => {
    it('flat object', () => {
        interface Model {
            a?: number,
            b: number | null
        }

        const fb = new FormBuilder();

        type Form = FormModel<Model, null, InferModeFromModel>;

        // With field a
        const form1: Form = fb.group<Form['controls']>({
            a: fb.control(42, { nonNullable: true }),
            b: fb.control(42)
        })

        expect(form1.value.a).toBe(42);
        expect(form1.value.b).toBe(42);
        expect(form1.controls.a?.value).toBe(42);
        expect(form1.controls.b.value).toBe(42);

        // Without field a
        const form2: Form = fb.group<Form['controls']>({
            b: fb.control(42)
        })

        expect(form2.value.a).toBeUndefined();
        expect(form2.value.b).toBe(42);
        expect(form2.controls.a?.value).toBeUndefined();
        expect(form2.controls.b.value).toBe(42);
    })

    it('array', () => {
        interface Model {
            a: number[] | null
            b: (number | null)[]
        }

        const fb = new FormBuilder();

        type Form = FormModel<Model, { a: FormElementArray, b: FormElementArray }, InferModeFromModel>
        type FormArrayA = Form['controls']['a']['controls'][0]
        type FormArrayB = Form['controls']['b']['controls'][0]

        const form: Form = fb.group<Form['controls']>({
            a: fb.array<FormArrayA>([ fb.control(42, { nonNullable: true }) ]),
            b: fb.array<FormArrayB>([ fb.control(42), fb.control(null) ]),
        })

        expect(form.value.a![0]).toBe(42);
        expect(form.value.b![0]).toBe(42);
        expect(form.value.b![1]).toBe(null);
        expect(form.controls.a.controls[0].value).toBe(42);
        expect(form.controls.b.controls[0].value).toBe(42);
        expect(form.controls.b.controls[1].value).toBe(null);
    })

    it('nested object', () => {
        interface Model {
            a?: {
                b?: number
                c: number | null
            }
        }

        const fb = new FormBuilder();

        type Form = FormModel<Model, { a: FormElementGroup }, InferModeFromModel>;

        const form: Form = fb.group<Form['controls']>({
            a: fb.group<NonNullable<Form['controls']['a']>['controls']>({
                b: fb.control(42, { nonNullable: true }),
                c: fb.control(null)
            }),
        })

        expect(form.value.a?.b).toBe(42);
        expect(form.value.a?.c).toBe(null);
        expect(form.controls.a?.controls.b?.value).toBe(42);
        expect(form.controls.a?.controls.c?.value).toBe(null);
    })
});

describe('InferModeFromModel & InferModeNonNullable', () => {
    it('nullable flat object', () => {
        interface Model {
            a?: number | null | undefined,
            b: number | null,
        }

        const fb = new FormBuilder().nonNullable;

        type Form = FormModel<Model, null, InferModeFromModel & InferModeNonNullable>;

        const form: Form = fb.group<Form['controls']>({
            a: fb.control(42),
            b: fb.control(42)
        })

        expect(form.value.a).toBe(42);
        expect(form.value.b).toBe(42);
        expect(form.controls.a?.value).toBe(42);
        expect(form.controls.b.value).toBe(42);
    })

    it('nullable nested object', () => {
        interface Model {
            a?: {
                b?: number | null
            } | null
        }

        const fb = new FormBuilder().nonNullable;

        type Form = FormModel<Model, { a: FormElementGroup }, InferModeFromModel & InferModeNonNullable>;
        type NestedForm = FormModel<Model['a'], FormElementGroup, InferModeFromModel & InferModeNonNullable>

        const form: Form = fb.group<Form['controls']>({
            a: fb.group<NestedForm['controls']>({
                b: fb.control(42)
            })
        })

        expect(form.value.a?.b).toBe(42);
        expect(form.controls.a?.controls.b?.value).toBe(42);
    })

    it('nullable array', () => {
        interface Model {
            a?: number[] | null
            b: number[] | null
        }

        const fb = new FormBuilder().nonNullable;

        type Form = FormModel<Model, { a: FormElementArray, b: FormElementArray }, InferModeFromModel & InferModeNonNullable>

        const form: Form = fb.group<Form['controls']>({
            a: fb.array([ fb.control(42) ]),
            b: fb.array([ fb.control(42) ]),
        })

        expect(form.value.a![0]).toBe(42);
        expect(form.value.b![0]).toBe(42);
        expect(form.controls.a?.controls[0].value).toBe(42);
        expect(form.controls.b.controls[0].value).toBe(42);
    })
})

describe('InferModeFromModel & InferModeNullable', () => {
    it('nonnullable flat object', () => {
        interface Model {
            a?: number,
            b: number
        }

        const fb = new FormBuilder();

        type Form = FormModel<Model, null, InferModeFromModel & InferModeNullable>

        const form: Form = fb.group<Form['controls']>({
            a: fb.control(42),
            b: fb.control(null)
        })

        expect(form.value.a).toBe(42);
        expect(form.value.b).toBe(null);
        expect(form.controls.a?.value).toBe(42);
        expect(form.controls.b.value).toBe(null);
    })

    it('nonnullable nested object', () => {
        interface Model {
            a: {
                b: number
                c: number
            }
        }

        const fb = new FormBuilder();

        type Form = FormModel<Model, { a: FormElementGroup }, InferModeFromModel & InferModeNullable>;
        type NestedForm = Form['controls']['a']

        const form: Form = fb.group<Form['controls']>({
            a: fb.group<NestedForm['controls']>({
                b: fb.control(42),
                c: fb.control(null)
            })
        })

        expect(form.value.a?.b).toBe(42);
        expect(form.value.a?.c).toBe(null);
        expect(form.controls.a.controls.b.value).toBe(42);
        expect(form.controls.a.controls.c.value).toBe(null);
    })

    it('nullable array', () => {
        interface Model {
            a: number[] | null
            b: (number | null)[]
        }

        const fb = new FormBuilder();

        type Form = FormModel<Model, { a: FormElementArray, b: FormElementArray }, InferModeFromModel & InferModeNullable>
        type FormArrayA = Form['controls']['a']['controls'][0]
        type FormArrayB = Form['controls']['b']['controls'][0]

        const form: Form = fb.group<Form['controls']>({
            a: fb.array<FormArrayA>([ fb.control(42), fb.control(null) ]),
            b: fb.array<FormArrayB>([ fb.control(42), fb.control(null) ]),
        })

        expect(form.value.a![0]).toBe(42);
        expect(form.value.a![1]).toBe(null);
        expect(form.value.b![0]).toBe(42);
        expect(form.value.b![1]).toBe(null);
        expect(form.controls.a.controls[0].value).toBe(42);
        expect(form.controls.a.controls[1].value).toBe(null);
        expect(form.controls.b.controls[0].value).toBe(42);
        expect(form.controls.b.controls[1].value).toBe(null);
    })
})

describe('InferModeOptional & InferModeNonNullable', () => {
    it('nullable optional and required', () => {
        interface Model {
            a?: number,
            b: number,
            c?: number | null,
            d: number | null
        }

        const fb = new FormBuilder().nonNullable;

        type Form = FormModel<Model, null, InferModeNonNullable & InferModeOptional>;

        // With field b
        const form1: Form = fb.group<Form['controls']>({
            a: fb.control(42),
            b: fb.control(42),

            c: fb.control(42),
            d: fb.control(42),
        })

        expect(form1.value.a).toBe(42);
        expect(form1.value.b).toBe(42);
        expect(form1.value.c).toBe(42);
        expect(form1.value.d).toBe(42);
        expect(form1.controls.a?.value).toBe(42);
        expect(form1.controls.b?.value).toBe(42);
        expect(form1.controls.c?.value).toBe(42);
        expect(form1.controls.d?.value).toBe(42);

        // Without field a and b
        const form2: Form = fb.group<Form['controls']>({
            c: fb.control(42),
            d: fb.control(42),
        })

        expect(form2.value.a).toBeUndefined();
        expect(form2.value.b).toBeUndefined();
        expect(form2.value.c).toBe(42);
        expect(form2.value.d).toBe(42);
        expect(form2.controls.a?.value).toBeUndefined();
        expect(form2.controls.b?.value).toBeUndefined();
        expect(form1.controls.c?.value).toBe(42);
        expect(form1.controls.d?.value).toBe(42);
    })
})

describe('InferModeOptional & InferModeNullable', () => {
    it('nonnullable optional and required', () => {
        interface Model {
            a?: number,
            b: number
        }

        const fb = new FormBuilder();

        type Form = FormModel<Model, null, InferModeNullable & InferModeOptional>;

        // With field a
        const form1: Form = fb.group<Form['controls']>({
            a: fb.control(42),
            b: fb.control(null)
        })

        expect(form1.value.a).toBe(42);
        expect(form1.value.b).toBe(null);
        expect(form1.controls.a?.value).toBe(42);
        expect(form1.controls.b?.value).toBe(null);

        // Without field a
        const form2: Form = fb.group<Form['controls']>({
            b: fb.control(null)
        })

        expect(form2.value.a).toBeUndefined();
        expect(form2.value.b).toBe(null);
        expect(form2.controls.a?.value).toBeUndefined();
        expect(form2.controls.b?.value).toBe(null);
    })
})

describe('InferModeOptional & InferModeFromModel', () => {
    it('nullable optional and required', () => {
        interface Model {
            a?: number | null
            b: number,
            c?: number,
            d: number | null,
        }

        const fb = new FormBuilder();

        type Form = FormModel<Model, null, InferModeFromModel & InferModeOptional>;

        // With a and b
        const form1: Form = fb.group<Form['controls']>({
            a: fb.control(42),
            b: fb.control(42, { nonNullable: true }),
            c: fb.control(42, { nonNullable: true }),
            d: fb.control(null),
        })

        expect(form1.value.a).toBe(42);
        expect(form1.value.b).toBe(42);
        expect(form1.value.c).toBe(42);
        expect(form1.value.d).toBe(null);
        expect(form1.controls.a?.value).toBe(42);
        expect(form1.controls.b?.value).toBe(42);
        expect(form1.controls.c?.value).toBe(42);
        expect(form1.controls.d?.value).toBe(null);

        // Without a and b
        const form2: Form = fb.group<Form['controls']>({
            c: fb.control(42, { nonNullable: true }),
            d: fb.control(null),
        })

        expect(form2.value.a).toBeUndefined();
        expect(form2.value.b).toBeUndefined();
        expect(form2.value.c).toBe(42);
        expect(form2.value.d).toBe(null);
        expect(form2.controls.a?.value).toBeUndefined();
        expect(form2.controls.b?.value).toBeUndefined();
        expect(form2.controls.c?.value).toBe(42);
        expect(form2.controls.d?.value).toBe(null);
    })
})

describe('InferModeRequired & InferModeNonNullable', () => {
    it('nullable optional and required', () => {
        interface Model {
            a?: number | null
            b: number | null
        }

        const fb = new FormBuilder().nonNullable;

        type Form = FormModel<Model, null, InferModeNonNullable & InferModeRequired>;

        const form: Form = fb.group<Form['controls']>({
            a: fb.control(42),
            b: fb.control(42)
        })

        expect(form.value.a).toBe(42);
        expect(form.value.b).toBe(42);
        expect(form.controls.a.value).toBe(42);
        expect(form.controls.b.value).toBe(42);
    })
})

describe('InferModeRequired & InferModeNullable', () => {
    it('optional and required', () => {
        interface Model {
            a?: number,
            b: number | null
        }

        const fb = new FormBuilder().nonNullable;

        type Form = FormModel<Model, null, InferModeNullable & InferModeRequired>;

        const form1: Form = fb.group<Form['controls']>({
            a: fb.control(42),
            b: fb.control(42)
        })

        expect(form1.value.a).toBe(42);
        expect(form1.value.b).toBe(42);
        expect(form1.controls.a.value).toBe(42);
        expect(form1.controls.b.value).toBe(42);
    })
})

describe('InferModeRequired & InferModeFromModel', () => {
    it('nullable optional and required', () => {
        interface Model {
            a?: number | null
            b: number,
            c?: number,
            d: number | null,
        }

        const fb = new FormBuilder();

        type Form = FormModel<Model, null, InferModeFromModel & InferModeRequired>;

        const form: Form = fb.group<Form['controls']>({
            a: fb.control(42),
            b: fb.control(42, { nonNullable: true }),
            c: fb.control(42, { nonNullable: true }),
            d: fb.control(null),
        })

        expect(form.value.a).toBe(42);
        expect(form.value.b).toBe(42);
        expect(form.value.c).toBe(42);
        expect(form.value.d).toBe(null);
        expect(form.controls.a?.value).toBe(42);
        expect(form.controls.b?.value).toBe(42);
        expect(form.controls.c?.value).toBe(42);
        expect(form.controls.d?.value).toBe(null);
    })
})