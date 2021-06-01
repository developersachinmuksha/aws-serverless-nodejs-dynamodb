const { expect, should } = require('chai');
const assert = require('assert');
var chai = require('chai');
var chaiHttp = require('chai-http');
const app = require("../handler");

chai.use(chaiHttp);

var requester = chai.request(app).keepOpen();

describe('User APIs Tests', () => {
    it('Get users', () => {
        requester.get('/users').end(function(err, res) {
            console.log(res.body);
            expect(res).to.have.status(200);
            expect(res.body.success).to.equal(true);
        });
    });

    it('Create user', () => {
        requester.get('/create-user').end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body.success).to.equal(true);
        });
    });
});