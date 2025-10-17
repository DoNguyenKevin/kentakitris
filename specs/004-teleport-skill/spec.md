# Feature Specification: Teleport Skill

**Feature Branch**: `004-teleport-skill`  
**Created**: October 15, 2025  
**Status**: Draft  
**Input**: User description: "Teleport (🌀 Teleport) - Click-to-place mechanic cho phép người chơi đặt mảnh ghép hiện tại vào bất kỳ vị trí nào trên bảng"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Activate Teleport Mode (Priority: P1)

When a player receives the Teleport power-up from the level-up modal, they can activate it to enter Teleport mode. The game board changes visually to indicate that Teleport mode is active and the player can now click anywhere on the board to place their current piece.

**Why this priority**: This is the foundation of the feature - without the ability to activate Teleport mode, the entire mechanic cannot function. It's the entry point for the entire feature.

**Independent Test**: Can be fully tested by selecting the Teleport power-up from the modal and verifying that the board enters Teleport mode with visual indicators. Delivers immediate value by giving players the ability to enter the special placement mode.

**Acceptance Scenarios**:

1. **Given** player levels up and sees the power-up modal, **When** player selects the Teleport (🌀) power-up, **Then** the game board enters Teleport mode with visual indicators
2. **Given** Teleport mode is active, **When** player views the game board, **Then** the board displays a visual effect (purple glow, crosshair cursor) indicating click-to-place is available
3. **Given** Teleport mode is active, **When** player hovers over the board, **Then** the cursor changes to indicate clickable areas

---

### User Story 2 - Click to Place Piece (Priority: P1)

When in Teleport mode, the player can click anywhere on the game board to instantly move their current piece to that location. The piece is placed if the position is valid (no collision), and Teleport mode ends after one use.

**Why this priority**: This is the core functionality of Teleport - the actual click-to-place mechanic. Without this, activating Teleport mode serves no purpose.

**Independent Test**: Can be fully tested by entering Teleport mode and clicking various positions on the board to verify piece placement. Delivers the primary value of the feature by enabling strategic piece placement.

**Acceptance Scenarios**:

1. **Given** Teleport mode is active and player has a current piece, **When** player clicks on a valid empty position on the board, **Then** the piece instantly moves to that position
2. **Given** Teleport mode is active, **When** player successfully places the piece, **Then** Teleport mode deactivates immediately after placement
3. **Given** Teleport mode is active, **When** player clicks on the board, **Then** the click coordinates are accurately converted to board grid positions
4. **Given** Teleport mode is active, **When** the piece is teleported, **Then** the board re-renders to show the piece in its new position

---

### User Story 3 - Collision Detection and Invalid Placement (Priority: P2)

When a player tries to teleport their piece to a position that would cause a collision with existing blocks or go out of bounds, the system prevents the placement and provides feedback to the player.

**Why this priority**: Essential for game integrity but can be tested after basic teleport works. Prevents invalid game states and provides user feedback.

**Independent Test**: Can be tested independently by attempting to click on occupied cells or out-of-bounds areas. Delivers value by preventing invalid game states and guiding player actions.

**Acceptance Scenarios**:

1. **Given** Teleport mode is active, **When** player clicks on a position that would cause the piece to collide with existing blocks, **Then** the placement is rejected and the piece remains in its current position
2. **Given** Teleport mode is active, **When** player clicks outside the board boundaries, **Then** the click is ignored and no placement occurs
3. **Given** Teleport mode is active, **When** player attempts an invalid placement, **Then** visual or audio feedback indicates the placement was invalid (optional: brief highlight or shake effect)
4. **Given** an invalid placement attempt occurs, **When** the placement is rejected, **Then** Teleport mode remains active so the player can try again

---

### User Story 4 - Teleport Mode Cancellation (Priority: P3)

Players can cancel Teleport mode without using it, allowing them to return to normal gameplay if they change their mind or activate it accidentally.

**Why this priority**: Quality of life feature that improves user experience but is not essential for core functionality. Players can still complete the teleport to exit the mode.

**Independent Test**: Can be tested by entering Teleport mode and pressing an escape key or clicking a cancel button. Delivers convenience value by giving players an exit option.

**Acceptance Scenarios**:

1. **Given** Teleport mode is active, **When** player presses the Escape key or clicks outside the board area, **Then** Teleport mode is cancelled and normal gameplay resumes
2. **Given** Teleport mode is cancelled, **When** player resumes playing, **Then** the Teleport power-up is consumed (one-time use policy)
3. **Given** Teleport mode is active, **When** a new piece spawns (current piece locks), **Then** Teleport mode automatically deactivates

---

### Edge Cases

- What happens when Teleport mode is activated but there's no current piece on the board?
- What happens when the board is completely full and there are no valid positions to teleport to?
- What happens if the player's piece shape is too large to fit in the clicked area?
- What happens when Teleport is activated during piece rotation or movement animations?
- What happens when Teleport mode is active and the game is paused?
- What happens when click coordinates fall on the border between two grid cells?
- What happens if multiple rapid clicks occur before the first teleport completes?

## Requirements *(mandatory)*

### Functional Requirements

#### Activation Requirements

- **FR-001**: System MUST provide Teleport as a selectable power-up in the level-up modal with "Instant" type
- **FR-002**: System MUST activate Teleport mode immediately when player selects the Teleport power-up
- **FR-003**: System MUST apply visual indicators to the game board when Teleport mode is active (purple glow effect)
- **FR-004**: System MUST change the mouse cursor to a crosshair or placement indicator when hovering over the board in Teleport mode

#### Placement Requirements

- **FR-005**: System MUST attach a click event listener to the game board when Teleport mode is activated
- **FR-006**: System MUST accurately convert mouse click coordinates to board grid cell coordinates
- **FR-007**: System MUST calculate the click position relative to the top-left corner of the piece shape
- **FR-008**: System MUST check for collisions before allowing piece placement at the clicked position
- **FR-009**: System MUST prevent placement if the clicked position would cause any part of the piece to collide with existing blocks
- **FR-010**: System MUST prevent placement if any part of the piece would be outside the board boundaries

#### Collision Detection Requirements

- **FR-011**: System MUST validate that all cells of the piece shape are within board bounds at the target position
- **FR-012**: System MUST validate that all cells of the piece shape are empty (no existing blocks) at the target position
- **FR-013**: System MUST use the same collision detection logic as the existing movePiece/checkCollision functions
- **FR-014**: System MUST provide feedback when an invalid placement is attempted (optional: visual indicator)

#### Deactivation Requirements

- **FR-015**: System MUST deactivate Teleport mode immediately after a successful piece placement
- **FR-016**: System MUST remove the click event listener from the board when Teleport mode ends
- **FR-017**: System MUST remove visual indicators (purple glow, crosshair cursor) when Teleport mode ends
- **FR-018**: System MUST update the game board display after piece teleportation
- **FR-019**: System MUST consume the Teleport power-up (one-time use) after activation

#### Cancellation Requirements

- **FR-020**: System MUST allow players to cancel Teleport mode using the Escape key
- **FR-021**: System MUST automatically cancel Teleport mode if the current piece locks before teleportation occurs
- **FR-022**: System MUST treat cancellation the same as usage (power-up is consumed)

### Key Entities

- **Teleport Mode State**: A boolean flag indicating whether Teleport mode is currently active, controlling click event handling and visual effects
- **Click Event Handler**: A function that captures mouse click events on the board, converts coordinates to grid positions, and attempts piece placement
- **Target Position**: The grid coordinates (x, y) where the player wants to teleport the current piece, calculated from click coordinates
- **Collision Validator**: A function that checks whether the piece can be legally placed at the target position without colliding with existing blocks or boundaries

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Players can activate Teleport mode and see visual indicators within 0.5 seconds of selecting the power-up
- **SC-002**: Click coordinates are converted to grid positions with 100% accuracy (no off-by-one errors)
- **SC-003**: Players can successfully teleport pieces to valid positions in 95% of attempts (5% allowance for user error clicking invalid spots)
- **SC-004**: Invalid placement attempts are rejected 100% of the time (no pieces placed in collision states)
- **SC-005**: Teleport mode deactivates immediately after successful placement (within one game frame)
- **SC-006**: Visual indicators (purple glow, cursor change) are visible and clear to 90% of players without instruction
- **SC-007**: The Teleport mechanic adds strategic value: 70% of players report using it to save difficult situations
- **SC-008**: Teleport activation and placement complete within 100ms of user action (no noticeable lag)

## Assumptions

- The game already has established functions for collision detection (checkCollision) that can be reused
- The board element is accessible via DOM and has a defined position/size that can be used for coordinate calculations
- Players understand that Teleport is a one-time instant power-up that is consumed upon activation
- The visual indicator (purple glow) is sufficient for players to understand they are in Teleport mode
- Teleport mode should work with the current piece in its current rotation state (no automatic rotation)
- The coordinate calculation should use the piece's reference point (typically top-left of bounding box)
- Teleport can place pieces anywhere on the board, including "floating" positions not touching other blocks

## Out of Scope

- Preview of where the piece will land before clicking (ghost preview while hovering)
- Ability to rotate the piece while in Teleport mode
- Multiple uses of Teleport per power-up activation
- Animated transition of the piece moving to the new position (instant teleport)
- Sound effects for teleport activation or placement
- Undo functionality after teleporting
- Teleporting to positions that are "partially valid" (all or nothing placement)
