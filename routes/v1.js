const express 			= require('express');
const router 			= express.Router();

const UserController 	= require('../controllers/user.controller');
const AdminController = require('../controllers/admin.controller')
const HomeController 	= require('../controllers/home.controller');

const custom 	        = require('./../middleware/custom');

const passport      	= require('passport');
const path              = require('path');


require('./../middleware/passport')(passport)
/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({status:"success", message:"Parcel Pending APIS", data:{"version_number":"v1.0.0"}})
});


router.post(    '/users',           passport.authenticate('jwt', {session:false}), UserController.create);                                                    // C
router.get(     '/users',           passport.authenticate('jwt', {session:false}), UserController.get);        // R
router.get(     '/admin/user/:uid',  passport.authenticate('jwt', {session:false}), custom.user, UserController.get);        // R
router.get(     '/user/:uid',  passport.authenticate('user-jwt', {session:false}), custom.user, UserController.get);        // R
router.put(     '/users',           passport.authenticate('jwt', {session:false}), UserController.update);     // U
router.delete(  '/users',           passport.authenticate('jwt', {session:false}), UserController.remove);     // D
router.post(    '/users/login',     UserController.login);



router.post(    '/admins',           AdminController.create);                                                    // C
router.get(     '/admins',           passport.authenticate('jwt', {session:false}), AdminController.get);        // R
router.put(     '/admins',           passport.authenticate('jwt', {session:false}), AdminController.update);     // U
router.delete(  '/admins',           passport.authenticate('jwt', {session:false}), AdminController.remove);     // D
router.post(    '/admins/login',     AdminController.login);            // R


router.get('/dash', passport.authenticate('jwt', {session:false}),HomeController.Dashboard)


//********* API DOCUMENTATION **********
router.use('/docs/api.json',            express.static(path.join(__dirname, '/../public/v1/documentation/api.json')));
router.use('/docs',                     express.static(path.join(__dirname, '/../public/v1/documentation/dist')));
module.exports = router;
