import { FormArray, FormControl, FormGroup } from '@angular/forms';

// Main type
export type FormModel<
  TModel extends object,
  TAnnotations extends TransformToAnnotations<TTraverseModel> | null = null,
  TInferMode extends InferMode = DefaultInferMode,
  TTraverseModel extends RemoveOptionalFields<TModel> = RemoveOptionalFields<TModel>
> = FormModelInnerTraverse<TModel, TTraverseModel, TInferMode, TAnnotations>

// Special type for annotation
export type Replace<T> = T & { __replace__: '__replace__' };

// Default infer mode 
type DefaultInferMode = InferModeNullable & InferModeRequired

// Form element types for annotations
type FormElementType = 'control' | 'group' | 'array';

// Variants of infer modes
export type InferModeOptional = { __optional__: '__optional__' }
export type InferModeRequired = { __required__: '__required__' }
export type InferModeFromModel = { __frommodel__: '__frommodel__' }
export type InferModeNullable = { __nullable__: '__nullable__' }
export type InferModeNonNullable = { __nonnullable__: '__nonnullable__' }
type InferMode = InferModeOptional | InferModeRequired | InferModeFromModel | InferModeNullable | InferModeNonNullable;

// Convert T to annotations type recursively
type TransformToAnnotations<T> = {
  [key in keyof T]?:
    T[key] extends Array<infer U>
      ? (
        | TransformToAnnotations<U>
        | FormElementType
        | [TransformToAnnotations<U>]
        | [FormElementType]
        | Replace<object>
      )
      : T[key] extends object
        ? (
          | TransformToAnnotations<T[key]> 
          | FormElementType
          | [TransformToAnnotations<T[key]>]
          | [FormElementType]
          | Replace<object>
        )
      : (FormElementType | Replace<object>)
} | (FormElementType | Replace<object>);

type RemoveOptionalFields<T> = {
  [key in keyof T]-?:
    T[key] extends (infer U)[]
    ? RemoveOptionalFields<U>[]
    : T[key] extends object
    ? RemoveOptionalFields<T[key]>
    : T[key]
}

type PrepareModel<T, TInferMode extends InferMode> = 
  TInferMode extends InferModeOptional & (InferModeNullable | InferModeNonNullable | InferModeFromModel)  
    ? InferModeOptional & InferModeNullable extends TInferMode  
      ? { [key in keyof T]?: NonNullable<T[key]> | null }

    : InferModeOptional & InferModeNonNullable extends TInferMode 
      ? { [key in keyof T]?: NonNullable<T[key]> }

    : InferModeOptional & InferModeFromModel extends TInferMode  
      ? { [key in keyof T]?: T[key] }
    : never

  : TInferMode extends InferModeRequired & (InferModeNullable | InferModeNonNullable | InferModeFromModel)  
    ? InferModeRequired & InferModeNullable extends TInferMode  
      ? { [key in keyof T]-?: NonNullable<T[key]> | null }

    : InferModeRequired & InferModeNonNullable extends TInferMode 
      ? { [key in keyof T]-?: NonNullable<T[key]> }

    : InferModeRequired & InferModeFromModel extends TInferMode  
      ? { [key in keyof T]-?: T[key] }
    : never

  : InferModeNullable extends TInferMode  
    ? { [key in keyof T]-?: NonNullable<T[key]> | null }

  : InferModeNonNullable extends TInferMode 
    ? { [key in keyof T]-?: NonNullable<T[key]> }

  : InferModeFromModel extends TInferMode
    ? { [key in keyof T]: T[key] }

  : never;

type FormArrayUtil<T, TInferMode extends InferMode> =
  T extends Array<infer U>
    ? FormArray<FormControl<
      InferModeNullable extends TInferMode  
      ? NonNullable<U> | null
      : InferModeNonNullable extends TInferMode 
      ? NonNullable<U>
      : Exclude<U, undefined>
    >>
    : never;

type FormControlUtil<T, TInferMode extends InferMode> = FormControl<
  NonNullable<T> extends object 
  ? NonNullable<T> extends RemoveOptionalFields<infer U>
    ? TInferMode extends InferModeNullable
      ? NonNullable<U> | null
      : TInferMode extends InferModeNonNullable
      ? NonNullable<U>
      : Exclude<U, undefined>
    : TInferMode extends InferModeNullable
      ? NonNullable<T> | null
      : TInferMode extends InferModeNonNullable
      ? NonNullable<T>
      : Exclude<T, undefined>
  : TInferMode extends InferModeNullable
    ? NonNullable<T> | null
    : TInferMode extends InferModeNonNullable
    ? NonNullable<T>
    : Exclude<T, undefined>
>;

// Traverse every key in object and transform it to form element recursively
type FormModelInnerKeyofTraverse<
  TModel extends object | unknown,
  TTraverseModel extends object | unknown,
  TInferMode extends InferMode,
  TAnnotations extends object | string | null,
  TPreparedModel = PrepareModel<TModel, TInferMode>
> = {
  [key in keyof TPreparedModel]:
    // @ts-ignore - because typescript has some issues
    FormModelInnerTraverse<TModel[key], TTraverseModel[key], TInferMode, TAnnotations[key]>
}

// Infer type of current object as form element type recursively
type FormModelInnerTraverse<
  TModel extends object | unknown,
  TTraverseModel extends object | unknown,
  TInferMode extends InferMode,
  TAnnotations extends object | string | unknown | null,
> =
  // When annotations is not set
  TAnnotations extends null
  ? TTraverseModel extends Array<any>
    ? FormModelInnerTraverse<TModel, TTraverseModel, TInferMode, 'array'>
    : TTraverseModel extends object
    ? FormModelInnerTraverse<TModel, TTraverseModel, TInferMode, 'group'>
    : FormModelInnerTraverse<TModel, TTraverseModel, TInferMode, 'control'>

  // Replace annotation
  //
  // If we have Replace<T> in annotation
  // then infer T
  : TAnnotations extends Replace<infer TInferredReplace>
    ? TInferredReplace

  // FormArray string annotation
  //
  // If we have 'array' string in annotation 
  // and current object is array type 
  // then infer FormArray type recursively
  : TAnnotations extends 'array'
    ? TTraverseModel extends Array<any>
      ? FormArrayUtil<TModel, TInferMode>
      : never

  // FormGroup string annotation
  //
  // If we have 'group' string in annotation
  // and current object is record type
  // then infer FormGroup type recursively
  : TAnnotations extends 'group'
    ? TTraverseModel extends object
      // @ts-ignore - because typescript has some issues
      ? FormGroup<FormModelInnerKeyofTraverse<NonNullable<TModel>, TTraverseModel, TInferMode, null>>
      : never

  // FormControl string annotation
  //
  // If we have 'control' string in annotation
  // then infer FormControl type
  : TAnnotations extends 'control'
    ? FormControlUtil<TModel extends unknown ? TTraverseModel : TModel, TInferMode>
  
  // FormArray type annotation
  //
  // If we have array type in annotation
  // and current object is array type
  // then infer FormArray type recursively
  : TAnnotations extends Array<infer TInferedAnnotations>
    ? TTraverseModel extends Array<infer TInferedArrayType>
      // @ts-ignore - because typescript has some issues
      ? FormArray<FormModelInnerTraverse<NonNullable<TModel> extends Array<infer U> ? U : unknown, TInferedArrayType, TInferMode, TInferedAnnotations>>
      : never

  // FormGroup type annotation
  //
  // If we have record type in annotation
  // and current object is record type
  // then infer FormGroup type recursively
  : TAnnotations extends object
    ? TTraverseModel extends object
      // @ts-ignore - because typescript has some issues
      ? FormGroup<FormModelInnerKeyofTraverse<NonNullable<TModel>, TTraverseModel, TInferMode, TAnnotations>>
      : never

  : FormModelInnerTraverse<TModel, TTraverseModel, TInferMode, 'control'>