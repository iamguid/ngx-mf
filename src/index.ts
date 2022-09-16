import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';

// Default infer mode 
type DefaultInferMode = InferModeNullable & InferModeRequired

// Form element types for annotations
type FormElementType = 'control' | 'group' | 'array';

// Main type
export type FormModel<
  TModel,
  TAnnotations extends TransformToAnnotations<TModel> | null = null,
  TInferMode extends InferMode = DefaultInferMode,
> = FormModelInnerTraverse<TModel, TAnnotations, TInferMode>

// Special type for annotation
export type Replace<T extends AbstractControl> = T & { __replace__: '__replace__' };

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
  TInferMode extends InferModeNullable
    ? NonNullable<T> | null
    : TInferMode extends InferModeNonNullable
    ? NonNullable<T>
    : Exclude<T, undefined>
>;

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
    ? FormModelInnerTraverse<TModel, 'array', TInferMode>
    : TModel extends object
      ? FormModelInnerTraverse<TModel, 'group', TInferMode>
      : FormModelInnerTraverse<TModel, 'control', TInferMode>

  // FormArray string annotation
  //
  // If we have 'array' string in annotation 
  // and current object is array type 
  // then infer FormArray type recursively
  : TAnnotations extends 'array'
    ? TModel extends Array<any>
      ? FormArrayUtil<TModel, TInferMode>
      : never

  // FormGroup string annotation
  //
  // If we have 'group' string in annotation
  // and current object is record type
  // then infer FormGroup type recursively
  : TAnnotations extends 'group'
    ? TModel extends object
      ? FormGroup<FormModelInnerKeyofTraverse<TModel, 'group', TInferMode>>
      : never

  // FormControl string annotation
  //
  // If we have 'control' string in annotation
  // then infer FormControl type
  : TAnnotations extends 'control'
    ? FormControlUtil<TModel, TInferMode>

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

  : FormModelInnerTraverse<TModel, 'control', TInferMode>