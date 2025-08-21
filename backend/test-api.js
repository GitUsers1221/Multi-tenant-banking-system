const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const API_BASE_URL = 'http://localhost:3000/api';

async function testAPI() {
    console.log('🧪 Testing Banking Management System APIs...\n');

    const tests = [
        {
            name: 'GET /api/accounts',
            method: 'GET',
            endpoint: '/accounts'
        },
        {
            name: 'GET /api/customers',
            method: 'GET',
            endpoint: '/customers'
        },
        {
            name: 'GET /api/banks',
            method: 'GET',
            endpoint: '/banks'
        },
        {
            name: 'GET /api/loans',
            method: 'GET',
            endpoint: '/loans'
        },
        {
            name: 'GET /api/audit',
            method: 'GET',
            endpoint: '/audit'
        },
        {
            name: 'POST /api/customers',
            method: 'POST',
            endpoint: '/customers',
            body: {
                name: 'Test Customer',
                age: 30,
                gender: 'Male'
            }
        },
        {
            name: 'POST /api/accounts',
            method: 'POST',
            endpoint: '/accounts',
            body: {
                customer_id: 1,
                account_type: 'Savings',
                balance: 1000.00
            }
        },
        {
            name: 'POST /api/banks',
            method: 'POST',
            endpoint: '/banks',
            body: {
                name: 'Test Bank',
                branch: 'Main Branch',
                location: 'Test City',
                phone_number: '123-456-7890'
            }
        }
    ];

    for (const test of tests) {
        try {
            console.log(`📡 Testing: ${test.name}`);
            
            const options = {
                method: test.method,
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            if (test.body) {
                options.body = JSON.stringify(test.body);
            }

            const response = await fetch(`${API_BASE_URL}${test.endpoint}`, options);
            const data = await response.json();

            if (response.ok) {
                console.log(`✅ ${test.name} - SUCCESS`);
                console.log(`   Status: ${response.status}`);
                console.log(`   Response: ${JSON.stringify(data, null, 2)}`);
            } else {
                console.log(`❌ ${test.name} - FAILED`);
                console.log(`   Status: ${response.status}`);
                console.log(`   Error: ${JSON.stringify(data, null, 2)}`);
            }
        } catch (error) {
            console.log(`❌ ${test.name} - ERROR`);
            console.log(`   Error: ${error.message}`);
        }
        console.log('');
    }

    console.log('🎉 API testing completed!');
}

// Run the test
testAPI().catch(console.error); 