# ngx-mf
`ngx-mf` is zero dependency set of types for infer
angular `FormGroup` type from model type.

It doesn't increase your bundle size because it's just
TypeScript types.

## Installation

npm

```bash
$ npm i ngx-mf --saveDev
```

yarn

```bash
$ yarn add ngx-mf --dev
```

## Usage

`ngx-mf` exports type `FormModel`

`FormModel<TModel, TAnnotations>` - This is the type
that recursively turns `TModel` (where `TModel` is your model type)
into a `FormGroup`.
You can choose what you want: `FormGroup` or `FormArray` by annotations.
You can pass `TAnnotations` as the second argument and specify
output type, you should use special syntax to do it.

For example we have some model like this:

```typescript
interface IUserModel {
    id: number;
    firstName: string;
    lastName: string;
    nickname: string;
    birthday: Date;
    contacts: IContactModel[];
}
```

Lets say we want, for example, infer FormGroup where
fields `firstName`, `lastName`, `nickname`, `birthday`
should be `FormControl` and field `contacts` should be
`FormArray` of `FormGroups`.

First of all we need to exclude `id` from our model,
it is needed because all fields are required.
If we need to exclude some fields we
should omit or pick them from source model.

```typescript
Omit<IUserModel, 'id'>
```

If we want to add some field then we should using `&`
operator, for examle:

```typescript
IUserModel & {
    someField: number;
}
```

Then we want to specify `contacts` as `FormArray` and specify
every contact as `FormGroup`, so we need to pass annotation
in our `FormModel` type. The syntax of annotation would
be like that:

```typescript
{ contacts: ['group'] }
```

Where `contacts` is our field, `['group']` indicates that
field is `FormArray`, `'group'` indicates that we have
`FormGroup` inside `FormArray`.

So our full `UserForm` type should be:
```typescript
FormModel<Omit<IUserModel, 'id'>, { contacts: ['group'] }>
```

You can find full example
here [/tests/example.test.ts](https://github.com/iamguid/ngx-mf/blob/master/tests/example.test.ts)

## Annotations
`ngx-mf` annotations have three different keywords: `array`,
`group`, `control` and special type `Replace`

* `array` - infer `FormArray`
* `group` - infer `FormGroup`
* `control` - infer `FormControl`
* `Replace<T>` - if you want replace inferred type to `T`

Also annotations can be objects like `{a: 'group'}`,
and arrays like `['group']`.

And you can combine `{}`, `[]`, `'array'`, `'group'`, `'control'`
to specify what you want.

If you use `{}` then object with the same nesting will be `FormGroup`
If you use `[]` then object with the same nesting will be `FormArray`

When you want to full replace inferred type you 
can use `Replace<T>`

For example: we have `FormGroup`, but want `FormControl`:

```typescript
interface Model {
    a: {
        b: number;
    }
}

type Form = FormModel<Model, { a: Replace<FormControl<number | null>> }>;

// Form inferred:
FormGroup<{
    a: FormControl<number | null>;
}>
```

## Infer Modes
`ngx-mf` have four different InferMode-s: `InferModeNullable`,
`InferModeNonNullable`, `InferModeFromModel`, and special mode
`InferModeSaveOptional` with those modes you can manage what you want
to infer in FormControl.

* `InferModeNullable` - infer `FormControl<NonNullable<T> | null>`
(by default)
* `InferModeNonNullable` - infer `FormControl<NonNullable<T>`
* `InferModeFromModel` - infer `FormControl<Exclude<T, undefined>>`
* `InferModeSaveOptional` - save optionals fields (`field?:`) or not

If `InferModeSaveOptional` is not provided then each model field
will be required, otherwise each field will be optional if source field
is optional.

You can combine `InferModeSaveOptional` with other modes with type union,
for example `InferModeNullable & InferModeSaveOptional` means that each
field should saves optional but every field will be nullable.

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

---

Now let's say that `b` should be `FormArray`

> Define Form type:
> 
> ```typescript
> type Form = FormModel<Model, { b: 'array' }>
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
> type Form = FormModel<Model, { c: 'group' }>
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
> type Form = FormModel<Model, { c: { f: 'group' } }>
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
> type Form = FormModel<Model, { c: { d: { e: 'array' } } }>
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
> type Form = FormModel<SomeModel, [['group']]>
> ```

> Or array inside group inside array for example:
> 
> ```typescript
> type Form = FormModel<SomeModel, [{a: 'array'}]>
> ```

Other examples you can find in annotation tests
[/tests/annotations.test.ts](https://github.com/iamguid/ngx-mf/blob/master/tests/annotations.test.ts)

## Tips And Tricks

* Always pass type `Form['controls']` when you create your
form. Because it will be more simpler to debug wrong types.

* Use FormBuilder (`fb.group<Form['controls']>(...)`) or
constructor (`new FormGroup<Form['controls']>(...)`)
syntax to define your forms.
Because if you use array syntax then you can't pass
argument to FormGroup type.

## Questions

> Q: Why i cannot just use `FormGroup<Model>` ?
> 
> A: see [/tests/pure-angular-forms.test.ts (example 1)](https://github.com/iamguid/ngx-mf/blob/master/tests/pure-angular-forms.test.ts)

> Q: Why i cannot define form as `FormGroup` ?
> 
> A: Because you loose your types, see [/tests/type-lose.ts](https://github.com/iamguid/ngx-mf/blob/master/tests/type-lose.ts)

> Q: Why i cannot define forms without binding
> it to model type ?
> 
> A: Yes you can, but it's more usefull to bind it

> Q: Why i cannot init form when define it and use
> `typeof` to infer form type?
> 
> A: Yes you can, it is another way to save form type
> and you can use `typeof` to get type of form,
> to pass it to the method, see [/test/define-when-init.ts](https://github.com/iamguid/ngx-mf/blob/master/tests/define-when-init.ts),
> but when your model will change then you will see
> errors only in the places where you use `patch`
> or `setValue` or thomething like that,
> i think it is inderect errors, but when you bind
> forms to models you see errors on the form definition

> Q: What about dynamic forms ?
> 
> A: In dynamic cases use `Replace` special type
> to define what you want to infer (see Annotations chapter)
> You can `Replace` inferred type to something like `FormGroup<any>`
> and then cast it to your types