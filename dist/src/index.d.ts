import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
export declare type FormModel<TModel, TAnnotations extends Record<string, any> | null = null> = FormModelInnerTraverse<TModel, TAnnotations>;
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
export declare type FormElementType = FormElementControl | FormElementGroup | FormElementArray | Replace<any>;
declare type OnlyKeys<T> = {
    [key in keyof T]-?: any;
};
declare type FormModelKeyofTraverse<TModel extends Record<string, any>, TAnnotations extends (OnlyKeys<TModel> | FormElementType)> = {
    [key in keyof OnlyKeys<TModel>]: FormModelInnerTraverse<TModel[key], TAnnotations extends OnlyKeys<TModel>[key] ? TAnnotations[key] : TAnnotations>;
};
declare type FormModelInnerTraverse<TModel, TAnnotations> = TAnnotations extends null ? TModel extends Array<any> ? FormModelInnerTraverse<TModel, FormElementArray> : TModel extends Record<string, any> ? FormModelInnerTraverse<TModel, FormElementGroup> : FormModelInnerTraverse<TModel, FormElementControl> : TAnnotations extends FormElementArray ? TModel extends Array<infer TInferredArrayValueType> ? FormArray<FormControl<TInferredArrayValueType>> : never : TAnnotations extends FormElementGroup ? TModel extends Record<string, any> ? FormGroup<FormModelKeyofTraverse<TModel, FormElementGroup>> : never : TAnnotations extends FormElementControl ? FormControl<TModel> : TAnnotations extends Replace<infer TInferredReplace> ? TInferredReplace : TAnnotations extends Array<infer TInferedAnnotations> ? TModel extends Array<infer TInferedArrayType> ? FormArray<FormModelInnerTraverse<TInferedArrayType, TInferedAnnotations>> : never : TAnnotations extends Record<string, any> ? TModel extends Record<string, any> ? FormGroup<FormModelKeyofTraverse<TModel, TAnnotations>> : never : FormModelInnerTraverse<TModel, FormElementControl>;
export {};
//# sourceMappingURL=index.d.ts.map