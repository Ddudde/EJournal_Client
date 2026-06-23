let urlsToCache: string[], cachePromise: Promise<any>;

// Name our cache
const CACHE_NAME: string = 'my-pwa-cache-v1';
const cacheOFF: boolean = true;
const cacheWhitelist: string[] = [CACHE_NAME];
const prefSite: string = "/EJournal_Client";
const prefResource: string = "";

const modedSelf: ServiceWorkerGlobalScope = self as unknown as ServiceWorkerGlobalScope & typeof globalThis;

async function initServiceWorker(): Promise<void> {
    cachePromise = prepareCachePromise();
    modedSelf.addEventListener("activate", activateF);
    modedSelf.addEventListener('install', installF);
    modedSelf.addEventListener('fetch', fetchF);
    modedSelf.addEventListener('message', messageF);
    modedSelf.addEventListener('push', (event: PushEvent) => {
        console.log('Event: Push', event);
        let data: any = {};
        if (event.data) data = event.data.json();
        console.log('SW: Push received', data)
        if (data.notification && data.notification.title) {
            event.waitUntil(modedSelf.registration.showNotification(data.notification.title, data.notification));
        } else {
            console.log('SW: No notification payload,  not showing notification')
        }
    });
    modedSelf.addEventListener('notificationclick', event => {
        console.log('On notification click: ', event.notification.data);
        event.notification.close();
        event.waitUntil(
            modedSelf.clients.openWindow(prefSite + '/')
        );
    });
}

async function prepareCachePromise(): Promise<void> {
    const response: Response = await fetch(prefResource + "/asset-manifest.json");
    const assets = await response.json();
    urlsToCache = [
        prefSite + "/",
        prefResource + "/static/media/fav512.png",
        prefResource + "/static/media/fav32.png",
        prefResource + "/static/media/fav16.png",
        prefResource + "/manifest.json",
        prefResource + "/src/utils/initPWA.ts"
    ];
    Object.getOwnPropertyNames(assets.files).map((key, i, x, val = assets.files[key]) => {
        urlsToCache.push(val);
    });
}

function messageF(e): void {
    console.log(`The client sent me a message: ${e.data}`);

    // e.source.postMessage("Hi client");
}

function activateF(e: ExtendableEvent): void {
    try {
        e.waitUntil((async () => {
            if(modedSelf.registration.navigationPreload){
                const data = await modedSelf.registration.navigationPreload.getState();
                if(!data.enabled) {
                    await modedSelf.registration.navigationPreload.enable()
                }
            }
            const keyList: string[] = await caches.keys();
            return Promise.all(keyList.map(key => {
                if (!cacheWhitelist.includes(key)) {
                    console.log('Deleting cache: ' + key)
                    return caches.delete(key);
                }
            }));
        }) ());
    } catch (message) {
        console.log(message)
    }
}

async function installF(e: ExtendableEvent): Promise<void> {
    try {
        await modedSelf.skipWaiting();
        await cachePromise;
        e.waitUntil(caches.open(CACHE_NAME).then(cache => {
            console.log('cached...');
            urlsToCache.map(key => forCache(cache, key))
        }));
    } catch (message) {
        console.log(message)
    }
}

function setCache(url: string): Promise<any> {
    try {
        console.log('try cache res');
        return caches.open(CACHE_NAME)
            .then(cache => forCache(cache, url))
    } catch (message) {
        console.log(message)
    }
}

async function forCache(cache: Cache, url: string): Promise<any> {
    await cache.add(url);
    return fetch(url)
    .then(req => {
        console.log("fetch!");
        return req;
    });
}

function fetchF(e: FetchEvent): void {
    if(e.request.destination == '' || cacheOFF) return;

    e.waitUntil((async () => {
        const responseCache: Response = await caches.match(e.request);
        console.log(responseCache);
        if(responseCache) return responseCache;

        try {
            const responsePre: Promise<any> = await e.preloadResponse;
            return responsePre || setCache(e.request.url);
        } catch (message) {
            console.log(message);
            if (e.request.destination == 'document') {
                console.log("setIndexDoc...")
                return caches.match("/");
            }
        }
    }) ());
}

initServiceWorker();