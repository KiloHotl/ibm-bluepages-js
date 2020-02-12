const nock = require('nock');

const bluePages = require('../Bluepages');
const json = require('./mocks/dummy.json');

function mockApiRequest() {
    nock('https://bluepages.ibm.com/BpHttpApisv3') // API HTTP Mocking
        .get('/slaphapi?ibmperson/mail=joe.doe@ibm.com.list/byjson')
        .reply(200, json);
}

test('the result is the full name of the employee', async () => {
    mockApiRequest();
    const data = await bluePages.getNameByW3ID('joe.doe@ibm.com');

	return expect(data).toBe('Joe Doe');
});

test('the result is an object containing employee information', async () => {
    mockApiRequest();
    const data = await bluePages.getEmployeeInfoByW3ID('joe.doe@ibm.com');

    return expect(data).toBeDefined();
});

test('the result is an object containing employee location', async () => {
    mockApiRequest();
    const data = await bluePages.getEmployeeLocationByW3ID('joe.doe@ibm.com');

    return expect(data).toBeDefined();
});

test('the result is an object containing employee mobile', async () => {
    mockApiRequest();
    const data = await bluePages.getEmployeeMobileByW3ID('joe.doe@ibm.com');

    return expect(data).toBe('notarealnumber');
});

test('the result is an object containing employee location including the office', async () => {
    mockApiRequest();
    const data = await bluePages.getEmployeeLocationByW3ID('joe.doe@ibm.com');

    return expect(data).toHaveProperty('workLocation');
});

test('the employee exists', async () => {
    mockApiRequest();
    const success = await bluePages.employeeExists('joe.doe@ibm.com');

    return expect(success).toBe(true);
});

// Requires real W3IDs because long run LDAP search call
test('the result is an object containing employee global manager', async () => {
    const data = await bluePages.getGlobalManagerUIDByW3ID('rod.anami@br.ibm.com');
    return expect(data).toBeDefined();
});
// Requires real Serial Numbers because long run LDAP search call
test('the result is an object containing employee info', async () => {
    const data = await bluePages.getEmployeeInfoByUID('092121631');
    return expect(data).toBeDefined();
});


// TODO: Authenticate, getDirectReports & getDirectAndIndirectReports ...
