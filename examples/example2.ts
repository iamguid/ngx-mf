// Example 2
//
// Usefull when you need to omit some fields from nested models

import { FormBuilder } from "@angular/forms";
import { FormElementGroup, FormModel, InferModeNullable, InferModeRequired } from "../src";

interface ModelA {
    id: number;
    a: number;
}

interface ModelB {
    id: number;
    a: number;
}

interface ModelC {
    modelA: ModelA;
    modelB: ModelB;
    b: number;
    c: number;
}

type FormModelA = Omit<ModelA, 'id'>;
type FormModelB = Omit<ModelB, 'id'>;

// We just omit fields and rewrite it
type FormModelC = Omit<ModelC, 'modelA' | 'modelB'> & {
    modelA: FormModelA;
    modelB: FormModelB;
}

type FullForm = FormModel<FormModelC, { modelA: FormElementGroup, modelB: FormElementGroup }, InferModeRequired & InferModeNullable>;

const fb = new FormBuilder();

// Now we have form without id
const form: FullForm = fb.group<FullForm['controls']>({
    modelA: fb.group<FullForm['controls']['modelA']['controls']>({
        a: fb.control(42),
    }),
    modelB: fb.group<FullForm['controls']['modelB']['controls']>({
        a: fb.control(42),
    }),
    b: fb.control(42),
    c: fb.control(42),
})