// @ts-nocheck 
import { FormArray, FormControl, FormGroup } from '@angular/forms';
export declare type FormModel<TModel extends object, TAnnotations extends TransformToAnnotations<TTraverseModel> | null = null, TInferMode extends InferMode = DefaultInferMode, TTraverseModel extends RemoveOptionalFields<TModel> = RemoveOptionalFields<TModel>> = FormControlsOfInnerTraverse<TModel, TTraverseModel, TInferMode, TAnnotations>;
export declare type Replace<T> = T & {
    __replace__: '__replace__';
};
declare type DefaultInferMode = InferModeNullable & InferModeRequired;
declare type FormElementType = 'control' | 'group' | 'array';
export declare type InferModeOptional = {
    __optional__: '__optional__';
};
export declare type InferModeRequired = {
    __required__: '__required__';
};
export declare type InferModeFromModel = {
    __frommodel__: '__frommodel__';
};
export declare type InferModeNullable = {
    __nullable__: '__nullable__';
};
export declare type InferModeNonNullable = {
    __nonnullable__: '__nonnullable__';
};
declare type InferMode = InferModeOptional | InferModeRequired | InferModeFromModel | InferModeNullable | InferModeNonNullable;
declare type TransformToAnnotations<T> = {
    [key in keyof T]?: T[key] extends Array<infer U> ? (TransformToAnnotations<U> | FormElementType | [TransformToAnnotations<U>] | [FormElementType] | Replace<object>) : T[key] extends object ? (TransformToAnnotations<T[key]> | FormElementType | [TransformToAnnotations<T[key]>] | [FormElementType] | Replace<object>) : (FormElementType | Replace<object>);
} | (FormElementType | Replace<object>);
declare type RemoveOptionalFields<T> = {
    [key in keyof T]-?: T[key] extends (infer U)[] ? RemoveOptionalFields<U>[] : T[key] extends object ? RemoveOptionalFields<T[key]> : T[key];
};
export declare type PrepareModel<T, TInferMode extends InferMode> = TInferMode extends InferModeOptional & (InferModeNullable | InferModeNonNullable | InferModeFromModel) ? InferModeOptional & InferModeNullable extends TInferMode ? {
    [key in keyof T]?: NonNullable<T[key]> | null;
} : InferModeOptional & InferModeNonNullable extends TInferMode ? {
    [key in keyof T]?: NonNullable<T[key]>;
} : InferModeOptional & InferModeFromModel extends TInferMode ? {
    [key in keyof T]?: T[key];
} : never : TInferMode extends InferModeRequired & (InferModeNullable | InferModeNonNullable | InferModeFromModel) ? InferModeRequired & InferModeNullable extends TInferMode ? {
    [key in keyof T]-?: NonNullable<T[key]> | null;
} : InferModeRequired & InferModeNonNullable extends TInferMode ? {
    [key in keyof T]-?: NonNullable<T[key]>;
} : InferModeRequired & InferModeFromModel extends TInferMode ? {
    [key in keyof T]-?: T[key];
} : never : InferModeNullable extends TInferMode ? {
    [key in keyof T]-?: NonNullable<T[key]> | null;
} : InferModeNonNullable extends TInferMode ? {
    [key in keyof T]-?: NonNullable<T[key]>;
} : InferModeFromModel extends TInferMode ? {
    [key in keyof T]: T[key];
} : never;
declare type FormArrayUtil<T, TInferMode extends InferMode> = T extends Array<infer U> ? FormArray<FormControl<InferModeNullable extends TInferMode ? NonNullable<U> | null : InferModeNonNullable extends TInferMode ? NonNullable<U> : Exclude<U, undefined>>> : never;
declare type FormControlUtil<T, TInferMode extends InferMode> = FormControl<T extends object ? T extends RemoveOptionalFields<infer U> ? TInferMode extends InferModeNullable ? NonNullable<U> | null : TInferMode extends InferModeNonNullable ? NonNullable<U> : Exclude<U, undefined> : never : TInferMode extends InferModeNullable ? NonNullable<T> | null : TInferMode extends InferModeNonNullable ? NonNullable<T> : Exclude<T, undefined>>;
declare type FormControlsOfInnerKeyofTraverse<TModel extends object | unknown, TTraverseModel extends object | unknown, TInferMode extends InferMode, TAnnotations extends object | string | null, TPreparedModel = PrepareModel<TModel, TInferMode>> = {
    [key in keyof TPreparedModel]: FormControlsOfInnerTraverse<TModel[key], TTraverseModel[key], TInferMode, TAnnotations[key]>;
};
declare type FormControlsOfInnerTraverse<TModel extends object | unknown, TTraverseModel extends object | unknown, TInferMode extends InferMode, TAnnotations extends object | string | unknown | null> = TAnnotations extends null ? TTraverseModel extends Array<any> ? FormControlsOfInnerTraverse<TModel, TTraverseModel, TInferMode, 'array'> : TTraverseModel extends object ? FormControlsOfInnerTraverse<TModel, TTraverseModel, TInferMode, 'group'> : FormControlsOfInnerTraverse<TModel, TTraverseModel, TInferMode, 'control'> : TAnnotations extends Replace<infer TInferredReplace> ? TInferredReplace : TAnnotations extends 'array' ? TTraverseModel extends Array<any> ? FormArrayUtil<TModel, TInferMode> : never : TAnnotations extends 'group' ? TTraverseModel extends object ? FormGroup<FormControlsOfInnerKeyofTraverse<NonNullable<TModel>, TTraverseModel, TInferMode, null>> : never : TAnnotations extends 'control' ? FormControlUtil<TModel extends unknown ? TTraverseModel : TModel, TInferMode> : TAnnotations extends Array<infer TInferedAnnotations> ? TTraverseModel extends Array<infer TInferedArrayType> ? FormArray<FormControlsOfInnerTraverse<TModel extends Array<infer U> ? U : unknown, TInferedArrayType, TInferMode, TInferedAnnotations>> : never : TAnnotations extends object ? TTraverseModel extends object ? FormGroup<FormControlsOfInnerKeyofTraverse<NonNullable<TModel>, TTraverseModel, TInferMode, TAnnotations>> : never : FormControlsOfInnerTraverse<TModel, TTraverseModel, TInferMode, 'control'>;
export {};
//# sourceMappingURL=index.d.ts.map