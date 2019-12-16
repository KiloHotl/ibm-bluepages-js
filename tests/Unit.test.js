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
  
  test('the result is the primary user ID of the employee', async () => {
    mockApiRequest();
    const data = await bluePages.getPrimaryUserIdByW3ID('joe.doe@ibm.com');

    return expect(data).toBe('joe.doe');
  });
  
test('the employee exists', async () => {
    mockApiRequest();
    const success = await bluePages.employeeExists('joe.doe@ibm.com');

    return expect(success).toBe(true);
});
  
// TODO: Authenticate, getDirectReports & getDirectAndIndirectReports ...
