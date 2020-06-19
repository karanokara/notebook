

// Step#1. registering a service worker in navigator obj in browser
if ( 'serviceWorker' in navigator ) {
    navigator.serviceWorker.register( '/sw.js' )
        .then( ( reg ) => {
            // reg is the registration of service worker
            console.log( 'service worker registered' );
            console.log( reg );
        } )
        .catch( err => console.log( 'service worker not registered', err ) );
}