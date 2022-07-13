import "@angular/compiler";

import { FormBuilder, Validators } from "@angular/forms"
import { FormModel } from ".."

describe('User form example', () => {
    it('should work', () => {
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
            birthday: number;
            contacts: IContactModel[];
        }

        const fb = new FormBuilder();

        type ContactForm = FormModel<IContactModel>;
        type UserForm = FormModel<Omit<IUserModel, 'id'>, { contacts: ['group'] }>;

        const form: UserForm = fb.group({
            firstName: [<string | null>null],
            lastName: [<string | null>null],
            nickname: [<string | null>null],
            birthday: [<number | null>null],
            contacts: fb.array<ContactForm>([]),
        });

        const value: Omit<IUserModel, 'id'> = {
            firstName: 'Vladislav',
            lastName: 'Lebedev',
            nickname: 'iam.guid',
            birthday: +new Date('022-07-07T17:10:03.102Z'),
            contacts: [{
                type: ContactType.Email,
                contact: 'iam.guid@gmail.com'
            }],
        }

        form.controls.contacts.controls.push(fb.group({
            type: [<ContactType | null>ContactType.Email],
            contact: [<string | null>null, Validators.email],
        }));

        form.patchValue(value);

        expect(form.valid).toBeTruthy()
        expect(form.value.contacts![0].contact).toBe('iam.guid@gmail.com');
    })
})
