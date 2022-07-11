import { FormArray, FormControl, FormGroup } from '@angular/forms';

// Main type
export type FormModel<
  TModel extends object | Array<any>,
  TPreparedAnnotations extends PrepareAnnotations<TPreparedModel> | null = null,
  TPreparedModel extends PrepareModel<TModel> = PrepareModel<TModel>
> =
  TPreparedAnnotations extends null
    ? TModel extends Array<any>
      ? FormControlsOfInner<TPreparedModel, true, false, null>
    : TModel extends object
      ? FormGroup<FormControlsOfInner<TPreparedModel, true, true, null>>
    : ERROR_1
  : TPreparedAnnotations extends string
    ? TModel extends Array<any>
      ? FormControlsOfInner<TPreparedModel, true, false, TPreparedAnnotations>
    : TModel extends object
      ? FormControlsOfInner<TPreparedModel, true, false, TPreparedAnnotations>
    : ERROR_1
  : TPreparedAnnotations extends Array<any>
    ? TModel extends Array<any>
      ? FormControlsOfInner<TPreparedModel, true, false, TPreparedAnnotations>
      : ERROR_4
  : TPreparedAnnotations extends object
    ? TModel extends object
      // @ts-ignore
      ? FormGroup<FormControlsOfInner<TPreparedModel, true, true, TPreparedAnnotations>>
    : ERROR_5
  : ERROR_2;

// Special type for annotation
export type Replace<T> = T & { __replace__: '__replace__' };

// Types for debugging output
type SHOW_ERRORS = true;
type ERROR_1 = SHOW_ERRORS extends true ? 'ERROR_1: Model should be array or object' : unknown;
type ERROR_2 = SHOW_ERRORS extends true ? 'ERROR_2: Annotations should be null or string or object or array' : unknown;
type ERROR_3 = SHOW_ERRORS extends true ? 'ERROR_3: Type passed to FormArrayUtil is not array' : unknown;
type ERROR_4 = SHOW_ERRORS extends true ? 'ERROR_4: Annotation is array but Model is not array' : unknown;
type ERROR_5 = SHOW_ERRORS extends true ? 'ERROR_5: Annotation is group but Model is not object' : unknown;
type ERROR_6 = SHOW_ERRORS extends true ? 'ERROR_6: Something went wrong :(' : unknown;

// Form element types for annotations
type FormElementType = 'control' | 'group' | 'array';

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
      : FormElementType | Replace<object>
} | FormElementType | Replace<object>;

// Remove all nulls and undefined from T recursively
type PrepareModel<T> = {
  [key in keyof T]-?: 
    NonNullable<T[key]> extends (infer U)[]
      ? PrepareModel<NonNullable<U>>[]
      : NonNullable<T[key]> extends object
        ? PrepareModel<NonNullable<T[key]>>
        : NonNullable<T[key]>;
};

type FormArrayUtil<T, TNullable extends boolean> =
  T extends Array<infer U>
    ? FormArray<FormControl<TNullable extends true ? (U | null) : U>>
    : ERROR_3;

type FormControlUtil<T, TNullable extends boolean> = FormControl<
  TNullable extends true
    ? ((T extends object ? (T extends PrepareModel<infer U> ? U : T) : T) | null)
    : (T extends object ? (T extends PrepareModel<infer U> ? U : T) : T)
>;

type FormControlsOfInner<
  TPreparedModel extends object | Array<any>,
  TNullable extends boolean,
  TKeyofTraverse extends boolean,
  TPreparedAnnotations extends PrepareAnnotations<TPreparedModel> | null
> =
  TKeyofTraverse extends true
  ? FormControlsOfInnerKeyofTraverse<TPreparedModel, TNullable, TPreparedAnnotations>
  : FormControlsOfInnerFlatTraverse<TPreparedModel, TNullable, TPreparedAnnotations>

// When TKeyofTraverse is true
//
// Traverse every key in object and transform it to form element recursive
type FormControlsOfInnerKeyofTraverse<
  TPreparedModel extends object | Array<any>,
  TNullable extends boolean,
  TPreparedAnnotations extends PrepareAnnotations<TPreparedModel> | null
> =
  // When annotations is not set
  //
  // If we dont have annotations then every nested value in object is FormControl 
  TPreparedAnnotations extends null
  ? {
    [key in keyof TPreparedModel]-?:
      FormControlUtil<TPreparedModel[key], TNullable>;
  }

  // When annotation is object or Array or string
  : {
    [key in keyof TPreparedModel]-?: 

      // Replace annotation
      //
      // If we have Replace<any> in annotation
      // then infer FormControl type based on annotation type
      //
      // @ts-ignore
      TPreparedAnnotations[key] extends Replace<infer TInferredAnnotation>
        ? TInferredAnnotation

      // FormArray string annotation
      //
      // If we have 'array' string in annotation
      // and current object is record type
      // then infer FormArray type recursively
      //
      // @ts-ignore
      : TPreparedAnnotations[key] extends 'array'
        ? TPreparedModel[key] extends Array<any>
          ? FormArrayUtil<TPreparedModel[key], TNullable>
          : ERROR_4

      // FormGroup string annotation
      //
      // If we have 'group' string in annotation
      // and current object is record type
      // then infer FormGroup type recursively
      //
      // @ts-ignore
      : TPreparedAnnotations[key] extends 'group'
        ? TPreparedModel[key] extends object
          ? FormGroup<FormControlsOfInner<TPreparedModel[key], TNullable, true, null>>
          : ERROR_5

      // FormControl string annotation
      //
      // If we have 'control' string in annotation
      // then infer FormControl type
      //
      // @ts-ignore
      : TPreparedAnnotations[key] extends 'control'
        ? FormControlUtil<TPreparedModel[key], TNullable>

      // FormArray type annotation
      //
      // If we have array type in annotation
      // and current object is array type
      // then infer FormArray type recursively
      //
      // @ts-ignore
      : TPreparedAnnotations[key] extends Array<infer TInferredAnnotation>
        ? TPreparedModel[key] extends Array<infer TInferredModel>
          // @ts-ignore
          ? FormArray<FormControlsOfInner<TInferredModel, TNullable, false, TInferredAnnotation>>
          : ERROR_4

      // FormGroup type annotation
      //
      // If we have record type in annotation
      // and current object is record type
      // then infer FormGroup type recursively
      //
      // @ts-ignore
      : TPreparedAnnotations[key] extends object
        ? TPreparedModel[key] extends object
          ? FormGroup<FormControlsOfInner<TPreparedModel[key], TNullable, true, TPreparedAnnotations[key]>>
          : ERROR_5

      // When annotations is unknown
      //
      // If annotation is unknown then infer FormControl 
      //
      // @ts-ignore
      : TPreparedAnnotations[key] extends unknown
        ? FormControlUtil<TPreparedModel[key], TNullable>

      : ERROR_6
  }

// When TKeyofTraverse is false
//
// Infer type of current object as form element type recursively
type FormControlsOfInnerFlatTraverse<
  TPreparedModel extends object | Array<any>,
  TNullable extends boolean,
  TPreparedAnnotations extends PrepareAnnotations<TPreparedModel> | null
> =
  // When annotations is not set
  //
  // If we dont have annotations then
  //   if current object is Array infer FormArray recursively
  //   else infer FormControl 
  TPreparedAnnotations extends null
    ? TPreparedModel extends Array<infer TInferredModel>
      // @ts-ignore
      ? FormArray<FormControlsOfInner<TInferredModel, TNullable, false, null>>
      : FormControlUtil<TPreparedModel, TNullable>

  // Replace annotation
  //
  // If we have Replace<any> in annotation
  // then infer FormControl type based on annotation type
  : TPreparedAnnotations extends Replace<infer TInferredAnnotation>
      ? TInferredAnnotation

  // FormArray string annotation
  //
  // If we have 'array' string in annotation 
  // and current object is array type 
  // then infer FormArray type recursively
  : TPreparedAnnotations extends 'array'
    ? TPreparedModel extends Array<any>
      ? FormArrayUtil<TPreparedModel, TNullable>
      : ERROR_4

  // FormGroup string annotation
  //
  // If we have 'group' string in annotation
  // and current object is record type
  // then infer FormGroup type recursively
  : TPreparedAnnotations extends 'group'
    ? TPreparedModel extends object
      ? FormGroup<FormControlsOfInner<TPreparedModel, TNullable, true, null>>
      : ERROR_5

  // FormControl string annotation
  //
  // If we have 'control' string in annotation
  // then infer FormControl type
  : TPreparedAnnotations extends 'control'
    ? FormControlUtil<TPreparedModel, TNullable>
  
  // FormArray type annotation
  //
  // If we have array type in annotation
  // and current object is array type
  // then infer FormArray type recursively
  : TPreparedAnnotations extends Array<infer TInferredAnnotation>
    ? TPreparedModel extends Array<infer TInferredModel>
      // @ts-ignore
      ? FormArray<FormControlsOfInner<TInferredModel, TNullable, false, TInferredAnnotation>>
      : ERROR_4

  // FormGroup type annotation
  //
  // If we have record type in annotation
  // and current object is record type
  // then infer FormGroup type recursively
  : TPreparedAnnotations extends object
    ? TPreparedModel extends object
      // @ts-ignore
      ? FormGroup<FormControlsOfInner<TPreparedModel, TNullable, true, TPreparedAnnotations>>
      : ERROR_5

  // When annotations is unknown
  //
  // If annotation is unknown then infer FormControl 
  : TPreparedAnnotations extends unknown
    ? TPreparedModel extends Array<infer TInferredModel>
      // @ts-ignore
      ? FormArray<FormControlsOfInner<TInferredModel, TNullable, false, null>>
      : FormControlUtil<TPreparedModel, TNullable>

  : ERROR_6