import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';

// Main type
export type FormModel<
  TModel,
  TAnnotations extends Record<string, any> | null = null,
> = FormModelInnerTraverse<TModel, TAnnotations>

// Special type for annotation
export type Replace<T extends AbstractControl> = T & { __replace__: '__replace__' };

// Variants of form elements types
export type FormElementControl = { __control__: '__control__' }
export type FormElementGroup = { __group__: '__group__' }
export type FormElementArray = { __array__: '__array__' }
export type FormElementType = FormElementControl | FormElementGroup | FormElementArray | Replace<any>

// Remove optionals and save object structure
type OnlyKeys<T> = {
  [key in keyof T]-?: any
}

// Traverse every key in object and transform it to form element recursively
type FormModelKeyofTraverse<
  TModel extends Record<string, any>,
  TAnnotations extends (OnlyKeys<TModel> | FormElementType),
> = {
  [key in keyof OnlyKeys<TModel>]:
    FormModelInnerTraverse<
      TModel[key],
      TAnnotations extends OnlyKeys<TModel>[key] ? TAnnotations[key] : TAnnotations
    >
}

// Infer type of current object as form element type recursively
type FormModelInnerTraverse<
  TModel,
  TAnnotations,
> =
  // When annotations is not set
  TAnnotations extends null
  ? TModel extends Array<any>
    ? FormModelInnerTraverse<TModel, FormElementArray>
    : TModel extends Record<string, any>
      ? FormModelInnerTraverse<TModel, FormElementGroup>
      : FormModelInnerTraverse<TModel, FormElementControl>

  // FormArray annotation
  //
  // If we have array in annotation 
  // and current record is array 
  // then infer FormArray type recursively
  : TAnnotations extends FormElementArray
    ? TModel extends Array<infer TInferredArrayValueType>
      ? FormArray<FormControl<TInferredArrayValueType>>
      : never

  // FormGroup annotation
  //
  // If we have group in annotation
  // and current object has keys
  // then infer FormGroup type recursively
  : TAnnotations extends FormElementGroup
    ? TModel extends Record<string, any>
      ? FormGroup<FormModelKeyofTraverse<TModel, FormElementGroup>>
      : never

  // FormControl annotation
  //
  // If we have control in annotation
  // then infer FormControl type
  : TAnnotations extends FormElementControl
    ? FormControl<TModel>

  // Replace annotation
  //
  // If we have Replace<T> in annotation
  // then infer T
  : TAnnotations extends Replace<infer TInferredReplace>
    ? TInferredReplace
  
  // FormArray type annotation
  //
  // If we have array type in annotation
  // and current object is array
  // then infer FormArray type recursively
  : TAnnotations extends Array<infer TInferedAnnotations>
    ? TModel extends Array<infer TInferedArrayType>
      ? FormArray<FormModelInnerTraverse<TInferedArrayType, TInferedAnnotations>>
      : never

  // FormGroup type annotation
  //
  // If we have Object type in annotation
  // and current object is Object
  // then infer FormGroup type recursively
  : TAnnotations extends Record<string, any>
    ? TModel extends Record<string, any>
      ? FormGroup<FormModelKeyofTraverse<TModel, TAnnotations>>
      : never

  : FormModelInnerTraverse<TModel, FormElementControl>