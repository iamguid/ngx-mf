# ngx-mf
`ngx-mf` is zero dependency set of types for infer
angular FormGroup type from model type.
That means you can bind your models type with form type.

It's not increase of your bundle size because it's just
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

`ngx-mf` exports four types `FormModel`,
`FormModelNonNullable`, `FM`, `FMN`

* `FormModel<TObj, TAnnotation>` - It's type that infer
type from TObj (where TObj is your model type) that
you can use at is.
You can define what you want FormGroup ar FormArray
at the concreate field in TObj by TAnnotation.
You can pass TAnnotation as the second argument and specify
output type, you should use special syntacis to do it.

* `FormModelNonNullable<TObj, TAnnotation>` - do the same things
but for `new FormBuilder().nonNullable`

* `FM` - it's just symlink to type `FormModel`

* `FMN` - it's just symlink to type `FormModelNonNullable`

For example we have some model like this:

```typescript
interface IUserModel {
    id: number;
    firstName: string;
    lastName: string;
    nick: string;
    birthday: Date;
    contacts: IContactModel[];
}
```

First of all we need to exclude `id` from our model,
it is needed because all fields is required in
infered type, if we need to exclude some field we
should omit or pick them from source model.

```typescript
Omit<IUserModel, 'id'>
```

And we want to specify `contacts` is FormArray and
every contact is FormGroup, so we need to pass special
annotation, the syntax of annotation would be like that:

```typescript
{ contacts: ['group'] }
```

where `contacts` is our field, and `['group']` indicates that
we have FormArray in that field, and `'group'` indicates that
we have FormGroup inside FormArray.

So the our full type should be:
```typescript
type UserForm = FormGroup<FormControlsOf<Omit<IUserModel, 'id'>, { contacts: ['group'] }>>
```

Yea we have UserForm!

You can find full example
in [/tests/example.test.ts](https://github.com/iamguid/ngx-mf/blob/master/tests/example.test.ts)

## Annotations
`ngx-mf` annotations has three different keywords: `array`, `group`, `control`

* `array` - should infer type FormArray
* `group` - should infer type FormGroup
* `control` - should infer type FormControl

Also annotations can be nested like `{a: 'group'}`.
and nested arrays like `{a: ['group']}`.

And you can combine `{}`, `[]`, `'array'`, `'group'`, `'control'`
to describe what you want

If you use `{}` then object in the same level will be FormGroup

If you use `[]` then object in the same level will be FormArray

## Examples Of Usage

---

> Definition of example model:
> 
> ```typescript
> interface Model {
>     a: number;
>     b: number[];
>     c: {
>         d: {
>             e: number;
>         }
>         f: {
>             g: string;
>         }
>         h: {
>             i: Date;
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

As we see every `FormGroup` elements is `FormControls` 
it is the default behavior of `FormModel`

---

Now we say that `b` should be `FormArray`

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

Now we say that `c` should be `FormGroup`

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

Now we say that `c.f` should be `FormGroup`

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

---

Now we say that `c.f` should be `FormGroup`

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