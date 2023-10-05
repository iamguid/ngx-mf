// @ts-nocheck 
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
export declare type FormModel<TModel, TAnnotations extends Object | null = null> = FormModelInnerTraverse<TModel, TAnnotations>;
export declare type Replace<T extends AbstractControl> = T & {
    __replace__: '__replace__';
};
export declare type FormElementControl = {
    __control__: '__control__';
};
export declare type FormElementGroup = {
    __group__: '__group__';
};
export declare type FormElementArray = {
    __array__: '__array__';
};
export declare type FormElementType = FormElementControl | FormElementGroup | FormElementArray;
declare type PrepareModel<T extends object> = {
    [key in keyof T]-?: T[key];
};
declare type FormModelKeyofTraverse<TModel extends object, TAnnotations, TPreparedModel = PrepareModel<TModel>> = {
    [key in keyof TPreparedModel]: FormModelInnerTraverse<TModel[key], TAnnotations[key]>;
};
declare type FormModelInnerTraverse<TModel, TAnnotations> = TAnnotations extends null ? TModel extends Array<any> ? FormModelInnerTraverse<TModel, FormElementArray> : TModel extends object ? FormModelInnerTraverse<TModel, FormElementGroup> : FormModelInnerTraverse<TModel, FormElementArray> : TAnnotations extends FormElementArray ? TModel extends Array<infer TInferredArrayValueType> ? FormArray<FormControl<TInferredArrayValueType>> : never : TAnnotations extends FormElementGroup ? TModel extends object ? FormGroup<FormModelKeyofTraverse<TModel, FormElementGroup>> : never : TAnnotations extends FormElementControl ? FormControl<TModel> : TAnnotations extends Replace<infer TInferredReplace> ? TInferredReplace : TAnnotations extends Array<infer TInferedAnnotations> ? TModel extends Array<infer TInferedArrayType> ? FormArray<FormModelInnerTraverse<TInferedArrayType, TInferedAnnotations>> : never : TAnnotations extends object ? TModel extends object ? FormGroup<FormModelKeyofTraverse<TModel, TAnnotations>> : never : FormModelInnerTraverse<TModel, FormElementControl>;
export {};
//# sourceMappingURL=index.d.ts.map