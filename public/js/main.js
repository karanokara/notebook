

var app = {
    isMenuOpened: 0,
    backLid: null,
};

var menuManager = {
    openedMenu: null,
};

var activityManager = {
    currentActivity: null,
    isActivityEdited: false,
};

app.init = function () {
    var _app = this;
    this.backLid = $( '#back-lid' );

    $( '.note-setting-btn' ).on( 'click', function () {
        var id = this.getAttribute( 'note-id' ),
            note = $( '#note' + id ),
            title = note.find( '.note-title' ).text();

        menuManager.openMenu( '#note-setting', title );
    } );

    $( '#app-setting-btn' ).on( 'click', function () {
        menuManager.openMenu( '#app-setting' );
    } );

    $( '#note-add-btn' ).on( 'click', function () {
        menuManager.openMenu( '#note-add-setting' );
    } );

    // when click "done" on edit note activity
    $( '#note-edit-submit' ).on( 'click', function () {

    } );

    /* ---------------- add note settings ----------------------- */

    $( '.setting-item[data-type="note"]' ).on( 'click', function () {
        activityManager.openActivity( '#note-edit' );
    } );

    /* ---------------- note settings ----------------------- */

    $( '.setting-item[data-type="delete"]' ).on( 'click', function () {

    } );

    $( '.go-back-btn' ).on( 'click', function () {
        if ( activityManager.isActivityEdited ) {
            var r = confirm( "Are you sure to discard?" );
            if ( !r )
                return;
        }
        activityManager.clearActivity();
        activityManager.closeActivity();
    } );

    $( '.discard-btn' ).on( 'click', function () {
        // clear draft 

        // close activity
        activityManager.clearActivity();
        activityManager.closeActivity();
    } );


    this.backLid.on( 'click', function () {
        menuManager.closeMenu();
    } );

};

app.addNote = function ( title, content ) {

};

menuManager.openMenu = function ( menuId, title ) {
    var menu = $( menuId );

    if ( title )
        menu.find( '.menu-title' ).text( title );

    app.backLid.css( {
        'visibility': 'visible'
    } );

    menu.css( {
        'visibility': 'visible'
    } );
    this.openedMenu = menu;
};

menuManager.closeMenu = function () {
    if ( this.openedMenu ) {
        this.openedMenu.css( {
            'visibility': ''
        } );

        app.backLid.css( {
            'visibility': ''
        } );

        this.openedMenu = null;
    }
};

activityManager.initActivity = function ( activity ) {
    var man = this;

    man.currentActivity.title = activity.find( '#note-edit-title' );
    man.currentActivity.content = activity.find( '#note-edit-content' );
    man.currentActivity.submit = activity.find( '#note-edit-submit' );

    man.currentActivity.title.on( 'keyup', function () {
        man.isActivityEdited = true;
    } );

    man.currentActivity.content.on( 'keyup', function () {
        man.isActivityEdited = true;
    } );

    man.currentActivity.submit.on( 'click', function () {
        // process data to server
    } );
};

activityManager.openActivity = function ( activityId ) {
    var activity = $( activityId );

    activity.css( {
        'visibility': 'visible'
    } );

    this.currentActivity = {
        dom: activity
    };

    this.initActivity( activity );
};

activityManager.closeActivity = function () {
    if ( this.currentActivity ) {
        this.currentActivity.dom.css( {
            'visibility': ''
        } );
        this.currentActivity = null;
    }
};

/**
 * clear data that have been entered 
 */
activityManager.clearActivity = function () {
    if ( this.isActivityEdited ) {
        this.currentActivity.title.val( '' );
        this.currentActivity.content.val( '' );
        this.isActivityEdited = false;

    }

};

$( document ).ready( function () {
    app.init();
} );


