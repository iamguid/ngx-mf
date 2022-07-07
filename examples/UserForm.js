"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forms_1 = require("@angular/forms");
const form = new forms_1.FormGroup({
    firstName: new forms_1.FormControl(null),
    lastName: new forms_1.FormControl(null),
    nick: new forms_1.FormControl(null),
    email: new forms_1.FormControl(null, forms_1.Validators.email),
    birthday: new forms_1.FormControl(null),
    contacts: new forms_1.FormArray([]),
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
