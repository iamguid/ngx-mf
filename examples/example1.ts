// Example 1
//
// Useful when you need to combine two models in one form

import "@angular/compiler";

import { FormBuilder, FormGroup } from "@angular/forms";
import { FormModel, InferModeNonNullable, InferModeNullable, InferModeOptional, InferModeRequired, Replace } from "../src";

interface ModelA {
    a: number;
}

interface ModelB {
    b: number;
}

// You can pass different InferMode-s in your parts,
// for example ModelAPartForm will be Required and NonNullable,
// but ModelBPartForm will be Optional and Nullable
type ModelAPartForm = FormModel<ModelA, null, InferModeRequired & InferModeNonNullable>
type ModelBPartForm = FormModel<ModelB, null, InferModeOptional & InferModeNullable>

// Then you just combine controls by union operator and place it in FormGroup
type FullForm = FormGroup<ModelAPartForm['controls'] & ModelBPartForm['controls']>

const fb = new FormBuilder();

// Now we can define field a without field b
const form1: FullForm = fb.group<FullForm['controls']>({
    a: fb.control(42, { nonNullable: true })
})

// Or we can define both fields
const form2: FullForm = fb.group<FullForm['controls']>({
    a: fb.control(42, { nonNullable: true }),
    b: fb.control(42)
})