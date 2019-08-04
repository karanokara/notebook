

var app = {
    backLid: null,
    noteList: null,
    currentFocusNote: null,
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
    this.noteList = $( '#note-list' );
    this.menuWrapper = $( '#menu-wrapper' );
    this.orderBtn = $( '#order-btn' );


    /* ------------------- open menu btn --------------------- */

    $( '#app-setting-btn' ).on( 'click', function () {
        menuManager.openMenu( '#app-setting' );
    } );

    $( '#note-add-btn' ).on( 'click', function () {
        menuManager.openMenu( '#note-add-setting' );
    } );

    // using bubbling, calling children first
    $( '.note-setting-btn' ).each( function () {
        this.addEventListener( 'click', function ( event ) {
            var id = this.getAttribute( 'note-id' ),
                note = $( '#note' + id ),
                title = note.find( '.note-title' ).text();

            menuManager.openMenu( '#note-setting', title, note );
            event.stopPropagation();
        } );

    } );


    /* ---------------- add note menu ----------------------- */

    $( '.setting-item[data-type="note-new"]' ).on( 'click', function () {
        activityManager.openActivity( 'new', '#note-edit' );
        menuManager.closeMenu();
    } );


    /* ---------------- note settings menu ----------------------- */

    $( '.setting-item[data-type="note-edit"]' ).on( 'click', function () {
        var thisNote = menuManager.associateItem;

        activityManager.closeActivity();
        activityManager.openActivity( 'edit', '#note-edit', thisNote );
        menuManager.closeMenu();
    } );

    $( '.setting-item[data-type="note-delete"]' ).on( 'click', function () {


    } );


    $( '.setting-item[data-type="note-detail"]' ).on( 'click', function () {

    } );

    /* ---------------- open view note activity ------------------- */

    $( '.note' ).each( function () {
        this.addEventListener( 'click', function () {
            app.currentFocusNote = this.getAttribute( 'note-id' );
            activityManager.openActivity( 'view', '#note-view', $( this ) );
        } );
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

    // when click "done" on edit note activity
    $( '#note-edit-submit' ).on( 'click', function () {

    } );


    /* ---------------- other ------------------- */

    this.backLid.on( 'click', function () {
        menuManager.closeMenu();
    } );


    this.changeNoteOrder();
};


app.addNote = function ( title, content ) {

    this.noteList.append();
    // update server side

};

app.makeNote = function () {

};

app.deleteNote = function ( noteDom ) {

    noteDom.remove();

    // update server side
};

/**
 * change note listing order
 */
app.changeNoteOrder = function () {

    this.orderBtn.find( '.order-img' ).css( 'display', 'none' );
    this.orderBtn.find( '#order-img-' + this.orderBtn.attr( 'order' ) ).css( 'display', '' );

};

menuManager.openMenu = function ( menuId, title, item ) {
    var menu = $( menuId );

    if ( title )
        menu.find( '.menu-title' ).text( title );

    app.menuWrapper.css( {
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

        app.menuWrapper.css( {
            'visibility': ''
        } );

        this.openedMenu = null;
    }
};

activityManager.editActivity = function ( activity, activityDom, dom ) {
    var man = this;

    man.currentActivity.activityTitle = activityDom.find( '.activity-title' );
    man.currentActivity.title = activityDom.find( '#note-edit-title' );
    man.currentActivity.content = activityDom.find( '#note-edit-content' );
    man.currentActivity.submit = activityDom.find( '#note-edit-submit' );

    if ( activity === 'edit' ) {
        var title = dom.find( '.note-title' ).text(),
            content = dom.find( '.note-content' ).text();

        man.currentActivity.title.val( title );
        man.currentActivity.content.val( content );
    }

    man.currentActivity.activityTitle.text( activity[0].toUpperCase() + activity.substr( 1 ) );

    // a note must have title
    man.currentActivity.title.off( 'keyup' ).on( 'keyup', function () {
        man.isActivityEdited = true;
        man.currentActivity.submit.removeAttr( 'disabled' );
        man.currentActivity.title.off( 'keyup' );
    } );

    // only content can't be submit on new note
    man.currentActivity.content.off( 'keyup' ).on( 'keyup', function () {
        man.isActivityEdited = true;
        if ( activity == 'edit' )
            man.currentActivity.submit.removeAttr( 'disabled' );

        man.currentActivity.content.off( 'keyup' );
    } );

    man.currentActivity.submit.off( 'click' ).on( 'click', function () {
        // process data to server
        if ( !this.hasAttribute( 'disabled' ) ) {

        }

    } );
};

activityManager.newActivity = activityManager.editActivity;

// filling info into single note view
activityManager.viewActivity = function ( activity, activityDom, dom ) {
    var viewTitle = activityDom.find( '#note-view-title' ),
        viewDate = activityDom.find( '#note-view-date' ),
        viewContent = activityDom.find( '#note-view-content' ),
        viewSettingBtn = activityDom.find( '.note-setting-btn' ),
        id = dom.attr( 'note-id' ),
        title = dom.find( '.note-title' ).text(),
        date = dom.find( '.note-date' ).text(),
        content = dom.find( '.note-content' ).text();


    viewTitle.text( title );
    viewDate.text( date );
    viewContent.text( content );
    viewSettingBtn.attr( 'note-id', id );
};

// associateItemDom is the related html dom 
//that a new activity can fetch data from
activityManager.openActivity = function ( activity, activityId, associateItemDom ) {
    var activityDom = $( activityId );

    activityDom.css( {
        'visibility': 'visible'
    } );

    this.currentActivity = {
        dom: activityDom,
        activity: activity
    };

    this[activity + 'Activity']( activity, activityDom, associateItemDom );
};

activityManager.closeActivity = function () {
    if ( this.currentActivity ) {
        this.currentActivity.dom.css( {
            'visibility': ''
        } );
        this.currentActivity = null;
    }

    menuManager.closeMenu();
};

/**
 * clear data that have been entered 
 */
activityManager.clearActivity = function () {
    if ( this.isActivityEdited || this.currentActivity.activity === 'edit' ) {
        this.currentActivity.title.val( '' );
        this.currentActivity.content.val( '' );
        this.isActivityEdited = false;
        this.currentActivity.submit.attr( 'disabled', '' );
    }

};

$( document ).ready( function () {
    app.init();
} );


