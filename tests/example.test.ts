import "@angular/compiler";

import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms"
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
            birthday: Date;
            contacts: IContactModel[];
        }

        type UserForm = FormModel<Omit<IUserModel, 'id'>, { contacts: ['group'] }>

        const form: UserForm = new FormGroup({
            firstName: new FormControl<string | null>(null),
            lastName: new FormControl<string | null>(null),
            nickname: new FormControl<string | null>(null),
            birthday: new FormControl<Date | null>(null),
            contacts: new FormArray<FormModel<IContactModel>>([]),
        });

        const value: Omit<IUserModel, 'id'> = {
            firstName: 'Vladislav',
            lastName: 'Lebedev',
            nickname: 'iam.guid',
            birthday: new Date('022-07-07T17:10:03.102Z'),
            contacts: [{
                type: ContactType.Email,
                contact: 'iam.guid@gmail.com'
            }],
        }

        form.controls.contacts.controls.push(new FormGroup({
            type: new FormControl<ContactType | null>(ContactType.Email),
            contact: new FormControl<string | null>(null, Validators.email),
        }));

        form.patchValue(value);

        expect(form.valid).toBeTruthy()
        expect(form.value.contacts![0].contact).toBe('iam.guid@gmail.com');
    })
})
