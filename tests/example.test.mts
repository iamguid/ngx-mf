import "@angular/compiler"

import { FormBuilder, Validators } from "@angular/forms"
import { FormElementGroup, FormType, G, I, T } from "../src/index.mjs"

describe('Examples', () => {
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
