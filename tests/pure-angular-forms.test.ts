import "@angular/compiler";

import { FormBuilder } from "@angular/forms";

describe('Example how to work with pure angular forms', () => {
    it('example 1', () => {
        type ModelE = number[];

        interface ModelD {
            e: ModelE;
        }

        interface ModelF {
            g: string;
        }

        interface ModelC {
            d: ModelD;
            f: ModelF;
        }

        type ModelB = string[]

        interface MainModel {
            a: number;
            b: ModelB;
            c: ModelC;
        }

        const fb = new FormBuilder();

        const formE = fb.array<ModelE>([[42]])

        const formD = fb.group<ModelD>({
            // Oops doesn't work :(
            // @ts-ignore
            e: formE
        })

        const formB = fb.array<ModelB>([['test']])

        const formF = fb.group<ModelF>({
            // Oops it work incorrect
            // @ts-ignore
            g: fb.control('test')
        })

        const formC = fb.group<ModelC>({
            // Oops doesn't work :(
            // @ts-ignore
            d: formD,

            // Oops doesn't work :(
            // @ts-ignore
            f: formF,
        })

        const mainForm = fb.group<MainModel>({
            a: 42,

            // Oops doesn't work :(
            // @ts-ignore
            b: formB,

            // Oops doesn't work :(
            // @ts-ignore
            c: formC
        })

        // Oo it's wrong type !
        expect(mainForm.value.b).not.toBe('test')

        expect(mainForm.value.c?.d.e[0]).toBe(42)

        // Oo it's wrong type !
        expect(mainForm.controls.b.value).not.toBe('test');
    })
})