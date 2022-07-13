import { FormArray, FormControl, FormGroup } from '@angular/forms';

// Default type
export type FormModel<
  TModel extends Record<string, any>,
  TPreparedAnnotations extends PrepareAnnotations<PrepareModel<TModel, InferModeNonNullable>> | null = null,
  TInferMode extends InferMode = DefaultInferMode,
  TPreparedModel extends PrepareModel<TModel, TInferMode> = PrepareModel<TModel, TInferMode>
  // @ts-ignore
> = FormControlsOfInnerTraverse<TPreparedModel, TInferMode, TPreparedAnnotations>

// Special type for annotation
export type Replace<T> = T & { __replace__: '__replace__' };

// Default infer mode 
type DefaultInferMode = InferModeNullable

// Form element types for annotations
type FormElementType = 'control' | 'group' | 'array';

// Variants of infer modes
export type InferModeSaveOptional = { __saveoptional__: '__saveoptional__' }
export type InferModeNullable = { __nullable__: '__nullable__' }
export type InferModeNonNullable = { __nonnullable__: '__nonnullable__' }
export type InferModeFromModel = { __frommodel__: '__frommodel__' }
type InferMode = InferModeSaveOptional | InferModeNullable | InferModeNonNullable | InferModeFromModel;

// Convert T to annotations type recursively
type PrepareAnnotations<T> = {
  [key in keyof T]?:
    T[key] extends Array<infer U>
      ? (
        | PrepareAnnotations<U>
        | FormElementType
        | [PrepareAnnotations<U>]
        | [FormElementType]
        | Replace<object>
      )
      : T[key] extends object
        ? (
          | PrepareAnnotations<T[key]> 
          | FormElementType
          | [PrepareAnnotations<T[key]>]
          | [FormElementType]
          | Replace<object>
        )
      : (FormElementType | Replace<object>)
} | (FormElementType | Replace<object>);

// Prepare T recursively
type PrepareModel<T, TInferMode extends InferMode> = 
  TInferMode extends InferModeSaveOptional & (InferModeNullable | InferModeNonNullable | InferModeFromModel)  
    ? InferModeSaveOptional & InferModeNullable extends TInferMode  
      ? {
          [key in keyof T]:
            NonNullable<T[key]> extends (infer U)[]
            ? PrepareModel<NonNullable<U>, TInferMode>[] | null
            : NonNullable<T[key]> extends object
            ? PrepareModel<NonNullable<T[key]>, TInferMode> | null
            : NonNullable<T[key]> | null
      }
    : InferModeSaveOptional & InferModeNonNullable extends TInferMode 
      ? {
          [key in keyof T]:
            NonNullable<T[key]> extends (infer U)[]
            ? PrepareModel<NonNullable<U>, TInferMode>[]
            : NonNullable<T[key]> extends object
            ? PrepareModel<NonNullable<T[key]>, TInferMode>
            : NonNullable<T[key]>
        }

    : InferModeSaveOptional & InferModeFromModel extends TInferMode  
      ? {
          [key in keyof T]:
            T[key] extends (infer U)[]
            ? PrepareModel<U, TInferMode>[]
            : T[key] extends object
            ? PrepareModel<T[key], TInferMode>
            : T[key]
      }
    : never
  : InferModeNullable extends TInferMode  
    ? {
        [key in keyof T]-?:
          NonNullable<T[key]> extends (infer U)[]
          ? PrepareModel<NonNullable<U>, TInferMode>[] | null
          : NonNullable<T[key]> extends object
          ? PrepareModel<NonNullable<T[key]>, TInferMode> | null
          : NonNullable<T[key]> | null
      }

  : InferModeNonNullable extends TInferMode 
    ? {
        [key in keyof T]-?:
          NonNullable<T[key]> extends (infer U)[]
          ? PrepareModel<NonNullable<U>, TInferMode>[]
          : NonNullable<T[key]> extends object
          ? PrepareModel<NonNullable<T[key]>, TInferMode>
          : NonNullable<T[key]>
    }
  : InferModeFromModel extends TInferMode
    ? {
      [key in keyof T]:
        T[key] extends (infer U)[]
        ? PrepareModel<U, TInferMode>[]
        : T[key] extends object
        ? PrepareModel<T[key], TInferMode>
        : T[key]
    }
  : never;

type FormArrayUtil<T, TInferMode extends InferMode> =
  T extends Array<infer U>
    ? FormArray<FormControl<
      InferModeNullable extends TInferMode  
        ? (NonNullable<U> | null)
        : InferModeNonNullable extends TInferMode 
        ? NonNullable<U>
        : Exclude<U, undefined>
    >>
    : never;

type FormControlUtil<T, TInferMode extends InferMode> = FormControl<
  TInferMode extends InferModeNullable
  ? ((T extends object ? (T extends PrepareModel<infer U, TInferMode> ? NonNullable<U> : NonNullable<T>) : NonNullable<T>) | null)
  : TInferMode extends InferModeNonNullable
  ? (T extends object ? (T extends PrepareModel<infer U, TInferMode> ? NonNullable<U> : NonNullable<T>) : NonNullable<T>)
  : (T extends object ? (T extends PrepareModel<infer U, TInferMode> ? Exclude<U, undefined> : Exclude<T, undefined>) : Exclude<T, undefined>)
>;

// Traverse every key in object and transform it to form element recursive
type FormControlsOfInnerKeyofTraverse<
  TPreparedModel extends Record<string, any>,
  TInferMode extends InferMode,
  TPreparedAnnotations extends PrepareAnnotations<TPreparedModel> | null
> =
  TInferMode extends InferModeSaveOptional | InferModeFromModel 
    ? {
      [key in keyof TPreparedModel]:
        // @ts-ignore
        FormControlsOfInnerTraverse<TPreparedModel[key], TInferMode, TPreparedAnnotations[key]>
    }
    : {
      [key in keyof TPreparedModel]-?:
        // @ts-ignore
        FormControlsOfInnerTraverse<TPreparedModel[key], TInferMode, TPreparedAnnotations[key]>
    }

// Infer type of current object as form element type recursively
type FormControlsOfInnerTraverse<
  TPreparedModel extends Record<string, any>,
  TInferMode extends InferMode,
  TPreparedAnnotations extends PrepareAnnotations<TPreparedModel> | null
> =
  // When annotations is not set
  TPreparedAnnotations extends null
  ? TPreparedModel extends Array<any>
    ? FormControlsOfInnerTraverse<TPreparedModel, TInferMode, 'array'>
    : TPreparedModel extends object
    ? FormControlsOfInnerTraverse<TPreparedModel, TInferMode, 'group'>
    : FormControlUtil<TPreparedModel, TInferMode>

  // Replace annotation
  //
  // If we have Replace<T> in annotation
  // then infer T
  : TPreparedAnnotations extends Replace<infer TInferredReplaceAnnotation>
    ? TInferredReplaceAnnotation

  // FormArray string annotation
  //
  // If we have 'array' string in annotation 
  // and current object is array type 
  // then infer FormArray type recursively
  : TPreparedAnnotations extends 'array'
    ? TPreparedModel extends Array<any>
      ? FormArrayUtil<TPreparedModel, TInferMode>
      : never

  // FormGroup string annotation
  //
  // If we have 'group' string in annotation
  // and current object is record type
  // then infer FormGroup type recursively
  : TPreparedAnnotations extends 'group'
    ? TPreparedModel extends object
      ? FormGroup<FormControlsOfInnerKeyofTraverse<TPreparedModel, TInferMode, null>>
      : never

  // FormControl string annotation
  //
  // If we have 'control' string in annotation
  // then infer FormControl type
  : TPreparedAnnotations extends 'control'
    ? FormControlUtil<TPreparedModel, TInferMode>
  
  // FormArray type annotation
  //
  // If we have array type in annotation
  // and current object is array type
  // then infer FormArray type recursively
  : TPreparedAnnotations extends Array<infer TInferedAnnotations>
    ? TPreparedModel extends Array<infer TInferedArrayType>
      // @ts-ignore
      ? FormArray<FormControlsOfInnerTraverse<TInferedArrayType, TInferMode, TInferedAnnotations>>
      : never

  // FormGroup type annotation
  //
  // If we have record type in annotation
  // and current object is record type
  // then infer FormGroup type recursively
  : TPreparedAnnotations extends object
    ? TPreparedModel extends object
      ? FormGroup<FormControlsOfInnerKeyofTraverse<TPreparedModel, TInferMode, TPreparedAnnotations>>
      : never

  // When annotations is unknown
  : TPreparedAnnotations extends unknown
    ? FormControlUtil<TPreparedModel, TInferMode>

  : never