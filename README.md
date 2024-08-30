# How TOs 16: Master Arbitrum Orbit Deposit and Withdrawal 

## Introduction

This repository contains scripts for performing deposit and withdrawal operations using the Arbitrum SDK. The scripts allow you to deposit native tokens as well as erec20 from L1 to L2 and withdraw it back to L1, demonstrating the interoperability between Ethereum and Arbitrum networks.

## Repo Structure


## Setup

Before running the scripts, ensure you have the necessary dependencies installed and the environment variables configured.

### Prerequisites

- Node.js
- Environment Variable:
  - `DEVNET_PRIVKEY`: Your private key
  - `L1RPC`: L1 RPC URL
  - `L2RPC`: L2 RPC URL

## Scripts

### Deposit

#### Logic

1. **Initialize Providers and Wallets**:
   - Set up L1 and L2 providers using RPC URLs.
   - Create wallets using the provided private key.
2. **Configure L2 Network**:
   - Define and register a custom L2 network configuration.
3. **Deposit ETH**:
   - Specify the amount of ETH to deposit.
   - Create an EthBridger instance.
   - Execute the deposit and wait for confirmation on both L1 and L2.

User-triggered transaction on Parent Chain:
[Transaction Link](https://sepolia.arbiscan.io/tx/0x717fbb8d3d59b32d952c6d0ba74e735e713ee4bc7828464413ff16133e8cf562)

Automatically triggered transaction to deposit on user's wallet on Orbit Chain:
[Transaction Link](https://arb-blueberry.gelatoscout.com/tx/0xef94b28c7336946d03fce07cf4dd3bb4d32702d299c061516b7e541a6ae50a57)

### Withdrawal

#### Step 1: Trigger Withdrawal

1. **Initialize Providers and Wallets**:
   - Set up L1 and L2 providers using RPC URLs.
   - Create wallets using the provided private key.
2. **Configure L2 Network**:
   - Define and register a custom L2 network configuration.
3. **Trigger Withdrawal**:
   - Retrieve the transaction receipt for the deposit.
   - Get the L2 to L1 messages from the receipt.
   - Check if the message has already been executed.
   - Wait for the outbox entry to be created and then execute the withdrawal transaction on L2.

Trigger withdrawal on Orbit Chain:
[Transaction Link](https://arb-blueberry.gelatoscout.com/tx/0xcc4b67573a8fd6bd8e467a315a3486e603f98dec959318f0129aa8b7d82726aa)

#### Step 2: Execute Withdrawal

1. **Execute Withdrawal on L1**:
   - Once the outbox entry is created, execute the transaction on the parent chain to complete the withdrawal process.

Execute transaction on Parent Chain:
[Transaction Link](https://sepolia.arbiscan.io/tx/0xc28fc294b482d4d77397811025bed3de5a0116eaaa1100efcf0fda18ef4f9aa0)

## Running the scripts

To run the scripts, follow these steps:

```
For deposits: npm run start
```

```
For Withdraw Step 1: npm run step:1
```

```
For Withdraw Step 2: npm run step:2
```
