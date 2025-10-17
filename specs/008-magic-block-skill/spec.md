# Feature Specification: Magic Block Skill

**Feature Branch**: `008-magic-block-skill`  
**Created**: October 15, 2025  
**Status**: Draft  
**Input**: User description: "Magic Block (✨ Magic Block) - Next piece type modifier that automatically fills gaps in the board when the piece lands, using smart placement to fill up to 5 empty cells"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Activate Magic Block Power-up (Priority: P1)

When a player receives the Magic Block power-up from the level-up modal and selects it, the next piece to spawn becomes a magic block piece. The magic piece is visually distinct and will auto-fill gaps when it lands.

**Why this priority**: This is the foundation - without activation and marking the next piece as magic, the entire gap-filling mechanic cannot function.

**Independent Test**: Can be fully tested by selecting the Magic Block power-up and verifying that the next piece is marked/displayed as a magic piece. Delivers immediate value by preparing the magic piece.

**Acceptance Scenarios**:

1. **Given** player levels up and sees the power-up modal, **When** player selects Magic Block (✨), **Then** the next piece to spawn is marked as a magic block piece
2. **Given** Magic Block is activated, **When** the next piece preview updates, **Then** the preview shows a magic indicator (sparkle icon or distinct visual style)
3. **Given** Magic Block is activated, **When** the marked magic piece spawns, **Then** the piece displays with a magic visual indicator (sparkles, glow, or distinct color)
4. **Given** a magic piece is spawned, **When** player views the piece, **Then** it's clearly distinguishable from normal pieces

---

### User Story 2 - Control Magic Piece Normally (Priority: P1)

A magic piece can be controlled just like a normal piece - moved left/right, rotated, soft dropped, and hard dropped. The magic functionality only triggers when the piece locks in place.

**Why this priority**: Players need to be able to position the magic piece strategically. Without normal controls, the piece can't be used effectively.

**Independent Test**: Can be tested by spawning a magic piece and verifying all movement and rotation controls work normally. Delivers value by enabling strategic piece placement.

**Acceptance Scenarios**:

1. **Given** a magic piece is active, **When** player presses left/right arrow keys, **Then** the magic piece moves horizontally like a normal piece
2. **Given** a magic piece is active, **When** player presses rotation keys, **Then** the magic piece rotates like a normal piece
3. **Given** a magic piece is active, **When** player presses down arrow (soft drop), **Then** the magic piece drops faster like a normal piece
4. **Given** a magic piece is active, **When** player presses hard drop key, **Then** the magic piece instantly drops to the bottom like a normal piece
5. **Given** a magic piece is in motion, **When** collision occurs, **Then** the magic piece obeys normal collision rules until it locks

---

### User Story 3 - Detect Gaps on Landing (Priority: P1)

When a magic piece locks in place, the system scans the entire board to identify all empty cells (gaps) that are surrounded by blocks. These gaps are candidates for auto-filling.

**Why this priority**: This is the core detection mechanism - without identifying gaps, there's nothing to fill. This is essential for the magic block functionality.

**Independent Test**: Can be fully tested by creating boards with various gap patterns and verifying the system correctly identifies all gaps. Delivers value by enabling the smart filling logic.

**Acceptance Scenarios**:

1. **Given** a magic piece locks in place, **When** the lock occurs, **Then** the system scans all cells on the board to find empty cells
2. **Given** the system scans for gaps, **When** an empty cell has blocks on at least two sides, **Then** that cell is identified as a gap
3. **Given** gaps are being identified, **When** multiple gaps exist, **Then** all valid gaps are found and recorded
4. **Given** the board is being scanned, **When** edge cells are checked, **Then** board boundaries count as "surrounding" for gap detection

---

### User Story 4 - Smart Gap Filling with Priority (Priority: P1)

After identifying gaps, the system fills them using a smart algorithm that prioritizes the deepest or most valuable gaps first. Up to 5 gaps are filled with blocks matching the magic piece's color.

**Why this priority**: This is the core value proposition - the intelligent gap filling that makes the magic block "magic". Without this, the power-up serves no purpose.

**Independent Test**: Can be fully tested by creating scenarios with various gap configurations and verifying correct prioritization and filling. Delivers the primary value of the power-up.

**Acceptance Scenarios**:

1. **Given** gaps are identified after a magic piece lands, **When** the filling algorithm runs, **Then** gaps are prioritized with deepest/lowest gaps filled first
2. **Given** more than 5 gaps exist, **When** filling occurs, **Then** exactly 5 gaps are filled (the top 5 by priority)
3. **Given** 5 or fewer gaps exist, **When** filling occurs, **Then** all gaps are filled
4. **Given** gaps are being filled, **When** a gap is filled, **Then** the filled cell receives a block with the same color as the magic piece
5. **Given** gaps are filled, **When** the filling completes, **Then** the board updates visually to show the new blocks

---

### User Story 5 - Gap Priority Algorithm (Priority: P2)

The gap-filling algorithm uses a smart priority system that considers gap depth (vertical position), surrounding blocks, and strategic value to determine which gaps to fill first.

**Why this priority**: Enhances the strategic value of the magic block, but basic filling (any 5 gaps) would still be useful. Can be refined after basic gap detection and filling work.

**Independent Test**: Can be tested by creating specific gap patterns and verifying the expected gaps are prioritized. Delivers enhanced strategic value.

**Acceptance Scenarios**:

1. **Given** multiple gaps exist at different heights, **When** priority is calculated, **Then** gaps lower on the board (higher Y coordinate) receive higher priority
2. **Given** gaps exist at the same height, **When** priority is calculated, **Then** gaps with more surrounding blocks receive higher priority
3. **Given** gaps exist in different configurations, **When** priority is calculated, **Then** gaps that would help complete lines receive bonus priority
4. **Given** the priority algorithm runs, **When** sorting gaps, **Then** the algorithm produces a consistent and deterministic ordering

---

### User Story 6 - Line Clearing After Gap Filling (Priority: P2)

After the magic block fills gaps and places the original piece, the system checks for completed lines and clears them normally. Gap filling can help complete lines for bonus score.

**Why this priority**: Integrates magic block with existing game systems. Can be tested after basic gap filling works. Maximizes the power-up's effectiveness.

**Independent Test**: Can be tested by arranging scenarios where gap filling results in completed lines. Delivers value by rewarding strategic magic block placement.

**Acceptance Scenarios**:

1. **Given** gap filling completes a line, **When** the filling finishes, **Then** the completed line is cleared normally
2. **Given** gap filling completes multiple lines, **When** the filling finishes, **Then** all completed lines are cleared
3. **Given** lines are cleared after gap filling, **When** line clearing occurs, **Then** score is awarded for both the gap filling and the line clears
4. **Given** the magic piece placement itself completes a line, **When** combined with gap filling, **Then** all applicable lines are cleared together

---

### User Story 7 - Visual Indicators for Gap Filling (Priority: P3)

When gaps are filled, visual effects (highlights, animations, sparkles) show which cells were filled by the magic block, providing clear feedback to the player.

**Why this priority**: Enhances user experience and understanding but the magic block is fully functional without it. Players can still see the result (filled gaps).

**Independent Test**: Can be tested by triggering magic block gap filling and observing visual effects. Delivers value through better feedback and polish.

**Acceptance Scenarios**:

1. **Given** gaps are filled by a magic block, **When** filling occurs, **Then** visual effects (sparkles, flash, or highlight) appear on filled cells
2. **Given** visual effects for gap filling play, **When** the effects complete, **Then** the board returns to normal display with filled gaps visible
3. **Given** multiple gaps are filled, **When** visual effects play, **Then** effects are synchronized or staggered for clarity

---

### Edge Cases

- What happens when there are no gaps on the board when a magic piece lands?
- What happens when there are exactly 5 gaps on the board?
- What happens when gaps exist but they're all in positions that wouldn't help gameplay (e.g., isolated single cells)?
- What happens when multiple magic blocks are somehow active simultaneously?
- What happens when a magic piece lands in a way that the original piece placement itself creates or fills gaps?
- What happens when gaps are identified in the same row and filling them would complete a line?
- What happens when the board is nearly full and gaps are scattered throughout?
- What happens when a magic block is used during reverse gravity or other special modes?
- What happens when gap filling causes cascading effects (filled gaps enable more line clears)?

## Requirements *(mandatory)*

### Functional Requirements

#### Activation Requirements

- **FR-001**: System MUST provide Magic Block as a selectable power-up in the level-up modal with "Next Piece" type
- **FR-002**: System MUST mark the next piece to spawn as a magic block piece when Magic Block power-up is selected
- **FR-003**: System MUST display a magic indicator on the next piece preview when Magic Block is active
- **FR-004**: System MUST apply a magic visual marker to the piece when it spawns (sparkles, glow, or special styling)

#### Piece Control Requirements

- **FR-005**: System MUST allow magic pieces to move left and right using arrow keys like normal pieces
- **FR-006**: System MUST allow magic pieces to rotate using rotation keys like normal pieces
- **FR-007**: System MUST allow magic pieces to soft drop using down arrow like normal pieces
- **FR-008**: System MUST allow magic pieces to hard drop using space bar like normal pieces
- **FR-009**: System MUST apply normal collision detection to magic pieces during movement
- **FR-010**: System MUST apply normal gravity to magic pieces (they fall at normal speed)

#### Gap Detection Requirements

- **FR-011**: System MUST scan the entire board for empty cells when a magic piece locks
- **FR-012**: System MUST identify cells as gaps when they are empty (no block present)
- **FR-013**: System MUST record the position (x, y coordinates) of all identified gaps
- **FR-014**: System MUST detect gaps regardless of their position on the board
- **FR-015**: System MUST complete gap detection before initiating gap filling

#### Gap Filling Requirements

- **FR-016**: System MUST fill a maximum of 5 gaps per magic block activation
- **FR-017**: System MUST fill all gaps if 5 or fewer gaps exist on the board
- **FR-018**: System MUST select which gaps to fill based on a priority algorithm
- **FR-019**: System MUST fill selected gaps with blocks matching the magic piece's color
- **FR-020**: System MUST update the board data structure to reflect filled gaps

#### Priority Algorithm Requirements

- **FR-021**: System MUST prioritize gaps based on vertical position (lower/deeper gaps first)
- **FR-022**: System MUST consider gap depth as the primary priority factor (Y coordinate, higher values = higher priority for standard gravity)
- **FR-023**: System MUST use additional factors (surrounding blocks, strategic value) as secondary priority criteria
- **FR-024**: System MUST produce a deterministic gap ordering (same gaps always produce same priority)
- **FR-025**: System MUST sort all identified gaps by priority before selecting the top 5

#### Post-Filling Requirements

- **FR-026**: System MUST check for completed lines after gaps are filled
- **FR-027**: System MUST clear any lines completed by the gap filling
- **FR-028**: System MUST award score for gap filling effects
- **FR-029**: System MUST award score for any subsequent line clears
- **FR-030**: System MUST update the board display after gap filling completes

#### Power-up Management Requirements

- **FR-031**: System MUST consume the Magic Block power-up after the magic piece is spawned (one-time use)
- **FR-032**: System MUST remove the magic marker from the next piece after the magic piece spawns
- **FR-033**: System MUST return to normal piece generation after the magic piece is used

#### Visual Effect Requirements (Optional)

- **FR-034**: System SHOULD display visual effects (sparkles, highlights, animations) when gaps are filled
- **FR-035**: System SHOULD make filled gaps visually distinct for a brief moment
- **FR-036**: System SHOULD complete any visual effects within 0.5 seconds to avoid delaying gameplay

#### Edge Case Handling Requirements

- **FR-037**: System MUST handle the case when no gaps exist (magic piece behaves as normal piece)
- **FR-038**: System MUST handle the case when gaps exist but are fewer than 5
- **FR-039**: System MUST handle gap filling when the board is nearly full
- **FR-040**: System MUST ensure gap filling doesn't cause invalid board states or errors

### Key Entities

- **Magic Piece**: A specially marked game piece that triggers gap-filling logic when locked, identified by a flag or property and displayed with distinct visuals
- **Gap**: An empty cell on the board that is a candidate for filling, represented by its coordinates (x, y) and priority score
- **Gap Priority**: A numerical score assigned to each gap based on depth, surroundings, and strategic value, used to rank gaps for filling
- **Gap List**: A collection of all identified gaps, sorted by priority, from which the top 5 are selected for filling

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Players can activate Magic Block power-up and see the next piece marked as magic within 0.5 seconds
- **SC-002**: Magic pieces can be controlled with 100% of normal piece controls (move, rotate, drop)
- **SC-003**: Gap detection identifies all valid gaps on the board with 100% accuracy
- **SC-004**: Gap filling fills exactly up to 5 gaps (or all gaps if fewer) in 100% of cases
- **SC-005**: Priority algorithm consistently selects the deepest/most valuable gaps in 95% of test scenarios
- **SC-006**: Line clearing integrates with gap filling correctly in 100% of test scenarios
- **SC-007**: 80% of players understand the gap-filling mechanic within their first use
- **SC-008**: Magic Block adds strategic value: 70% of players report using it to fix board problems

## Assumptions

- The game has an existing lockPiece() function that can be extended to check for magic pieces
- A piece can be marked with a flag or property (e.g., isMagic: true) to identify it as magic
- Gaps are defined as empty cells (no surrounding requirement) or cells with partial surroundings
- The priority algorithm can be a simple depth-first approach (lowest Y = highest priority)
- Gap filling happens immediately when the piece locks (no delay)
- Filled blocks use the same color as the magic piece for visual consistency
- Visual effects are optional and enhance experience but are not required for functionality
- Only one piece at a time can be a magic block (no simultaneous multiple magic pieces)
- Maximum of 5 gaps filled is sufficient to provide value without being overpowered

## Out of Scope

- Variable number of gaps filled (always up to 5, not configurable)
- Player choice of which gaps to fill (always automatic based on priority)
- Different fill patterns or shapes
- Magic blocks that fill gaps in specific patterns (e.g., horizontal lines only)
- Ability to preview which gaps will be filled before placing the piece
- Different colors for filled gaps vs. the magic piece
- Sound effects for gap filling
- Complex particle effects or animations
- Multiple magic pieces per power-up activation (always one magic piece)
- Gap filling that extends beyond immediate neighbors (no recursive filling)
