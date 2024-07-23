import "@angular/compiler"

import { FormBuilder, Validators } from "@angular/forms"
import { FormElementArray, FormElementControl, FormElementGroup, FormType, G, I, T } from "../src/index.mjs"

describe('Examples', () => {
    describe('Example from README.md', () => {
        interface Model {
            a: number | null;
            b: string;
            c?: {
                d: {
                    e: number[];
                    f: { 
                        g: string; 
                    }
                }[]
            }
        }

        const fb = new FormBuilder();

        it('Default behavior, without annotations', () => {
            type Form = FormType<Model>
            // type Form = {
            //     [T]: FormGroup<...>;
            //     [G]: {
            //         a: FormControl<number | null>;
            //         b: FormControl<string>;
            //         c?: FormControl<...> | undefined;
            //     };
            //     a: { [T]: FormControl<number | null> };
            //     b: { [T]: FormControl<string> };
            //     c: { [T]: FormControl<... | undefined> };
            // }

            type TypeG = Form[G]
            // type TypeG = {
            //     a: FormControl<number | null>;
            //     b: FormControl<string>;
            //     c?: FormControl<{
            //         d: {
            //             e: number[];
            //             f: {
            //                 g: string;
            //             };
            //         }[];
            //     } | undefined> | undefined;
            // }

            type TypeA = Form['a']
            // type TypeA = {
            //     [T]: FormControl<number | null>;
            // }

            type typeB = Form['b']
            // type typeB = {
            //     [T]: FormControl<string>;
            // }

            type typeC = Form['c']
            // type typeC = {
            //     [T]: FormControl<{
            //         d: {
            //             e: number[];
            //             f: {
            //                 g: string;
            //             };
            //         }[];
            //     } | undefined>;
            // }

            const form: Form[T] = fb.group<Form[G]>({
                a: fb.control(null),
                // ^ This walue is nullable in model type, so, we can use nullable form control, and use null in default value

                // b: fb.control('test'),
                // ^ Type 'FormControl<string | null>' is not assignable to type 'FormControl<string>'.
                //     Type 'string | null' is not assignable to type 'string'.
                //         Type 'null' is not assignable to type 'string'.ts(2322)
                // Because form control is nullable, but in model is nonNullable.
                // The right way is to set form control to nonNullable.
                b: fb.control('test', { nonNullable: true }),

                // c: fb.control({...})
                // ^ Can be omitted, because it is opptional
            })

            expect(form.value).toStrictEqual({
                a: null,
                b: 'test',
            })
        })

        it('`c` should be `FormGroup`', () => {
            type Form = FormType<Model, { c: FormElementGroup }>
            // type Form = {
            //     [T]: FormGroup<...>;
            //     [G]: {
            //         a: FormControl<...>
            //         b: FormControl<...>
            //         c: FromGroup<...>
            //     };
            //     a: { [T]: FormControl<...> }
            //     b: { [T]: FormControl<...> }
            //     c: {
            //         [T]: FormGroup<...>;
            //         d: {
            //             [T]: FormControl<...>
            //         }
            //     }
            // }

            type FormC = Form['c']
            // type FormC = {
            //     [T]: FormGroup<...>;
            //     [G]: {
            //         d: FromControl<...>
            //     };
            //     d: {
            //         [T]: FormControl<...>;
            //     }
            // }

            type FormCD = Form['c']['d']
            // type FormCD = {
            //     [T]: FormControl<{
            //         e: number[];
            //         f: {
            //             g: string;
            //         };
            //     }[]>;
            // }

            const form: Form[T] = fb.group<Form[G]>({
                a: fb.control(null),
                b: fb.control('test', { nonNullable: true }),
                c: fb.group<Form['c'][G]>({
                    d: fb.control([], {nonNullable: true})
                })
            })

            expect(form.value).toStrictEqual({
                a: null,
                b: 'test',
                c: { d: [] }
            })
        })

        it('`c.d` should be `FormArray`', () => {
            type Form = FormType<Model, { c: { d: FormElementArray } }>

            type FormC = Form['c']
            // type FormC = {
            //     [T]: FormGroup<...>;
            //     [G]: {
            //         d: FormArray<...>
            //     };
            //     d: {
            //         [T]: FromArray<...>
            //         [I]: FormControl<...>
            //          ^ This is FormArray item type
            //     }
            // }

            type FormCD = Form['c']['d']
            // type FormCD = {
            //     [T]: FormArray<FormControl<{
            //         e: number[];
            //         f: {
            //             g: string;
            //         };
            //     }>>;
            //     [I]: FormControl<{
            //         e: number[];
            //         f: {
            //             g: string;
            //         };
            //     }>;
            // }

            const form: Form[T] = fb.group<Form[G]>({
                a: fb.control(42),
                b: fb.control('test', { nonNullable: true }),
                c: fb.group<Form['c'][G]>({
                    d: fb.array<Form['c']['d'][I]>([
                        fb.control({
                            e: [42],
                            f: { g: 'test' }
                        }, { nonNullable: true })
                    ])
                })
            })

            expect(form.value).toStrictEqual({
                a: 42,
                b: 'test',
                c: { d: [ { e: [42], f: { g: 'test' } } ] }
            })
        })

        it('`c.d.e` should be `FormArray`', () => {
            type Form = FormType<Model, { c: { d: [ { e: FormElementArray } ] } }>

            type FormCDIE = Form['c']['d'][I]['e']
            // type FormCDIE = {
            //     [T]: FormArray<FormControl<number>>;
            //     [I]: FormControl<number>;
            // }

            type FormCDIG = Form['c']['d'][I][G]
            // type FormCDIG = {
            //     e: FormArray<FormControl<number>>;
            //     f: FormControl<{
            //         g: string;
            //     }>;
            // }

            const form: Form[T] = fb.group<Form[G]>({
                a: fb.control(42),
                b: fb.control('test', { nonNullable: true }),
                c: fb.group<Form['c'][G]>({
                    d: fb.array<Form['c']['d'][I][T]>([
                        fb.group<Form['c']['d'][I][G]>({
                            e: fb.array<Form['c']['d'][I]['e'][I]>([]),
                            f: fb.control({ g: 'test' }, { nonNullable: true })
                        })
                    ])
                })
            })

            expect(form.value).toStrictEqual({
                a: 42,
                b: 'test',
                c: { d: [ { e: [], f: { g: 'test' } } ] }
            })
        })

        it('`c.d.e` should be `FormArray` and `c.d.f` should be `FormGroup`', () => {
            type Form = FormType<Model, { c: { d: [ { e: FormElementArray, f: FormElementGroup } ] } }>

            type FormCDIF = Form['c']['d'][I]['f']
            // type FormCDIF = {
            //     [T]: FormGroup<...>;
            //     [G]: {
            //         g: FormControl<string>;
            //     };
            //     g: {
            //         [T]: FormControl<string>;
            //     };
            // }

            type FormCDIFG = Form['c']['d'][I]['f'][G]
            // type FormCDIFG = {
            //     g: FormControl<string>;
            // }

            const form: Form[T] = fb.group<Form[G]>({
                a: fb.control(42),
                b: fb.control('test', { nonNullable: true }),
                c: fb.group<Form['c'][G]>({
                    d: fb.array<Form['c']['d'][I][T]>([
                        fb.group<Form['c']['d'][I][G]>({
                            e: fb.array<Form['c']['d'][I]['e'][I]>([]),
                            f: fb.group<Form['c']['d'][I]['f'][G]>({ 
                                g: fb.control('test', { nonNullable: true }) 
                            })
                        })
                    ])
                })
            })

            expect(form.value).toStrictEqual({
                a: 42,
                b: 'test',
                c: { d: [ { e: [], f: { g: 'test' } } ] }
            })
        })
    })

    it('User form example', () => {
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
            birthday: number;
            contacts: IContactModel[];
        }

        const fb = new FormBuilder();

        type UserForm = FormType<IUserModel, { contacts: [ FormElementGroup ] }>;
        type ContactForm = UserForm['contacts'][I];

        const form: UserForm[T] = fb.group<UserForm[G]>({
            firstName: fb.nonNullable.control('test'),
            lastName: fb.nonNullable.control('test'),
            nickname: fb.nonNullable.control('test'),
            birthday: fb.nonNullable.control(13),
            contacts: fb.array<ContactForm[T]>([]),
        });

        const value: IUserModel = {
            firstName: 'Vladislav',
            lastName: 'Lebedev',
            nickname: 'iam.guid',
            birthday: +new Date('022-07-07T17:10:03.102Z'),
            contacts: [{
                type: ContactType.Email,
                contact: 'iam.guid@gmail.com'
            }],
        }

        form.controls.contacts.controls.push(fb.group<ContactForm[G]>({
            type: fb.nonNullable.control(ContactType.Email),
            contact: fb.nonNullable.control('test@test.com', Validators.email),
        }));

        form.patchValue(value);

        expect(form.valid).toBeTruthy()
        expect(form.value.contacts![0].contact).toBe('iam.guid@gmail.com');

        const testValue: IUserModel = form.value as IUserModel;
    })
})
