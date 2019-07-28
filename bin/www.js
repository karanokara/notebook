/**
 * Handle www requests
 */

/**
 * Module dependencies.
 */
var server = require( '../server' );
//var debug = require('debug')('notebook:server');
var port = normalizePort( process.env.PORT || '3000' );
var hostname = '0.0.0.0';

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort ( val ) {
  var port = parseInt( val, 10 );

  if ( isNaN( port ) ) {
    // named pipe
    return val;
  }

  if ( port >= 0 ) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError ( error ) {
  if ( error.syscall !== 'listen' ) {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch ( error.code ) {
    case 'EACCES':
      console.error( bind + ' requires elevated privileges' );
      process.exit( 1 );
      break;
    case 'EADDRINUSE':
      console.error( bind + ' is already in use' );
      process.exit( 1 );
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening () {
  console.log( `Server running at http://${hostname}:${port}/` );
}

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen( port, hostname, onListening );

/**
 * Add listener for error
 */
server.on( 'error', onError );
