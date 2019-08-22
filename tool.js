var fs = require( 'fs' );
var mustache = require( 'mustache' );

var tools = {
    /**
     * synchronously reading file
     * root of path this file folder is ../notebook
     */
    readFile: function ( path ) {
        // read file synchronously
        // must stop here to be done 
        var buffer = fs.readFileSync( path );
        //console.log( buffer );
        return buffer.toString();
    },
    /**
     * synchronously write file
     * @param {*} fileName 
     * @param {*} data 
     */
    writeFile: function ( fileName, data ) {
        fs.writeFileSync( fileName, data )
    },
    /**
     * render with template
     * @param {*} viewTemplate A HTML file (name) in /view
     * @param {*} view An obj
     * @returns A HTML string after templating
     */
    render: function ( viewTemplate, view ) {
        var path = './views/' + viewTemplate + '.html'
        return mustache.render( this.readFile( path ), view );
    },
    /**
     * parse JSON file to a JS object
     * @param {*} fileName A JSON file in /data 
     * @returns An object
     */
    fetchNoteData: function ( fileName ) {
        var dataStr = this.readFile( './data/' + fileName + '.json' );
        return JSON.parse( dataStr );
    },
    wirteNoteData: function ( fileName, data ) {
        var dataStr = JSON.stringify( data );
        this.writeFile( './data/' + fileName + '.json', dataStr );
    },
    /**
     * authenticate user first
    */
    authenticateHere: function ( req, res, next ) {
        if ( req.isAuthenticated() )
            next();
        else
            res.redirect( '/login' );

    },
};



module.exports = tools;