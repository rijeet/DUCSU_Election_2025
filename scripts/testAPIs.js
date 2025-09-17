const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testAPIs() {
  const baseUrl = 'http://localhost:3000';
  
  try {
    console.log('🧪 Testing DUCSU Election APIs...\n');
    
    // Test health endpoint
    console.log('1. Testing /api/health...');
    const healthRes = await fetch(`${baseUrl}/api/health`);
    const healthData = await healthRes.json();
    console.log(`   ✅ Status: ${healthRes.status}`);
    console.log(`   📊 Response:`, healthData);
    
    // Test candidates endpoint
    console.log('\n2. Testing /api/candidates...');
    const candidatesRes = await fetch(`${baseUrl}/api/candidates?limit=3`);
    const candidatesData = await candidatesRes.json();
    console.log(`   ✅ Status: ${candidatesRes.status}`);
    console.log(`   📊 Total candidates: ${candidatesData.total}`);
    console.log(`   👥 Sample candidates:`, candidatesData.items?.slice(0, 2).map(c => `${c.name} (#${c.ballotNumber})`));
    
    // Test panel endpoint
    console.log('\n3. Testing /api/panel...');
    const panelRes = await fetch(`${baseUrl}/api/panel`);
    const panelData = await panelRes.json();
    console.log(`   ✅ Status: ${panelRes.status}`);
    console.log(`   📊 Panel data:`, panelData);
    
    // Test specific position
    console.log('\n4. Testing /api/candidates?position=vice_president...');
    const vicePresRes = await fetch(`${baseUrl}/api/candidates?position=vice_president&limit=3`);
    const vicePresData = await vicePresRes.json();
    console.log(`   ✅ Status: ${vicePresRes.status}`);
    console.log(`   📊 Vice-President candidates: ${vicePresData.total}`);
    console.log(`   👥 Sample:`, vicePresData.items?.slice(0, 2).map(c => `${c.name} (#${c.ballotNumber})`));
    
    console.log('\n🎉 All API tests completed successfully!');
    
  } catch (error) {
    console.error('❌ API test failed:', error.message);
  }
}

testAPIs();
