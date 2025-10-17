# Feature Specification: Bomb Skill

**Feature Branch**: `007-bomb-skill`  
**Created**: October 15, 2025  
**Status**: Draft  
**Input**: User description: "Bomb (💣 Bomb) - Next piece type modifier that creates a 3x3 explosion when the piece lands, clearing all blocks in the explosion radius"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Activate Bomb Power-up (Priority: P1)

When a player receives the Bomb power-up from the level-up modal and selects it, the next piece to spawn becomes a bomb piece. The bomb piece is visually distinct and will explode upon landing.

**Why this priority**: This is the foundation - without activation and marking the next piece as a bomb, the entire explosion mechanic cannot function.

**Independent Test**: Can be fully tested by selecting the Bomb power-up and verifying that the next piece is marked/displayed as a bomb piece. Delivers immediate value by preparing the explosive piece.

**Acceptance Scenarios**:

1. **Given** player levels up and sees the power-up modal, **When** player selects Bomb (💣), **Then** the next piece to spawn is marked as a bomb piece
2. **Given** Bomb is activated, **When** the next piece preview updates, **Then** the preview shows a bomb indicator (bomb icon or distinct visual style)
3. **Given** Bomb is activated, **When** the marked bomb piece spawns, **Then** the piece displays with a bomb visual indicator (different color, icon overlay, or distinct style)
4. **Given** a bomb piece is spawned, **When** player views the piece, **Then** it's clearly distinguishable from normal pieces

---

### User Story 2 - Control Bomb Piece Normally (Priority: P1)

A bomb piece can be controlled just like a normal piece - moved left/right, rotated, soft dropped, and hard dropped. The bomb functionality only triggers when the piece locks in place.

**Why this priority**: Players need to be able to position the bomb strategically. Without normal controls, the bomb can't be used effectively.

**Independent Test**: Can be tested by spawning a bomb piece and verifying all movement and rotation controls work normally. Delivers value by enabling strategic bomb placement.

**Acceptance Scenarios**:

1. **Given** a bomb piece is active, **When** player presses left/right arrow keys, **Then** the bomb piece moves horizontally like a normal piece
2. **Given** a bomb piece is active, **When** player presses rotation keys, **Then** the bomb piece rotates like a normal piece
3. **Given** a bomb piece is active, **When** player presses down arrow (soft drop), **Then** the bomb piece drops faster like a normal piece
4. **Given** a bomb piece is active, **When** player presses hard drop key, **Then** the bomb piece instantly drops to the bottom like a normal piece
5. **Given** a bomb piece is in motion, **When** collision occurs, **Then** the bomb piece obeys normal collision rules until it locks

---

### User Story 3 - Bomb Explosion on Landing (Priority: P1)

When a bomb piece locks in place on the board, it triggers a 3x3 explosion centered on the bomb's position. All blocks within the 3x3 area are cleared, including the bomb piece itself.

**Why this priority**: This is the core mechanic - the explosion effect that makes the bomb valuable. Without this, the bomb is just a normal piece.

**Independent Test**: Can be fully tested by locking a bomb piece and verifying a 3x3 area is cleared. Delivers the primary value of the bomb power-up by clearing blocks.

**Acceptance Scenarios**:

1. **Given** a bomb piece locks in place, **When** the lock occurs, **Then** a 3x3 explosion is triggered centered on the bomb's center block
2. **Given** a bomb explosion occurs, **When** blocks exist within the 3x3 explosion radius, **Then** all those blocks are cleared (removed)
3. **Given** a bomb explosion occurs, **When** the explosion area includes the bomb piece itself, **Then** the bomb piece is also cleared
4. **Given** a bomb explosion clears blocks, **When** the explosion completes, **Then** blocks above the cleared area fall down to fill gaps
5. **Given** a bomb piece is placed, **When** the explosion occurs, **Then** the board updates visually to show the cleared blocks

---

### User Story 4 - Explosion Boundary Handling (Priority: P2)

When a bomb explodes near the edges or corners of the board, the explosion only affects blocks that exist within the board boundaries. The explosion doesn't cause errors or extend beyond the board.

**Why this priority**: Important for game stability and correct behavior, but can be tested after basic explosion works. Prevents edge case bugs.

**Independent Test**: Can be tested by placing bombs at board edges and corners and verifying safe explosion behavior. Delivers value by ensuring robust bomb mechanics.

**Acceptance Scenarios**:

1. **Given** a bomb is placed at the left edge of the board, **When** the bomb explodes, **Then** only blocks within the board (right side of 3x3) are cleared
2. **Given** a bomb is placed at the right edge of the board, **When** the bomb explodes, **Then** only blocks within the board (left side of 3x3) are cleared
3. **Given** a bomb is placed at the bottom edge of the board, **When** the bomb explodes, **Then** only blocks within the board (upper part of 3x3) are cleared
4. **Given** a bomb is placed in a corner, **When** the bomb explodes, **Then** only the valid quadrant of the 3x3 area is cleared
5. **Given** a bomb explosion at the edge, **When** the explosion executes, **Then** no errors occur and the game continues normally

---

### User Story 5 - Visual Explosion Effect (Priority: P3)

When a bomb explodes, a visual effect (animation, flash, or highlight) indicates the explosion area, making it clear to players what was cleared.

**Why this priority**: Enhances user experience and clarity but the bomb is fully functional without it. Players can still see the result (cleared blocks).

**Independent Test**: Can be tested by triggering a bomb explosion and observing the visual effect. Delivers value through better feedback and polish.

**Acceptance Scenarios**:

1. **Given** a bomb explodes, **When** the explosion occurs, **Then** a visual effect (flash, animation, or highlight) appears in the 3x3 area
2. **Given** an explosion visual effect plays, **When** the effect completes, **Then** the board returns to normal display with cleared blocks
3. **Given** a bomb explodes, **When** the visual effect displays, **Then** the effect is noticeable but doesn't obstruct gameplay for other pieces

---

### User Story 6 - Line Clearing After Explosion (Priority: P3)

After a bomb explosion clears blocks and blocks fall down to fill gaps, the system checks for completed lines and clears them normally.

**Why this priority**: Integrates bomb with existing game systems. Can be tested after basic explosion works. Ensures consistent game behavior.

**Independent Test**: Can be tested by arranging a scenario where a bomb explosion results in completed lines. Delivers value by maximizing bomb effectiveness.

**Acceptance Scenarios**:

1. **Given** a bomb explosion causes blocks to fall and complete a line, **When** the falling completes, **Then** the completed line is cleared normally
2. **Given** a bomb explosion clears blocks, **When** blocks fall to fill gaps, **Then** multiple lines can be cleared if multiple rows become complete
3. **Given** line clearing occurs after a bomb explosion, **When** lines are cleared, **Then** score is awarded for both the bomb and the line clears

---

### Edge Cases

- What happens when a bomb explodes with no other blocks nearby (empty area)?
- What happens when multiple bombs are somehow active simultaneously?
- What happens when a bomb explosion would clear blocks that are part of another piece still in motion?
- What happens when a bomb is the first piece on an empty board?
- What happens when a bomb explosion occurs at the exact moment another power-up activates?
- What happens when a bomb piece is part of a multi-block piece shape (which block is the center)?
- What happens when the 3x3 explosion would affect the next piece spawn area?
- What happens when a bomb explodes during reverse gravity or other special modes?

## Requirements *(mandatory)*

### Functional Requirements

#### Activation Requirements

- **FR-001**: System MUST provide Bomb as a selectable power-up in the level-up modal with "Next Piece" type
- **FR-002**: System MUST mark the next piece to spawn as a bomb piece when Bomb power-up is selected
- **FR-003**: System MUST display a bomb indicator on the next piece preview when Bomb is active
- **FR-004**: System MUST apply a bomb visual marker to the piece when it spawns (icon overlay, distinct color, or special styling)

#### Piece Control Requirements

- **FR-005**: System MUST allow bomb pieces to move left and right using arrow keys like normal pieces
- **FR-006**: System MUST allow bomb pieces to rotate using rotation keys like normal pieces
- **FR-007**: System MUST allow bomb pieces to soft drop using down arrow like normal pieces
- **FR-008**: System MUST allow bomb pieces to hard drop using space bar like normal pieces
- **FR-009**: System MUST apply normal collision detection to bomb pieces during movement
- **FR-010**: System MUST apply normal gravity to bomb pieces (they fall at normal speed)

#### Explosion Requirements

- **FR-011**: System MUST trigger an explosion when a bomb piece locks in place on the board
- **FR-012**: System MUST create a 3x3 explosion area centered on the bomb piece's center block
- **FR-013**: System MUST clear all blocks within the 3x3 explosion area (set cells to empty/0)
- **FR-014**: System MUST clear the bomb piece itself as part of the explosion
- **FR-015**: System MUST calculate the explosion center based on the bomb piece's position coordinates

#### Boundary Handling Requirements

- **FR-016**: System MUST limit the explosion area to within the board boundaries (no out-of-bounds access)
- **FR-017**: System MUST handle explosions at the left edge correctly (partial 3x3 area)
- **FR-018**: System MUST handle explosions at the right edge correctly (partial 3x3 area)
- **FR-019**: System MUST handle explosions at the bottom edge correctly (partial 3x3 area)
- **FR-020**: System MUST handle explosions at the top edge correctly (partial 3x3 area)
- **FR-021**: System MUST handle explosions in corners correctly (quarter or partial 3x3 area)

#### Post-Explosion Requirements

- **FR-022**: System MUST cause blocks above cleared cells to fall down after the explosion
- **FR-023**: System MUST check for completed lines after blocks settle from the explosion
- **FR-024**: System MUST clear any completed lines formed after the bomb explosion
- **FR-025**: System MUST award score for both the bomb explosion and any subsequent line clears
- **FR-026**: System MUST update the board display after the explosion completes

#### Power-up Management Requirements

- **FR-027**: System MUST consume the Bomb power-up after the bomb piece is spawned (one-time use)
- **FR-028**: System MUST remove the bomb marker from the next piece after the bomb piece spawns
- **FR-029**: System MUST return to normal piece generation after the bomb piece is used

#### Visual Effect Requirements (Optional)

- **FR-030**: System SHOULD display a visual effect (flash, animation, particles) when the bomb explodes
- **FR-031**: System SHOULD make the explosion area visually distinct for a brief moment
- **FR-032**: System SHOULD complete any visual effects within 0.5 seconds to avoid delaying gameplay

### Key Entities

- **Bomb Piece**: A specially marked game piece that triggers an explosion effect when locked, identified by a flag or property and displayed with distinct visuals
- **Explosion Center**: The grid coordinates (x, y) of the bomb piece's center block, used to calculate the 3x3 explosion area
- **Explosion Area**: A 3x3 grid of cells centered on the explosion center, representing all blocks that will be cleared by the bomb
- **Bomb Marker**: A flag or property attached to a piece indicating it's a bomb, used by the lock logic to trigger explosion

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Players can activate Bomb power-up and see the next piece marked as a bomb within 0.5 seconds
- **SC-002**: Bomb pieces can be controlled with 100% of normal piece controls (move, rotate, drop)
- **SC-003**: Bomb explosions clear exactly the correct 3x3 area in 100% of cases
- **SC-004**: Bomb explosions at board edges handle boundaries correctly without errors in 100% of cases
- **SC-005**: Blocks fall correctly after bomb explosions in 100% of cases
- **SC-006**: Line clearing integrates with bomb explosions correctly in 100% of test scenarios
- **SC-007**: 80% of players understand how to use the bomb strategically within their first use
- **SC-008**: Bomb explosions add strategic value: 70% of players report using bombs to clear difficult situations

## Assumptions

- The game has an existing lockPiece() function that can be extended to check for bomb pieces
- A piece can be marked with a flag or property (e.g., isBomb: true) to identify it as a bomb
- The 3x3 explosion is calculated from the piece's position (x, y) as the center
- For multi-block pieces, the center is defined as the piece's position coordinate
- Bomb explosion happens immediately when the piece locks (no delay)
- Cleared blocks from explosion are treated the same as cleared blocks from line clearing (blocks fall to fill gaps)
- Visual effects are optional and enhance experience but are not required for functionality
- Only one piece at a time can be a bomb (no simultaneous multiple bomb pieces)

## Out of Scope

- Variable explosion sizes (always 3x3, not configurable)
- Chain reactions or multiple explosions
- Damage or special effects on neighboring pieces
- Bomb pieces that don't explode (duds)
- Ability to defuse or cancel a bomb
- Delayed explosions or timed bombs
- Different explosion shapes (always square 3x3)
- Sound effects for explosions
- Particle effects or complex animations
- Multiple bomb pieces per power-up activation (always one bomb piece)
