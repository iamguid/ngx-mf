
import { FormArray, FormControl, FormGroup } from '@angular/forms';

export type FormControlsOf<
  TObj extends Record<string, any>,
  TPreparedAnnotationsObj extends PrepareAnnotationsObj<TPreparedObj> | null = null,
  TPreparedObj = PrepareObj<TObj>
> = FormControlsOfInner<TPreparedObj, true, true, TPreparedAnnotationsObj>;

export type FormControlsOfNonNullable<
  TObj extends Record<string, any>,
  TPreparedAnnotationsObj extends PrepareAnnotationsObj<TPreparedObj> | null = null,
  TPreparedObj = PrepareObj<TObj>
> = FormControlsOfInner<TPreparedObj, false, true, TPreparedAnnotationsObj>;

type DEBUG = false;
type DEBUG_1 = DEBUG extends true ? '1' : never;
type DEBUG_2 = DEBUG extends true ? '2' : never;
type DEBUG_3 = DEBUG extends true ? '3' : never;
type DEBUG_4 = DEBUG extends true ? '4' : never;
type DEBUG_5 = DEBUG extends true ? '5' : never;
type DEBUG_6 = DEBUG extends true ? '6' : never;
type DEBUG_7 = DEBUG extends true ? '7' : never;
type DEBUG_8 = DEBUG extends true ? '8' : never;
type DEBUG_9 = DEBUG extends true ? '9' : never;

type FormElementType = 'control' | 'group' | 'array';

type PrepareAnnotationsObj<T> = {
  [key in keyof T]?:
    T[key] extends Array<infer U>
      ? (
        | PrepareAnnotationsObj<U>
        | FormElementType
        | [PrepareAnnotationsObj<U>]
        | [FormElementType]
      )
      : T[key] extends Record<string, any>
        ? (
          | PrepareAnnotationsObj<T[key]> 
          | FormElementType
          | [PrepareAnnotationsObj<T[key]>]
          | [FormElementType]
        )
        : FormElementType;
};

type PrepareObj<T> = {
  [key in keyof T]-?: 
    NonNullable<T[key]> extends (infer U)[]
      ? PrepareObj<NonNullable<U>>[]
      : NonNullable<T[key]> extends Record<string, any>
        ? PrepareObj<NonNullable<T[key]>>
        : NonNullable<T[key]>;
};

type FormArrayUtil<T, TNullable extends boolean> =
  T extends Array<infer U>
    ? FormArray<FormControl<TNullable extends true ? (U | null) : U>>
    : DEBUG_1;

type FormControlUtil<T, TNullable extends boolean> = FormControl<
  TNullable extends true
    ? ((T extends object ? (T extends PrepareObj<infer U> ? U : T) : T) | null)
    : (T extends object ? (T extends PrepareObj<infer U> ? U : T) : T)
>;

type FormControlsOfInner<
  TPreparedObj extends Record<string, any>,
  TNullable extends boolean,
  TTraverseObj extends boolean,
  TPreparedAnnotationsObj extends PrepareAnnotationsObj<TPreparedObj> | null
> =
  // When annotations is not set
  //
  // If we dont have annotations then every nested value in object is FormControl 
  TPreparedAnnotationsObj extends null
    ? { [key in keyof TPreparedObj]-?: FormControlUtil<TPreparedObj[key], TNullable>; }

  // When TTraverseObj is true
  //
  // Traverse every key in object and transform it to form element
  : TTraverseObj extends true
    ? {
      [key in keyof TPreparedObj]-?: 
        // FormArray type annotation
        //
        // If we have array type in annotation and current object is array type then infer FormArray type
        NonNullable<TPreparedAnnotationsObj>[key] extends Array<infer Z>
          ? TPreparedObj[key] extends Array<infer U>
            // @ts-ignore - because strange error
            ? FormArray<FormControlsOfInner<U, TNullable, false, Z>>
            : DEBUG_2

        // FormGroup type annotation
        //
        // If we have record type in annotation and current object is record type then infer FormGroup type
        : NonNullable<TPreparedAnnotationsObj>[key] extends Record<string, any>
          ? TPreparedObj[key] extends Record<string, any>
            ? FormGroup<FormControlsOfInner<TPreparedObj[key], TNullable, true, NonNullable<TPreparedAnnotationsObj>[key]>>
            : DEBUG_3
        
        // FormArray string annotation
        //
        // If we have 'array' string in annotation and current object is record type then infer FormArray type
        : NonNullable<TPreparedAnnotationsObj>[key] extends 'array'
          ? TPreparedObj[key] extends Array<infer U>
            ? FormArrayUtil<TPreparedObj[key], TNullable>
            : DEBUG_4

        // FormGroup string annotation
        //
        // If we have 'group' string in annotation and current object is record type then infer FormGroup type
        : NonNullable<TPreparedAnnotationsObj>[key] extends 'group'
          ? TPreparedObj[key] extends Record<string, any>
            ? FormGroup<FormControlsOfInner<TPreparedObj[key], TNullable, true, null>>
            : DEBUG_5

        // FormControl string annotation
        //
        // If we have 'control' string in annotation then infer FormControl type
        : NonNullable<TPreparedAnnotationsObj>[key] extends 'control'
          ? FormControlUtil<TPreparedObj[key], TNullable>

        // FormControl as default
        //
        // Otherwise infer FormControl type base on current object type
        : FormControlUtil<TPreparedObj[key], TNullable>;
    }

    // When TTraverseObj is false
    //
    // Infer type of current object as form element type
    :
    
    // FormArray type annotation
    //
    // If we have array type in annotation and current object is array type then infer FormArray type
    TPreparedAnnotationsObj extends Array<infer Z>
      ? TPreparedObj extends Array<infer U>
        // @ts-ignore - because strange error
        ? FormArray<FormControlsOfInner<U, TNullable, false, Z>>
        : DEBUG_6

    // FormGroup type annotation
    //
    // If we have record type in annotation and current object is record type then infer FormGroup type
    : TPreparedAnnotationsObj extends Record<string, any>
      ? TPreparedObj extends Record<string, any>
        ? FormGroup<FormControlsOfInner<TPreparedObj, TNullable, true, TPreparedAnnotationsObj>>
        : DEBUG_7

    // FormArray string annotation
    //
    // If we have 'array' string in annotation and current object is record type then infer FormArray type
    : TPreparedAnnotationsObj extends 'array'
      ? TPreparedObj extends Array<any>
        ? FormArrayUtil<TPreparedObj, TNullable>
        : DEBUG_8

    // FormGroup string annotation
    //
    // If we have 'group' string in annotation and current object is record type then infer FormGroup type
    : TPreparedAnnotationsObj extends 'group'
      ? TPreparedObj extends Record<string, any>
        ? FormGroup<FormControlsOfInner<TPreparedObj, TNullable, true, null>>
        : DEBUG_9

    // FormControl string annotation
    //
    // If we have 'control' string in annotation then infer FormControl type
    : TPreparedAnnotationsObj extends 'control'
      ? FormControlUtil<TPreparedObj, TNullable>

    // FormControl as default
    //
    // Otherwise infer FormControl type base on current object type
    : FormControlUtil<TPreparedObj, TNullable>;
