#!/bin/bash

echo "======================================"
echo "PLAYWRIGHT SANDBOX TEST SUITE"
echo "======================================"

# Create directories
mkdir -p screenshots
mkdir -p test-results

# Start server in background
echo -e "\n[1/4] Starting test server..."
npm run server > server.log 2>&1 &
SERVER_PID=$!
echo "Server PID: $SERVER_PID"
sleep 3

# Check if server is running
if curl -s http://localhost:8080 > /dev/null; then
    echo "✅ Server is running"
else
    echo "❌ Server failed to start"
    kill $SERVER_PID 2>/dev/null
    exit 1
fi

# Run diagnostic
echo -e "\n[2/4] Running diagnostic tests..."
npm run test:diagnostic

# Try Playwright test suite with different configs
echo -e "\n[3/4] Testing with baseline config..."
npm run test:baseline || echo "Baseline failed"

echo -e "\n[4/4] Generating report..."
echo "Check screenshots/ directory for any captured images"
echo "Check diagnostic-results.json for detailed results"

# Cleanup
echo -e "\nCleaning up..."
kill $SERVER_PID 2>/dev/null
echo "Done!"
