# ngx-mf
`ngx-mf` is a small zero dependency set of TypeScript types for recursive
infer angular `FormGroup`, `FormArray` or `FormControl` type
from model type.

It doesn't increase your bundle size because it's just
TypeScript types.

WARNING: I found some issues in TypeScript,
for workaround it I use @ts-ignore,
if it critical for your project don't use that library.
Because in future TypeScript releases library may break down

## Installation

npm

```bash
$ npm i ngx-mf --saveDev
```

yarn

```bash
$ yarn add ngx-mf --dev
```

## Restrictions

* You cant use array syntax with `FormControlState`, it is a bug on angular side,
but in other syntax (with constructor and FormBuilder) it works fine

## How It Works

We define some model:

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
    id: number;
    firstName: string;
    lastName: string;
    nickname: string;
    birthday: Date;
    contacts: IContactModel[];
}
```

Then we define some magic type, like:

```typescript
Type Form = FormModel<IUserModel, { contacts: ['group'] }>
```

Then we have type, based on our model, before form will be define:

```typescript
FormGroup<{
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

`ngx-mf` exports type `FormModel`

`FormModel<TModel, TAnnotations, TInferMode>` - This is the type
that recursively turns `TModel` fields (where `TModel` is your model type)
into a `FormGroup`, `FormArray` or `FormControl`.
You can choose what you want: `FormGroup`, `FormArray` or `FormControl`
by annotations.
You can pass `TAnnotations` as the second argument to specify
output type using special syntax.
Also you can pass `TInferType` for manage infer logic, see Infer Mode chapter.

For example we have some model from How It Works chapter:

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
    id: number;
    firstName: string;
    lastName: string;
    nickname: string;
    birthday: Date;
    contacts: IContactModel[];
}
```

Lets say we want, for example, infer `FormGroup` where
fields `firstName`, `lastName`, `nickname`, `birthday`
should be `FormControl` and field `contacts` should be
`FormArray` of `FormGroups`.

First of all we need to exclude `id` from our model,
it is needed because all fields are required by default.
If we need to exclude some fields we
should omit or pick them from source model.

```typescript
Omit<IUserModel, 'id'>
```

Ofcourse you can save optional fields in output type,
see chapter Infer Mode

If we want to add some field then we should using `&`
operator or extends interface, for examle:

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

Also you can check [/tests/annotations.test.ts](https://github.com/iamguid/ngx-mf/blob/master/tests/annotations.test.ts)

## Infer Modes
`ngx-mf` have different InferMode-s and it's a third type parameter of `FormModel`,
InferMode needed for manage what you want to infer.
For example we need make all fields in form optional,
but we want that all controls should be nonnullable,
it is a case of InferMode.

So we need define FormModel like this:

```typescript
type Form = FormModel<IUserModel, { contacts: ['group'] }, InferModeOptional & InferModeNonNullable>;
```

Then we have that type:

```typescript
FormGroup<{
    firstName?: FormControl<string>;
    lastName?: FormControl<string>;
    nickname?: FormControl<string>;
    birthday?: FormControl<Date>;
    contacts?: FormArray<FormGroup<{
        type?: FormControl<ContactType>;
        contact?: FormControl<string>;
    }>>;
}>
```

As we see now FormGroups has optional fields and all FormControls is nonnullable

Available variants:
* `InferModeFromModel` - infer all from model (optionals and nullability)
* `InferModeFromModel & InferModeNonNullable` - infer optionals from model, and all controls will be all nonnullable
* `InferModeFromModel & InferModeNullable` - infer optionals from model, and all controls will be nullable 
* `InferModeOptional & InferModeNonNullable` - makes all fields optional and all controls will be nonnullable
* `InferModeOptional & InferModeNullable` - makes all fields optional, and all controls will be nnullable
* `InferModeOptional & InferModeFromModel` - makes all fields optional, and controls infer nullability from model
* `InferModeRequired & InferModeNonNullable` - makes all fields required, and all controls will be nonnullable
* `InferModeRequired & InferModeNullable` - makes all fields required, and all controls will be nnullable
* `InferModeRequired & InferModeFromModel` - makes all fields required, and controls infer nullability from model

Also you can check [/tests/infermode.test.ts](https://github.com/iamguid/ngx-mf/blob/master/tests/infermode.test.ts)

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

## Questions

> Q: Why i cannot just use `FormGroup<Model>` ?
> 
> A: Because when your model have nested fields,
> then it wouldn't work

> Q: Why i cannot define form just as `FormGroup` ?
> 
> A: Because then you loose your types

> Q: Why i cannot define forms without binding
> it to model type ?
> 
> A: Yes you can, but it's more usefull to bind it

> Q: Why i cannot init form when define it and use
> `typeof` to infer form type?
> 
> A: Yes you can, it is another way to save form type
> and you can use `typeof` to get type of form,
> to pass it to the method but when your model will
> change then you will see errors only in the places
> where you use `patch` > or `setValue` or thomething like that,
> i think it is inderect errors, but when you bind
> forms to models you see errors on the form definition.
> But anyway in that case you can't to get types of your form before
> it will be define

> Q: What about dynamic forms ?
> 
> A: you can make some fields optional and enable/disable
> it when you need it.
> You can use `Replace` special type
> to define what you want to infer (see Annotations chapter)
> You can `Replace` inferred type to something like `FormGroup<any>`
> and then cast it to your types if you really need it.

> Q: What about complicated forms that includes many of
> fields, groups and controls
> 
> A: It is the main idea of `ngx-mf` :)

## Tips And Tricks

* Always pass type `Form['controls']` when you create your
form. Because it will be more simpler to debug wrong types,
allow you not to specify controls types.

* Use FormBuilder (`fb.group<Form['controls']>(...)`) or
constructor (`new FormGroup<Form['controls']>(...)`)
syntax to define your forms.
Because if you use array syntax, then you can't pass
argument to FormGroup type.

## Links
* Reddit topic - https://www.reddit.com/r/angular/comments/vv2xmd/what_do_you_think_about_generating_formgroup_type/
* Stackoverflow questions - https://stackoverflow.com/questions/72500855/formbuilder-with-strongly-typed-form-in-ng14 https://stackoverflow.com/questions/72507263/angular-14-strictly-typed-reactive-forms-how-to-type-formgroup-model-using-exi
* Dev.to article - https://dev.to/iamguid/new-way-to-cook-angular-14-typed-forms-1g7h
* Medium article - https://medium.com/p/1ffebf193df