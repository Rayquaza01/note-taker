import { useEffect, useState } from "react";

/**
 * Hook that provides a value from webextension storage as a readonly state variable. Updates state whenever value changes in storage
 * @param key The key from storage to check
 * @param defaultValue The default value to fall back to if key is missing
 */
export function useStorageLocal<T>(key: string, defaultValue: T): [ T, boolean ] {
    const [val, setVal] = useState(defaultValue);
    // triggers when the value is actually loaded, to tell the difference between the real and default value
    const [isReady, setIsReady] = useState(false)

    useEffect(() => {
        browser.storage.local.get(key).then(res => {
            console.log("Got value: ", res);
            setVal(res[key] as T ?? defaultValue)
            setIsReady(true);
        });
    }, []);

    browser.storage.onChanged.addListener(changes => {
        if (key in changes) {
            setVal(changes[key].newValue as T);
        }
    });

    return [val, isReady];
}

export function putStorageLocal<T>(key: string, value: T): void {
    console.log("Putting ", key, "=", value);
    browser.storage.local.set({ [key]: value });
}
