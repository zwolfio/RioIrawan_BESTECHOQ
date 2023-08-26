const config = require(`${__config_dir}/app.config.json`);
const { debug } = config;
const mysql = new(require(`${__class_dir}/mariadb.class.js`))(config.db);
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');



class _auth {
    register(data) {
        // Validate data
        const schema = Joi.object({
            username: Joi.string().required(),
            password: Joi.string().required()
        }).options({
            abortEarly: false
        });
        const validation = schema.validate(data);
        if (validation.error) {
            const errorDetails = validation.error.details.map(detail => detail.message);
            return {
                status: false,
                code: 422,
                error: errorDetails.join(', ')
            };
        }

        // Hash password
        const hashedPassword = bcrypt.hashSync(data.password, 10);

        // Insert user into database
        const sql = {
            query: `INSERT INTO users (username, password) VALUES (?, ?)`,
            params: [data.username, hashedPassword]
        };

        return mysql.query(sql.query, sql.params)
            .then(data => {
                return {
                    status: true,
                    data
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
    };


    login(data) {
        // Validate data
        const schema = Joi.object({
            username: Joi.string().required(),
            password: Joi.string().required()
        }).options({
            abortEarly: false
        });
        const validation = schema.validate(data);
        if (validation.error) {
            const errorDetails = validation.error.details.map(detail => detail.message);
            return {
                status: false,
                code: 422,
                error: errorDetails.join(', ')
            };
        }

        const sql = {
            query: `SELECT id, password FROM users WHERE username = ?`,
            params: [data.username]
        };

        return mysql.query(sql.query, sql.params)
            .then(data => {
                const token = jwt.sign({ id: data[0].id, username: data[0].username }, 'aaa', { expiresIn: '1d' });
                return {
                    status: true,
                    data,
                    token: token
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
}

module.exports = new _auth();