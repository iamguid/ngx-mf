// Example 3
//
// Useful when you need any

import { FormBuilder, FormGroup } from "@angular/forms";
import { FormModel, Replace } from "../src";

interface ModelA {
    a: number;
}

interface ModelB {
    b: number;
}

interface ModelC {
    field: ModelA | ModelB
}

// You should use Replace
type Form = FormModel<ModelC, { field: Replace<FormGroup<any>> }>;

type FormModelA = FormModel<ModelA>;
type FormModelB = FormModel<ModelB>;

const fb = new FormBuilder().nonNullable;

// ModelA
const form1: Form = new FormGroup<Form['controls']>({
    field: fb.group<FormModelA['controls']>({
        a: fb.control(42),
    }),
});

// ModelB
const form2: Form = new FormGroup<Form['controls']>({
    field: fb.group<FormModelB['controls']>({
        b: fb.control(42),
    }),
});

// Then you can cast it to your model
(form1.controls.field.controls as FormModelA['controls']).a.value;
(form2.controls.field.controls as FormModelB['controls']).b.value;