import { FormArray, FormControl, FormGroup } from '@angular/forms';

// Main type
//
// If TModel is array
// then infer FormArray recursively
// else infer FormGroup recursively
export type FormModel<
  TModel extends Record<string, any> | Array<any>,
  TPreparedAnnotations extends PrepareAnnotations<TPreparedModel> | null = null,
  TPreparedModel extends PrepareModel<TModel> = PrepareModel<TModel>
> =
  TModel extends Array<any>
  ? FormControlsOfInner<TPreparedModel, true, false, TPreparedAnnotations>
  : TPreparedAnnotations extends string
  ? FormControlsOfInner<TPreparedModel, true, false, TPreparedAnnotations>
  // @ts-ignore
  : FormGroup<FormControlsOfInner<TPreparedModel, true, true, TPreparedAnnotations>>

// Special types for annotation
export type Annotate<T> = T & { __annotate__: '__annotate__' };
export type Replace<T> = T & { __replace__: '__replace__' };

// Types for debugging output
type DEBUG = false;
type DEBUG_1 = DEBUG extends true ? '1' : unknown;
type DEBUG_2 = DEBUG extends true ? '2' : unknown;
type DEBUG_3 = DEBUG extends true ? '3' : unknown;
type DEBUG_4 = DEBUG extends true ? '4' : unknown;
type DEBUG_5 = DEBUG extends true ? '5' : unknown;
type DEBUG_6 = DEBUG extends true ? '6' : unknown;
type DEBUG_7 = DEBUG extends true ? '7' : unknown;
type DEBUG_8 = DEBUG extends true ? '8' : unknown;
type DEBUG_9 = DEBUG extends true ? '9' : unknown;
type DEBUG_10 = DEBUG extends true ? '9' : unknown;

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
        | Annotate<any>
      )
      : T[key] extends Record<string, any>
        ? (
          | PrepareAnnotations<T[key]> 
          | FormElementType
          | [PrepareAnnotations<T[key]>]
          | [FormElementType]
          | Annotate<any>
        )
      : FormElementType | Annotate<any>
} | FormElementType | Annotate<any>;

// Remove all nulls and undefined from T recursively
type PrepareModel<T> = {
  [key in keyof T]-?: 
    NonNullable<T[key]> extends (infer U)[]
      ? PrepareModel<NonNullable<U>>[]
      : NonNullable<T[key]> extends Record<string, any>
        ? PrepareModel<NonNullable<T[key]>>
        : NonNullable<T[key]>;
};

type FormArrayUtil<T, TNullable extends boolean> =
  T extends Array<infer U>
    ? FormArray<FormControl<TNullable extends true ? (U | null) : U>>
    : DEBUG_1;

type FormControlUtil<T, TNullable extends boolean> = FormControl<
  TNullable extends true
    ? ((T extends object ? (T extends PrepareModel<infer U> ? U : T) : T) | null)
    : (T extends object ? (T extends PrepareModel<infer U> ? U : T) : T)
>;

type FormControlsOfInner<
  TPreparedModel extends Record<string, any> | Array<any>,
  TNullable extends boolean,
  TKeyofTraverse extends boolean,
  TPreparedAnnotations extends PrepareAnnotations<TPreparedModel> | null
> =
  // When TKeyofTraverse is true
  //
  // Traverse every key in object and transform it to form element recursive
  TKeyofTraverse extends true

    // When annotations is not set
    //
    // If we dont have annotations then every nested value in object is FormControl 
    ? TPreparedAnnotations extends null
      ? { [key in keyof TPreparedModel]-?: FormControlUtil<TPreparedModel[key], TNullable>; }
      : {
        [key in keyof TPreparedModel]-?: 
          // type annotation
          //
          // If we have Annotate<T> in annotation
          // then infer FormControl type based on annotation type
          //
          // @ts-ignore
          TPreparedAnnotations[key] extends Annotate<infer TInferredAnnotation>
              // @ts-ignore
              ? FormModel<TInferredAnnotation, null>

          // replace annotation
          //
          // If we have Replace<any> in annotation
          // then infer FormControl type based on annotation type
          //
          // @ts-ignore
          : TPreparedAnnotations[key] extends Replace<infer TInferredAnnotation>
              // @ts-ignore
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
              : DEBUG_4

          // FormGroup string annotation
          //
          // If we have 'group' string in annotation
          // and current object is record type
          // then infer FormGroup type recursively
          //
          // @ts-ignore
          : TPreparedAnnotations[key] extends 'group'
            ? TPreparedModel[key] extends Record<string, any>
              ? FormGroup<FormControlsOfInner<TPreparedModel[key], TNullable, true, null>>
              : DEBUG_5

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
              : DEBUG_2

          // FormGroup type annotation
          //
          // If we have record type in annotation
          // and current object is record type
          // then infer FormGroup type recursively
          //
          // @ts-ignore
          : TPreparedAnnotations[key] extends Record<string, any>
            ? TPreparedModel[key] extends Record<string, any>
              // @ts-ignore
              ? FormGroup<FormControlsOfInner<TPreparedModel[key], TNullable, true, TPreparedAnnotations[key]>>
              : DEBUG_3

          // FormControl as default
          //
          // Otherwise infer FormControl type based on current object type
          //
          // @ts-ignore
          : FormControlUtil<TPreparedModel[key], TNullable>;
    }

    // When TKeyofTraverse is false
    //
    // Infer type of current object as form element type recursively
    :

      // When annotations is not set
      //
      // If we dont have annotations then
      //   if current object is Array infer FormArray recursively
      //   else infer FormControl 
      TPreparedAnnotations extends null
        ? TPreparedModel extends Array<infer TInferredModel>
          ? FormArray<FormControlsOfInner<TInferredModel, TNullable, false, null>>
          : FormControlUtil<TPreparedModel, TNullable>

      // FormArray string annotation
      //
      // If we have 'array' string in annotation 
      // and current object is array type 
      // then infer FormArray type recursively
      : TPreparedAnnotations extends 'array'
        ? TPreparedModel extends Array<any>
          ? FormArrayUtil<TPreparedModel, TNullable>
          : DEBUG_8

      // FormGroup string annotation
      //
      // If we have 'group' string in annotation
      // and current object is record type
      // then infer FormGroup type recursively
      : TPreparedAnnotations extends 'group'
        ? TPreparedModel extends Record<string, any>
          ? FormGroup<FormControlsOfInner<TPreparedModel, TNullable, true, null>>
          : DEBUG_9

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
          : DEBUG_6

      // FormGroup type annotation
      //
      // If we have record type in annotation
      // and current object is record type
      // then infer FormGroup type recursively
      : TPreparedAnnotations extends Record<string, any>
        ? TPreparedModel extends Record<string, any>
          // @ts-ignore
          ? FormGroup<FormControlsOfInner<TPreparedModel, TNullable, true, TPreparedAnnotations>>
          : DEBUG_7

      // FormControl as default
      //
      // Otherwise infer FormControl type based on current object type
      : FormControlUtil<TPreparedModel, TNullable>;
