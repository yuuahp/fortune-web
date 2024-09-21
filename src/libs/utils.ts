export function transform<T, R>(value: T, callback: (value: T) => R): R {
    return callback(value);
}

export function returnIf<T>(condition: boolean, doTrue: () => T, doFalse: () => T): T {
    return condition ? doTrue() : doFalse();
}

export function lastOf<T>(arr: T[], back: number = 0): T | undefined {
    return arr.length > 0 ? arr[arr.length - 1 - back] : undefined;
}