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
Form[T] is FormGroup<{
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

`ngx-mf` exports types `FormModel` and `FormType`

`FormModel<TModel, TAnnotations>` - WARNING (deprecated) recursively turns `TModel` fields (where `TModel` is your model type) into a `FormGroup`, `FormArray` or `FormControl`.
You can choose what do you want: `FormGroup`, `FormArray` or `FormControl` by annotation.
You can pass `TAnnotations` as the second argument to specify output type using special easy to use syntax.

`FormType` needs to get types of nested fields.

Example model from How It Works chapter:

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

For that we need to pass annotation in our `FormType` type.
 The syntax of annotation will be:

```typescript
{ contacts: [FormElementGroup] }
```

Where `contacts` is our field, `[FormElementGroup]` indicates that field is `FormArray`.
`[FormElementGroup]` indicates that we have `FormGroup` inside `FormArray`.

So our full `UserForm` type should be:
```typescript
type UserForm = FormType<IUserModel, { contacts: [FormElementGroup] }>
```

You can find full example
here [/tests/example.test.mts](https://github.com/iamguid/ngx-mf/blob/master/tests/example.test.mts)

`FormType<TModel, TAnnotations>` - Recursively turns `TModel` fields (where `TModel` is your model type) into types tree with your model structure and additional fields for shortcuts.
There is 3 type of shortcuts:
* `T` - type of full form for current node, something like `FormGroup<...>`
* `G` - group type of your FromGroup, looks like `{a: FromControl<...>, b: FormControl<...>}`
* `I` - array item type of your FormArray, looks like `FormControl<...>`

You can combine keys of your model and this additional fields for every level of your type to get type that you need.

I strongly recommend to use `FormType`, because in specific cases you may need to get form type for nested fields,
and sometime this fields are optional, and it will be difficult to get type of nested optional field.

## Annotations
`ngx-mf` annotations have three different annotations: `FormElementArray`, `FormElementGroup`, `FormElementControl`

* `FormElementArray` - infer `FormArray` on the same nesting
* `FormElementGroup` - infer `FormGroup` on the same nesting
* `FormElementControl` - infer `FormControl` on the same nesting

Also annotations can be objects, like `{a: FormElementGroup}`,
and arrays, like `[FormElementGroup]`.

If you use `{}` then object with the same nesting will be `FormGroup`
If you use `[]` then object with the same nesting will be `FormArray`

And you can combine `keys of TModel`, `{}`, `[]`, `FormElementArray`, `FormElementGroup`, `FormElementControl`
to specify what you do want to infer in result type.

Check [/tests/annotations.test.mts](https://github.com/iamguid/ngx-mf/blob/master/tests/annotations.test.mts) for details

## Examples Of Usage

> Definition of example model:
> 
> ```typescript
> interface Model {
>     a: number | null;
>     b?: {
>         c: {
>             d: number[];
>             e: { 
>                 f: string; 
>             }
>         }[]
>     }
> }
> ```

---

Lets see what `FormType` will do without annotations

> ```typescript
> type Form = FormType<Model>
> ```
>
> ```typescript
> Form[T] is FormGroup<{
>     a: FormControl<number | null>;
>     b: FormControl<string[]>;
>     c?: FormControl<{
>         d: {
>            e: number[];
>            f: {
>                g: string;
>            };
>         }[];
>     } | undefined> | undefined;
> }>
> ```

As you can see root is `FormGroup`, and elements is `FormControl` - it is the default behavior of `FormType` without annotations

As you can see `c` field is optional, because in `Model` this field marked as optional in form type too.
That means, all optionals will be optionals in inferred type.

---

Now let's say that `c` should be `FormGroup`

> ```typescript
> type Form = FormType<Model, { c: FormElementGroup }>
> ```
>
> ```typescript
> Form[T] is FormGroup<{
>     a: FormControl<number | null>;
>     b: FormControl<string>;
>     c?: FormGroup<{ // <<
>         d: FormControl<{ // <<
>            e: number[];
>            f: {
>                g: string;
>            };
>         }[]>;
>     } | undefined> | undefined;
> }>
> ```
---

Now let's say that `c.d` should be `FormArray`

> ```typescript
> type Form = FormType<Model, { c: { d: FormElementArray } }>
> ```
>
> ```typescript
> Form[T] is FormGroup<{
>     a: FormControl<number | null>;
>     b: FormControl<string[]>;
>     c?: FormGroup<{ // <<
>         d: FormArray<FormControl<{ // <<
>            e: number[];
>            f: {
>                g: string;
>            };
>         }>>;
>     } | undefined> | undefined;
> }>
> ```

---

Now let's say that `c.d.e` should be `FormArray`

> ```typescript
> type Form = FormType<Model, { c: { d: [ { e: FormElementArray } ] } }>
> ```
>
> ```typescript
> Form[T] is FormGroup<{
>     a: FormControl<number | null>;
>     b: FormControl<string[]>;
>     c?: FormGroup<{ // <<
>         d: FormArray<FormGroup<{ // <<
>            e: FormArray<FormControl<number>>; // <<
>            f: {
>                g: string;
>            };
>         }>>;
>     } | undefined> | undefined;
> }>
> ```

---

Now let's say that `c.d.e` should be `FormArray` and `c.d.f` should be `FormGroup`

> ```typescript
> type Form = FormType<Model, { c: { d: [ { e: FormElementArray, f: FormElementGroup } ] } }>
> ```
>
> ```typescript
> Form[T] is FormGroup<{
>     a: FormControl<number | null>;
>     b: FormControl<string[]>;
>     c?: FormGroup<{ // <<
>         d: FormArray<FormGroup<{ // <<
>            e: FormArray<FormControl<number>>; // <<
>            f: FormGroup<{ // <<
>                g: FormControl<string>; // <<
>            }>;
>         }>>;
>     } | undefined> | undefined;
> }>
> ```



---

> If you pass array type to FormType then you will get FormArray
> instead of FormGroup
>
> ```typescript
> type Form = FormType<number[]>
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
> type Form = FormType<SomeModel, [[FormElementGroup]]>
> ```

> Or array inside group inside array for example:
> 
> ```typescript
> type Form = FormType<SomeModel, [{a: FormElementArray}]>
> ```

Other examples you can find in annotation tests
[/tests/annotations.test.mts](https://github.com/iamguid/ngx-mf/blob/master/tests/annotations.test.mts)

## The right way to debug your types

* Always use `FormGroup<FormType[G]>` types when you create your form group.
Because it will be more simpler to debug wrong types, and it allow you to not to specify controls types directly.
See answer here https://github.com/iamguid/ngx-mf/issues/19

* Use FormBuilder (`fb.group<Form[G]>(...)`) or constructor (`new FormGroup<Form[G]>(...)`) syntax to define your forms.
Because if you use array syntax, then you can't pass argument to FormGroup type.

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

## Links
* Reddit topic - https://www.reddit.com/r/angular/comments/vv2xmd/what_do_you_think_about_generating_formgroup_type/
* Stackoverflow questions - https://stackoverflow.com/questions/72500855/formbuilder-with-strongly-typed-form-in-ng14 https://stackoverflow.com/questions/72507263/angular-14-strictly-typed-reactive-forms-how-to-type-formgroup-model-using-exi
* Dev.to article - https://dev.to/iamguid/new-way-to-cook-angular-14-typed-forms-1g7h
* Medium article - https://medium.com/p/1ffebf193df
* Playground - 