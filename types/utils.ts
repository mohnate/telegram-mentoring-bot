export type UtilsFunction<P, R> = (options: P) => R;

export type AsyncUtilsFunction<P, R> = (options: P) => Promise<R>;
