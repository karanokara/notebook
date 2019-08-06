
var app = {
    backLid: null,
    noteList: null,
    currentFocusNote: null,
    editView: null,
    viewView: null,
    ajaxResponse: null,
    appWrapper: $( '#app-wrapper' ),
    htmlBody: $( 'body' ),
    isInit: false,
    messageBar: {
        /**
         * the html DOM
         */
        dom: null,
        isShowed: 0,
        scheduleToHide: 0,
        show: function ( msg ) {
            var _this = this;

            _this.dom.find( '.message-content' ).text( msg );
            _this.isShowed = 1;
            TweenMax.to( _this.dom, .3, {
                y: '0%', ease: Power2.easeOut, onComplete: function () {
                    _this.hide( 5 );
                }
            } );
        },

        hide: function ( delay ) {
            var _this = this;
            if ( !_this.isShowed )
                return;

            if ( delay == undefined )
                delay = 0;

            if ( _this.scheduleToHide ) {
                _this.scheduleToHide.kill();
            }

            _this.scheduleToHide = TweenMax.to( _this.dom, .3, {
                y: '100%', ease: Power2.easeOut, delay: delay, onComplete: function () {
                    _this.isShowed = 0;
                    _this.scheduleToHide = 0;
                }
            } );
        },
    },

    init: function () {
        if ( this.isInit )
            return;

        var _app = this;
        this.isInit = true;
        this.backLid = $( '#back-lid' );
        this.noteList = $( '#note-list' );
        this.menuWrapper = $( '#menu-wrapper' );
        this.orderBtn = $( '#order-btn' );
        this.editView = $( '#note-edit-activity' );
        this.viewView = $( '#note-view-activity' );


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
            activityManager.openActivity( 'new', '#note-edit-activity' );
            menuManager.closeMenu();
        } );


        /* ---------------- note settings menu ----------------------- */

        $( '.setting-item[data-type="note-edit"]' ).on( 'click', function () {
            var thisNote = menuManager.associateItem;

            activityManager.openActivity( 'edit', '#note-edit-activity', thisNote );
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
                activityManager.openActivity( 'view', '#note-view-activity', $( this ) );
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
        this.trimNote();
        this.sizeNoteEditView();
    },

    login: function () {
        var _this = this,
            form = $( '#login-form' ),
            username = form.find( '#input-username' ),
            password = form.find( '#input-password' );

        this.messageBar.dom = $( '#message-bar' );
        this.messageBar.isShowed = 0;

        form.on( 'submit', function ( evt ) {
            evt.preventDefault();

            var name = username.val(),
                pass = password.val(),
                data = {
                    username: name,
                    password: pass,
                };


            _this.sendData( '/validate', data, null,
                function ( data ) {
                    // change activity



                    //activityManager.openActivity();
                }, function () {
                    // others to do after complete
                }
            );


        } )
    },


    addNote: function ( title, content ) {

        this.noteList.append();
        // update server side

    },

    makeNote: function () {

    },

    deleteNote: function ( noteDom ) {

        noteDom.remove();

        // update server side
    },

    trimNote: function ( noteId ) {
        if ( noteId != undefined ) {
            // only trim a specific note


        }
        else {

            this.noteList.find( '.note' ).each( function () {
                var content = $( this ).find( '.note-content-show' ),
                    text = content.text();

                content.text( text.substr( 0, 100 ) + ' . . .' );
            } );
        }
    },

    sizeNoteEditView: function () {
        var sum = app.editView.find( '.activity-guide' ).outerHeight( true ) +
            this.editView.find( '.note-title-area' ).outerHeight( true ) +
            this.editView.find( '.note-submit-area' ).outerHeight( true ),
            total = app.editView.height();

        this.editView.find( '#note-edit-content' ).css( {
            'height': total - sum - 5
        } );

    },
    /**
     * change note listing order
     */
    changeNoteOrder: function () {

        this.orderBtn.find( '.order-img' ).css( 'display', 'none' );
        this.orderBtn.find( '#order-img-' + this.orderBtn.attr( 'order' ) ).css( 'display', '' );

    },
    /**
     * 
     * @param {*} target 
     * @param {*} data 
     * @param {*} start 
     * @param {*} success 
     * @param {*} complete 
     */
    sendData: function ( target, data, start, success, complete ) {
        var _this = this,
            url = location.origin + target;

        $.ajax( {
            url: url,
            data: data,
            method: 'POST',
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',  // data send
            dataType: 'json',   // data format comes back, a obj
            beforeSend: function () {
                if ( start )
                    start();
            },
            complete: function () {
                if ( complete )
                    complete();
            },
            success: function ( data, status, xhr ) {
                console.log( data );
                console.log( status );
                console.log( xhr );

                if ( success )
                    success( data );
                //app.ajaxResponse = xhr;

            },
            error: function ( xhr, status, error ) {
                console.log( error );
                console.log( status );
                console.log( xhr );
                _this.messageBar.show( xhr.responseJSON.msg )
                //alert( 'error' );
                //app.ajaxResponse = xhr;
            }
        } );
    }
};

var menuManager = {
    openedMenu: null,
    associateItem: null,
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


var activityManager = {
    currentActivity: {
        prevActivity: null,
        dom: null,
        activity: '',
    },
    activityCount: 0,
    isActivityEdited: false,

    init: function () {
        this.currentActivity.activity = app.appWrapper.attr( 'data-activity' )
        this.currentActivity.dom = $( '#' + this.currentActivity.activity + '-activity' );
        this.activityCount += 1;
        if ( this.currentActivity.activity === 'user' ) {
            app.init();
        }
        else {
            app.login();
        }
    },

    editActivity: function ( activity, activityDom, dom ) {
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
    },

    newActivity: function ( activity, activityDom, dom ) {
        this.editActivity( activity, activityDom, dom );
    },
    // filling info into single note view
    viewActivity: function ( activity, activityDom, dom ) {
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
    },

    // associateItemDom is the related html dom 
    //that a new activity can fetch data from
    openActivity: function ( activity, activityId, associateItemDom ) {
        var _this = this,
            newActivity = {
                prevActivity: _this.currentActivity,
                dom: $( activityId ),
                activity: activity,
            };

        _this.currentActivity = newActivity;

        newActivity.dom.css( {
            'visibility': 'visible',
            'zIndex': Number( newActivity.dom.css( 'zIndex' ) ) + ( _this.activityCount++ ),
        } );

        TweenMax.to( newActivity.dom, .3, {
            y: '0%', ease: Power2.easeOut,
            onStart: function () {
                app.htmlBody.css( { 'overflow': 'hidden' } );
            }, onComplete: function () {
                if ( newActivity.activity === 'user' )
                    app.htmlBody.css( { 'overflow': '' } );
            }
        } );
        TweenMax.to( newActivity.prevActivity.dom, .3, {
            y: '2%', scale: .92, ease: Power2.easeOut, onComplete: function () {

            }
        } );

        //    transform: translate(0%,2%) scale(.92);
        if ( this.hasOwnProperty( activity + 'Activity' ) )
            this[activity + 'Activity']( activity, newActivity.dom, associateItemDom );
    },

    closeActivity: function () {
        var _this = this;
        // ensure there is a activity to bring back
        if ( this.currentActivity.prevActivity ) {
            var current = _this.currentActivity;

            TweenMax.to( current.dom, .3, {
                y: '100%', ease: Power2.easeOut,
                onStart: function () {
                    app.htmlBody.css( { 'overflow': 'hidden' } );
                }, onComplete: function () {

                }, clearProps: 'all'
            } );
            TweenMax.to( current.prevActivity.dom, .3, {
                y: '0%', scale: 1, ease: Power2.easeOut, onComplete: function () {
                    if ( current.prevActivity.activity === 'user' ) {
                        app.htmlBody.css( { 'overflow': '' } );
                        current.prevActivity.dom.css( { 'transform': '' } );
                    }

                    _this.currentActivity.dom.css( {
                        'visibility': '',
                    } );

                    --_this.activityCount;
                    _this.currentActivity = _this.currentActivity.prevActivity;
                }
            } );

        }

        menuManager.closeMenu();
    },

    /**
     * clear data that have been entered 
     */
    clearActivity: function () {
        if ( this.isActivityEdited || this.currentActivity.activity === 'edit' ) {
            this.currentActivity.title.val( '' );
            this.currentActivity.content.val( '' );
            this.isActivityEdited = false;
            this.currentActivity.submit.attr( 'disabled', '' );
        }

    },
};


$( document ).ready( function () {
    activityManager.init();

} );


