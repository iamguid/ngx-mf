// @ts-nocheck 
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
declare type DefaultInferMode = InferModeNullable & InferModeRequired;
declare type FormElementType = 'control' | 'group' | 'array';
export declare type FormModel<TModel, TAnnotations extends TransformToAnnotations<TModel> | null = null, TInferMode extends InferMode = DefaultInferMode> = FormModelInnerTraverse<TModel, TAnnotations, TInferMode>;
export declare type Replace<T extends AbstractControl> = T & {
    __replace__: '__replace__';
};
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
} : never : InferModeNullable extends TInferMode ? {
    [key in keyof T]-?: NonNullable<T[key]> | null;
} : InferModeNonNullable extends TInferMode ? {
    [key in keyof T]-?: NonNullable<T[key]>;
} : InferModeFromModel extends TInferMode ? {
    [key in keyof T]: T[key];
} : never;
declare type FormArrayUtil<T, TInferMode extends InferMode> = T extends Array<infer U> ? FormArray<FormControl<InferModeNullable extends TInferMode ? NonNullable<U> | null : InferModeNonNullable extends TInferMode ? NonNullable<U> : Exclude<U, undefined>>> : never;
declare type FormControlUtil<T, TInferMode extends InferMode> = FormControl<TInferMode extends InferModeNullable ? NonNullable<T> | null : TInferMode extends InferModeNonNullable ? NonNullable<T> : Exclude<T, undefined>>;
declare type FormModelInnerKeyofTraverse<TModel extends object, TAnnotations, TInferMode extends InferMode, TPreparedModel = PrepareModel<TModel, TInferMode>> = {
    [key in keyof TPreparedModel]: FormModelInnerTraverse<TModel[key], TAnnotations[key], TInferMode>;
};
declare type FormModelInnerTraverse<TModel, TAnnotations, TInferMode extends InferMode> = TAnnotations extends null ? TModel extends Array<any> ? FormModelInnerTraverse<TModel, 'array', TInferMode> : TModel extends object ? FormModelInnerTraverse<TModel, 'group', TInferMode> : FormModelInnerTraverse<TModel, 'control', TInferMode> : TAnnotations extends 'array' ? TModel extends Array<any> ? FormArrayUtil<TModel, TInferMode> : never : TAnnotations extends 'group' ? TModel extends object ? FormGroup<FormModelInnerKeyofTraverse<TModel, 'group', TInferMode>> : never : TAnnotations extends 'control' ? FormControlUtil<TModel, TInferMode> : TAnnotations extends Replace<infer TInferredReplace> ? TInferredReplace : TAnnotations extends Array<infer TInferedAnnotations> ? TModel extends Array<infer TInferedArrayType> ? FormArray<FormModelInnerTraverse<TInferedArrayType, TInferedAnnotations, TInferMode>> : never : TAnnotations extends object ? TModel extends object ? FormGroup<FormModelInnerKeyofTraverse<TModel, TAnnotations, TInferMode>> : never : FormModelInnerTraverse<TModel, 'control', TInferMode>;
export {};
//# sourceMappingURL=index.d.ts.map