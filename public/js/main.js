

var app = {
    isMenuOpened: 0,
    backLid: null,
};

var menuManager = {
    openedMenu: null,
};

var activityManager = {
    currentActivity: null,
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

    $( '.setting-item[data-type="new-note"]' ).on( 'click', function () {

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

activityManager.openActivity = function () {

};

activityManager.closeActivity = function () {

};

$( document ).ready( function () {
    app.init();
} );


