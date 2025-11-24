#!/usr/bin/env node

/**
 * Demo script showing MCP server in action
 */

const { spawn } = require('child_process');
const readline = require('readline');

async function queryMCPServer(query) {
  return new Promise((resolve, reject) => {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`🔍 Querying MCP Server: "${query}"`);
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
        const response = JSON.parse(line);
        responses.push(response);
      } catch (error) {
        // Ignore non-JSON output
      }
    });

    server.stderr.on('data', (data) => {
      // Server logs go to stderr
    });

    // Send initialize
    server.stdin.write(JSON.stringify({
      jsonrpc: '2.0',
      id: requestId++,
      method: 'initialize',
      params: { protocolVersion: '1.0.0', clientInfo: { name: 'demo', version: '1.0.0' } }
    }) + '\n');

    // Wait a bit, then send query
    setTimeout(() => {
      server.stdin.write(JSON.stringify({
        jsonrpc: '2.0',
        id: requestId++,
        method: 'tools/call',
        params: {
          name: 'query_wiki',
          arguments: { query, maxResults: 5 }
        }
      }) + '\n');
    }, 500);

    // Wait for responses and cleanup
    setTimeout(() => {
      server.kill();

      // Find the query response
      const queryResponse = responses.find(r => r.id === 2 && r.result);

      if (queryResponse && queryResponse.result.content) {
        console.log('\n📄 Response:\n');
        console.log(queryResponse.result.content[0].text);
      } else {
        console.log('\n❌ No response received');
      }

      resolve();
    }, 2000);
  });
}

async function main() {
  // Demo queries
  await queryMCPServer('How do I generate wiki documentation?');
  await queryMCPServer('What agents are available and what do they do?');
  await queryMCPServer('How does the cross-page linking system work?');

  console.log('\n✅ Demo complete!\n');
}

main().catch(console.error);
