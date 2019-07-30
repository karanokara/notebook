var express = require('express');
var router = express.Router();
var tool = require('../tool');

var view = {
  siteTitle: 'Notebook - User Notes',
  bodyClasses: 'user',
  username: 'HappyTester',
  userSettingBtnImage: '/files/images/user-setting.svg',
  noteSettingBtnImage: '/files/images/note-setting.svg',
  noteExpand: tool.readFile('public/images/arrow-down-s.svg'),
  appBottomMenu: tool.readFile('views/app-bottom-menu.html'),
  logoImage: '/files/images/note-no-shadow.svg',
};

/* GET users listing. */
router.get('/', function (req, res, next) {
  var userFile = 'user';

  view.body = tool.render('user', view);
  view.userData = tool.fetchNoteData(userFile);

  // render index.html using view obj
  res.render('index', view);
});

module.exports = router;
