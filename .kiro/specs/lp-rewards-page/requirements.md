# Requirements Document

## Introduction

This feature adds a new page to display detailed reward information for liquidity providers (LPs). The page will show how much reward token is owed to each LP, with comprehensive breakdowns by pool and contract selection capabilities. This provides transparency and detailed tracking for LP rewards across different AMM reward contracts.

## Requirements

### Requirement 1

**User Story:** As a liquidity provider, I want to view a detailed table of all LPs and their reward information, so that I can see the complete reward distribution across the platform.

#### Acceptance Criteria

1. WHEN the LP rewards page loads THEN the system SHALL display a table with columns for LP wallet address, staked balance breakdown by pool ID, pending rewards breakdown by pool ID, and total pending rewards
2. WHEN displaying staked balance breakdown THEN the system SHALL format each entry as "{POOL.SYMBOL} XX.XX" where POOL.SYMBOL is the pool token symbol and XX.XX is the balance with two decimal places
3. WHEN displaying pending rewards breakdown THEN the system SHALL format each entry as "{POOL.SYMBOL} XX.XX" where POOL.SYMBOL is the pool token symbol and XX.XX is the pending reward amount with two decimal places
4. WHEN calculating total pending rewards THEN the system SHALL sum all pending rewards across all pools for each LP

### Requirement 2

**User Story:** As a platform administrator, I want to see summary statistics at the top of the rewards page, so that I can quickly understand the overall reward distribution status.

#### Acceptance Criteria

1. WHEN the LP rewards page loads THEN the system SHALL display a summary section containing total number of LPs, total owed amount across all LPs, and reward token balance of the selected AmmRewards contract
2. WHEN calculating total LPs THEN the system SHALL count unique wallet addresses that have staked balances or pending rewards
3. WHEN calculating total owed amount THEN the system SHALL sum all pending rewards across all LPs and pools
4. WHEN displaying reward token balance THEN the system SHALL show the current balance of reward tokens held by the selected AmmRewards contract

### Requirement 3

**User Story:** As a user, I want to select between different AmmRewards contracts, so that I can view reward information for different reward programs.

#### Acceptance Criteria

1. WHEN the LP rewards page loads THEN the system SHALL display a contract selection section similar to the existing main page implementation
2. WHEN a user selects a different AmmRewards contract THEN the system SHALL update all displayed data (summary and table) to reflect the selected contract
3. WHEN switching contracts THEN the system SHALL maintain the same page layout and functionality
4. IF no contract is selected THEN the system SHALL display a default or prompt the user to select a contract

### Requirement 4

**User Story:** As a user, I want the LP rewards page to be easily accessible and well-integrated with the existing application, so that I can navigate to it seamlessly.

#### Acceptance Criteria

1. WHEN implementing the LP rewards page THEN the system SHALL create a new route/page that is accessible via navigation
2. WHEN the page loads THEN the system SHALL maintain consistent styling and UI patterns with the existing application
3. WHEN displaying data THEN the system SHALL handle loading states and error conditions gracefully
4. WHEN the page is responsive THEN the system SHALL display properly on different screen sizes
