// /**
//  * A service worker file handling what event from the browser to listen 
//  * 
//  * This file acts as a proxy between the app and the server
//  * 
//  * Online:
//  * 
//  *        request               request
//  *     .--------------> sw.js -----------------> server
//  * app <-------------- sw.js <----------------/
//  *        respone               respone
//  * 
//  * 
//  * Offline: as a cache server
//  * 
//  *        request            
//  *     .--------------> sw.js
//  * app <-------------/ 
//  *        respone            
//  *
//  * 
//  */

// const staticCacheName = 'site-static-v4';
// const dynamicCacheName = 'site-dynamic-v4';

// // assets are the url to the resource/obj
// // checkout the Application -> Cache Storage
// const assets = [
//     '/',
//     '/index.html',
//     '/js/app.js',
//     '/js/ui.js',
//     '/js/materialize.min.js',
//     '/css/styles.css',
//     '/css/materialize.min.css',
//     '/img/dish.png',
//     'https://fonts.googleapis.com/icon?family=Material+Icons',
//     'https://fonts.gstatic.com/s/materialicons/v47/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
//     '/pages/fallback.html'
// ];

// // cache size limit function
// const limitCacheSize = ( name, size ) => {
//     caches.open( name ).then( cache => {
//         cache.keys().then( keys => {
//             if ( keys.length > size ) {

//                 // delete the oldest cache
//                 cache.delete( keys[0] ).then( () => {
//                     limitCacheSize( name, size );
//                 } );
//             }
//         } );
//     } );
// };

// // install event emits when the browser install the service worker
// self.addEventListener( 'install', evt => {
//     console.log( 'service worker installed' );
//     // since browser may stop the SW after installing SW completely
//     // so wait unitil pre-caching is finished
//     evt.waitUntil(
//         // open a cache of exist
//         // or create and open a cache
//         caches.open( staticCacheName ).then( ( cache ) => {
//             console.log( 'pre-caching the shell assets' );

//             // "cache" is the cache that we open
//             // got out to the server and put resource (url to the resource) to the opened-cache
//             // need to be Online
//             cache.addAll( assets );
//         } )
//     );
// } );

// // activate event emits when the current service worker is activated
// self.addEventListener( 'activate', evt => {
//     console.log( 'service worker activated', evt );

//     // when a new service worker is active, delete all old cache for updated cache
//     evt.waitUntil(

//         // find the cache's name (cache that we have opened)
//         caches.keys().then( keys => {
//             console.log( keys );

//             // wait unitl all promise (all cache deleting) is solved
//             return Promise.all( keys
//                 // filter those cache's name that not is the current static cache or dynamic cache
//                 .filter( key => key !== staticCacheName && key !== dynamicCacheName )
//                 // iterate each cache's name, return an array of promise
//                 .map( key => caches.delete( key ) )
//             );
//         } )
//     );
// } );

// // fetch events emits when the app need to fetch resource/file from server
// // such as xx.js, xx.css, xx.png, ...
// self.addEventListener( 'fetch', evt => {
//     console.log( 'fetch event occur', evt );

//     // only caching on URL object rather than DB data
//     if ( evt.request.url.indexOf( 'firestore.googleapis.com' ) === -1 ) {
//         // make a respond to this fetch request with xxx resource
//         evt.respondWith(
//             caches.match( evt.request ).then( cacheRes => {
//                 // if there is existing cache (from all different cache's name) match the request, 
//                 // then cacheRes is from the cache
//                 // otherwise, cacheRes is empty
//                 // then make request to the server
//                 return cacheRes || fetch( evt.request ).then( fetchRes => {

//                     // put the fetched resource into another Cache, say "dynamic"
//                     return caches.open( dynamicCacheName ).then( cache => {

//                         // put the fetched resource (already fetched)
//                         // fetched resource can't be used twice, need another copy
//                         //        the resource URL  a copy of resource
//                         cache.put( evt.request.url, fetchRes.clone() );
//                         // check cached items size
//                         limitCacheSize( dynamicCacheName, 15 );

//                         // return original resource to show to user
//                         return fetchRes;
//                     } );
//                 } );
//             } ).catch( () => {
//                 // only replace the xx.html page with the fallback page.html
//                 if ( evt.request.url.indexOf( '.html' ) > -1 ) {
//                     return caches.match( '/pages/fallback.html' );
//                 }
//             } )
//         );
//     }
// } );