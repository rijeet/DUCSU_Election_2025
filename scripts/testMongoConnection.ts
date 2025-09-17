import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const MONGODB_DB = process.env.MONGODB_DB || 'ducsu';

async function testConnection() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    console.log(`URI: ${MONGODB_URI}`);
    console.log(`Database: ${MONGODB_DB}`);
    
    await mongoose.connect(MONGODB_URI, { 
      dbName: MONGODB_DB,
      serverSelectionTimeoutMS: 5000
    });
    
    console.log('✅ Successfully connected to MongoDB!');
    
    // Test database operations
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not established');
    }
    
    const collections = await db.listCollections().toArray();
    console.log(`📊 Collections in '${MONGODB_DB}' database:`, collections.map(c => c.name));
    
    // Test creating a test collection
    const testCollection = db.collection('test_connection');
    await testCollection.insertOne({ 
      test: true, 
      timestamp: new Date(),
      message: 'DUCSU Election Database Connection Test'
    });
    
    const testDoc = await testCollection.findOne({ test: true });
    console.log('✅ Test document created and retrieved:', testDoc);
    
    // Clean up test document
    await testCollection.deleteOne({ test: true });
    console.log('🧹 Test document cleaned up');
    
    console.log('🎉 Database connection test completed successfully!');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

testConnection();
