type ElementType = 'a' | 'b' | 'c'

type PrepareAnnotations<T> = {
  [key in keyof T]?:
    T[key] extends Array<infer U>
      ? (
        | PrepareAnnotations<U>
        | ElementType
        | [PrepareAnnotations<U>]
        | [ElementType]
      )
      : T[key] extends Record<string, any>
        ? (
          | PrepareAnnotations<T[key]> 
          | ElementType
          | [PrepareAnnotations<T[key]>]
          | [ElementType]
        )
      : ElementType
};

type PrepareModel<T> = {
    [key in keyof T]-?:
        NonNullable<T[key]> extends (infer U)[]
            ? PrepareModel<U>[]
            : T[key] extends Record<string, any>
            ? PrepareModel<T[key]>
            : T[key];
}


type MagicType<
    TPreparedModel extends Record<string, any>,
    TPreparedAnnotations extends PrepareAnnotations<TPreparedModel> | null,
> = {
    [key in keyof TPreparedModel]-?:
        // @ts-ignore
        TPreparedAnnotations[key] extends 'a' 
        ? 'aaa'
        // @ts-ignore
        : TPreparedAnnotations[key] extends 'b'
        ? 'bbb'
        // @ts-ignore
        : TPreparedAnnotations[key] extends 'c'
        ? 'ccc'
        // @ts-ignore
        : TPreparedAnnotations[key] extends Record<string, any>
        ? MagicType<TPreparedModel[key], TPreparedAnnotations[key]>
        // @ts-ignore
        : TPreparedAnnotations[key] extends unknown
        ? MagicType<TPreparedModel[key], null>
        // @ts-ignore
        : TPreparedAnnotations[key] extends null 
        ? 'TPreparedAnnotations is null'
        : TPreparedModel[key]
}

interface Model {
    a: {
        b: number;
        c: {
          d: number
        }
    }
    c: number
}

type T1 = PrepareModel<Model>;

type T3 = MagicType<T1, { a: { b: 'b', c: 'c' } }>

type T4 = T3['a']['b']
type T5 = T3['a']['c']
type T6 = T3['c']