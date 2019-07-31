

var app = {
    isMenuOpened: 0,
    backLid: null,
};

var menuManager = {
    openedMenu: null,
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

    $( '.app-setting-btn' ).on( 'click', function () {

        menuManager.openMenu( '#app-setting' );
    } );

    $( '.note-add-btn' ).on( 'click', function () {
        menuManager.openMenu( '#note-add-setting' );
    } );

    this.backLid.on( 'click', function () {
        menuManager.closeMenu();
    } );

};

app.toggleNoteOptions = function () {

};

app.toggleNoteAdd = function () {

};

app.toggleAppSettings = function () {

};

app.toggleNoteAdd = function () {

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



$( document ).ready( function () {
    app.init();
} );


