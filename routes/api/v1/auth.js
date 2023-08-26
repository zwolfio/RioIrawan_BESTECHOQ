const express = require('express');
const router = express.Router();
const helper = require(__class_dir + '/helper.class.js');
const m$auth = require(__module_dir + '/auth.module.js');

router.post('/register', async function(req, res, next) {
    const registerResult = await m$auth.register(req.body);
    helper.sendResponse(res, registerResult);
});

router.post('/login', async function(req, res, next) {
    const loginResult = await m$auth.login(req.body);
    helper.sendResponse(res, loginResult);
});

module.exports = router;