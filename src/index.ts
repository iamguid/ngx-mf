import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';

// FormModel
// @deprecated
export type FormModel<
  TModel,
  TAnnotation extends FormElementTree = null,
> = BuildFormTreeNode<TModel, TAnnotation>

// FormModel with Types for case where you have optional fields, and need to get form types
export type FormType<
  TModel,
  TAnnotation extends FormElementTree = null,
> = BuildFormTypeTreeNode<TModel, TAnnotation>

// Variants of form elements types
export type FormElementControl = { __kind__: '__control__' }
export type FormElementGroup = { __kind__: '__group__' }
export type FormElementArray = { __kind__: '__array__' }
export type FormElement = FormElementControl | FormElementGroup | FormElementArray
export type FormElementTree = { [key: string]: FormElementTree } | Array<FormElementTree> | FormElement | null

// Special symbols to get full/array/group type of current node from FormType structure
const T = Symbol('T')
const I = Symbol('I')
const G = Symbol('G')
export type T = typeof T
export type I = typeof I
export type G = typeof G

// Remove optionals and leave only model structure
type Structure<T, TValue = any> = {
  [key in keyof T]?: TValue
}

// Handle form type tree record
type BuildFormTypeTreeKeyof<
  TModel extends Record<string, any>,
  TAnnotation extends Structure<TModel>,
> = {
  [key in keyof Required<TModel>]-?: BuildFormTypeTreeNode<TModel[key], TAnnotation[key]>
} 

// Handle form type tree node
type BuildFormTypeTreeNode<
  TModel,
  TAnnotation extends FormElementTree,
  TResult extends AbstractControl = BuildFormTreeNode<TModel, TAnnotation>
> = TResult extends FormArray
    ? { 
        [T]: TResult,
        [I]: TModel extends Array<infer TArrayElement> 
          ? TAnnotation extends Array<infer TArrayElementAnnotation extends FormElementTree>
            ? BuildFormTypeTreeNode<TArrayElement, TArrayElementAnnotation>
            : TAnnotation extends FormElementArray
              ? BuildFormTypeTreeNode<TArrayElement, FormElementArray>
              : TResult['controls'][0] 
          : BuildFormTypeTreeNode<TModel, TAnnotation> 
      }
    : TResult extends FormGroup
      ? { 
          [T]: TResult,
          [G]: TResult['controls']
        } & (TModel extends Record<string, any> ? BuildFormTypeTreeKeyof<TModel, TAnnotation> : never)
    : { [T]: TResult }

// Handle form tree record
type BuildFormTreeKeyof<TModel extends Record<string, any>, TAnnotation extends Structure<TModel>> = {
  [key in keyof TModel]: BuildFormTreeNode<TModel[key], TAnnotation[key]>
}

// Handle form tree node
type BuildFormTreeNode<TModel, TAnnotation> =
  // When annotations is not set
  TAnnotation extends null
    ? TModel extends Array<any>
      ? BuildFormTreeNode<TModel, FormElementArray>
    : TModel extends Record<string, any>
      ? BuildFormTreeNode<TModel, FormElementGroup>
  : BuildFormTreeNode<TModel, FormElementControl>

  // FormArray annotation
  //
  // If we have array in annotation 
  // and current model is array 
  // then infer FormArray type recursively
  : TAnnotation extends FormElementArray
    ? TModel extends Array<infer TArrayElement>
      ? FormArray<FormControl<TArrayElement>>
    : never

  // FormGroup annotation
  //
  // If we have group in annotation
  // and current model has keys
  // then infer FormGroup type recursively
  : TAnnotation extends FormElementGroup
    ? TModel extends Record<string, any>
      ? FormGroup<BuildFormTreeKeyof<TModel, { [key in keyof TModel]: FormElementControl }>>
    : never

  // FormControl annotation
  //
  // If we have control in annotation
  // then infer FormControl type
  : TAnnotation extends FormElementControl
    ? FormControl<TModel>
  
  // FormArray type annotation
  //
  // If we have array type in annotation
  // and current model is array
  // then infer FormArray type recursively
  : TAnnotation extends Array<infer TArrayElementAnnotation extends FormElementTree>
    ? TModel extends Array<infer TArrayElement>
      ? FormArray<BuildFormTreeNode<TArrayElement, TArrayElementAnnotation>>
    : never

  // FormGroup type annotation
  //
  // If we have Record type in annotation
  // and current model is Record
  // then infer FormGroup type recursively
  : TAnnotation extends Structure<TModel, FormElementTree>
    ? TModel extends Record<string, any>
      ? FormGroup<BuildFormTreeKeyof<TModel, TAnnotation>>
    : never

  // by default
  : BuildFormTreeNode<TModel, FormElementControl>

// #endregion
