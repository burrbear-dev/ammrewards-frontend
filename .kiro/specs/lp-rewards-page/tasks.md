# Implementation Plan

- [x] 1. Extend type definitions for LP rewards data

  - Add new interfaces to `src/lib/types.ts` for LP reward data structures
  - Define `LpRewardData`, `PoolBalance`, and `RewardsSummaryData` interfaces
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3_

- [x] 2. Implement blockchain data fetching functions

  - [x] 2.1 Create function to fetch LP staking and reward data from contracts

    - Add `getLpRewardsData` function to `src/lib/berachain.ts`
    - Implement contract calls to get user balances and pending rewards by pool
    - Format data according to "{POOL.SYMBOL} XX.XX" requirement
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 2.2 Create function to fetch rewards summary statistics
    - Add `getRewardsSummary` function to `src/lib/berachain.ts`
    - Calculate total LPs, total owed amount, and contract reward balance
    - _Requirements: 2.1, 2.2, 2.3_

- [x] 3. Create LP rewards table component

  - [x] 3.1 Implement LpRewardsTable component with sorting functionality

    - Create `src/components/lp-rewards-table.tsx` component
    - Display columns for wallet address, staked balance breakdown, pending rewards breakdown, and total pending rewards
    - Implement sortable columns using existing table patterns
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [x] 3.2 Add data formatting and display logic
    - Format breakdown columns with pool symbols and balances
    - Handle empty states and loading states
    - Add responsive design for mobile screens
    - _Requirements: 1.2, 1.3_

- [x] 4. Create rewards summary component

  - [x] 4.1 Implement RewardsSummary component
    - Create `src/components/rewards-summary.tsx` component
    - Display total LPs, total owed amount, and contract reward balance
    - Use existing Card component patterns for consistent styling
    - _Requirements: 2.1, 2.2, 2.3_

- [x] 5. Create rewards page with contract selection

  - [x] 5.1 Implement rewards page component

    - Create `src/app/rewards/page.tsx` with contract selection section
    - Reuse contract selection logic from main page
    - Integrate RewardsSummary and LpRewardsTable components
    - _Requirements: 3.1, 3.2, 3.3, 4.1, 4.2, 4.3, 4.4_

  - [x] 5.2 Add state management and data fetching
    - Implement contract address state management
    - Add loading and error states for async operations
    - Handle contract switching and data refresh
    - _Requirements: 3.2, 3.3, 4.3_

- [x] 6. Add navigation and routing integration

  - [x] 6.1 Set up routing for rewards page

    - Ensure `/rewards` route is properly configured
    - Add navigation link or menu item to access rewards page
    - _Requirements: 4.1, 4.2_

  - [x] 6.2 Implement error handling and user feedback
    - Add error boundaries and fallback UI
    - Implement loading spinners and error messages
    - Handle edge cases like no data or invalid contracts
    - _Requirements: 4.3, 4.4_
