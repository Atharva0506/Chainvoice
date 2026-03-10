#!/bin/sh

echo "Starting local Anvil blockchain node on port 8545..."
# Start anvil in the background, listening on all interfaces
anvil -a 10 --host 0.0.0.0 --port 8545 > anvil.log &

# Wait for Anvil to be ready
sleep 3

echo "Deploying Chainvoice and Custom Token..."
# Use the default first Anvil account private key:
export PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
export RPC_URL=http://127.0.0.1:8545

# Build and deploy the contracts
forge build
forge script script/DeployLocal.s.sol:DeployLocalScript --rpc-url $RPC_URL --broadcast 

echo ""
echo "============================================="
echo "Local RPC URL:      http://127.0.0.1:8545"
echo "Chain ID:           31337"
echo ""
echo "Accounts available in Anvil:"
echo "Account 1: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (Used for deployment)"
echo "Private Key 1: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
echo "============================================="
echo ""
echo "Check the logs above for the 'Chainvoice Address' and 'Custom Token (CTT) Address'."
echo ""
echo "Keeping node alive..."

# Keep the container running and show anvil outputs
tail -f anvil.log
