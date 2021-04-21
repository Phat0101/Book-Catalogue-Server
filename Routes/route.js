const {Router} = require('express');
const LoginController = require('../Controllers/loginController');
const SignupController = require('../Controllers/signupController');
const homeController = require('../Controllers/homeController');
const router = Router();

router.get('/signup', SignupController.signup_get );
router.post('/signup', SignupController.signup_post);

router.get('/login', LoginController.login_get);
router.post('/login', LoginController.login_post);
router.get('/logout', LoginController.logout_get);

router.post('/home/isbn', homeController.isbn_post);
router.post('/home/addbook', homeController.add_book_post);
router.post('/home/addcomment', homeController.add_comment_post);
router.post('/home/addgroup', homeController.add_group_post);
router.post('/home/history', homeController.update_history);
router.post('/home/delete', homeController.delete_book_post);

module.exports = router;