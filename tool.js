var fs = require( 'fs' );
var mustache = require( 'mustache' );

var tools = {
    // root of path this this file folder ../notebook
    readFile: function ( path ) {
        var buffer = fs.readFileSync( path );

        return buffer.toString();
    },
    render: function ( viewTemplate, view ) {
        var path = 'views/' + viewTemplate + '.html'
        return mustache.render( this.readFile( path ), view );
    }

};



module.exports = tools;