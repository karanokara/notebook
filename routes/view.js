var tool = require( '../tool' );

var view = {};

/**
 * get default view obj
 */
view.getDefault = function () {
    return {
        stylesheets: [
            'files/css/bootstrap.min.css',
            'files/css/style.css',
            'files/css/sign-in.css',
        ],
        footerScripts: [
            'files/js/vendor.js',
            'files/js/main.js',
        ],
        body: null,
    };
};

/**
 * Extend default option to user's defined options
 * 
 * @param {object} default_ele default options
 * @param {object} to_change the options the need to be change in default options
 */
view.extend = function ( default_ele, to_change ) {
    for ( var key in to_change ) {
        default_ele[key] = to_change[key];
    }

    return default_ele;
}

view.appSettingView = function ( username ) {
    return {
        title: 'User: ' + username,
        listingClasses: 'flex-column',
        settingId: 'app-setting',
        items: [
            {
                itemName: 'Change display name',
                itemIcon: tool.readFile( 'public/images/person.svg' ),
                settingStr: 'display-name'

            },
            {
                itemName: 'Change password',
                itemIcon: tool.readFile( 'public/images/key.svg' ),
                settingStr: 'password'

            },
            {
                itemName: 'Sign out',
                itemIcon: tool.readFile( 'public/images/sign-out.svg' ),
                settingStr: 'sign-out'

            }
        ]
    };
};

view.noteSettingView = function () {
    return {
        title: "Note",
        listingClasses: 'flex-column',
        settingId: 'note-setting',
        items: [
            {
                itemName: 'Edit',
                itemIcon: tool.readFile( 'public/images/edit.svg' ),
                settingStr: 'note-edit'
            },
            {
                itemName: 'Delete',
                itemIcon: tool.readFile( 'public/images/delete.svg' ),
                settingStr: 'note-delete'

            },
            {
                itemName: 'Change color',
                itemIcon: tool.readFile( 'public/images/palette.svg' ),
                settingStr: 'note-color'

            }
        ]
    };
};

view.noteOrderSettingView = function () {
    return {
        title: "Order",
        listingClasses: 'flex-column ml-2',
        settingId: 'note-order-setting',
        items: [
            {
                itemName: 'Title',
                itemIcon: tool.readFile( 'public/images/arrow-up.svg' ),
                settingStr: 'note-order-title-up'
            },
            {
                itemName: 'Title',
                itemIcon: tool.readFile( 'public/images/arrow-down.svg' ),
                settingStr: 'note-order-title-down'

            },
            {
                itemName: 'Last update',
                itemIcon: tool.readFile( 'public/images/arrow-up.svg' ),
                settingStr: 'note-order-date-up'

            },
            {
                itemName: 'Last update',
                itemIcon: tool.readFile( 'public/images/arrow-down.svg' ),
                settingStr: 'note-order-date-down'

            },
        ]
    };
};

// app top setting drop down 
view.userDisplayNameChangeView = function () {
    return {
        title: 'Change display name',
        settingId: 'user-display-name-change',
        listingClasses: 'flex-column',
        items: [
            {
                itemName: 'Name',
                settingStr: 'user-display-name',
                type: 'text'
            }
        ],
        btns: [
            {
                name: 'Cancel'
            },
            {
                name: 'Change'
            }
        ]
    };
};

// app top setting drop down 
view.userPasswordChangeView = function () {
    return {
        title: 'Change password',
        settingId: 'user-password-change',
        listingClasses: 'flex-column',
        items: [
            {
                itemName: 'Password',
                settingStr: 'user-password',
                type: 'password',
            }
        ],
        btns: [
            {
                name: 'Cancel'
            },
            {
                name: 'Change'
            }
        ]
    };
};

view.noteAddView = function () {
    return {
        title: "New",
        //listingClasses: 'justify-content-around',
        listingClasses: 'flex-column',
        settingId: 'note-add-setting',
        items: [
            {
                itemName: 'Note',
                itemIcon: tool.readFile( 'public/images/file.svg' ),
                settingStr: 'note-new',
            },
        ]
    };
};

view.noteEditView = function () {
    return {
        backBtn: tool.readFile( 'public/images/arrow-left.svg' ),
        deleteBtn: tool.readFile( 'public/images/delete.svg' ),
    };
};

view.userView = function ( userData ) {
    var userView = {
        siteTitle: 'Notebook - User Notes',
        bodyClasses: 'user',
        username: userData.username,
        menus: [],
        settings: [],
        userSettingBtnImage: '/files/images/user-setting.svg',
        noteExpand: tool.readFile( 'public/images/arrow-down-s.svg' ),
        noteAddBtnImage: tool.readFile( 'public/images/add.svg' ),
        logoImage: '/files/images/note-no-shadow.svg',
        userData: userData,

    };

    // bottom menu
    userView.menus.push( tool.render( 'app-bottom-menu', view.appSettingView( userView.username ) ) );
    userView.menus.push( tool.render( 'app-bottom-menu', view.noteSettingView() ) );
    userView.menus.push( tool.render( 'app-bottom-menu', view.noteOrderSettingView() ) );
    userView.menus.push( tool.render( 'app-bottom-menu', view.noteAddView() ) );

    // top settings
    userView.settings.push( tool.render( 'app-top-setting', view.userDisplayNameChangeView() ) );
    userView.settings.push( tool.render( 'app-top-setting', view.userPasswordChangeView() ) );

    // activity
    userView.noteEdit = tool.render( 'note-edit', view.noteEditView() );
    userView.noteView = tool.render( 'note-view', view.noteEditView() );


    var de = this.getDefault();
    this.extend( de, userView );

    de.body = tool.render( 'user', de );

    return de;
};

view.loginView = function () {
    var loginView = {
        siteTitle: 'Notebook - Login',
        signInTitle: 'A Simple Notebook',
        bodyClasses: 'login',
        headScripts: [

        ],
        logoImage: '/files/images/note-no-shadow.svg',
        copyright: '2019, A little project'
    };


    var de = this.getDefault();

    this.extend( de, loginView );

    de.body = tool.render( 'login', de );

    return de;
};

module.exports = view;