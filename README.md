# ngx-mf
`ngx-mf` is zero dependency set of types for infer
angular FormGroup type from model type.

That means you can bind your models type with form type
and check type errors.

For example if you have codegen tools for models in your
project you can just use that models to define forms type.

If something changed in your models you see type checking
errors - it is usefull in real world enterprise applications
where everything can be changed.

You can define your model interface once and then you
can use it everywhere (in forms and backend interaction
for example).

Use only one source of truth is imported thing, and this
lib can help you for that.

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

`ngx-mf` export two types `FormControlsOf`
and `FormControlsOfNonNullable`

`FormControlsOf<TObj, TAnnotation>` - It's helper type
that infer special type from TObj (where TObj is your
model type) that you can pass to FormGroup as a first
type argument.
You can define what you want (FormGroup ar FormArray)
at the concreate field in TObj.
It's possible because second argument TAnnotation do it.
You can pass TAnnotation as the second argument and specify
output type, you shoul use special syntacis.

`FormControlsOfNonNullable<TObj, TAnnotation>` - do the same things but for `new FormBuilder().nonNullable`

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

Also annotations can have nested objects like `{a: 'group'}`.

Also annotations can have nested arrays like `{a: ['control']}`.

### examples of usage

---

Default behavior without annotations

```typescript
interface SomeModel {
    a: number;
    b: number[];
    c: {
        d: number;
    };
}

type Form = FormGroup<FormControlsOf<SomeModel>>
```

Form type would be

```typescript
Form === FormGroup<{
    a: FormControl<number | null>;
    b: FormControl<number[] | null, true>;
    c: FormControl<{
        d: number;
    }>;
}>
```

Every FormGroup member would be FormControl