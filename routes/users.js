var express = require( 'express' );
var router = express.Router();
var tools = require( '../tools' );

var view = {
  siteTitle: 'Notebook - User Notes',
  username: 'HappyTester',
  list: [
    {
      noteTitle: 'Suggestions',
      noteExcert: 'Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus ....'

    },
    {
      noteTitle: 'Suggestions',
      noteExcert: 'Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus ....'

    },
    {
      noteTitle: 'Suggestions',
      noteExcert: 'Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus ....'

    },
    {
      noteTitle: 'Suggestions',
      noteExcert: 'Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus ....'

    },
  ],
  stylesheets: [
    'files/stylesheets/bootstrap.min.css',
    'files/stylesheets/style.css',

  ],
  settings: {

  },
  userSettingBtnImage: '/files/images/user-setting.svg',
  noteSettingBtnImage: '/files/images/note-setting.svg',
  noteExpand: tools.readFile( 'public/images/arrow-down-s.svg' ),
  appBottomMenu: tools.readFile( 'views/app-bottom-menu.html' ),
  logoImage: '/files/images/note-no-shadow.svg',
};

/* GET users listing. */
router.get( '/', function ( req, res, next ) {

  // render user.html using view obj
  res.render( 'user', view );
} );

module.exports = router;
