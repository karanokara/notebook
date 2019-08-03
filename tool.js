var fs = require( 'fs' );
var mustache = require( 'mustache' );

var tools = {
    /**
     * synchronously reading file
     * root of path this file folder is ../notebook
     */
    readFile: function ( path ) {
        var buffer = fs.readFileSync( path );

        return buffer.toString();
    },
    /**
     * render with template
     * @param {*} viewTemplate A HTML file (name) in /view
     * @param {*} view An obj
     * @returns A HTML string after templating
     */
    render: function ( viewTemplate, view ) {
        var path = 'views/' + viewTemplate + '.html'
        return mustache.render( this.readFile( path ), view );
    },
    /**
     * parse JSON file to a JS object
     * @param {*} fileName A JSON file in /data 
     * @returns An object
     */
    fetchNoteData: function ( fileName ) {
        var dataStr = this.readFile( 'data/' + fileName + '.json' );
        return JSON.parse( dataStr );
    },
    writeData: function ( fileName ) {

    },
};



module.exports = tools;