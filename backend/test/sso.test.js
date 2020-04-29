/* eslint-disable no-undef */

process.env.PORT = 3020;
const expect = require('chai').expect;
const userData = require('./data/user');
const chai = require('chai');
chai.use(require('chai-http'));
const app = require('../server');

const request = chai.request.agent(app);
const { createUser } = require('./utils/userSignUp');
const plans = require('../backend/config/plans').getPlans();
const log = require('./data/log');
const UserService = require('../backend/services/userService');
const AirtableService = require('../backend/services/airtableService');
const GlobalConfig = require('./utils/globalConfig');
const VerificationTokenModel = require('../backend/models/verificationToken');

let token, userId, airtableId;

describe('SSO API', function () {
    this.timeout(300000);

    before(function (done) {
        this.timeout(40000);
        GlobalConfig.initTestConfig().then(function () {
            createUser(request, userData.adminUser, function (err, res) {
                userId = res.body.id;
                airtableId = res.body.airtableId;

                VerificationTokenModel.findOne({ userId }, function (
                    err,
                    verificationToken
                ) {
                    request
                        .get(`/user/confirmation/${verificationToken.token}`)
                        .redirects(0)
                        .end(function () {
                            request
                                .post('/user/login')
                                .send({
                                    email: userData.adminUser.email,
                                    password: userData.adminUser.password,
                                })
                                .end(function (err, res) {
                                    token = res.body.tokens.jwtAccessToken;
                                    UserService.updateBy(
                                        { _id: userId },
                                        { role: 'master-admin' }
                                    ).then(function () {
                                        done();
                                    });
                                });
                        });
                });
            });
        });
    });

    after(async function () {
        await GlobalConfig.removeTestConfig();
        await UserService.hardDeleteBy({
            email: {
                $in: [
                    userData.user.email,
                    userData.newUser.email,
                    userData.anotherUser.email,
                ],
            },
        });
        await AirtableService.deleteUser(airtableId);
    });

    describe('should reject request of an unauthenticated user', function () {
        it('should reject GET requests', function (done) {
            request.get('/sso')
                .end(function (err, res) {
                    expect(res).to.have.status(401);
                    done();
                })
        })
        it('should reject POST requests', function (done) {
            request.post('/sso')
                .end(function (err, res) {
                    expect(res).to.have.status(401);
                    done();
                })
        })
        it('should reject PUT requests', function (done) {
            request.put('/sso/5ea951228877984ea9f47660')
                .end(function (err, res) {
                    expect(res).to.have.status(401);
                    done();
                })
        })
        it('should reject DELETE requests', function (done) {
            request.delete('/sso/5ea951228877984ea9f47660')
                .end(function (err, res) {
                    expect(res).to.have.status(401);
                    done();
                })
        })
    })

    describe('GET /sso/', function () {
        it('should return SSOs list with count', function (done) {
            const authorization = `Basic ${token}`;
            request.get('/sso')
                .set('Authorization', authorization)
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('data');
                    expect(res.body).to.have.property('count');
                    done();
                })
        })
        it('should return SSOs list with count, skip and limit (when skip&limit specified)', function (done) {
            const authorization = `Basic ${token}`;
            request.get('/sso?limit=10&skip=0')
                .set('Authorization', authorization)
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('data');
                    expect(res.body).to.have.property('count');
                    expect(res.body).to.have.property('limit');
                    expect(res.body).to.have.property('skip');
                    done();
                })
        })
    })
    describe('POST /sso', function () {

        it('should create a new SSO', function (done) {
            const authorization = `Basic ${token}`;
            request.post('/sso')
                .set('Authorization', authorization)
                .send({
                    "saml-enable":true,
                    domain:"hackerbay.com",
                    samlSsoUrl:"hackerbat.com/login",
                    certificateFingerprint:"azertyuiop",
                    remoteLogoutUrl:"hackerbay.com/logout",
                    ipRanges:"127.0.0.1",
                })
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('object');
                    done();
                })
        })

        it('should not create a new SSO if domaine is not defined', function (done) {
            const authorization = `Basic ${token}`;
            request.post('/sso')
                .set('Authorization', authorization)
                .send({
                    "saml-enable":true,
                    samlSsoUrl:"hackerbat.com/login",
                    certificateFingerprint:"azertyuiop",
                    remoteLogoutUrl:"hackerbay.com/logout",
                    ipRanges:"127.0.0.1",
                })
                .end(function (err, res) {
                    expect(res).to.have.status(400);
                    expect(res.body).to.be.an('object');
                    done();
                })
        })

    });
});
