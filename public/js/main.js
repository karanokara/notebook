var anime = TweenMax,
    ease2 = Power2;

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
        scheduleToHide: null,
        show: function ( msg ) {
            var _this = this;

            _this.dom.find( '.message-content' ).text( msg );
            _this.isShowed = 1;
            anime.to( _this.dom, .3, {
                y: '0%', ease: ease2.easeOut, onComplete: function () {
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

            _this.scheduleToHide = anime.to( _this.dom, .3, {
                y: '100%', ease: ease2.easeOut, delay: delay, onComplete: function () {
                    _this.isShowed = 0;
                    _this.scheduleToHide = null;
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

        /* ---------------- app setting menu ----------------------- */
        $( '.setting-item[data-type="username"]' ).on( 'click', function () {

        } );

        $( '.setting-item[data-type="password"]' ).on( 'click', function () {

        } );

        $( '.setting-item[data-type="sign-out"]' ).on( 'click', function () {
            app.logout();

        } );

        /* ---------------- add note menu ----------------------- */

        $( '.setting-item[data-type="note-new"]' ).on( 'click', function () {
            activityManager.openActivity( 'new', '#note-edit-activity' );

        } );


        /* ---------------- note settings menu ----------------------- */

        $( '.setting-item[data-type="note-edit"]' ).on( 'click', function () {
            var thisNote = menuManager.associateItem;

            activityManager.openActivity( 'edit', '#note-edit-activity', thisNote );
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
    /**
     * handle login activity stuffs
     */
    login: function () {
        var _this = this,
            form = $( '#login-form' ),
            username = form.find( '#input-username' ),
            password = form.find( '#input-password' ),
            localSubmit = form.find( '#local-login-btn' ),
            googleSubmit = form.find( '#google-login-btn' );

        this.messageBar.dom = $( '#message-bar' );
        this.messageBar.isShowed = 0;

        form.on( 'submit', function ( evt ) {
            evt.preventDefault();
            username.attr( 'disabled', '' );
            password.attr( 'disabled', '' );
            localSubmit.attr( 'disabled', '' );
            googleSubmit.attr( 'disabled', '' );

            var name = username.val(),
                pass = password.val(),
                data = {
                    username: name,
                    password: pass,
                };


            _this.sendData( '/validate', data, null,
                // success
                function ( data ) {
                    // change activity
                    _this.appWrapper.append( data.data );
                    _this.init();
                    activityManager.openActivity( 'user', '#user-activity', null, activityManager.disconnectActivity.bind( activityManager ) );
                },
                // fail
                function () {

                },
                // complete
                function () {
                    // others to do after complete

                    username.attr( 'disabled', null );
                    password.attr( 'disabled', null );
                    localSubmit.attr( 'disabled', null );
                    googleSubmit.attr( 'disabled', null );

                }
            );


        } );

        googleSubmit.on( 'click', function () {
            username.attr( 'disabled', '' );
            password.attr( 'disabled', '' );
            localSubmit.attr( 'disabled', '' );
            googleSubmit.attr( 'disabled', '' );

            _this.sendData( '/google', null, null,
                // success
                function ( data ) {
                    // change activity
                    // _this.appWrapper.append( data.data );
                    // _this.init();
                    // activityManager.openActivity( 'user', '#user-activity', null, activityManager.disconnectActivity.bind( activityManager ) );
                },
                // fail
                function () {

                },
                // complete
                function () {
                    // others to do after complete

                    username.attr( 'disabled', null );
                    password.attr( 'disabled', null );
                    localSubmit.attr( 'disabled', null );
                    googleSubmit.attr( 'disabled', null );

                }
            );



        } );

    },
    logout: function () {
        if ( !confirm( 'Are you sure to sign out?' ) )
            return;

        var _this = this;

        _this.sendData( '/logout', null, null,
            // success
            function ( data ) {
                // change activity
                _this.appWrapper.append( data.data );
                _this.login();
                _this.isInit = false;
                activityManager.openActivity( 'login', '#login-activity', null, function () {
                    activityManager.disconnectActivity();
                    activityManager.removeActivity( 'note-edit-activity note-view-activity' );
                    $( '#menu-wrapper' ).remove();
                } );
            },
            // fail
            function () {

            },
            // complete
            function () {
                // others to do after complete

            }
        );

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
            'height': total - sum - 50
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
    sendData: function ( target, data, start, success, fail, complete ) {
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

                if ( fail )
                    fail();
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

    anime.to( app.backLid, .2, { opacity: '1', ease: ease2.easeOut } );
    anime.to( menu, .2, { y: '0%', opacity: '1', ease: ease2.easeOut } );

    // associate opened menu with item selected
    if ( item )
        this.associateItem = item;
};

menuManager.closeMenu = function () {
    var _this = this;
    if ( _this.openedMenu ) {

        anime.to( app.backLid, .2, { opacity: '0', ease: ease2.easeOut, clearProps: 'all' } );
        anime.to( this.openedMenu, .2, {
            y: '50%', opacity: '0', ease: ease2.easeOut, clearProps: 'all', onComplete: function () {
                _this.openedMenu.css( {
                    'visibility': ''
                } );

                app.menuWrapper.css( {
                    'visibility': ''
                } );
                _this.openedMenu = null;
            }
        } );


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
        this.currentActivity.dom.addClass( 'current' );
        this.currentActivity.dom.removeClass( 'fixed-top' );


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
    openActivity: function ( activity, activityId, associateItemDom, callback ) {
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

        anime.to( newActivity.dom, .3, {
            y: '0%', ease: ease2.easeOut,
            onStart: function () {
                app.htmlBody.css( { 'overflow': 'hidden' } );
            }, onComplete: function () {
                _this.currentActivity.dom.addClass( 'current' );
                _this.currentActivity.dom.removeClass( 'fixed-top' );

                if ( newActivity.activity === 'user' )
                    app.htmlBody.css( { 'overflow': '' } );
            },
            clearProps: 'visibility,transform'
        } );
        anime.to( newActivity.prevActivity.dom, .3, {
            y: '2%', scale: .92, ease: ease2.easeOut, onComplete: function () {

                _this.currentActivity.prevActivity.dom.addClass( 'fixed-top' );
                _this.currentActivity.prevActivity.dom.removeClass( 'current' );

                if ( callback )
                    callback();
            }
        } );

        if ( this.hasOwnProperty( activity + 'Activity' ) )
            this[activity + 'Activity']( activity, newActivity.dom, associateItemDom );

        menuManager.closeMenu();
    },

    closeActivity: function ( callback ) {
        var _this = this;
        // ensure there is a activity to bring back
        if ( this.currentActivity.prevActivity ) {
            var current = _this.currentActivity;

            anime.to( current.dom, .3, {
                y: '100%', ease: ease2.easeOut,
                onStart: function () {
                    app.htmlBody.css( { 'overflow': 'hidden' } );

                    _this.currentActivity.dom.addClass( 'fixed-top' );
                }, onComplete: function () {

                    _this.currentActivity.dom.removeClass( 'current' );
                },
                clearProps: 'all'
            } );
            anime.to( current.prevActivity.dom, .3, {
                y: '0%', scale: 1, ease: ease2.easeOut,
                onStart: function () {
                    _this.currentActivity.prevActivity.dom.addClass( 'current' );

                }, onComplete: function () {
                    if ( current.prevActivity.activity === 'user' ) {
                        app.htmlBody.css( { 'overflow': '' } );
                    }
                    _this.currentActivity.prevActivity.dom.removeClass( 'fixed-top' );

                    --_this.activityCount;
                    _this.currentActivity = _this.currentActivity.prevActivity;

                    if ( callback )
                        callback();
                },
                clearProps: 'visibility,transform'
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
    disconnectActivity: function () {
        if ( this.currentActivity.prevActivity ) {
            this.currentActivity.prevActivity.dom.remove();
            this.currentActivity.prevActivity = null;
            this.activityCount -= 1;
            this.currentActivity.dom.css( { 'zIndex': '' } );
        }
    },
    /**
     * removed by activity id
     * @param {string} except a string of activities id 
     */
    removeActivity: function ( idString ) {
        var count = 0;
        $( '.activity' ).each( function () {
            if ( idString.includes( this.getAttribute( 'id' ) ) ) {
                this.remove();
                ++count;
            }
        } );

        return count;
    },
    hasPrevActivity: function () {
        return ( this.currentActivity.prevActivity ) ? true : false;
    }
};


$( document ).ready( function () {
    activityManager.init();

} );


