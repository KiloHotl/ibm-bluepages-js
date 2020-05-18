const fetch = require('node-fetch');

const bluePages = require('../Bluepages');
const urls = require('../URLs');

// Requires real W3IDs because long run LDAP search call
test('the result is an object containing employee global manager', async () => {
    const data = await bluePages.getGlobalManagerUIDByW3ID('rod.anami@br.ibm.com');
		//console.log(data);
    return expect(data).toEqual('022589613');
});

test('the result is the W3ID of the employee', async () => {
	const data = await bluePages.getW3IDByUID('092121631');
	const expected = ["rod.anami@br.ibm.com", "ranami@br.ibm.com"];
	return expect(data).toEqual(expect.arrayContaining(expected));
});

test('the result is an object containing employee slack information', async () => {
	const data = await bluePages.getSlackInfoByW3ID('rod.anami@br.ibm.com');
	const expected = {
		slackId: 'W3G2D4732',
		slackUser: 'rod.anami'
	};
	return expect(data).toEqual(expect.objectContaining(expected));
});

test('the result is an object containing employee conference information', async () => {
	const data = await bluePages.getConferenceInfoByW3ID('rod.anami@br.ibm.com');
	const expected = "https://ibm.webex.com/meet/rod.anami";
	return expect(data).toEqual(expected);
});

test('the result is an object containing employee information', async () => {
	const data = await bluePages.getEmployeeInfoByW3ID('rod.anami@br.ibm.com');
	return expect(data).toHaveProperty('name') &&
				 expect(data).toHaveProperty('mail') &&
				 expect(data).toHaveProperty('serialNumber');
});

test('the result is an object containing employee mobile', async () => {
	const data = await bluePages.getEmployeeMobileByW3ID('rod.anami@br.ibm.com');
	return expect(data).not.toBeNull();
});

test('the result is an object containing employee location including the office', async () => {
	const data = await bluePages.getEmployeeLocationByW3ID('rod.anami@br.ibm.com');
	return expect(data).toHaveProperty('workLocation') &&
				 expect(data).toHaveProperty('country') &&
				 expect(data).toHaveProperty('countryAlphaCode') &&
				 expect(data).toHaveProperty('employeeCountryCode');
});

test('the employee exists', async () => {
	const success = await bluePages.employeeExists('rod.anami@br.ibm.com');
	return expect(success).toBe(true);
});

test('the employee does not exists', async () => {
	const success = await bluePages.employeeExists('joe.doe@us.ibm.com');
	return expect(success).toBe(false);
});

test('the result is a URL with a employee\'s JPG profile picture', async () => {
	const data = await bluePages.getPhotoByW3ID('rod.anami@br.ibm.com');
	return expect(data).toBe('https://w3-services1.w3-969.ibm.com/myw3/unified-profile-photo/v1/image/rod.anami@br.ibm.com?def=avatar');
});

test("the direct reports are populated", async () => {
	const data = await bluePages.getDirectReportsByW3ID("rwilliams@uk.ibm.com");

	// We expect this manager to have more than 2 reports, and less than 50
	expect(data).toBeInstanceOf(Array);
	expect(data.length).toBeGreaterThan(2);
	expect(data.length).toBeLessThan(40);

	// Some sensible assertions about what fields are populated
	const report = data[2];
	expect(report).toHaveProperty("uid");
	expect(report).toHaveProperty("name");
	expect(report).toHaveProperty("mail");
});

test("the direct and indirect reports are populated",
	async () => {
		const manager = "rasayles@us.ibm.com";
		const data = await bluePages.getDirectAndIndirectReportsByW3ID(manager);

		// We expect this higher-level manager to have more than 20 reports, and less than 500
		expect(data).toBeInstanceOf(Array);
		expect(data.length).toBeGreaterThan(5); // minimum of 5 considering small teams
		expect(data.length).toBeLessThan(500);

		// This should include all the direct reports
		const directReports = await bluePages.getDirectAndIndirectReportsByW3ID(
			manager
		);
		expect(data).toEqual(expect.arrayContaining(directReports));
	},
	30 * 1000
);

test('the login is successful', async () => {
	// This is a weak test, (since we can't use a correct password) that catches compilation errors
	const success = await bluePages.authenticate("rod.anami@br.ibm.com",	"nottherightpassword");
	return expect(success).toBe(false);
});
