export function throttle<T extends any[]>(fn: (...args: T) => void, delay: number): (...arg: T) => void {
    let timer: ReturnType<typeof setTimeout> | null = null;
    return function (this: any, ...args: T): void {
        if (!timer) {
            fn.apply(this, args);
            timer = setTimeout(() => {
                timer = null;
            }, delay);
        }
    };
}
