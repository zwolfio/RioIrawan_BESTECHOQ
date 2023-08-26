const config = require(`${__config_dir}/app.config.json`);
const { debug } = config;
const mysql = new(require(`${__class_dir}/mariadb.class.js`))(config.db);
const Joi = require('joi');

class _task {
    add(data) {

        // Validate data
        const schema = Joi.object({
            item: Joi.string()
        }).options({
            abortEarly: false
        })
        const validation = schema.validate(data)
        if (validation.error) {
            const errorDetails = validation.error.details.map((detail) => {
                detail.message
            })

            return {
                status: false,
                code: 422,
                error: errorDetails.join(', ')
            }
        }

        // Insert data to database
        const sql = {
            query: `INSERT INTO task (items) VALUES (?)`,
            params: [data.item]
        }

        return mysql.query(sql.query, sql.params)
            .then(data => {
                return {
                    status: true,
                    data: data
                }
            })
            .catch(error => {
                if (debug) {
                    console.error('add task Error: ', error)
                }

                return {
                    status: false,
                    error
                }
            })
    }
    getAllTasks() {
        // Query to get all tasks
        const sql = {
            query: `SELECT * FROM task`
        };

        return mysql.query(sql.query)
            .then(data => {
                return {
                    status: true,
                    data
                };
            })
            .catch(error => {
                if (debug) {
                    console.error('get all tasks Error: ', error);
                }

                return {
                    status: false,
                    error
                };
            });
    }
    deleteTask(taskId) {
        const sql = {
            query: `DELETE FROM task WHERE id = ?`,
            params: [taskId]
        };

        return mysql.query(sql.query, sql.params)
            .then(data => {
                return {
                    status: true,
                    message: 'Task deleted successfully',
                    data
                };
            })
            .catch(error => {
                if (debug) {
                    console.error('get all tasks Error: ', error);
                }

                return {
                    status: false,
                    error: 'An error occurred during deletion'
                };
            });
    }
}

module.exports = new _task();