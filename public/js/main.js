

var app = {
    backLid: null,
};

var menuManager = {
    openedMenu: null,
    associateItem: null,
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

        menuManager.openMenu( '#note-setting', title, note );
    } );

    /* ------------------- open menu btn --------------------- */

    $( '#app-setting-btn' ).on( 'click', function () {
        menuManager.openMenu( '#app-setting' );
    } );

    $( '#note-add-btn' ).on( 'click', function () {
        menuManager.openMenu( '#note-add-setting' );
    } );

    // when click "done" on edit note activity
    $( '#note-edit-submit' ).on( 'click', function () {

    } );

    /* ---------------- add note menu ----------------------- */

    $( '.setting-item[data-type="note-new"]' ).on( 'click', function () {
        activityManager.openActivity( 'note-new', '#note-edit' );
    } );

    /* ---------------- note settings menu ----------------------- */

    $( '.setting-item[data-type="note-edit"]' ).on( 'click', function () {
        var thisNote = menuManager.associateItem;

        activityManager.openActivity( 'note-edit', '#note-edit', thisNote );
    } );

    $( '.setting-item[data-type="note-delete"]' ).on( 'click', function () {


    } );


    $( '.setting-item[data-type="delete"]' ).on( 'click', function () {

    } );

    /* ---------------- Edit note activity ------------------- */

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
        activityManager.clearActivity();

        // close activity
        activityManager.closeActivity();
    } );


    this.backLid.on( 'click', function () {
        menuManager.closeMenu();
    } );

};

app.addNote = function ( title, content ) {

};

app.deleteNote = function ( noteId ) {

};

menuManager.openMenu = function ( menuId, title, item ) {
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

    // associate opened menu with item selected
    if ( item )
        this.associateItem = item;
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

activityManager.initActivity = function ( activity, activityDom, dom ) {
    var man = this;

    man.currentActivity.title = activityDom.find( '#note-edit-title' );
    man.currentActivity.content = activityDom.find( '#note-edit-content' );
    man.currentActivity.submit = activityDom.find( '#note-edit-submit' );

    if ( activity === 'note-edit' ) {
        var title = dom.find( '.note-title' ).text(),
            content = dom.find( '.note-content' ).text();
        man.currentActivity.title.val( title );
        man.currentActivity.content.val( content );
    }

    // a note must have title
    man.currentActivity.title.on( 'keyup', function () {
        man.isActivityEdited = true;
        man.currentActivity.submit.removeAttr( 'disabled' );
        man.currentActivity.title.off( 'keyup' );
    } );

    // only content can't be submit on new note
    man.currentActivity.content.on( 'keyup', function () {
        man.isActivityEdited = true;
        if ( activity == 'note-edit' )
            man.currentActivity.submit.removeAttr( 'disabled' );

        man.currentActivity.content.off( 'keyup' );
    } );

    man.currentActivity.submit.off( 'click' ).on( 'click', function () {
        // process data to server
        if ( !this.hasAttribute( 'disabled' ) ) {

        }

    } );
};

// dom is the related html dom that a new activity 
// can fetch data from
activityManager.openActivity = function ( activity, activityId, dom ) {
    var activityDom = $( activityId );

    activityDom.css( {
        'visibility': 'visible'
    } );

    this.currentActivity = {
        dom: activityDom,
        activity: activity
    };

    this.initActivity( activity, activityDom, dom );
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
    if ( this.isActivityEdited || this.currentActivity.activity === 'note-edit' ) {
        this.currentActivity.title.val( '' );
        this.currentActivity.content.val( '' );
        this.isActivityEdited = false;
        this.currentActivity.submit.attr( 'disabled', '' );
    }

};

$( document ).ready( function () {
    app.init();
} );


