const express = require('express');
const router = express.Router();
const helper = require(__class_dir + '/helper.class.js');
const m$task = require(__module_dir + '/task.module.js');
const verifyToken = require('../../../middleware/verify');


router.post('/', verifyToken.isAuth, async(req, res, next) => {
    const addTask = await m$task.add(req.body)
    helper.sendResponse(res, addTask);
});

router.get('/get', verifyToken.isAuth, (req, res) => {
    m$task.getAllTasks()
        .then(result => {
            if (result.status) {
                const tasks = result.data;
                console.log('All tasks:', tasks);
                helper.sendResponse(res, tasks);
            } else {
                console.error('Error:', result.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

router.delete('/:id', verifyToken.isAuth, async function(req, res, next) {
    try {
        const taskId = req.params.id;
        const deleteResult = await m$task.deleteTask(taskId);
        helper.sendResponse(res, deleteResult);
    } catch (error) {
        console.error('Error:', error);
        helper.sendResponse(res, {
            status: false,
            error: 'An error occurred during deletion'
        });
    }
});

module.exports = router;