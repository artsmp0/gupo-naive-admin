/* eslint-disable @typescript-eslint/no-explicit-any  */
declare type Recordable<T = any> = Record<string, T>;

declare type Nullable<T> = undefined | T;

declare type Prettify<T> = { [P in keyof T]: T[P] } & {};

declare type Key = string | number;

declare type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
};

declare type ObjectValues<T extends object> = T[keyof T];
declare type ObjectKeys<T extends object> = keyof T;
