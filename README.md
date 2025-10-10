# AmmRewards - Berachain LP Rewards Explorer

A Next.js application for exploring AMM rewards and liquidity provider data on Berachain.

## Features

- **Pool Allocations**: View liquidity pool allocations and reward distributions
- **LP Rewards**: Detailed breakdown of staked balances and pending rewards for liquidity providers
- **Shareable URLs**: Direct links to specific contract data for easy sharing
- **Real-time Data**: Live data from Berachain smart contracts
- **Responsive Design**: Works on desktop and mobile devices

## URL Structure

The application uses URL-based routing to make contract data easily shareable:

- **Pool Allocations**: `/{contract-address}`
  - Example: `/0x7a2be8e74f4ae28796828af7b685def78c20416c`
- **LP Rewards**: `/{contract-address}/rewards`
  - Example: `/0x7a2be8e74f4ae28796828af7b685def78c20416c/rewards`

## Sharing Links

Each page includes a share button that copies the current URL to your clipboard. You can share these links with clients or team members to show specific contract data.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.
