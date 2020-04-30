const puppeteer = require('puppeteer');
const utils = require('./test-utils');
const init = require('./test-init');
const { Cluster } = require('puppeteer-cluster');

require('should');

// user credentials
const email = utils.generateRandomBusinessEmail();
const password = '1234567890';

describe('Status Page', () => {
    const operationTimeOut = 500000;

    let cluster;
    beforeAll(async () => {
        jest.setTimeout(360000);

        cluster = await Cluster.launch({
            concurrency: Cluster.CONCURRENCY_PAGE,
            puppeteerOptions: utils.puppeteerLaunchConfig,
            puppeteer,
            timeout: 500000,
        });

        cluster.on('error', err => {
            throw err;
        });

        await cluster.execute({ email, password }, async ({ page, data }) => {
            const user = {
                email: data.email,
                password: data.password,
            };
            // user
            await init.registerUser(user, page);
            await init.loginUser(user, page);
        });
    });

    afterAll(async done => {
        await cluster.idle();
        await cluster.close();
        done();
    });

    test(
        'should create a domain',
        async () => {
            await cluster.execute(null, async ({ page }) => {
                await init.addDomainToStatusPage(page);
                // if domain was not added sucessfully, list will be undefined
                // it will timeout
                const list = await page.waitForSelector(
                    'fieldset[name="added-domain"]',
                    { visible: true }
                );
                expect(list).toBeTruthy();
            });
        },
        operationTimeOut
    );

    test(
        'should not verify a domain when txt record does not match token',
        async () => {
            await cluster.execute(null, async ({ page }) => {
                await page.goto(utils.DASHBOARD_URL);
                await page.$eval('#statusPages > a', elem => elem.click());
                // select the first item from the table row
                const rowItem = await page.waitForSelector(
                    '#statusPagesListContainer > tr',
                    { visible: true }
                );
                rowItem.click();
                await page.waitForNavigation({ waitUntil: 'networkidle0' });
                await page.waitForSelector('#btnVerifyDomain');
                await page.click('#btnVerifyDomain');

                await page.waitForSelector('#confirmVerifyDomain');
                await page.click('#confirmVerifyDomain');
                // element will be visible once the domain was not verified
                const elem = await page.waitForSelector('#verifyDomainError', {
                    visible: true,
                });
                expect(elem).toBeTruthy();
            });
        },
        operationTimeOut
    );

    test(
        'should not have option of deleting a domain, if there is only one domain in the status page',
        async () => {
            await cluster.execute(null, async ({ page }) => {
                await page.reload({ waitUntil: 'networkidle0' });
                let elem = await page.$('.btnDeleteDomain');
                expect(elem).toBeNull();
            });
        },
        operationTimeOut
    );

    test(
        'should delete a domain in a status page',
        async () => {
            await cluster.execute(null, async ({ page }) => {
                await page.goto(utils.DASHBOARD_URL);
                await page.$eval('#statusPages > a', elem => elem.click());
                // select the first item from the table row
                const rowItem = await page.waitForSelector(
                    '#statusPagesListContainer > tr',
                    { visible: true }
                );
                rowItem.click();
                await page.waitForNavigation({ waitUntil: 'networkidle0' });

                //Get the initial length of domains
                let initialLength = await page.$$eval(
                    'fieldset[name="added-domain"]',
                    domains => domains.length
                );

                // create one more domain on the status page
                await page.waitForSelector('#addMoreDomain');
                await page.click('#addMoreDomain');
                await page.waitForSelector('#domain', { visible: true });
                await page.type('#domain', 'app.fyipeapp.com');
                await page.click('#btnAddDomain');
                await page.reload({ waitUntil: 'networkidle0' });

                await page.$eval('.btnDeleteDomain', elem => elem.click());
                await page.$eval('#confirmDomainDelete', elem => elem.click());

                await page.reload({ waitUntil: 'networkidle0' });
                // get the final length of domains after deleting
                let finalLength = await page.$$eval(
                    'fieldset[name="added-domain"]',
                    domains => domains.length
                );

                expect(finalLength).toEqual(initialLength);
            });
        },
        operationTimeOut
    );

    test(
        'should cancel deleting of a domain in a status page',
        async () => {
            await cluster.execute(null, async ({ page }) => {
                await page.goto(utils.DASHBOARD_URL);
                await page.$eval('#statusPages > a', elem => elem.click());
                // select the first item from the table row
                const rowItem = await page.waitForSelector(
                    '#statusPagesListContainer > tr',
                    { visible: true }
                );
                rowItem.click();
                await page.waitForNavigation({ waitUntil: 'networkidle0' });

                //Get the initial length of domains
                let initialLength = await page.$$eval(
                    'fieldset[name="added-domain"]',
                    domains => domains.length
                );

                // create one more domain on the status page
                await page.waitForSelector('#addMoreDomain');
                await page.click('#addMoreDomain');
                await page.waitForSelector('#domain', { visible: true });
                await page.type('#domain', 'app.fyipeapp.com');
                await page.click('#btnAddDomain');
                await page.reload({ waitUntil: 'networkidle0' });

                await page.$eval('.btnDeleteDomain', elem => elem.click());
                await page.$eval('#cancelDomainDelete', elem => elem.click());

                await page.reload({ waitUntil: 'networkidle0' });
                // get the final length of domains after cancelling
                let finalLength = await page.$$eval(
                    'fieldset[name="added-domain"]',
                    domains => domains.length
                );

                expect(finalLength).toBeGreaterThan(initialLength);
            });
        },
        operationTimeOut
    );
});
