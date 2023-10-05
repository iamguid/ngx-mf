// Example 1
//
// Useful when you need to combine two models in one form

import "@angular/compiler";

import { FormBuilder, FormGroup } from "@angular/forms";
import { FormModel } from "../src";

interface ModelA {
    a: number;
}

interface ModelB {
    b: number;
}

type ModelAPartForm = FormModel<ModelA>
type ModelBPartForm = FormModel<ModelB>

// Then you just combine controls by union operator and place it in FormGroup
type FullForm = FormGroup<ModelAPartForm['controls'] & ModelBPartForm['controls']>

const fb = new FormBuilder().nonNullable;

// Now we can define field a without field b
const form1: FullForm = fb.group<FullForm['controls']>({
    b: fb.control(42),
    a: fb.control(42),
})

// Or we can define both fields
const form2: FullForm = fb.group<FullForm['controls']>({
    a: fb.control(42),
    b: fb.control(42),
})