var tool = require( './tool' );
var privateData = require( './private' );
var moment = require( 'moment' );
var MongoClient = require( 'mongodb' ).MongoClient;
var ObjectId = require( 'mongodb' ).ObjectId;
var assert = require( 'assert' );

var database = {
    // DB client
    client: new MongoClient( privateData.mongodbURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    } ),
    // the note table
    noteTable: null,

    /**
     * check user login
     * if success, return user data
     * else, return message
     */
    userLogin: function ( userId, username, givenPassword, isUsingPassword, callback ) {
        var _this = this,
            filter = ( userId ) ? { _id: new ObjectId( userId ) } : { username: username };

        // find one document/row from note data table
        // obj is the found user data obj
        _this.read( filter, function ( obj ) {

            if ( obj ) {
                if ( !isUsingPassword || obj['password'] === givenPassword ) {
                    // update last login to now
                    _this.update( { _id: obj['_id'] },
                        {
                            $set: { lastLogin: moment().valueOf() }
                        }
                    );

                    // update login string to be displayed 
                    obj['lastLoginString'] = moment( obj['lastLogin'] ).format( 'YYYY/MM/DD - HH:mm' );

                    return callback( {
                        status: 1,
                        data: obj
                    } );
                }

                return callback( {
                    status: 0,
                    msg: 'Password is not matched.',
                } );
            }

            return callback( {
                status: 0,
                msg: 'User is not exist.',
            } );
        } );
    },

    /**
    * create a user data
    */
    create: function ( doc, callback ) {
        // Insert a single document
        this.noteTable.insertOne( doc, function ( err, r ) {
            assert.equal( null, err );
            assert.equal( 1, r.insertedCount );

            // pass by inserted OjectId
            callback( r.insertedId );
        } );
    },

    /**
     * read user data by filter
     */
    read: function ( filter, callback ) {
        this.noteTable.findOne( filter, function ( err, obj ) {
            assert.equal( err, null );
            callback( obj );
        } );
    },

    /**
     * update user data for 1 colleciton by filter
     */
    update: function ( filter, update, callback ) {
        // Update a single document/row
        this.noteTable.updateOne( filter, update,
            {
                upsert: false,              // not update the whole document
            }, function ( err, updateResult ) {
                assert.equal( null, err );
                //assert.equal( 1, updateResult.modifiedCount );
                //console.log( updateResult );

                if ( callback )
                    // if there is a row get updated
                    // passing true
                    callback( updateResult.modifiedCount > 0 );
            }
        );
    },

    /**
     * Add a new user
     */
    addUser: function ( userData, callback ) {
        var user = {
            "username": userData.username,
            "password": null,
            "name": userData.name,
            "lastLogin": moment().valueOf(),
            "lastLoginString": 'Welcome!',
            "image": userData.img,
            "list": [],
            "noteCount": 0,
            "settings": {
                "noteOrderName": "Title",
                "noteOrderDirection": "up",
                "noteDisplay": "list"
            }
        };

        this.create( user, function ( userId ) {
            user._id = userId;

            callback( {
                status: 1,
                data: user
            } );
        } )
    },

    /**
     * delete a note by userId, noteId
     */
    deleteNote: function ( userId, noteId, callback ) {
        this.update(
            {
                "_id": new ObjectId( userId )
            },
            {
                $pull: {
                    'list': {
                        'noteId': Number( noteId )
                    }
                }
            },
            function ( success ) {
                if ( success )
                    callback( { status: 1 } );
                else
                    callback( {
                        status: 0,
                        msg: 'Note id:' + noteId + ' is not found.'
                    } );
            }
        );

    },

    /**
     * edit note by userId, noteId
     */
    editNote: function ( userId, noteId, notetitle, noteContent, callback ) {
        var date = moment().format( 'YYYY/MM/DD - HH:mm' );

        this.update(
            {
                "_id": new ObjectId( userId ),
                'list.noteId': Number( noteId )
            },
            {
                $set: {
                    'list.$.title': notetitle,
                    'list.$.note': noteContent,
                    'list.$.lastUpdate': date
                }
            },
            function ( success ) {
                if ( success )
                    callback( { status: 1, date: date, } );
                else
                    callback( {
                        status: 0,
                        msg: 'Note ' + notetitle + ' is not found.'
                    } );
            }
        );
    },

    /**
     * add note by userId, note title, note content
     */
    addNote: function ( userId, noteTitle, noteContent, callback ) {
        var date = moment().format( 'YYYY/MM/DD - HH:mm' ),
            defer = tool.deferred(),
            _this = this,
            noteCount;

        _this.noteTable.findOne(
            { '_id': new ObjectId( userId ) },
            {
                projection: {
                    '_id': 0,
                    'noteCount': 1
                }
            },
            function ( err, result ) {
                assert.equal( err, null );

                defer.resolve();
                noteCount = 1 + Number( result['noteCount'] );
            }
        );

        defer.promise.then( function () {
            _this.update(
                {
                    "_id": new ObjectId( userId )
                },
                {
                    $set: {
                        'noteCount': noteCount
                    },
                    $push: {
                        list: {
                            "title": noteTitle,
                            "noteId": noteCount,
                            "type": "file",
                            "lastUpdate": null,
                            "create": date,
                            "note": noteContent,
                        }
                    }
                },
                function ( success ) {
                    if ( success )
                        callback( { status: 1, id: noteCount, date: date, } );
                    else
                        callback( {
                            status: 0,
                            msg: 'Failed to add the new note.'
                        } );
                }
            );
        } );
    },

    /**
     * change the user display name
     */
    changeDisplayName: function ( userId, name, callback ) {
        this.update(
            {
                "_id": new ObjectId( userId )
            },
            {
                $set: {
                    'name': name
                }
            },
            function ( success ) {
                if ( success )
                    callback( { status: 1 } );
                else
                    callback( {
                        status: 0,
                        msg: 'User is not found.'
                    } );
            }
        );
    },

    /**
     * change the user password
     */
    changePassword: function ( userId, password, callback ) {
        this.update(
            {
                "_id": new ObjectId( userId )
            },
            {
                $set: {
                    'password': password
                }
            },
            function ( success ) {
                if ( success )
                    callback( { status: 1 } );
                else
                    callback( {
                        status: 0,
                        msg: 'User is not found.'
                    } );
            }
        );
    },

    /**
     * change note order
     */
    changeNoteOrder: function ( userId, orderName, direction, callback ) {
        this.update(
            {
                "_id": new ObjectId( userId )
            },
            {
                $set: {
                    'settings.noteOrderName': orderName,
                    'settings.noteOrderDirection': direction
                }
            },
            function ( success ) {
                if ( success )
                    callback( { status: 1 } );
                else
                    callback( {
                        status: 0,
                        msg: 'User is not found.'
                    } );
            }
        );
    },

    /**
     * init the database by fetching from mongo DB
     */
    init: function ( path ) {
        var _this = this;

        _this.client.connect( err => {
            assert.equal( null, err );          // make sure no error to continue

            // get the note collection/table from a DB
            var noteTable = _this.client.db( "notebook" ).collection( "data" );

            //_this.data = tool.fetchNoteData( 'user' );
            //_this.size = this.data.length;

            // perform actions on the collection object
            //_this.client.close();             // close this connection

            _this.noteTable = noteTable;

            //_this.test();
        } );

    },

    // testing database
    test: function () {

        var defer1 = tool.deferred(),
            defer2 = tool.deferred(),
            _this = this,
            noteId;

        // add note
        _this.addNote( '5d7dc8c4349bc75cb7c92634', '123456', 'aaaaabbbbbbcccccc',
            function () {
                database.read( { "username": "abc", }, function ( doc ) {
                    var re = doc['list'].pop();
                    if ( re.title == '123456' ) {
                        console.log( re );
                        defer1.resolve();
                        noteId = re.noteId;
                    }
                    else {
                        console.log( 'Wrong!' );
                        defer1.reject();
                    }
                } );
            }
        );

        // modify note title
        defer1.promise.then( function () {
            _this.editNote( '5d7dc8c4349bc75cb7c92634', noteId, '654321', 'dddddeeeeffff',
                function () {
                    database.read( { "username": "abc", }, function ( doc ) {
                        var re = doc['list'].pop();
                        if ( re.noteId == noteId && re.title == '654321' ) {
                            console.log( re );
                            defer2.resolve();
                        }
                        else {
                            console.log( 'Wrong!' );
                            defer2.reject();
                        }
                    } );
                }
            );
        } );

        // remove note
        defer2.promise.then( function () {
            _this.deleteNote( '5d7dc8c4349bc75cb7c92634', noteId,
                function () {
                    database.read( { "username": "abc", }, function ( doc ) {
                        var re = doc['list'].pop();
                        if ( re.noteId == noteId ) {
                            console.log( 'Wrong!' );
                        }
                        else {
                            console.log( doc['list'] );
                        }
                    } );
                }
            );
        } );

    }
};

database.init();

module.exports = database;