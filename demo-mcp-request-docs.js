#!/usr/bin/env node

/**
 * Demo requesting missing documentation via MCP server
 */

const { spawn } = require('child_process');
const readline = require('readline');

async function requestDocumentation(topic, reason) {
  return new Promise((resolve) => {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`📝 Requesting Documentation: "${topic}"`);
    console.log('='.repeat(80));

    const server = spawn('node', ['mcp-server.js']);
    let requestId = 1;
    const responses = [];

    const rl = readline.createInterface({
      input: server.stdout,
      terminal: false
    });

    rl.on('line', (line) => {
      try {
        responses.push(JSON.parse(line));
      } catch (error) {
        // Ignore
      }
    });

    // Initialize
    server.stdin.write(JSON.stringify({
      jsonrpc: '2.0',
      id: requestId++,
      method: 'initialize',
      params: { protocolVersion: '1.0.0', clientInfo: { name: 'demo', version: '1.0.0' } }
    }) + '\n');

    // Request documentation
    setTimeout(() => {
      server.stdin.write(JSON.stringify({
        jsonrpc: '2.0',
        id: requestId++,
        method: 'tools/call',
        params: {
          name: 'request_documentation',
          arguments: { topic, reason, priority: 'high' }
        }
      }) + '\n');
    }, 500);

    // Get metrics
    setTimeout(() => {
      server.stdin.write(JSON.stringify({
        jsonrpc: '2.0',
        id: requestId++,
        method: 'metrics/get',
        params: {}
      }) + '\n');
    }, 1000);

    // Cleanup
    setTimeout(() => {
      server.kill();

      const docResponse = responses.find(r => r.id === 2);
      const metricsResponse = responses.find(r => r.id === 3);

      if (docResponse?.result?.content) {
        console.log('\n✅ ' + docResponse.result.content[0].text.split('\n')[0]);
      }

      if (metricsResponse?.result) {
        console.log('\n📊 Current Metrics:');
        console.log(`   - Total queries: ${metricsResponse.result.totalQueries}`);
        console.log(`   - Missing doc requests: ${metricsResponse.result.missingDocRequests.length}`);
        if (metricsResponse.result.missingDocRequests.length > 0) {
          console.log('\n📋 Documentation Queue:');
          metricsResponse.result.missingDocRequests.forEach((req, i) => {
            console.log(`   ${i + 1}. [${req.priority.toUpperCase()}] ${req.topic}`);
            console.log(`      Reason: ${req.reason}`);
          });
        }
      }

      resolve();
    }, 2000);
  });
}

async function main() {
  await requestDocumentation(
    'Agent Architecture and Communication Patterns',
    'Need detailed documentation on how agents communicate and coordinate'
  );

  await requestDocumentation(
    'Performance Optimization Strategies',
    'Users need guidance on optimizing wiki generation for large repositories'
  );

  console.log('\n✅ Demo complete!\n');
}

main().catch(console.error);
