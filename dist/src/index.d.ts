// @ts-nocheck 
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
declare type DefaultInferMode = InferModeNullable & InferModeRequired;
export declare type FormModel<TModel, TAnnotations extends TransformToAnnotations<TModel> | null = null, TInferMode extends InferMode = DefaultInferMode> = FormModelInnerTraverse<TModel, TAnnotations, TInferMode>;
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
declare type TransformToAnnotations<T, TPrepared = RemoveOptionalFields<T>, TTraverse = T | TPrepared> = {
    [key in keyof TTraverse]?: TTraverse[key] extends Array<infer U> ? (TransformToAnnotations<U> | FormElementType | [TransformToAnnotations<U>] | [FormElementType] | Replace<AbstractControl>) : TTraverse[key] extends object ? (TransformToAnnotations<TTraverse[key]> | FormElementType | [TransformToAnnotations<TTraverse[key]>] | [FormElementType] | Replace<AbstractControl>) : (FormElementType | Replace<AbstractControl>);
} | (FormElementType | Replace<AbstractControl>);
declare type RemoveOptionalFields<T> = {
    [key in keyof T]-?: T[key];
};
declare type PrepareModel<T extends object, TInferMode extends InferMode> = TInferMode extends InferModeOptional & (InferModeNullable | InferModeNonNullable | InferModeFromModel) ? InferModeOptional & InferModeNullable extends TInferMode ? {
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
} : never : TInferMode extends InferModeFromModel & (InferModeNullable | InferModeNonNullable) ? InferModeFromModel & InferModeNullable extends TInferMode ? {
    [key in keyof T]: NonNullable<T[key]> | null;
} : InferModeFromModel & InferModeNonNullable extends TInferMode ? {
    [key in keyof T]: NonNullable<T[key]>;
} : never : InferModeFromModel extends TInferMode ? {
    [key in keyof T]: T[key];
} : never;
declare type ApplyInferMode<T, TInferMode extends InferMode> = TInferMode extends InferModeNullable ? T | null : TInferMode extends InferModeNonNullable ? Exclude<T, null> : T;
declare type FormModelInnerKeyofTraverse<TModel extends object, TAnnotations, TInferMode extends InferMode, TPreparedModel = PrepareModel<TModel, TInferMode>> = {
    [key in keyof TPreparedModel]: FormModelInnerTraverse<TModel[key], TAnnotations[key], TInferMode>;
};
declare type FormModelInnerTraverse<TModel, TAnnotations, TInferMode extends InferMode> = TAnnotations extends null ? TModel extends Array<any> ? FormModelInnerTraverse<TModel, FormElementArray, TInferMode> : TModel extends object ? FormModelInnerTraverse<TModel, FormElementGroup, TInferMode> : FormModelInnerTraverse<TModel, FormElementArray, TInferMode> : TAnnotations extends FormElementArray ? TModel extends Array<infer TInferredArrayValueType> ? FormArray<FormControl<ApplyInferMode<TInferredArrayValueType, TInferMode>>> : never : TAnnotations extends FormElementGroup ? TModel extends object ? FormGroup<FormModelInnerKeyofTraverse<TModel, FormElementGroup, TInferMode>> : never : TAnnotations extends FormElementControl ? FormControl<ApplyInferMode<TModel, TInferMode>> : TAnnotations extends Replace<infer TInferredReplace> ? TInferredReplace : TAnnotations extends Array<infer TInferedAnnotations> ? TModel extends Array<infer TInferedArrayType> ? FormArray<FormModelInnerTraverse<TInferedArrayType, TInferedAnnotations, TInferMode>> : never : TAnnotations extends object ? TModel extends object ? FormGroup<FormModelInnerKeyofTraverse<TModel, TAnnotations, TInferMode>> : never : FormModelInnerTraverse<TModel, FormElementControl, TInferMode>;
export {};
//# sourceMappingURL=index.d.ts.map