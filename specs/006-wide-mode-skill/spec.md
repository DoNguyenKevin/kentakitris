# Feature Specification: Wide Mode Skill

**Feature Branch**: `006-wide-mode-skill`  
**Created**: October 15, 2025  
**Status**: Draft  
**Input**: User description: "Wide Mode (📏 Wide Mode / WIDE_PIECE) - Duration power-up that expands the game board from 10 columns to 12 columns for 25 seconds"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Activate Wide Mode and Expand Board (Priority: P1)

When a player receives the Wide Mode power-up from the level-up modal and selects it, the game board expands from 10 columns to 12 columns. The expansion is visible immediately and a 25-second timer displays the remaining duration.

**Why this priority**: This is the core mechanic - board expansion. Without this, there's no Wide Mode feature at all. This is the foundation for all other behaviors.

**Independent Test**: Can be fully tested by selecting the Wide Mode power-up and observing that the board widens. Delivers immediate value by giving players more space to maneuver.

**Acceptance Scenarios**:

1. **Given** player levels up and sees the power-up modal, **When** player selects Wide Mode (📏), **Then** the game board expands from 10 columns to 12 columns
2. **Given** Wide Mode is activated, **When** player views the board, **Then** a 25-second countdown timer is displayed showing remaining duration
3. **Given** Wide Mode is activated, **When** the board expands, **Then** the board visually widens and the expansion is smooth and clear
4. **Given** Wide Mode is activated, **When** player views the game, **Then** visual indicators show that Wide Mode is active (blue border or similar effect)

---

### User Story 2 - Preserve Existing Blocks and Center Them (Priority: P1)

When Wide Mode activates and the board expands, all existing blocks on the board are preserved and centered within the wider board. No existing gameplay progress is lost.

**Why this priority**: Essential for game integrity - players must not lose their existing blocks or progress when activating the power-up. This ensures fair gameplay.

**Independent Test**: Can be tested by having blocks on the board before activating Wide Mode, then verifying they remain centered. Delivers value by preserving player progress.

**Acceptance Scenarios**:

1. **Given** blocks exist on the 10-column board, **When** Wide Mode activates, **Then** all existing blocks are preserved without data loss
2. **Given** blocks exist on the left side of the original board, **When** the board expands to 12 columns, **Then** existing blocks are centered (one new column added on each side)
3. **Given** completed lines exist on the board, **When** Wide Mode activates, **Then** the line clearing status is preserved
4. **Given** Wide Mode activates, **When** the board expands, **Then** the board height remains unchanged at 20 rows

---

### User Story 3 - Spawn and Control Pieces in Wide Mode (Priority: P1)

When Wide Mode is active, new pieces spawn in the center of the wider 12-column board, and players can move pieces across the full width including the new columns.

**Why this priority**: Core gameplay - without proper piece spawning and movement in the wider space, the expanded board serves no purpose.

**Independent Test**: Can be tested by playing with Wide Mode active and verifying pieces spawn correctly and can move to all columns. Delivers the primary value of having extra space.

**Acceptance Scenarios**:

1. **Given** Wide Mode is active, **When** a new piece spawns, **Then** the piece spawns centered on the 12-column board (at column 5 or 6)
2. **Given** Wide Mode is active and a piece is in play, **When** player moves the piece left or right, **Then** the piece can move across all 12 columns
3. **Given** Wide Mode is active, **When** a piece reaches the left or right edge, **Then** collision detection works correctly at the new board boundaries
4. **Given** Wide Mode is active, **When** pieces are placed in the new outer columns (columns 0 or 11), **Then** they lock and render correctly

---

### User Story 4 - Line Clearing in Wide Mode (Priority: P2)

When Wide Mode is active and a line is completed across all 12 columns, the line is cleared normally. The line clearing system adapts to the wider board width.

**Why this priority**: Important for complete gameplay, but the expanded board is still useful for building even without clearing lines. Can be tested after basic movement works.

**Independent Test**: Can be tested by filling a line across all 12 columns and verifying it clears. Delivers value by maintaining consistent game rules.

**Acceptance Scenarios**:

1. **Given** Wide Mode is active, **When** all 12 columns in a row are filled, **Then** the line is cleared and the player earns points
2. **Given** Wide Mode is active, **When** only 10 of 12 columns are filled in a row, **Then** the line is not cleared (requires full width)
3. **Given** Wide Mode is active, **When** multiple lines are cleared, **Then** blocks above the cleared lines fall down normally across all 12 columns

---

### User Story 5 - Timer Expiration and Board Contraction (Priority: P2)

After 25 seconds, Wide Mode automatically deactivates and the board contracts back to 10 columns. The system handles the contraction appropriately, dealing with blocks in the outer columns.

**Why this priority**: Essential for the duration power-up model, but can be tested after core expansion works. Ensures the temporary effect ends properly.

**Independent Test**: Can be tested by waiting for the 25-second timer to expire and verifying the board contracts. Delivers value by properly managing the temporary effect.

**Acceptance Scenarios**:

1. **Given** Wide Mode has been active for 25 seconds, **When** the timer expires, **Then** the board contracts from 12 columns back to 10 columns
2. **Given** Wide Mode expires, **When** the board contracts, **Then** blocks in the center 10 columns are preserved
3. **Given** Wide Mode expires and blocks exist in the outer columns (0 or 11), **When** the board contracts, **Then** those blocks are removed (cleared)
4. **Given** Wide Mode expires, **When** a piece is currently in the outer columns, **Then** the piece is adjusted to fit within the 10-column board or locked/placed if adjustment is impossible
5. **Given** Wide Mode expires, **When** the board contracts, **Then** the Wide Mode timer is removed from display
6. **Given** Wide Mode expires, **When** the board contracts, **Then** visual indicators for Wide Mode are removed

---

### User Story 6 - Rendering and UI Adaptation (Priority: P3)

The game's visual rendering adapts to the wider board, maintaining proper proportions, cell sizes, and UI element positioning throughout Wide Mode.

**Why this priority**: Quality of life feature - the game is playable without perfect rendering, but proper visuals enhance the experience.

**Independent Test**: Can be tested by activating Wide Mode and checking that all visual elements display correctly. Delivers value through better user experience.

**Acceptance Scenarios**:

1. **Given** Wide Mode is active, **When** the board renders, **Then** all 12 columns are visible without horizontal scrolling
2. **Given** Wide Mode is active, **When** the board renders, **Then** block cells maintain consistent size across all columns
3. **Given** Wide Mode is active, **When** the board renders, **Then** the board remains centered on the screen or positioned appropriately
4. **Given** Wide Mode is active, **When** UI elements (score, next piece, etc.) are displayed, **Then** they remain visible and properly positioned

---

### Edge Cases

- What happens when Wide Mode expires while a piece is being placed in the outer columns?
- What happens when Wide Mode activates while the board is nearly full?
- What happens when Wide Mode is activated multiple times in succession (timer resets)?
- What happens when blocks in the outer columns form part of a completed line when Wide Mode expires?
- What happens when the current piece is partially in the outer columns when Wide Mode expires?
- What happens when Wide Mode is active and the screen size is too small to display 12 columns?
- What happens when Wide Mode is combined with other board-affecting power-ups?
- What happens when Wide Mode expires and it causes blocks to be removed that would trigger line clears?

## Requirements *(mandatory)*

### Functional Requirements

#### Activation Requirements

- **FR-001**: System MUST provide Wide Mode as a selectable power-up in the level-up modal with "Duration" type
- **FR-002**: System MUST activate Wide Mode immediately when player selects the power-up
- **FR-003**: System MUST display a 25-second countdown timer while Wide Mode is active
- **FR-004**: System MUST apply visual indicators to show that Wide Mode is active (blue border or similar effect)

#### Board Expansion Requirements

- **FR-005**: System MUST expand the board from 10 columns to 12 columns when Wide Mode activates
- **FR-006**: System MUST maintain the board height at 20 rows (no vertical expansion)
- **FR-007**: System MUST update the internal board data structure to accommodate 12 columns
- **FR-008**: System MUST update the BOARD_WIDTH variable from 10 to 12 during Wide Mode

#### Block Preservation Requirements

- **FR-009**: System MUST preserve all existing blocks when the board expands
- **FR-010**: System MUST center the existing 10-column content within the new 12-column board
- **FR-011**: System MUST add one empty column on the left side (new column 0)
- **FR-012**: System MUST add one empty column on the right side (new column 11)
- **FR-013**: System MUST maintain block colors and positions (with offset) during expansion

#### Piece Spawning Requirements

- **FR-014**: System MUST adjust spawn position to center pieces on the 12-column board
- **FR-015**: System MUST calculate new spawn X coordinate based on 12-column width
- **FR-016**: System MUST maintain normal spawn Y position (top of board)

#### Movement and Collision Requirements

- **FR-017**: System MUST allow pieces to move across all 12 columns
- **FR-018**: System MUST detect collision with the new left boundary (column 0)
- **FR-019**: System MUST detect collision with the new right boundary (column 11)
- **FR-020**: System MUST detect collision with blocks in any of the 12 columns
- **FR-021**: System MUST allow pieces to lock in the outer columns (0 and 11)

#### Line Clearing Requirements

- **FR-022**: System MUST require all 12 columns to be filled for a line to be complete during Wide Mode
- **FR-023**: System MUST clear lines that span all 12 columns
- **FR-024**: System MUST NOT clear partial lines (10 of 12 columns filled)
- **FR-025**: System MUST drop blocks normally after line clears across the full 12-column width

#### Rendering Requirements

- **FR-026**: System MUST render all 12 columns visibly on screen
- **FR-027**: System MUST update the board's visual width to accommodate 12 columns
- **FR-028**: System MUST maintain consistent block cell sizes across all columns
- **FR-029**: System MUST update the CSS grid or canvas rendering to display 12 columns

#### Deactivation Requirements

- **FR-030**: System MUST automatically deactivate Wide Mode after exactly 25 seconds
- **FR-031**: System MUST contract the board from 12 columns back to 10 columns when Wide Mode expires
- **FR-032**: System MUST preserve blocks in the center 10 columns when contracting
- **FR-033**: System MUST remove (clear) blocks in the outer columns (0 and 11) when contracting
- **FR-034**: System MUST adjust or place the current piece if it's in the outer columns when expiring
- **FR-035**: System MUST update the BOARD_WIDTH variable back to 10 when Wide Mode expires
- **FR-036**: System MUST remove visual indicators when Wide Mode expires
- **FR-037**: System MUST remove the countdown timer from display when Wide Mode expires
- **FR-038**: System MUST update the board rendering back to 10-column display

### Key Entities

- **Board Dimensions**: Variables tracking the current board width (10 or 12 columns) and height (always 20 rows), used throughout the game logic
- **Wide Mode Timer**: A 25-second countdown timer that tracks remaining duration and triggers deactivation when it reaches zero
- **Board Data Structure**: The 2D array or matrix representing the game board, which dynamically expands and contracts between 10 and 12 columns
- **Column Offset**: A calculation used during expansion and contraction to properly center and shift block positions

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Players can activate Wide Mode and see the board expand within 0.5 seconds of selection
- **SC-002**: Board expansion preserves 100% of existing blocks with correct positioning (centered)
- **SC-003**: Pieces can move to and lock in all 12 columns with 100% accuracy during Wide Mode
- **SC-004**: Line clearing works correctly for lines spanning all 12 columns in 100% of cases
- **SC-005**: The 25-second timer counts down accurately with ±0.5 second precision
- **SC-006**: Board contraction occurs immediately (within 1 frame) when the timer expires
- **SC-007**: Blocks in outer columns are properly removed during contraction in 100% of cases
- **SC-008**: 75% of players report that Wide Mode provides useful additional space for building strategies

## Assumptions

- The game's board data structure can be dynamically resized (or recreated with new dimensions)
- The rendering system can adapt to display different board widths
- Players understand that blocks in the outer columns will be lost when Wide Mode expires
- The 25-second duration provides enough time for meaningful strategic use of the extra space
- Board width changes do not affect piece shapes or rotation behavior
- The UI has sufficient space to display a 12-column board without scrolling
- Centering the 10-column content within 12 columns (adding 1 column on each side) is the most intuitive expansion method
- Line clearing logic checks for "full rows" based on current board width

## Out of Scope

- Variable board widths (always expands to exactly 12 columns)
- Permanent wide mode or different duration times
- Vertical board expansion (height changes)
- Saving blocks in outer columns when Wide Mode expires (always cleared)
- Animated expansion/contraction transitions (instant change acceptable)
- Different centering strategies (always center with equal columns on both sides)
- Warning indicators before Wide Mode expires
- Ability to manually end Wide Mode early
- Sound effects or music changes during Wide Mode
