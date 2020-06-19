/**
 * A service worker file handling what event from the browser to listen 
 * 
 * This file acts as a proxy between the app and the server
 * 
 * Online:
 * 
 *        request               request
 *     .--------------> sw.js -----------------> server
 * app <-------------- sw.js <----------------/
 *        respone               respone
 * 
 * 
 * Offline: as a cache server
 * 
 *        request            
 *     .--------------> sw.js
 * app <-------------/ 
 *        respone            
 *
 * 
 */

const staticCacheName = 'site-static-v4';
const dynamicCacheName = 'site-dynamic-v4';
const assets = [
    '/',
    '/index.html',
    '/js/app.js',
    '/js/ui.js',
    '/js/materialize.min.js',
    '/css/styles.css',
    '/css/materialize.min.css',
    '/img/dish.png',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://fonts.gstatic.com/s/materialicons/v47/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
    '/pages/fallback.html'
];

// cache size limit function
const limitCacheSize = ( name, size ) => {
    caches.open( name ).then( cache => {
        cache.keys().then( keys => {
            if ( keys.length > size ) {
                cache.delete( keys[0] ).then( limitCacheSize( name, size ) );
            }
        } );
    } );
};

// install event emits when the browser install the service worker
self.addEventListener( 'install', evt => {
    console.log( 'service worker installed' );
    evt.waitUntil(
        caches.open( staticCacheName ).then( ( cache ) => {
            console.log( 'caching shell assets' );
            cache.addAll( assets );
        } )
    );
} );

// activate event emits when the current service worker is activated
self.addEventListener( 'activate', evt => {
    console.log( 'service worker activated', evt );
    evt.waitUntil(
        caches.keys().then( keys => {
            //console.log(keys);
            return Promise.all( keys
                .filter( key => key !== staticCacheName && key !== dynamicCacheName )
                .map( key => caches.delete( key ) )
            );
        } )
    );
} );

// fetch events emits when the app need to fetch file from server
// such as xx.js, xx.css, xx.png, ...
self.addEventListener( 'fetch', evt => {
    console.log( 'fetch event occur', evt );

    if ( evt.request.url.indexOf( 'firestore.googleapis.com' ) === -1 ) {
        evt.respondWith(
            caches.match( evt.request ).then( cacheRes => {
                return cacheRes || fetch( evt.request ).then( fetchRes => {
                    return caches.open( dynamicCacheName ).then( cache => {
                        cache.put( evt.request.url, fetchRes.clone() );
                        // check cached items size
                        limitCacheSize( dynamicCacheName, 15 );
                        return fetchRes;
                    } )
                } );
            } ).catch( () => {
                if ( evt.request.url.indexOf( '.html' ) > -1 ) {
                    return caches.match( '/pages/fallback.html' );
                }
            } )
        );
    }
} );