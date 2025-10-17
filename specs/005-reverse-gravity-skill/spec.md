# Feature Specification: Reverse Gravity Skill

**Feature Branch**: `005-reverse-gravity-skill`  
**Created**: October 15, 2025  
**Status**: Draft  
**Input**: User description: "Reverse Gravity (🔺 Reverse Gravity) - Duration power-up that inverts gravity for 15 seconds, making pieces float upward instead of falling down"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Activate Reverse Gravity (Priority: P1)

When a player receives the Reverse Gravity power-up from the level-up modal and selects it, the game's gravity inverts for 15 seconds. Pieces now float upward instead of falling down, and a timer displays the remaining duration.

**Why this priority**: This is the core mechanic - without gravity inversion, the entire feature doesn't exist. This is the foundation that all other behaviors depend on.

**Independent Test**: Can be fully tested by selecting the Reverse Gravity power-up and observing that pieces move upward instead of downward. Delivers immediate value by creating a completely new gameplay dynamic.

**Acceptance Scenarios**:

1. **Given** player levels up and sees the power-up modal, **When** player selects Reverse Gravity (🔺), **Then** gravity inverts and pieces begin floating upward
2. **Given** Reverse Gravity is activated, **When** player views the screen, **Then** a timer displays showing the remaining duration (starting at 15 seconds)
3. **Given** Reverse Gravity is active, **When** a piece is spawned or in motion, **Then** the piece automatically moves upward instead of downward each game tick
4. **Given** Reverse Gravity is active, **When** player views the board, **Then** visual indicators show that gravity is reversed (optional: upward arrows, blue tint)

---

### User Story 2 - Spawn Position During Reverse Gravity (Priority: P1)

When Reverse Gravity is active, new pieces spawn at the bottom of the board instead of the top, since they need to float upward rather than fall downward.

**Why this priority**: Essential for basic functionality - without proper spawn positioning, pieces would immediately hit the ceiling and the mechanic wouldn't work properly.

**Independent Test**: Can be tested by activating Reverse Gravity and observing where new pieces spawn. Delivers value by ensuring the inverted gravity mechanic works correctly.

**Acceptance Scenarios**:

1. **Given** Reverse Gravity is active, **When** a new piece spawns, **Then** the piece appears at the bottom of the board (bottom rows) instead of the top
2. **Given** Reverse Gravity is active, **When** a piece spawns at the bottom, **Then** the spawn position is horizontally centered (same X position as normal spawn)
3. **Given** Reverse Gravity is active, **When** checking for game over, **Then** the system checks the bottom rows for blocked spawn positions instead of top rows

---

### User Story 3 - Movement and Collision During Reverse Gravity (Priority: P1)

When Reverse Gravity is active, all piece movement and collision detection logic is inverted. Pieces float upward, collide with the ceiling instead of the floor, and lock when they can no longer move upward.

**Why this priority**: Core gameplay mechanic - without proper collision and movement, the game would be unplayable during Reverse Gravity.

**Independent Test**: Can be tested by playing with Reverse Gravity active and verifying upward movement, collision with ceiling, and proper locking behavior. Delivers the fundamental gameplay experience.

**Acceptance Scenarios**:

1. **Given** Reverse Gravity is active, **When** the game tick occurs, **Then** pieces move up by one row instead of down
2. **Given** Reverse Gravity is active and a piece is moving upward, **When** the piece reaches the top row, **Then** collision is detected with the ceiling
3. **Given** Reverse Gravity is active and a piece cannot move upward, **When** collision is detected, **Then** the piece locks in place at its current position
4. **Given** Reverse Gravity is active, **When** player manually moves piece left or right, **Then** horizontal movement works normally (unchanged)
5. **Given** Reverse Gravity is active, **When** player presses down arrow (soft drop), **Then** the piece moves downward (opposite of normal gravity direction)
6. **Given** Reverse Gravity is active, **When** player presses up arrow, **Then** the piece moves upward (in direction of reverse gravity)

---

### User Story 4 - Hard Drop During Reverse Gravity (Priority: P2)

When Reverse Gravity is active and the player uses the hard drop function, the piece shoots upward to the ceiling instead of downward to the floor.

**Why this priority**: Important for player control and strategy, but the game is still playable without it using normal movement keys.

**Independent Test**: Can be tested by activating Reverse Gravity and using the hard drop key (Space). Delivers value by maintaining the hard drop feature's utility in reversed gravity.

**Acceptance Scenarios**:

1. **Given** Reverse Gravity is active and player has a current piece, **When** player presses the hard drop key (Space), **Then** the piece instantly moves to the highest valid position (near ceiling)
2. **Given** Reverse Gravity is active, **When** hard drop is executed, **Then** the piece locks immediately after reaching the top position
3. **Given** Reverse Gravity is active, **When** hard drop score bonus is calculated, **Then** bonus is based on upward distance traveled (same calculation, reversed direction)

---

### User Story 5 - Timer Expiration and Gravity Restoration (Priority: P2)

After 15 seconds, Reverse Gravity automatically deactivates and normal downward gravity is restored. Any pieces currently in motion continue with normal gravity.

**Why this priority**: Essential for the duration power-up model, but can be tested after core reverse gravity works. Ensures the temporary effect ends properly.

**Independent Test**: Can be tested by waiting for the 15-second timer to expire and verifying that gravity returns to normal. Delivers value by properly managing the temporary effect.

**Acceptance Scenarios**:

1. **Given** Reverse Gravity has been active for 15 seconds, **When** the timer expires, **Then** gravity returns to normal downward direction
2. **Given** Reverse Gravity expires, **When** gravity is restored, **Then** new pieces spawn at the top of the board again
3. **Given** Reverse Gravity expires, **When** a piece is currently in motion, **Then** the piece immediately begins falling downward with normal gravity
4. **Given** Reverse Gravity expires, **When** player views the screen, **Then** the Reverse Gravity timer is removed from display
5. **Given** Reverse Gravity expires, **When** gravity is restored, **Then** visual indicators for reverse gravity are removed

---

### User Story 6 - Line Clearing During Reverse Gravity (Priority: P3)

When Reverse Gravity is active and lines are completed, they should be cleared normally. The system handles line clearing regardless of gravity direction.

**Why this priority**: Quality of life feature - line clearing should work consistently. Can be tested after core mechanics work.

**Independent Test**: Can be tested by completing lines while Reverse Gravity is active. Delivers value by maintaining consistent game rules across power-ups.

**Acceptance Scenarios**:

1. **Given** Reverse Gravity is active and a line is completed, **When** line clearing logic runs, **Then** the completed line is cleared normally
2. **Given** Reverse Gravity is active and multiple lines are cleared, **When** blocks above (in normal mode) or below (in reverse mode) the cleared lines exist, **Then** blocks shift appropriately to fill the gap

---

### Edge Cases

- What happens when Reverse Gravity expires while a piece is mid-movement?
- What happens when Reverse Gravity is activated while Time Freeze is also active?
- What happens when the bottom spawn area is blocked when Reverse Gravity activates?
- What happens when Reverse Gravity expires and the spawn area at the top is blocked?
- What happens when player rotates a piece near the ceiling during Reverse Gravity?
- What happens when Hard Drop is used during Reverse Gravity with obstacles near the ceiling?
- What happens when Reverse Gravity activates during a piece's lock delay?
- What happens when multiple gravity-affecting power-ups are somehow active simultaneously?

## Requirements *(mandatory)*

### Functional Requirements

#### Activation Requirements

- **FR-001**: System MUST provide Reverse Gravity as a selectable power-up in the level-up modal with "Duration" type
- **FR-002**: System MUST activate Reverse Gravity immediately when player selects the power-up
- **FR-003**: System MUST display a 15-second countdown timer while Reverse Gravity is active
- **FR-004**: System MUST apply visual indicators to show that gravity is reversed (optional: upward arrows, color tint, animation)

#### Gravity Direction Requirements

- **FR-005**: System MUST invert gravity direction so pieces move upward instead of downward during each game tick
- **FR-006**: System MUST change the automatic piece movement from movePiece(0, 1) to movePiece(0, -1) equivalent
- **FR-007**: System MUST detect when the gravity direction is currently reversed (state tracking)
- **FR-008**: System MUST maintain consistent upward movement speed matching the normal downward movement speed

#### Spawn Position Requirements

- **FR-009**: System MUST spawn new pieces at the bottom of the board when Reverse Gravity is active
- **FR-010**: System MUST calculate the spawn Y position to place pieces near the bottom row (e.g., Y = BOARD_HEIGHT - 2)
- **FR-011**: System MUST maintain the same horizontal spawn position (centered) as normal spawning
- **FR-012**: System MUST check for blocked spawn positions at the bottom instead of top when Reverse Gravity is active

#### Collision Detection Requirements

- **FR-013**: System MUST invert collision detection to check upward movement collisions instead of downward
- **FR-014**: System MUST detect collision with the top boundary (ceiling) instead of bottom boundary
- **FR-015**: System MUST detect collision with blocks above the current piece instead of below
- **FR-016**: System MUST lock pieces when they cannot move further upward (same locking logic, inverted direction)

#### Player Control Requirements

- **FR-017**: System MUST allow players to manually move pieces downward (opposite of gravity) using the down arrow key
- **FR-018**: System MUST allow players to manually move pieces upward (with gravity) using the up arrow key
- **FR-019**: System MUST maintain normal left/right movement controls without changes
- **FR-020**: System MUST maintain normal rotation controls without changes

#### Hard Drop Requirements

- **FR-021**: System MUST modify hard drop to move pieces upward to the ceiling when Reverse Gravity is active
- **FR-022**: System MUST calculate hard drop target position as the highest valid position (near top boundary)
- **FR-023**: System MUST lock the piece immediately after hard drop completes in reverse gravity
- **FR-024**: System MUST calculate hard drop score bonus based on upward distance traveled

#### Deactivation Requirements

- **FR-025**: System MUST automatically deactivate Reverse Gravity after exactly 15 seconds
- **FR-026**: System MUST restore normal downward gravity when Reverse Gravity expires
- **FR-027**: System MUST restore normal spawn positions (top of board) when Reverse Gravity expires
- **FR-028**: System MUST remove visual indicators when Reverse Gravity expires
- **FR-029**: System MUST remove the countdown timer from display when Reverse Gravity expires
- **FR-030**: System MUST immediately apply normal gravity to any pieces in motion when the effect expires

#### Game Over Detection Requirements

- **FR-031**: System MUST check the bottom spawn area for game over conditions when Reverse Gravity is active
- **FR-032**: System MUST check the top spawn area for game over conditions when normal gravity is active

### Key Entities

- **Gravity Direction**: A state variable indicating the current gravity direction (normal/downward or reversed/upward), controlling piece movement behavior
- **Reverse Gravity Timer**: A 15-second countdown timer that tracks remaining duration and triggers deactivation when it reaches zero
- **Spawn Position Calculator**: A function that determines the Y coordinate for new piece spawning based on current gravity direction (top for normal, bottom for reversed)
- **Collision Detector**: Modified collision detection logic that checks appropriate boundaries and neighboring blocks based on gravity direction

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Players can activate Reverse Gravity and see pieces floating upward within 1 game tick (typically <100ms)
- **SC-002**: Pieces spawn at the bottom with 100% accuracy when Reverse Gravity is active
- **SC-003**: Collision detection works correctly in 100% of cases during Reverse Gravity (no pieces passing through blocks or boundaries)
- **SC-004**: The 15-second timer counts down accurately with ±0.5 second precision
- **SC-005**: Hard drop functions correctly in reverse direction for 100% of uses during Reverse Gravity
- **SC-006**: Gravity restoration occurs immediately (within 1 frame) when the timer expires
- **SC-007**: 80% of players can successfully adapt to reversed gravity within 3 attempts
- **SC-008**: The mechanic adds strategic depth: 65% of players report using it to create different stacking strategies

## Assumptions

- The game has a consistent game tick system that can be modified to move pieces upward
- The existing collision detection functions can be reused with inverted parameters
- Players understand that "reverse gravity" means pieces float upward (intuitive concept)
- The 15-second duration provides enough time for meaningful strategic use
- Manual movement controls (arrow keys) should have intuitive behavior (down = against gravity)
- Hard drop maintains its "instant placement" nature but in the opposite direction
- Line clearing mechanics are not affected by gravity direction
- The game tick rate remains constant regardless of gravity direction

## Out of Scope

- Gravity strength variations (always same speed as normal gravity, just reversed)
- Partial gravity changes (e.g., sideways gravity)
- Piece rotation changes during reverse gravity (rotation works the same way)
- Different reverse gravity durations or variable timers
- Permanent reverse gravity mode
- Sound effects or music changes during reverse gravity
- Animated transition when gravity flips (instant change)
- Multiple simultaneous gravity-affecting power-ups
