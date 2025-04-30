#!/bin/bash

echo "👉 Installing with --legacy-peer-deps..."
npm install --legacy-peer-deps

echo "👉 Building Vite app..."
npm run build
