const dns = require('dns');

const connectionString = "mongodb+srv://shedy:uZbjMO3V25csNBoA@modellibrary.isg8bsq.mongodb.net/";
// Extract hostname from connection string
const hostname = "modellibrary.isg8bsq.mongodb.net";
const srvRecord = `_mongodb._tcp.${hostname}`;

console.log(`Diagnostic: Checking DNS resolution for MongoDB Atlas...`);
console.log(`Target Hostname: ${hostname}`);
console.log(`SRV Record: ${srvRecord}`);

const start = Date.now();

dns.resolveSrv(srvRecord, (err, addresses) => {
    const duration = Date.now() - start;
    if (err) {
        console.error(`\n[FAILED] DNS Resolution failed after ${duration}ms`);
        console.error(`Error Code: ${err.code}`);
        console.error(`Error Message: ${err.message}`);
        
        if (err.code === 'ETIMEOUT') {
            console.log('\nAnalysis: The DNS query timed out.');
            console.log('Possible causes:');
            console.log('1. Network firewall is blocking DNS queries to external SRV records.');
            console.log('2. Local DNS server is unresponsive or filtering these requests.');
            console.log('3. Internet connectivity issues.');
        } else if (err.code === 'ENOTFOUND') {
            console.log('\nAnalysis: The domain name could not be found.');
            console.log('Possible causes:');
            console.log('1. Typo in the connection string hostname.');
            console.log('2. The MongoDB Atlas cluster has been deleted or paused.');
        }
    } else {
        console.log(`\n[SUCCESS] DNS Resolution succeeded in ${duration}ms`);
        console.log('Addresses found:', addresses);
        console.log('\nAnalysis: Your machine can successfully resolve the MongoDB address.');
        console.log('If you are still getting ETIMEOUT in your app, check:');
        console.log('1. If the application is running in a different environment (e.g., Docker container) with different network settings.');
        console.log('2. If a firewall is blocking the actual TCP connection to port 27017 after DNS resolution.');
    }
});