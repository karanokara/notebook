var express = require( 'express' );
var router = express.Router();
var tool = require( '../tool' );

var view = {
  siteTitle: 'Notebook - User Notes',
  page: 'user',
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
  noteExpand: tool.readFile( 'public/images/arrow-down-s.svg' ),
  appBottomMenu: tool.readFile( 'views/app-bottom-menu.html' ),
  logoImage: '/files/images/note-no-shadow.svg',
};

/* GET users listing. */
router.get( '/', function ( req, res, next ) {

  view.body = tool.render( 'user', view );

  // render index.html using view obj
  res.render( 'index', view );
} );

module.exports = router;
