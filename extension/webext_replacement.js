// ?protocol=https&url=node-red-r01.duckdns.org&get=note-taker%2fgetStorage&set=note-taker%2fupdateStorage
let bslg = undefined;
let i18nData = undefined;

function parseQuery() {
    let obj = {};
    let pairs = location.search.substring(1).split("&");
    for (let pair of pairs) {
        let kv = pair.split("=");
        obj[kv[0]] = kv[1];
    }
    return obj;
}

const browser = {
    extension: {
        getViews: ctx => (ctx.type === "tab" ? [window] : []),
        getURL: path => path
    },
    i18n: {
        getMessage: async string => {
            if (i18nData === undefined) {
                let i18n = await fetch(
                    "https://raw.githubusercontent.com/Rayquaza01/note-taker/master/extension/_locales/en-US/messages.json"
                );
                i18nData = await i18n.json();
            }
            if (i18nData.hasOwnProperty(string)) {
                return i18nData[string].message;
            } else {
                return string;
            }
        }
    },
    storage: {
        sync: {
            get: async () => {
                let params = parseQuery();
                let req = await fetch(
                    params.protocol +
                        "://" +
                        params.url +
                        "/" +
                        decodeURIComponent(params.get),
                    {
                        mode: "no-cors"
                    }
                );
                let body = req.text();
                console.log(body);
                // let json = await req.json();
                // bslg = json;
                bslg = body;
                return body;
            },
            set: async replacement => {
                await browser.storage.local.set(replacement);
                let params = parseQuery();
                let req = await fetch(
                    params.protocol +
                        "://" +
                        params.url +
                        "/" +
                        decodeURIComponent(params.set),
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(bslg),
                        mode: "no-cors"
                    }
                );
                return await req.json();
            }
        },
        local: {
            get: async () => {
                if (bslg === undefined) {
                    bslg = await browser.storage.sync.get();
                }
                return bslg;
            },
            set: async replacement => {
                Object.keys(replacement).forEach(key => (bslg[key] = replacement[key]));
                listUpdate();
            }
        },
        onChanged: {
            addListener: arg => arg
        }
    },
    tabs: {
        query: async () => {
            return [{ id: 0, incognito: false, url: "general_notes" }];
        },
        create: async object => {
            open(object.url);
            return { id: 0 };
        },
        onActivated: {
            addListener: arg => arg
        },
        onUpdated: {
            addListener: arg => arg
        }
    }
};

document.addEventListener("DOMContentLoaded", async () => {});
