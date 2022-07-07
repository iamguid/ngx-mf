import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms"
import { FormControlsOf } from ".."

interface IUserModel {
    id: number;
    firstName: string;
    lastName: string;
    nick: string;
    email: string;
    birthday: Date;
    contacts: string[];
}

type UserForm = FormGroup<FormControlsOf<Omit<IUserModel, 'id'>, { contacts: 'array' }>>

const form: UserForm = new FormGroup({
    firstName: new FormControl<string | null>(null),
    lastName: new FormControl<string | null>(null),
    nick: new FormControl<string | null>(null),
    email: new FormControl<string | null>(null, Validators.email),
    birthday: new FormControl<Date | null>(null),
    contacts: new FormArray<FormControl<string | null>>([]),
});

const patch: Partial<IUserModel> = {
    firstName: 'Vladislav',
    lastName: 'Lebedev',
    nick: 'iam.guid',
    email: 'iam.guid@gmail.com',
    birthday: new Date('022-07-07T17:10:03.102Z'),
    contacts: ['123456789'],
}

form.patchValue(patch);

console.log('Form is valid', form.valid);
console.log('My nickname', form.value.nick);
