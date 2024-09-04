# How TOs 16: Master Arbitrum Orbit Deposit and Withdrawal 

## Introduction

This repository contains deposit and withdrawal operations scripts using the Arbitrum SDK v4. The scripts allow you to deposit native tokens and erc20 from Parent to Child and withdraw them back to Parent, demonstrating the interoperability between EVM and  Orbit chains.

## Repo Structure
We have a set of scritps organized in four main folders:
- [ParentToChild](./src/ParentToChild/): with scripts to deposit native tokens, erc20s and to send transactions to child chain.
This category also has two sub-categories:
   - [Orbit chain with ETH](./src/ParentToChild/eth:orbit-chain/) as native token
   - [Orbit chain with CGT](./src/ParentToChild/cgt:orbit-chain/) (Custom Gas Token) as native token

- [ChildToParent](./src/ChildToParent/): with scripts to withdraw native tokens, erc20s and to send transactions to parent chain.

- [Child](./src/Child/manual-redeem.ts). Script to manual redeem a retryable ticket (deposit) if it didn't execute automatically.

- [Parent](./src/Parent/execute-txs.ts): Script to execute withdrawals and txs childToParent when the challenge period is over.

In order to use the Arbitrum/sdk we need to pass an object with the Orbit chain config. Please check the [Helpers Folder](./src/helpers/) with examples of config with [eth: reya cronos example](./src/helpers/custom-network-reya.ts) or [cgt](./src/helpers/custom-network-novastro.ts: novastro example) as native token


## Setup

Before running the scripts, ensure you have the necessary dependencies installed and the environment variables configured.

### Prerequisites

- Node.js
- Environment Variable:
  - `DEVNET_PRIVKEY`: Your private key
  - `ParentRPC`: Parent RPC URL
  - `ChildRPC`: Child RPC URL

## Scripts

### Deposit

#### Logic

1. **Initialize Providers and Wallets**:
   - Set up Parent and Child providers using RPC URLs.
   - Create wallets using the provided private key.
2. **Configure Child Network**:
   - Define and register a custom Child network configuration.
3. **Deposit ETH**:
   - Specify the amount of ETH to deposit.
   - Create an EthBridger instance.
   - Execute the deposit and wait for confirmation on both Parent and Child.

User-triggered transaction on Parent Chain:
[Transaction Link](https://sepolia.arbiscan.io/tx/0x717fbb8d3d59b32d952c6d0ba74e735e713ee4bc7828464413ff16133e8cf562)

Automatically triggered transaction to deposit on user's wallet on Orbit Chain:
[Transaction Link](https://arb-blueberry.gelatoscout.com/tx/0xef94b28c7336946d03fce07cf4dd3bb4d32702d299c061516b7e541a6ae50a57)

### Withdrawal

#### Step 1: Trigger Withdrawal

1. **Initialize Providers and Wallets**:
   - Set up Parent and Child providers using RPC URLs.
   - Create wallets using the provided private key.
2. **Configure Child Network**:
   - Define and register a custom Child network configuration.
3. **Trigger Withdrawal**:
   - Retrieve the transaction receipt for the deposit.
   - Get the Child to Parent messages from the receipt.
   - Check if the message has already been executed.
   - Wait for the outbox entry to be created and then execute the withdrawal transaction on Child.

Trigger withdrawal on Orbit Chain:
[Transaction Link](https://arb-blueberry.gelatoscout.com/tx/0xcc4b67573a8fd6bd8e467a315a3486e603f98dec959318f0129aa8b7d82726aa)

#### Step 2: Execute Withdrawal

1. **Execute Withdrawal on Parent**:
   - Once the outbox entry is created, execute the transaction on the parent chain to complete the withdrawal process.

Execute transaction on Parent Chain:
[Transaction Link](https://sepolia.arbiscan.io/tx/0xc28fc294b482d4d77397811025bed3de5a0116eaaa1100efcf0fda18ef4f9aa0)

## Running the scripts

To run the scripts, follow these steps:

### ParentToChain deposits CGT Chain

**Deposit Native Token**
```typescript
yarn parentToChild:cgt:deposit:native
```

**Deposit Erc20 Token**
```typescript
parentToChild:cgt:deposit:erc20
```

**Send Tx**
```typescript
yarn parentToChild:cgt:tx
```

### ChildtoParent

**Withdraw Native Token**
```typescript
yarn childToParent:withdraw:native
```

**Withdraw Erc20 Token**
```typescript
yarn childToParent:withdraw:erc20
```

**Send Tx**
```typescript
yarn childToParent:sendTx
```

### Parent
**Execute Withdraw tx**
```typescript
yarn parent:withdraw:execution
```