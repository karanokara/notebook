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
database.userLogin = function ( username, givenPassword, isUsingPassword ) {
    var obj = this.get( username );

    if ( isUsingPassword == undefined )
        isUsingPassword = 1;

    if ( obj ) {
        if ( !isUsingPassword || obj['password'] === givenPassword ) {
            var last = obj['currentLogin'];

            obj['lastLogin'] = last;
            obj['lastLoginString'] = moment( last ).format( 'YYYY/MM/DD - HH:mm' );
            obj['currentLogin'] = moment().valueOf();
            this.update();

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
database.addUser = function ( username, password, name ) {
    var user = {
        "username": username,
        "password": password,
        "name": name,
        "lastLogin": null,
        "currentLogin": moment().valueOf(),
        "lastLoginString": false,
        "list": [],
        "settings": {
            "noteOrderName": "Name",
            "noteOrderDirection": "down",
            "noteDisplay": "list"
        }
    };

    this.data.push( user );
    this.update();
    return user;
};

/**
 * delete a note by username, noteId
 */
database.deleteNote = function ( username, noteId ) {
    var list = this.get( username ).list;

    for ( var i = 0; i < list.length; ++i ) {
        if ( Number( noteId ) == list[i]["noteId"] ) {
            list.splice( i, 1 );
            this.update();
            return {
                status: 1
            };
        }
    }

    return {
        status: 0,
        msg: 'Note id:' + noteId + ' is not found.'
    };
};

/**
 * edit note by username, noteId
 */
database.editNote = function ( username, noteId, notetitle, noteContent ) {
    var list = this.get( username ).list,
        note = null,
        found = 0;

    for ( var i = 0; i < list.length && !found; ++i ) {
        note = list[i];

        if ( note['noteId'] == Number( noteId ) ) {
            found = 1;
        }
    }

    if ( !found )
        return {
            status: 0,
            msg: 'Note ' + notetitle + ' is not found.'
        };

    note['title'] = notetitle;
    note['note'] = noteContent;
    var date = moment().format( 'YYYY/MM/DD - HH:mm' );
    note['lastUpdate'] = date;

    this.update();
    return {
        status: 1,
        date: date,
    };
};

/**
 * delete note by username, noteTitle
 */
database.addNote = function ( username, noteTitle, noteContent ) {
    var obj = this.get( username ),
        noteId = Number( obj.noteCount ) + 1,
        create = moment().format( 'YYYY/MM/DD - HH:mm' ),
        note = {
            "title": noteTitle,
            "noteId": noteId,
            "type": "file",
            "lastUpdate": null,
            "create": create,
            "note": noteContent,
        };

    obj.noteCount = noteId;
    obj['list'].push( note );
    this.update();

    return {
        status: 1,
        id: noteId,
        date: create
    };
};

/**
 * change the user display name
 */
database.changeDisplayName = function ( username, name ) {
    var data = this.get( username );

    if ( !data )
        return {
            status: 0,
            msg: 'User is not found.'
        };

    data.name = name;
    this.update();
    return {
        status: 1
    };
};

/**
 * change the user password
 */
database.changePassword = function ( username, password ) {
    var data = this.get( username );

    if ( !data )
        return {
            status: 0,
            msg: 'User is not found.'
        };

    data.password = password;
    this.update();
    return {
        status: 1
    };
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