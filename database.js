var tool = require( './tool' );
var moment = require( 'moment' );


var database = {
    data: null,
};

/**
 * check user login
 * if success, return user data
 * else, return message
 */
database.userLogin = function ( username, givenPassword ) {
    var obj = this.get( username );

    if ( obj ) {
        if ( obj['password'] === givenPassword ) {
            return {
                status: 1,
                data: obj
            };
        }

        return {
            status: 0,
            msg: 'Password is not matched.',
        };
    }

    return {
        status: 0,
        msg: 'User is not exist.',
    };
};

/**
 * get user data by username
 */
database.get = function ( username ) {

    for ( var i = 0; i < this.size; ++i ) {
        var obj = this.data[i];
        if ( obj['username'] === username ) {
            return obj;
        }
    }

    return null;
};

/**
 * Add a new user
 */
database.addUser = function () {

    this.update();
};

/**
 * delete a note by username, noteId
 */
database.deleteNote = function ( username, noteId ) {
    var list = this.get( username ).list;

    for ( var i = 0; i < list.length; ++i ) {
        if ( noteId == list[i]["noteId"] ) {
            list.splice( i, 1 );
            this.update();
            return 1;
        }
    }

    return 0;
};

/**
 * edit note by username, noteId
 */
database.editNote = function ( username, noteId ) {

};

/**
 * delete note by username, noteTitle
 */
database.addNote = function ( username, noteTitle, noteContent ) {
    var obj = this.get( username ),
        noteId = obj.list.length + 1,
        note = {
            "title": noteTitle,
            "noteId": noteId,
            "type": "file",
            "lastUpdate": null,
            "create": moment().valueOf(),
            "note": noteContent,
        };

    obj['list'].push( note );
    this.update();

    return 1;
};

/**
 * write data to data file
 */
database.update = function () {
    tool.wirteNoteData( 'user', this.data );
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