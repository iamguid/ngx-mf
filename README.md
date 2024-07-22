# ngx-mf
`ngx-mf` is a small (100 lines of code) zero dependency set of TypeScript types for recursive infer angular `FormGroup`, `FormArray` or `FormControl` type from your model type.

It doesn't increase your bundle size because it's just TypeScript types.

## Installation

npm

```bash
$ npm i ngx-mf
```

yarn

```bash
$ yarn add ngx-mf
```

## How It Works

Define some model:

```typescript
enum ContactType {
    Email,
    Telephone,
}

interface IContactModel {
    type: ContactType;
    contact: string;
}

interface IUserModel {
    id?: number;
    firstName: string;
    lastName: string;
    nickname: string;
    birthday: Date;
    contacts: IContactModel[];
}
```

Then define your form type based on IUserModel:

```typescript
type Form = FormType<IUserModel, { contacts: [FormElementGroup] }>
```

Then you have form type, before form will be defined:

```typescript
FormGroup<{
    id?: FormControl<number | undefined> | undefined; 
    firstName: FormControl<string | null>;
    lastName: FormControl<string | null>;
    nickname: FormControl<string | null>;
    birthday: FormControl<Date | null>;
    contacts: FormArray<FormGroup<{
        type: FormControl<ContactType | null>;
        contact: FormControl<string | null>;
    }>>;
}>
```

## Usage

`ngx-mf` exports type `FormModel` and `FormType`

`FormModel<TModel, TAnnotations>` - This is the type that recursively turns `TModel` fields (where `TModel` is your model type) into a `FormGroup`, `FormArray` or `FormControl`.
You can choose what you want: `FormGroup`, `FormArray` or `FormControl` by annotation.
You can pass `TAnnotations` as the second argument to specify output type using special easy to use syntax.

For example you have some model from How It Works chapter:

```typescript
enum ContactType {
    Email,
    Telephone,
}

interface IContactModel {
    type: ContactType;
    contact: string;
}

interface IUserModel {
    id?: number;
    firstName: string;
    lastName: string;
    nickname: string;
    birthday: Date;
    contacts: IContactModel[];
}
```

Lets say we want infer `FormGroup` where fields `firstName`, `lastName`, `nickname`, `birthday` should be `FormControl` and field `contacts` should be `FormArray` of `FormGroups`.

For that we need to pass annotation in our `FormModel` type.
 The syntax of annotation will be:

```typescript
{ contacts: [FormElementGroup] }
```

Where `contacts` is our field, `[FormElementGroup]` indicates that field is `FormArray`.
`FormElementGroup` indicates that we have `FormGroup` inside `FormArray`.

So our full `UserForm` type should be:
```typescript
FormModel<IUserModel, { contacts: [FormElementGroup] }>
```

You can find full example
here [/tests/example.test.ts](https://github.com/iamguid/ngx-mf/blob/master/tests/example.test.ts)

I strongly recommend always use `FormType`

`FormType<TModel, TAnnotations>` - This is the type that recursively turns `TModel` fields (where `TModel` is your model type) into special types tree that you can use for shortcuts to form types.
`FormType` returns tree with your model structure and additional fields for shortcuts, there is 3 type of shortcuts:
* `T` - just type of full form for current node, something like `FormGroup<...>`
* `G` - group type of your FromGroup, looks like `{a: FromControl<...>, b: FormControl<...>}`
* `I` - array item type of your FormArray, looks like `FormControl<...>`

You can combine keys of your model and this additional fields for every level of your type to get type that you need.

## Annotations
`ngx-mf` annotations have three different keywords: `FormElementArray`, `FormElementGroup`, `FormElementControl`

* `FormElementArray` - infer `FormArray`
* `FormElementGroup` - infer `FormGroup`
* `FormElementControl` - infer `FormControl`

Also annotations can be objects, like `{a: FormElementGroup}`,
and arrays, like `[FormElementGroup]`.

If you use `{}` then object with the same nesting will be `FormGroup`
If you use `[]` then object with the same nesting will be `FormArray`

And you can combine `keys of TModel`, `{}`, `[]`, `FormElementArray`, `FormElementGroup`, `FormElementControl`
to specify what you want to infer in result type.

Check [/tests/annotations.test.ts](https://github.com/iamguid/ngx-mf/blob/master/tests/annotations.test.ts) for details

## Examples Of Usage

> Definition of example model:
> 
> ```typescript
> interface Model {
>     a: number;
>     b: string[];
>     c: {
>         d: {
>             e: number[];
>         }
>         f: {
>             g: string;
>         }
>     }
> }
> ```

---

Lets see what `FormModel` will do without annotations

> Define Form type:
> 
> ```typescript
> type Form = FormModel<Model>
> ```

> Inferred `Form` type
> 
> ```typescript
> FormGroup<{
>     a: FormControl<number | null>;
>     b: FormControl<string[] | null>;
>     c: FormControl<{
>         d: {
>             e: number[];
>         };
>         f: {
>             g: string;
>         };
>     } | null>;
> }>

As we see each `FormGroup` elements is `FormControl` 
it is the default behavior of `FormModel`

The same behavior for `FormType`, but `FormType` will provide you tree of form types

---

Now let's say that `b` should be `FormArray`

> Define Form type:
> 
> ```typescript
> type Form = FormModel<Model, { b: FormElementArray }>
> ```

> Inferred `Form` type
> 
> ```typescript
> FormGroup<{
>     a: FormControl<number | null>;
>     b: FormArray<FormControl<string | null>>; // <<
>     c: FormControl<{
>         d: {
>             e: number[];
>         };
>         f: {
>             g: string;
>         };
>     } | null>;
> }>
> ```

---

Now let's say that `c` should be `FormGroup`

> Define Form type:
> 
> ```typescript
> type Form = FormModel<Model, { c: FormElementGroup }>
> ```
 
> Inferred `Form` type
> 
> ```typescript
> FormGroup<{
>     a: FormControl<number | null>;
>     b: FormControl<string[] | null>;
>     c: FormGroup<{ // <<
>         d: FormControl<{
>             e: number[];
>         } | null>;
>         f: FormControl<{
>             g: string;
>         } | null>;
>     }>;
> }>
> ```

---

Now let's say that `c.f` should be `FormGroup`

> Define Form type:
> 
> ```typescript
> type Form = FormModel<Model, { c: { f: FormElementGroup } }>
> ```
 
> Inferred `Form` type
> 
> ```typescript
> FormGroup<{
>     a: FormControl<number | null>;
>     b: FormControl<string[] | null>;
>     c: FormGroup<{ // <<
>         d: FormControl<{
>             e: number[];
>         } | null>;
>         f: FormGroup<{ // <<
>             g: FormControl<string | null>;
>         }>;
>     }>;
> }>
> ```

As we see field `c` is also `FormGroup` because every nested
fields will be `FormGroup` too.

---

Now let's say that `c.d.e` should be `FormArray`

> Define Form type:
> 
> ```typescript
> type Form = FormModel<Model, { c: { d: { e: FormElementArray } } }>
> ```

> Inferred `Form` type
> 
> ```typescript
> FormGroup<{
>     a: FormControl<number | null>;
>     b: FormControl<string[] | null>;
>     c: FormGroup<{ // <<
>         d: FormGroup<{ // <<
>             e: FormArray<FormControl<number | null>>; // <<
>         }>;
>         f: FormControl<{
>             g: string;
>         } | null>;
>     }>;
> }>
> ```

---

> If you pass array type to FormModel then you get FormArray
> instead of FormGroup
>
> ```typescript
> type Form = FormModel<number[]>
> ```
> 
> would be
>
> ```typescript
> FormArray<FormControl<number>>
> ```

> Also you can define FormArray recursively like group inside
> array inside array :)
> ```typescript
> type Form = FormModel<SomeModel, [[FormElementGroup]]>
> ```

> Or array inside group inside array for example:
> 
> ```typescript
> type Form = FormModel<SomeModel, [{a: FormElementArray}]>
> ```

Other examples you can find in annotation tests
[/tests/annotations.test.ts](https://github.com/iamguid/ngx-mf/blob/master/tests/annotations.test.ts)

## Questions

> Q: Why i can't use just `FormGroup<Model>` ?
> 
> A: Because when your model have nested fields, then it won't work

> Q: Why i can't define form just as `FormGroup` ?
> 
> A: Because then you loose your types

> Q: Why i can't define forms without binding
> it to model type ?
> 
> A: Yes you can, but it's more usefull to bind it, because if you change the model it will better to see inconsystency directly in your form

> Q: Why i can't init form when define it and use `typeof` to infer form type?
> 
> A: Yes you can, it is another way to save form type
> and you can use `typeof` to get type of form,
> to pass it to the method, but when your model will
> change then you will see errors only in the places
> where you use `patch` > or `setValue`,
> but it is inderect errors, and when you bind
> forms to models you will see errors on the form definition.
> But, anyway in that case you can't to get types of your form before
> it will be define

> Q: What about dynamic forms ?
> 
> A: you can make some fields optional and enable/disable
> it when you need it.

> Q: What about complicated forms that includes many of fields, groups and controls
> 
> A: It is the main scenario of `ngx-mf`

## Tips And Tricks

* Always use `FormType` types when you create your form.
Because it will be more simpler to debug wrong types, and it allow you to not to specify controls types directly.

* Use FormBuilder (`fb.group<Form[G]>(...)`) or constructor (`new FormGroup<Form[G]>(...)`) syntax to define your forms.
Because if you use array syntax, then you can't pass argument to FormGroup type.

## Links
* Reddit topic - https://www.reddit.com/r/angular/comments/vv2xmd/what_do_you_think_about_generating_formgroup_type/
* Stackoverflow questions - https://stackoverflow.com/questions/72500855/formbuilder-with-strongly-typed-form-in-ng14 https://stackoverflow.com/questions/72507263/angular-14-strictly-typed-reactive-forms-how-to-type-formgroup-model-using-exi
* Dev.to article - https://dev.to/iamguid/new-way-to-cook-angular-14-typed-forms-1g7h
* Medium article - https://medium.com/p/1ffebf193df