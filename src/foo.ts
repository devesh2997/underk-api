export function bar() {
    if (true) {
        return true;
    } else {
        return false;
    }
}

export async function barAsync() {
    return new Promise((resolve, _) => {
        setTimeout(() => {
            if (true) {
                resolve(true);
            } else {
                resolve(false);
            }
        }, 1000);
    });
}