# Design Document

## Overview

The LP Rewards Page will be a new route in the Next.js application that displays comprehensive reward information for liquidity providers. The page will follow the existing architectural patterns, using React components with TypeScript, Tailwind CSS for styling, and viem for blockchain interactions. The design leverages the existing UI component library and maintains consistency with the current application structure.

## Architecture

### Page Structure

The LP rewards page will be implemented as `/rewards` route with the following component hierarchy:

```
/rewards (page.tsx)
├── Contract Selection Section (reused from main page)
├── Summary Statistics Card
└── LP Rewards Table Component
```

### Data Flow

1. User selects AmmRewards contract address
2. System fetches LP data and reward information from blockchain
3. Data is processed and formatted for display
4. Components render with loading/error states

### State Management

- React useState for local component state
- Contract address selection state
- Loading and error states for async operations
- Sorted table data state

## Components and Interfaces

### New Components

#### `LpRewardsTable` Component

```typescript
interface LpRewardsTableProps {
  data: LpRewardData[];
  loading: boolean;
}

interface LpRewardData {
  walletAddress: `0x${string}`;
  stakedBalances: PoolBalance[];
  pendingRewards: PoolBalance[];
  totalPendingRewards: string;
}

interface PoolBalance {
  poolId: number;
  poolSymbol: string;
  balance: string;
  formattedBalance: string; // "{SYMBOL} XX.XX"
}
```

#### `RewardsSummary` Component

```typescript
interface RewardsSummaryProps {
  totalLPs: number;
  totalOwedAmount: string;
  contractRewardBalance: string;
  rewardTokenSymbol: string;
  loading: boolean;
}
```

### Extended Types

```typescript
// Extend existing types in src/lib/types.ts
export interface LpRewardData {
  walletAddress: `0x${string}`;
  stakedBalances: PoolBalance[];
  pendingRewards: PoolBalance[];
  totalPendingRewards: string;
}

export interface PoolBalance {
  poolId: number;
  poolSymbol: string;
  balance: string;
  formattedBalance: string;
}

export interface RewardsSummaryData {
  totalLPs: number;
  totalOwedAmount: string;
  contractRewardBalance: string;
  rewardTokenSymbol: string;
}
```

### Blockchain Integration

Extend `src/lib/berachain.ts` with new functions:

```typescript
// New function to fetch LP reward data
export async function getLpRewardsData(
  ammRewardsAddress: `0x${string}`
): Promise<LpRewardData[]>;

// New function to fetch summary statistics
export async function getRewardsSummary(
  ammRewardsAddress: `0x${string}`
): Promise<RewardsSummaryData>;
```

## Data Models

### LP Rewards Data Structure

```typescript
interface LpRewardData {
  walletAddress: `0x${string}`; // LP wallet address
  stakedBalances: PoolBalance[]; // Breakdown by pool
  pendingRewards: PoolBalance[]; // Breakdown by pool
  totalPendingRewards: string; // Sum of all pending rewards
}

interface PoolBalance {
  poolId: number; // Pool identifier
  poolSymbol: string; // Pool token symbol
  balance: string; // Raw balance amount
  formattedBalance: string; // Formatted as "{SYMBOL} XX.XX"
}
```

### Summary Statistics Data

```typescript
interface RewardsSummaryData {
  totalLPs: number; // Count of unique LP addresses
  totalOwedAmount: string; // Sum of all pending rewards
  contractRewardBalance: string; // Current reward token balance
  rewardTokenSymbol: string; // Symbol of reward token
}
```

## Error Handling

### Error States

1. **Contract Connection Errors**: Display alert when unable to connect to contract
2. **Data Fetching Errors**: Show error message with retry option
3. **Invalid Contract Address**: Validate contract address format
4. **No Data Available**: Handle empty states gracefully

### Error UI Components

- Reuse existing `Alert` component for error messages
- Loading spinners during data fetching
- Fallback UI for missing or invalid data

### Error Recovery

- Automatic retry on network errors
- Manual refresh capability
- Graceful degradation when partial data is available

## Testing Strategy

### Manual Testing

- Cross-browser compatibility
- Responsive design on different screen sizes
- User interaction flows

## Implementation Considerations

### Responsive Design

- Mobile-first approach using Tailwind CSS
- Collapsible table columns on smaller screens
- Horizontal scrolling for table overflow
- Touch-friendly interactive elements

## Navigation Integration

### Route Structure

- New route: `/rewards`
- Navigation link in header or sidebar
- Breadcrumb navigation support

### URL Parameters

- Optional contract address parameter
- Sorting and filtering state in URL
- Deep linking support for specific views

## Styling and UI Consistency

### Design System

- Reuse existing UI components from `src/components/ui/`
- Maintain consistent spacing and typography
- Follow established color scheme and branding
- Use existing card layouts and patterns

### Component Styling

- Tailwind CSS classes for responsive design
- CSS Grid/Flexbox for layout
- Consistent hover and focus states
- Loading skeleton components
