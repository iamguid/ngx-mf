import "@angular/compiler";

import { FormBuilder } from "@angular/forms";
import { FormModel } from "..";

describe('Misc tests', () => {
    it('objects inside FormControl', () => {
        interface Model {
            a: Date;
        }

        const fb = new FormBuilder();

        const form: FormModel<Model> = fb.group({
            a: [new Date('2022-07-08T06:46:28.452Z')]
        })

        expect(form.value.a?.toISOString()).toBe(new Date('2022-07-08T06:46:28.452Z').toISOString());
        expect(form.controls.a.value?.toISOString()).toBe(new Date('2022-07-08T06:46:28.452Z').toISOString());
    })

    it('FormModel after Omit', () => {
        interface Model {
            a: number;
            b: number;
        }

        const fb = new FormBuilder();

        const form: FormModel<Omit<Model, 'a'>> = fb.group({
            b: [42]
        })

        expect(form.value.b).toBe(42);
        expect(form.controls.b.value).toBe(42);
    })

    it('complex form', () => {
        interface Model {
            a: number;
            b: number[];
            c: {
                d: {
                    e: number;
                }
                f: {
                    g: string;
                }
                h: {
                    i: Date;
                }
            }
        }

        const fb = new FormBuilder();

        const form: FormModel<Model, {
            b: 'array',
            c: {
                d: 'group',
                f: 'group',
            },
        }> = fb.group({
            a: [42],
            b: fb.array([[1], [2], [3]]),
            c: fb.group({
                d: fb.group({
                    e: [43],
                }),
                f: fb.group({
                    g: ['test']
                }),
                h: [{ 
                    i: new Date('2022-07-08T13:21:05.951Z')
                }],
            })
        })

        expect(form.value.a).toBe(42);
        expect(form.value.b![0]).toBe(1);
        expect(form.value.b![1]).toBe(2);
        expect(form.value.b![2]).toBe(3);
        expect(form.value.c?.d?.e).toBe(43);
        expect(form.value.c?.f?.g).toBe('test');
        expect(form.value.c?.h).toStrictEqual({ i: new Date('2022-07-08T13:21:05.951Z') });

        expect(form.controls.a.value).toBe(42);
        expect(form.controls.b?.controls![0].value).toBe(1);
        expect(form.controls.b?.controls![1].value).toBe(2);
        expect(form.controls.b?.controls![2].value).toBe(3);
        expect(form.controls.c.controls.d.controls.e.value).toBe(43);
        expect(form.controls.c.controls.f.controls.g.value).toBe('test');
        expect(form.controls.c.controls.h.value).toStrictEqual({ i: new Date('2022-07-08T13:21:05.951Z') });
    })
})
