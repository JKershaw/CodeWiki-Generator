#!/usr/bin/env node

/**
 * Test script for MCP server
 *
 * Sends sample JSON-RPC requests to verify the server works correctly.
 */

const { spawn } = require('child_process');
const readline = require('readline');

class MCPTester {
  constructor() {
    this.requestId = 1;
    this.pendingRequests = new Map();
  }

  async test() {
    console.log('Starting MCP Server test...\n');

    // Start the MCP server
    this.server = spawn('node', ['mcp-server.js']);

    // Setup line reader for server responses
    const rl = readline.createInterface({
      input: this.server.stdout,
      terminal: false
    });

    rl.on('line', (line) => {
      try {
        const response = JSON.parse(line);
        this.handleResponse(response);
      } catch (error) {
        console.error('Failed to parse response:', line);
      }
    });

    // Log server output (stderr)
    this.server.stderr.on('data', (data) => {
      console.log(`[Server] ${data.toString().trim()}`);
    });

    // Wait for server to start
    await this.sleep(1000);

    // Run tests
    try {
      await this.testInitialize();
      await this.testToolsList();
      await this.testQueryWiki();
      await this.testRequestDocumentation();
      await this.testResourcesList();
      await this.testMetrics();

      console.log('\n✅ All tests passed!');
    } catch (error) {
      console.error('\n❌ Test failed:', error.message);
      process.exit(1);
    } finally {
      this.server.kill();
    }
  }

  async testInitialize() {
    console.log('\n--- Test: Initialize ---');
    const result = await this.sendRequest('initialize', {
      protocolVersion: '1.0.0',
      clientInfo: {
        name: 'test-client',
        version: '1.0.0'
      }
    });
    console.log('✓ Initialize response:', JSON.stringify(result, null, 2));
  }

  async testToolsList() {
    console.log('\n--- Test: List Tools ---');
    const result = await this.sendRequest('tools/list', {});
    console.log(`✓ Found ${result.tools.length} tools`);
    result.tools.forEach(tool => {
      console.log(`  - ${tool.name}: ${tool.description}`);
    });
  }

  async testQueryWiki() {
    console.log('\n--- Test: Query Wiki ---');
    const result = await this.sendRequest('tools/call', {
      name: 'query_wiki',
      arguments: {
        query: 'How do I generate wiki documentation?',
        maxResults: 3
      }
    });
    console.log('✓ Query result:', result.content[0].text.substring(0, 200) + '...');
  }

  async testRequestDocumentation() {
    console.log('\n--- Test: Request Documentation ---');
    const result = await this.sendRequest('tools/call', {
      name: 'request_documentation',
      arguments: {
        topic: 'Advanced testing strategies',
        reason: 'Need more guidance on integration tests',
        priority: 'medium'
      }
    });
    console.log('✓ Documentation request recorded');
  }

  async testResourcesList() {
    console.log('\n--- Test: List Resources ---');
    const result = await this.sendRequest('resources/list', {});
    console.log(`✓ Found ${result.resources.length} wiki resources`);
    if (result.resources.length > 0) {
      console.log(`  First resource: ${result.resources[0].name}`);
    }
  }

  async testMetrics() {
    console.log('\n--- Test: Get Metrics ---');
    const result = await this.sendRequest('metrics/get', {});
    console.log('✓ Metrics:', {
      totalQueries: result.totalQueries,
      successfulQueries: result.successfulQueries,
      failedQueries: result.failedQueries,
      missingDocRequests: result.missingDocRequests.length
    });
  }

  sendRequest(method, params) {
    return new Promise((resolve, reject) => {
      const id = this.requestId++;
      const request = {
        jsonrpc: '2.0',
        id,
        method,
        params
      };

      // Store resolver
      this.pendingRequests.set(id, { resolve, reject });

      // Send request
      this.server.stdin.write(JSON.stringify(request) + '\n');

      // Timeout after 10 seconds
      setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id);
          reject(new Error(`Request timeout for ${method}`));
        }
      }, 10000);
    });
  }

  handleResponse(response) {
    const { id, result, error } = response;

    if (!this.pendingRequests.has(id)) {
      console.warn('Received response for unknown request:', id);
      return;
    }

    const { resolve, reject } = this.pendingRequests.get(id);
    this.pendingRequests.delete(id);

    if (error) {
      reject(new Error(`${error.message} (code: ${error.code})`));
    } else {
      resolve(result);
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Run tests
const tester = new MCPTester();
tester.test().catch(error => {
  console.error('Test error:', error);
  process.exit(1);
});
