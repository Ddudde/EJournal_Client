var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var urlsToCache, cachePromise;
// Name our cache
var CACHE_NAME = 'my-pwa-cache-v1';
var cacheOFF = true;
var cacheWhitelist = [CACHE_NAME];
var prefSite = "/EJournal_Client";
var prefResource = "";
var modedSelf = self;
function initServiceWorker() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            cachePromise = prepareCachePromise();
            modedSelf.addEventListener("activate", activateF);
            modedSelf.addEventListener('install', installF);
            modedSelf.addEventListener('fetch', fetchF);
            modedSelf.addEventListener('message', messageF);
            modedSelf.addEventListener('push', function (event) {
                console.log('Event: Push', event);
                var data = {};
                if (event.data)
                    data = event.data.json();
                console.log('SW: Push received', data);
                if (data.notification && data.notification.title) {
                    event.waitUntil(modedSelf.registration.showNotification(data.notification.title, data.notification));
                }
                else {
                    console.log('SW: No notification payload,  not showing notification');
                }
            });
            modedSelf.addEventListener('notificationclick', function (event) {
                console.log('On notification click: ', event.notification.data);
                event.notification.close();
                event.waitUntil(modedSelf.clients.openWindow(prefSite + '/'));
            });
            return [2 /*return*/];
        });
    });
}
function prepareCachePromise() {
    return __awaiter(this, void 0, void 0, function () {
        var response, assets;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch(prefResource + "/asset-manifest.json")];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    assets = _a.sent();
                    urlsToCache = [
                        prefSite + "/",
                        prefResource + "/static/media/fav512.png",
                        prefResource + "/static/media/fav32.png",
                        prefResource + "/static/media/fav16.png",
                        prefResource + "/manifest.json",
                        prefResource + "/src/utils/initPWA.ts"
                    ];
                    Object.getOwnPropertyNames(assets.files).map(function (key, i, x, val) {
                        if (val === void 0) { val = assets.files[key]; }
                        urlsToCache.push(val);
                    });
                    return [2 /*return*/];
            }
        });
    });
}
function messageF(e) {
    console.log("The client sent me a message: ".concat(e.data));
    // e.source.postMessage("Hi client");
}
function activateF(e) {
    var _this = this;
    try {
        e.waitUntil((function () { return __awaiter(_this, void 0, void 0, function () {
            var data, keyList;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!modedSelf.registration.navigationPreload) return [3 /*break*/, 3];
                        return [4 /*yield*/, modedSelf.registration.navigationPreload.getState()];
                    case 1:
                        data = _a.sent();
                        if (!!data.enabled) return [3 /*break*/, 3];
                        return [4 /*yield*/, modedSelf.registration.navigationPreload.enable()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [4 /*yield*/, caches.keys()];
                    case 4:
                        keyList = _a.sent();
                        return [2 /*return*/, Promise.all(keyList.map(function (key) {
                                if (!cacheWhitelist.includes(key)) {
                                    console.log('Deleting cache: ' + key);
                                    return caches.delete(key);
                                }
                            }))];
                }
            });
        }); })());
    }
    catch (message) {
        console.log(message);
    }
}
function installF(e) {
    return __awaiter(this, void 0, void 0, function () {
        var message_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, modedSelf.skipWaiting()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, cachePromise];
                case 2:
                    _a.sent();
                    e.waitUntil(caches.open(CACHE_NAME).then(function (cache) {
                        console.log('cached...');
                        urlsToCache.map(function (key) { return forCache(cache, key); });
                    }));
                    return [3 /*break*/, 4];
                case 3:
                    message_1 = _a.sent();
                    console.log(message_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function setCache(url) {
    try {
        console.log('try cache res');
        return caches.open(CACHE_NAME)
            .then(function (cache) { return forCache(cache, url); });
    }
    catch (message) {
        console.log(message);
    }
}
function forCache(cache, url) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, cache.add(url)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, fetch(url)
                            .then(function (req) {
                            console.log("fetch!");
                            return req;
                        })];
            }
        });
    });
}
function fetchF(e) {
    var _this = this;
    if (e.request.destination == '' || cacheOFF)
        return;
    e.waitUntil((function () { return __awaiter(_this, void 0, void 0, function () {
        var responseCache, responsePre, message_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, caches.match(e.request)];
                case 1:
                    responseCache = _a.sent();
                    console.log(responseCache);
                    if (responseCache)
                        return [2 /*return*/, responseCache];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, e.preloadResponse];
                case 3:
                    responsePre = _a.sent();
                    return [2 /*return*/, responsePre || setCache(e.request.url)];
                case 4:
                    message_2 = _a.sent();
                    console.log(message_2);
                    if (e.request.destination == 'document') {
                        console.log("setIndexDoc...");
                        return [2 /*return*/, caches.match("/")];
                    }
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); })());
}
initServiceWorker();
