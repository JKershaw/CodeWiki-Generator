#!/usr/bin/env node

/**
 * MongoDB Setup Test Script
 *
 * This script tests whether MongoDB can be used in the current environment.
 * It checks for:
 * 1. Local MongoDB installation
 * 2. Docker availability
 * 3. Connection to external MongoDB (if connection string provided)
 */

const { execSync, exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

// Results summary
const results = {
  localMongoDB: false,
  docker: false,
  mongodbPackage: false,
  externalConnection: false,
  recommendation: ''
};

async function checkLocalMongoDB() {
  console.log('\n=== Checking Local MongoDB Installation ===');

  try {
    execSync('which mongod', { stdio: 'pipe' });
    console.log('✓ mongod found');
    results.localMongoDB = true;
  } catch {
    console.log('✗ mongod not installed');
  }

  try {
    execSync('which mongosh || which mongo', { stdio: 'pipe' });
    console.log('✓ MongoDB client found');
  } catch {
    console.log('✗ MongoDB client not installed');
  }

  // Check if MongoDB service is running
  try {
    execSync('pgrep mongod', { stdio: 'pipe' });
    console.log('✓ MongoDB service is running');
  } catch {
    console.log('✗ MongoDB service not running');
  }
}

async function checkDocker() {
  console.log('\n=== Checking Docker Availability ===');

  try {
    execSync('which docker', { stdio: 'pipe' });
    console.log('✓ Docker installed');

    try {
      execSync('docker ps', { stdio: 'pipe' });
      console.log('✓ Docker daemon accessible');
      results.docker = true;
    } catch {
      console.log('✗ Docker daemon not accessible');
    }
  } catch {
    console.log('✗ Docker not installed');
  }
}

async function checkMongoDBPackage() {
  console.log('\n=== Checking MongoDB Node.js Package ===');

  try {
    require('mongodb');
    console.log('✓ mongodb package is installed');
    results.mongodbPackage = true;
    return true;
  } catch {
    console.log('✗ mongodb package not installed');
    console.log('  Installing mongodb package...');

    try {
      execSync('npm install mongodb --save', { stdio: 'pipe', cwd: process.cwd() });
      console.log('✓ mongodb package installed successfully');
      results.mongodbPackage = true;
      return true;
    } catch (e) {
      console.log('✗ Failed to install mongodb package:', e.message);
      return false;
    }
  }
}

async function testExternalConnection(connectionString) {
  console.log('\n=== Testing External MongoDB Connection ===');

  if (!connectionString) {
    console.log('No connection string provided.');
    console.log('To test external MongoDB, run:');
    console.log('  MONGODB_URI="mongodb+srv://..." node mongodb-setup-test.js');
    return;
  }

  try {
    // Dynamic require after potential installation
    const { MongoClient } = require('mongodb');

    console.log('Attempting connection to external MongoDB...');
    const client = new MongoClient(connectionString, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000
    });

    await client.connect();
    console.log('✓ Successfully connected to external MongoDB!');

    // Test basic operations
    const adminDb = client.db('admin');
    const serverStatus = await adminDb.command({ ping: 1 });
    console.log('✓ Server ping successful:', serverStatus);

    // List databases
    const dbList = await client.db().admin().listDatabases();
    console.log('✓ Available databases:', dbList.databases.map(d => d.name).join(', '));

    await client.close();
    console.log('✓ Connection closed cleanly');

    results.externalConnection = true;
  } catch (error) {
    console.log('✗ External connection failed:', error.message);
  }
}

async function testLocalConnection() {
  console.log('\n=== Testing Local MongoDB Connection ===');

  try {
    const { MongoClient } = require('mongodb');

    console.log('Attempting connection to localhost:27017...');
    const client = new MongoClient('mongodb://localhost:27017', {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000
    });

    await client.connect();
    console.log('✓ Connected to local MongoDB!');
    await client.close();
    results.localMongoDB = true;
  } catch (error) {
    console.log('✗ Local connection failed:', error.message);
  }
}

function printSummary() {
  console.log('\n' + '='.repeat(50));
  console.log('SUMMARY');
  console.log('='.repeat(50));

  console.log(`Local MongoDB: ${results.localMongoDB ? '✓ Available' : '✗ Not available'}`);
  console.log(`Docker: ${results.docker ? '✓ Available' : '✗ Not available'}`);
  console.log(`MongoDB Package: ${results.mongodbPackage ? '✓ Installed' : '✗ Not installed'}`);
  console.log(`External Connection: ${results.externalConnection ? '✓ Working' : '✗ Not tested/failed'}`);

  console.log('\n' + '='.repeat(50));
  console.log('RECOMMENDATION');
  console.log('='.repeat(50));

  if (results.localMongoDB) {
    console.log('✓ Local MongoDB is available. You can use it directly.');
  } else if (results.docker) {
    console.log('Docker is available. You can run MongoDB with:');
    console.log('  docker run -d -p 27017:27017 --name mongodb mongo:latest');
  } else {
    console.log('Neither local MongoDB nor Docker is available.');
    console.log('\nRECOMMENDED: Use an external MongoDB provider:');
    console.log('');
    console.log('1. MongoDB Atlas (Free tier available):');
    console.log('   - Visit: https://www.mongodb.com/atlas');
    console.log('   - Create free M0 cluster');
    console.log('   - Get connection string');
    console.log('   - Set MONGODB_URI environment variable');
    console.log('');
    console.log('2. Other providers:');
    console.log('   - Railway.app (MongoDB addon)');
    console.log('   - Render.com');
    console.log('   - DigitalOcean Managed MongoDB');
    console.log('');
    console.log('Example usage with connection string:');
    console.log('  MONGODB_URI="mongodb+srv://user:pass@cluster.mongodb.net/dbname" node your-app.js');
  }
}

async function main() {
  console.log('MongoDB Setup Test');
  console.log('==================');
  console.log('Environment:', process.platform, process.arch);
  console.log('Node.js:', process.version);

  await checkLocalMongoDB();
  await checkDocker();

  const packageInstalled = await checkMongoDBPackage();

  if (packageInstalled) {
    await testLocalConnection();

    const connectionString = process.env.MONGODB_URI || process.env.MONGO_URI;
    await testExternalConnection(connectionString);
  }

  printSummary();
}

main().catch(console.error);
