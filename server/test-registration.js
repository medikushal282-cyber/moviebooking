// Test registration endpoint
// Run with: node test-registration.js

require('dotenv').config();

async function testRegistration() {
    console.log('Testing registration endpoint...\n');

    const testUser = {
        name: 'Test User',
        email: 'testuser' + Date.now() + '@example.com', // Unique email
        password: 'test123'
    };

    console.log('Registering user:', testUser.email);

    try {
        const response = await fetch('http://localhost:5000/api/v1/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testUser)
        });

        const data = await response.json();

        console.log('\n--- Response ---');
        console.log('Status:', response.status);
        console.log('Success:', data.success);
        console.log('Message:', data.message);
        console.log('Email:', data.email);

        if (!data.success) {
            console.log('\n❌ Registration failed!');
            console.log('Error:', data.error);
            if (data.details) {
                console.log('Details:', data.details);
            }
        } else {
            console.log('\n✅ Registration successful!');
            console.log('Check email:', data.email, 'for OTP');
        }

    } catch (error) {
        console.error('\n❌ Request failed:', error.message);
    }
}

testRegistration();
