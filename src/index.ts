import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';

// Default infer mode 
type DefaultInferMode = InferModeNullable & InferModeRequired

// Main type
export type FormModel<
  TModel,
  TAnnotations extends TransformToAnnotations<TModel> | null = null,
  TInferMode extends InferMode = DefaultInferMode,
> = FormModelInnerTraverse<TModel, TAnnotations, TInferMode>

// Special type for annotation
export type Replace<T extends AbstractControl> = T & { __replace__: '__replace__' };

// Variants of form elements types
// Variants of infer modes
export type FormElementControl = { __control__: '__control__' }
export type FormElementGroup = { __group__: '__group__' }
export type FormElementArray = { __array__: '__array__' }
export type FormElementType = FormElementControl | FormElementGroup | FormElementArray

// Variants of infer modes
export type InferModeOptional = { __optional__: '__optional__' }
export type InferModeRequired = { __required__: '__required__' }
export type InferModeFromModel = { __frommodel__: '__frommodel__' }
export type InferModeNullable = { __nullable__: '__nullable__' }
export type InferModeNonNullable = { __nonnullable__: '__nonnullable__' }

type InferMode = InferModeOptional | InferModeRequired | InferModeFromModel | InferModeNullable | InferModeNonNullable;

// Convert T to annotations type recursively
type TransformToAnnotations<T, TPrepared = RemoveOptionalFields<T>, TTraverse = T | TPrepared> = {
  [key in keyof TTraverse]?:
    TTraverse[key] extends Array<infer U>
      ? (
        | TransformToAnnotations<U>
        | FormElementType
        | [TransformToAnnotations<U>]
        | [FormElementType]
        | Replace<AbstractControl>
      )
      : TTraverse[key] extends object
        ? (
          | TransformToAnnotations<TTraverse[key]> 
          | FormElementType
          | [TransformToAnnotations<TTraverse[key]>]
          | [FormElementType]
          | Replace<AbstractControl>
        )
      : (FormElementType | Replace<AbstractControl>)
} | (FormElementType | Replace<AbstractControl>);

type RemoveOptionalFields<T> = {
  [key in keyof T]-?: T[key] 
}

type PrepareModel<T extends object, TInferMode extends InferMode> = 
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

  : TInferMode extends InferModeFromModel & (InferModeNullable | InferModeNonNullable)  
    ? InferModeFromModel & InferModeNullable extends TInferMode  
      ? { [key in keyof T]: NonNullable<T[key]> | null }

    : InferModeFromModel & InferModeNonNullable extends TInferMode 
      ? { [key in keyof T]: NonNullable<T[key]> }

    : never

  : InferModeFromModel extends TInferMode
    ? { [key in keyof T]: T[key] }

  : never;

type ApplyInferMode<T, TInferMode extends InferMode> =
  TInferMode extends InferModeNullable   
    ? NonNullable<T> | null
    : TInferMode extends InferModeNonNullable  
      ? NonNullable<T>
      : Exclude<T, undefined>

// Traverse every key in object and transform it to form element recursively
type FormModelInnerKeyofTraverse<
  TModel extends object,
  TAnnotations,
  TInferMode extends InferMode,
  TPreparedModel = PrepareModel<TModel, TInferMode>,
> = {
  [key in keyof TPreparedModel]:
    // @ts-ignore - ugly hack for traverse by TModel and TAnnotation using key from TPreparedModel
    FormModelInnerTraverse<TModel[key], TAnnotations[key], TInferMode>
}

// Infer type of current object as form element type recursively
type FormModelInnerTraverse<
  TModel,
  TAnnotations,
  TInferMode extends InferMode,
> =
  // When annotations is not set
  TAnnotations extends null
  ? TModel extends Array<any>
    ? FormModelInnerTraverse<TModel, FormElementArray, TInferMode>
    : TModel extends object
      ? FormModelInnerTraverse<TModel, FormElementGroup, TInferMode>
      : FormModelInnerTraverse<TModel, FormElementArray, TInferMode>

  // FormArray string annotation
  //
  // If we have 'array' string in annotation 
  // and current object is array type 
  // then infer FormArray type recursively
  : TAnnotations extends FormElementArray
    ? TModel extends Array<infer TInferredArrayValueType>
      ? FormArray<FormControl<ApplyInferMode<TInferredArrayValueType, TInferMode>>>
      : never

  // FormGroup string annotation
  //
  // If we have 'group' string in annotation
  // and current object is record type
  // then infer FormGroup type recursively
  : TAnnotations extends FormElementGroup
    ? TModel extends object
      ? FormGroup<FormModelInnerKeyofTraverse<TModel, FormElementGroup, TInferMode>>
      : never

  // FormControl string annotation
  //
  // If we have 'control' string in annotation
  // then infer FormControl type
  : TAnnotations extends FormElementControl
    ? FormControl<ApplyInferMode<TModel, TInferMode>>

  // Replace annotation
  //
  // If we have Replace<T> in annotation
  // then infer T
  : TAnnotations extends Replace<infer TInferredReplace>
    ? TInferredReplace
  
  // FormArray type annotation
  //
  // If we have array type in annotation
  // and current object is array type
  // then infer FormArray type recursively
  : TAnnotations extends Array<infer TInferedAnnotations>
    ? TModel extends Array<infer TInferedArrayType>
      ? FormArray<FormModelInnerTraverse<TInferedArrayType, TInferedAnnotations, TInferMode>>
      : never

  // FormGroup type annotation
  //
  // If we have record type in annotation
  // and current object is record type
  // then infer FormGroup type recursively
  : TAnnotations extends object
    ? TModel extends object
      ? FormGroup<FormModelInnerKeyofTraverse<TModel, TAnnotations, TInferMode>>
      : never

  : FormModelInnerTraverse<TModel, FormElementControl, TInferMode>