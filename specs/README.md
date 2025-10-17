# Game Skills Specifications

This directory contains specification documents for all game features and skills in Kentakitris.

## Existing Features

### 001 - The Leaderboard Feature
**Status**: Completed  
**Description**: Leaderboard system allowing players to compete and view top scores.

### 002 - Show Speed Number
**Status**: Completed  
**Description**: Game settings with speed display toggle and configurable parameters.

### 003 - The Difficulty Feature
**Status**: Completed  
**Description**: Difficulty selection system with Easy, Normal, Hard, and Impossible modes.

## Advanced Skills (New)

### 004 - Teleport Skill (🌀)
**Type**: Instant Power-up  
**Description**: Click-to-place mechanic that allows players to instantly move the current piece to any valid position on the board by clicking.

**Key Features**:
- Purple glow visual indicator when active
- Crosshair cursor for placement
- One-time use instant effect
- Collision detection for valid placement

**Priority User Stories**:
1. P1: Activate Teleport mode with visual indicators
2. P1: Click to place piece at target location
3. P2: Collision detection and invalid placement handling
4. P3: Teleport mode cancellation

---

### 005 - Reverse Gravity Skill (🔺)
**Type**: Duration Power-up (15 seconds)  
**Description**: Inverts gravity direction, making pieces float upward instead of falling down.

**Key Features**:
- Pieces spawn at bottom and float upward
- All collision detection inverted
- Hard drop shoots pieces to ceiling
- 15-second timer with automatic restoration

**Priority User Stories**:
1. P1: Activate reverse gravity with upward movement
2. P1: Adjust spawn position to bottom of board
3. P1: Invert movement and collision logic
4. P2: Hard drop reversal
5. P2: Timer expiration and gravity restoration

---

### 006 - Wide Mode Skill (📏)
**Type**: Duration Power-up (25 seconds)  
**Description**: Expands the game board from 10 columns to 12 columns temporarily.

**Key Features**:
- Board expands from 10 to 12 columns
- Existing blocks preserved and centered
- Pieces can move across all 12 columns
- Blocks in outer columns removed when timer expires

**Priority User Stories**:
1. P1: Activate and expand board to 12 columns
2. P1: Preserve and center existing blocks
3. P1: Spawn and control pieces in wide mode
4. P2: Line clearing across 12 columns
5. P2: Timer expiration and board contraction

---

### 007 - Bomb Skill (💣)
**Type**: Next Piece Power-up  
**Description**: The next piece becomes a bomb that creates a 3x3 explosion when it lands, clearing all blocks in the area.

**Key Features**:
- Next piece marked with bomb indicator
- Normal piece control until landing
- 3x3 explosion centered on bomb position
- Boundary-safe explosion at edges

**Priority User Stories**:
1. P1: Activate and mark next piece as bomb
2. P1: Control bomb piece normally
3. P1: Trigger 3x3 explosion on landing
4. P2: Handle explosions at board boundaries
5. P3: Visual explosion effects

---

### 008 - Magic Block Skill (✨)
**Type**: Next Piece Power-up  
**Description**: The next piece becomes magic and automatically fills up to 5 gaps in the board when it lands, using smart placement logic.

**Key Features**:
- Next piece marked with magic indicator
- Automatic gap detection on landing
- Smart priority algorithm (deepest gaps first)
- Fills up to 5 gaps with matching color blocks

**Priority User Stories**:
1. P1: Activate and mark next piece as magic
2. P1: Control magic piece normally
3. P1: Detect gaps across entire board
4. P1: Fill gaps with smart priority algorithm
5. P2: Priority algorithm for deepest gaps
6. P2: Line clearing after gap filling

---

## Specification Structure

Each feature/skill follows the speckit template structure:

```
specs/[###-feature-name]/
├── spec.md                      # Main specification document
│   ├── User Scenarios & Testing (with priorities)
│   ├── Requirements (Functional Requirements, Key Entities)
│   └── Success Criteria (Measurable Outcomes)
└── checklists/
    └── requirements.md          # Quality validation checklist
```

## Specification Principles

All specifications follow these principles:

✅ **Technology-Agnostic**: No implementation details (frameworks, languages, APIs)  
✅ **User-Focused**: Written for non-technical stakeholders  
✅ **Testable**: All requirements have clear acceptance criteria  
✅ **Measurable**: Success criteria include specific metrics  
✅ **Prioritized**: User stories ordered by importance (P1, P2, P3)  
✅ **Independent**: Each user story is independently testable  
✅ **Edge Cases**: Comprehensive edge case identification  
✅ **Scope-Bounded**: Clear definition of what's included and excluded

## Using These Specifications

These specifications are ready for:
- `/speckit.plan` - Generate implementation plans
- `/speckit.tasks` - Break down into development tasks
- Technical design - Create architecture and implementation details
- Development - Guide coding and implementation
- Testing - Define test cases and acceptance criteria
- Documentation - Source for user guides and technical docs

## References

- **Template**: `.specify/templates/spec-template.md`
- **Implementation Docs**: 
  - `docs/POWERUPS-IMPLEMENTATION.md`
  - `docs/SKILLS-TECHNICAL.md`
  - `docs/IMPLEMENTATION-SKILLS-SUMMARY.md`
