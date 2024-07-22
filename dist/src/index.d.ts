import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
export type FormModel<TModel, TAnnotation extends FormElementTree = null> = BuildFormTreeNode<TModel, TAnnotation>;
export type FormType<TModel, TAnnotation extends FormElementTree = null> = BuildFormTypeTreeNode<TModel, TAnnotation>;
export type FormElementControl = {
    __kind__: '__control__';
};
export type FormElementGroup = {
    __kind__: '__group__';
};
export type FormElementArray = {
    __kind__: '__array__';
};
export type FormElement = FormElementControl | FormElementGroup | FormElementArray;
export type FormElementTree = {
    [key: string]: FormElementTree;
} | Array<FormElementTree> | FormElement | null;
declare const T: unique symbol;
declare const I: unique symbol;
declare const G: unique symbol;
export type T = typeof T;
export type I = typeof I;
export type G = typeof G;
type Structure<T, TValue = any> = {
    [key in keyof T]?: TValue;
};
type BuildFormTypeTreeKeyof<TModel extends Record<string, any>, TAnnotation extends Structure<TModel>> = {
    [key in keyof Required<TModel>]-?: BuildFormTypeTreeNode<TModel[key], TAnnotation[key]>;
};
type BuildFormTypeTreeNode<TModel, TAnnotation extends FormElementTree, TResult extends AbstractControl = BuildFormTreeNode<TModel, TAnnotation>> = TResult extends FormArray ? {
    [T]: TResult;
    [I]: TModel extends Array<infer TArrayElement> ? TAnnotation extends Array<infer TArrayElementAnnotation extends FormElementTree> ? BuildFormTypeTreeNode<TArrayElement, TArrayElementAnnotation> : TAnnotation extends FormElementArray ? BuildFormTypeTreeNode<TArrayElement, FormElementArray> : TResult['controls'][0] : BuildFormTypeTreeNode<TModel, TAnnotation>;
} : TResult extends FormGroup ? {
    [T]: TResult;
    [G]: TResult['controls'];
} & (TModel extends Record<string, any> ? BuildFormTypeTreeKeyof<TModel, TAnnotation> : never) : {
    [T]: TResult;
};
type BuildFormTreeKeyof<TModel extends Record<string, any>, TAnnotation extends Structure<TModel>> = {
    [key in keyof TModel]: BuildFormTreeNode<TModel[key], TAnnotation[key]>;
};
type BuildFormTreeNode<TModel, TAnnotation> = TAnnotation extends null ? TModel extends Array<any> ? BuildFormTreeNode<TModel, FormElementArray> : TModel extends Record<string, any> ? BuildFormTreeNode<TModel, FormElementGroup> : BuildFormTreeNode<TModel, FormElementControl> : TAnnotation extends FormElementArray ? TModel extends Array<infer TArrayElement> ? FormArray<FormControl<TArrayElement>> : never : TAnnotation extends FormElementGroup ? TModel extends Record<string, any> ? FormGroup<BuildFormTreeKeyof<TModel, {
    [key in keyof TModel]: FormElementControl;
}>> : never : TAnnotation extends FormElementControl ? FormControl<TModel> : TAnnotation extends Array<infer TArrayElementAnnotation extends FormElementTree> ? TModel extends Array<infer TArrayElement> ? FormArray<BuildFormTreeNode<TArrayElement, TArrayElementAnnotation>> : never : TAnnotation extends Structure<TModel, FormElementTree> ? TModel extends Record<string, any> ? FormGroup<BuildFormTreeKeyof<TModel, TAnnotation>> : never : BuildFormTreeNode<TModel, FormElementControl>;
export {};
//# sourceMappingURL=index.d.ts.map