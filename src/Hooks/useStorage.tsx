import { useEffect, useState } from "react";

/**
 * Hook that provides a value from webextension storage as a readonly state variable. Updates state whenever value changes in storage
 * @param key The key from storage to check
 * @param defaultValue The default value to fall back to if key is missing
 */
export function useStorageLocal<T>(key: string, defaultValue: T): T {
    const [val, setVal] = useState(defaultValue);

    useEffect(() => {
        browser.storage.local.get(key).then(res => setVal(res[key] as T ?? defaultValue));
    }, []);

    browser.storage.onChanged.addListener(changes => {
        if (key in changes) {
            setVal(changes[key].newValue as T);
        }
    });

    return val;
}

export function putStorageLocal<T>(key: string, value: T): void {
    browser.storage.local.set({ [key]: value });
}
