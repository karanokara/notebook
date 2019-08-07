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

view.appSettingView = function () {
    return {
        title: "Notebook",
        listingClasses: 'flex-column',
        settingId: 'app-setting',
        items: [
            {
                itemName: 'Change username',
                itemIcon: tool.readFile( 'public/images/person.svg' ),
                settingStr: 'username'

            },
            {
                itemName: 'Change password',
                itemIcon: tool.readFile( 'public/images/key.svg' ),
                settingStr: 'password'

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
                itemName: 'View Details',
                itemIcon: tool.readFile( 'public/images/detail.svg' ),
                settingStr: 'note-detail'

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
        userSettingBtnImage: '/files/images/user-setting.svg',
        noteExpand: tool.readFile( 'public/images/arrow-down-s.svg' ),
        noteAddBtnImage: tool.readFile( 'public/images/add.svg' ),
        logoImage: '/files/images/note-no-shadow.svg',
        userData: userData,

    };

    userView.menus.push( tool.render( 'app-bottom-menu', view.appSettingView() ) );
    userView.menus.push( tool.render( 'app-bottom-menu', view.noteSettingView() ) );
    userView.menus.push( tool.render( 'app-bottom-menu', view.noteAddView() ) );

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