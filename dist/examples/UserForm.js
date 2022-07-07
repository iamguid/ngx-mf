import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
const form = new FormGroup({
    firstName: new FormControl(null),
    lastName: new FormControl(null),
    nick: new FormControl(null),
    email: new FormControl(null, Validators.email),
    birthday: new FormControl(null),
    contacts: new FormArray([]),
});
const patch = {
    firstName: 'Vladislav',
    lastName: 'Lebedev',
    nick: 'iam.guid',
    email: 'iam.guid@gmail.com',
    birthday: new Date('022-07-07T17:10:03.102Z'),
    contacts: ['123456789'],
};
form.patchValue(patch);
console.log('Form is valid', form.valid);
console.log('My nickname', form.value.nick);
form.controls;
