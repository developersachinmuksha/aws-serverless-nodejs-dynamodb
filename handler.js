'use strict';
const serverless = require('serverless-http');
const express = require('express');
const app = express();

var dynamo = require("dynamodb");

const Joi = require('joi');
dynamo.AWS.config.update({
    accessKeyId: 'XXXXXXXXXXXXXXXXXXXXX',
    secretAccessKey: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    region: 'XXXXXXXXX'
});

var User = dynamo.define('User', {
    hashKey: 'email',

    // add the timestamp attributes (updatedAt, createdAt)
    timestamps: true,

    schema: {
        email: Joi.string().email(),
        name: Joi.string(),
        age: Joi.number(),
        roles: dynamo.types.stringSet(),
        settings: {
            nickname: Joi.string(),
            acceptedTerms: Joi.boolean().default(false)
        }
    }
});
User.config({ tableName: 'users_entity' });

dynamo.createTables(function(err) {
    if (err) {
        console.log('Error creating tables: ', err);
    } else {
        console.log('Tables has been created');
    }
});

app.get('/create-user', (req, res) => {
    User.create({ email: 'abc@example.com', name: 'Foo Bar', age: 21 }, function(err, createdUser) {
        if (err) return res.json({
            success: false,
            error: err
        });
        else {
            console.log('created user in DynamoDB', createdUser.get('email'));
            return res.json({
                success: true,
                response: createdUser
            });
        }
    });
})

app.get('/users', (req, res) => {
    User.scan().loadAll().exec((err, results) => {
        if (err) return res.json({
            success: true,
            error: err
        });
        else {
            return res.json({
                success: true,
                response: results
            });
        }
    });
})

module.exports.hello = serverless(app);
module.exports = app;