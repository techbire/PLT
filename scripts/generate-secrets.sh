#!/bin/bash

# Generate secure JWT secrets
echo "Generating secure JWT secrets..."

JWT_SECRET=$(openssl rand -base64 64)
JWT_REFRESH_SECRET=$(openssl rand -base64 64)

echo "Add these to your Render environment variables:"
echo ""
echo "JWT_SECRET=$JWT_SECRET"
echo "JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET"
echo ""
echo "Copy these values to your Render dashboard under Environment Variables."
