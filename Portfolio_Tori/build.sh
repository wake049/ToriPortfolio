#!/bin/bash
set -e

echo "Starting build process..."

# Clean up
rm -rf node_modules package-lock.json

# Install dependencies with specific npm configuration
echo "Installing dependencies..."
npm install --prefer-offline --no-audit --progress=false

# Verify critical dependencies
echo "Verifying rollup installation..."
npm ls rollup || echo "Rollup not found in direct dependencies"

# Try to build
echo "Building application..."
npm run build

echo "Build completed successfully!"
