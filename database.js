var tool = require( './tool' );


var database = {
    data: null,
};

/**
 * write data to data file
 */
database.write = function ( key, value ) {

};

/**
 * get user data by username
 */
database.get = function ( username ) {
    var re = null,
        found = 0;
    for ( var i = 0; i < this.size && !found; ++i ) {
        var obj = this.data[i];
        if ( obj['username'] === username ) {
            re = obj;
            found = 1;
        }
    }

    return re;
};

/**
 * wipe data by key
 */
database.wipe = function ( key ) {

};

/**
 * init the database by fetching a JSON file
 */
database.init = function ( path ) {
    this.data = tool.fetchNoteData( 'user' );
    this.size = this.data.length;
};

database.init();

module.exports = database;