var fs = require( 'fs' );

var tools = {
    // root of path this this file folder ../notebook
    readFile: function ( path ) {
        var buffer = fs.readFileSync( path );

        return buffer.toString();
    },


};



module.exports = tools;