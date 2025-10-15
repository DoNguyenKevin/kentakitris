# Feature Specification: Difficulty Selection System

**Feature Branch**: `003-the-difficulty-feature`  
**Created**: October 15, 2025  
**Status**: Draft  
**Input**: User description: "the difficulty feature - khi bắt đầu, sẽ có một dòng thông báo hỏi muốn chúng ta chọn độ khó. 1 dễ: cho người mới bắt đầu, 2:bình thường: cho người có chút kinh nghiệm, 3: khó : dành cho người nhiều kinh nghiệm (sẽ có các khối năng lượng của con boss mini nhưng sẽ chỉ đi xuống chậm, phải phá không khi nó cạm vào các khối ở đáy thì bạn sẽ thua), 4: impossible :không ai thắng được các khối năng lượng xuất hiện nhiều hơn và rơi xuống cực nhanh và chúng cực nguy hiểm, chúng có tỉ lệ nổ khi con trỏ chuột lại gần, khi nổ nó sẽ khến cho người chơi không thể cử động trỏ chuột trong 3 giây"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Display Difficulty Selection Screen (Priority: P1)

When a player starts the game, they see a message prompting them to select a difficulty level from four options: Easy, Normal, Hard, and Impossible. Each option includes a brief description to help players understand what to expect.

**Why this priority**: This is the foundation of the feature - without the ability to select difficulty, none of the other difficulty-specific behaviors can be tested or experienced. It's the entry point for all subsequent functionality.

**Independent Test**: Can be fully tested by launching the game and verifying that the difficulty selection prompt appears with all four options and descriptions. Delivers immediate value by allowing players to make an informed choice about their gameplay experience.

**Acceptance Scenarios**:

1. **Given** the game is launched, **When** the start screen appears, **Then** a difficulty selection prompt is displayed before gameplay begins
2. **Given** the difficulty selection prompt is shown, **When** the player views the options, **Then** four difficulty levels are listed: Easy (1), Normal (2), Hard (3), and Impossible (4)
3. **Given** the difficulty selection prompt is shown, **When** the player views each option, **Then** each level displays a description indicating the target player skill level

---

### User Story 2 - Easy Mode Gameplay (Priority: P2)

A beginner player selects Easy mode (option 1) to experience gameplay designed for those new to the game. The game proceeds with easier mechanics suitable for learning.

**Why this priority**: This is the first difficulty implementation and serves as the baseline experience for new players. It's essential for player onboarding and retention.

**Independent Test**: Can be fully tested by selecting Easy mode and verifying that gameplay proceeds with beginner-friendly characteristics. Delivers value by providing an accessible entry point for new players.

**Acceptance Scenarios**:

1. **Given** the difficulty selection prompt is displayed, **When** the player selects option 1 (Easy), **Then** the game starts with Easy mode active
2. **Given** Easy mode is active, **When** gameplay begins, **Then** the game uses slower piece falling speeds and simpler mechanics appropriate for beginners
3. **Given** Easy mode is active, **When** the player is playing, **Then** no energy blocks appear during gameplay

---

### User Story 3 - Normal Mode Gameplay (Priority: P2)

A player with some experience selects Normal mode (option 2) to play with standard game mechanics that provide a balanced challenge.

**Why this priority**: This represents the standard gameplay experience and serves as the reference difficulty for players with basic familiarity with the game.

**Independent Test**: Can be fully tested by selecting Normal mode and verifying that gameplay has moderate difficulty characteristics. Delivers value by providing an appropriate challenge for intermediate players.

**Acceptance Scenarios**:

1. **Given** the difficulty selection prompt is displayed, **When** the player selects option 2 (Normal), **Then** the game starts with Normal mode active
2. **Given** Normal mode is active, **When** gameplay begins, **Then** the game uses standard piece falling speeds and standard mechanics
3. **Given** Normal mode is active, **When** the player is playing, **Then** game difficulty remains consistent with balanced challenge

---

### User Story 4 - Hard Mode with Energy Blocks (Priority: P3)

An experienced player selects Hard mode (option 3) to face a challenging gameplay experience that includes special energy blocks inspired by mini-boss mechanics.

**Why this priority**: This adds complexity for advanced players but depends on core difficulty selection working properly. It's valuable for player retention but not essential for initial functionality.

**Independent Test**: Can be fully tested by selecting Hard mode and verifying that energy blocks appear and function as described. Delivers value by providing an engaging challenge for skilled players.

**Acceptance Scenarios**:

1. **Given** the difficulty selection prompt is displayed, **When** the player selects option 3 (Hard), **Then** the game starts with Hard mode active
2. **Given** Hard mode is active, **When** gameplay begins, **Then** energy blocks periodically appear and fall slowly down the board
3. **Given** an energy block is falling, **When** it reaches the bottom and touches other blocks, **Then** the player must destroy the energy block before it settles
4. **Given** an energy block has settled at the bottom, **When** the player has not destroyed it, **Then** the game ends with a loss condition

---

### User Story 5 - Impossible Mode with Hazardous Energy Blocks (Priority: P4)

A highly skilled player seeking extreme challenge selects Impossible mode (option 4) to face extremely difficult gameplay with numerous fast-falling energy blocks that have explosive properties.

**Why this priority**: This is an advanced feature for a niche audience of expert players. It can be implemented last as it builds on Hard mode mechanics with additional complexity.

**Independent Test**: Can be fully tested by selecting Impossible mode and verifying that energy blocks appear frequently, fall rapidly, and exhibit explosive behavior. Delivers value by providing ultimate challenge for mastery-seeking players.

**Acceptance Scenarios**:

1. **Given** the difficulty selection prompt is displayed, **When** the player selects option 4 (Impossible), **Then** the game starts with Impossible mode active
2. **Given** Impossible mode is active, **When** gameplay begins, **Then** energy blocks appear more frequently than in Hard mode
3. **Given** Impossible mode is active, **When** energy blocks are falling, **Then** they fall significantly faster than in Hard mode
4. **Given** an energy block is on the board, **When** the mouse cursor moves near it, **Then** the block has a chance to explode
5. **Given** an energy block explodes, **When** the explosion occurs, **Then** the player cannot move the mouse cursor for 3 seconds
6. **Given** Impossible mode is active, **When** the player attempts to play, **Then** the difficulty is extremely high with minimal margin for error

---

### Edge Cases

- What happens when the player closes the game without selecting a difficulty?
- What happens if the player tries to change difficulty mid-game?
- How does the system handle saving the last selected difficulty preference?
- What happens when energy blocks appear in positions that are already occupied?
- What happens when multiple energy blocks explode simultaneously in Impossible mode?
- How does the game handle the 3-second mouse freeze period if another explosion occurs during the freeze?
- What happens when the player pauses the game during the mouse freeze period?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a difficulty selection prompt when the game starts, before gameplay begins
- **FR-002**: System MUST provide four difficulty options: Easy (1), Normal (2), Hard (3), and Impossible (4)
- **FR-003**: System MUST display descriptive text for each difficulty level indicating the target player skill level
- **FR-004**: System MUST allow players to select one difficulty level using number keys or mouse interaction
- **FR-005**: System MUST start gameplay immediately after a difficulty level is selected
- **FR-006**: System MUST adjust game mechanics (piece falling speed, energy block behavior) based on the selected difficulty level
- **FR-007**: System MUST NOT spawn energy blocks in Easy mode
- **FR-008**: System MUST NOT spawn energy blocks in Normal mode
- **FR-009**: System MUST spawn energy blocks periodically in Hard mode with slow falling speed
- **FR-010**: System MUST end the game when an energy block settles at the bottom without being destroyed in Hard mode
- **FR-011**: System MUST spawn energy blocks more frequently in Impossible mode compared to Hard mode
- **FR-012**: System MUST make energy blocks fall significantly faster in Impossible mode compared to Hard mode
- **FR-013**: System MUST implement explosion probability for energy blocks when the mouse cursor is near them in Impossible mode
- **FR-014**: System MUST disable mouse cursor movement for 3 seconds when an energy block explodes in Impossible mode
- **FR-015**: System MUST visually distinguish energy blocks from regular game pieces
- **FR-016**: System MUST prevent player actions during the mouse freeze period in Impossible mode
- **FR-017**: System MUST track which difficulty level is currently active throughout the game session
- **FR-018**: System MUST maintain consistent difficulty settings until the game ends or is restarted

### Key Entities

- **Difficulty Level**: Represents the selected game difficulty (Easy, Normal, Hard, Impossible) with associated gameplay parameters such as piece speed, energy block spawn rate, and energy block behavior
- **Energy Block**: A special game element that appears in Hard and Impossible modes, has different falling speeds per difficulty, must be destroyed before settling, and can explode near the mouse cursor in Impossible mode
- **Mouse Freeze State**: A temporary game state in Impossible mode that prevents mouse cursor movement for a specific duration after an energy block explosion

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Players can select a difficulty level within 5 seconds of starting the game
- **SC-002**: Each difficulty level provides a noticeably different gameplay experience that matches its description
- **SC-003**: 90% of beginners can complete at least one line clear in Easy mode within their first 3 attempts
- **SC-004**: Hard mode energy blocks are visually distinct and players can identify them immediately upon appearance
- **SC-005**: Impossible mode energy block explosions consistently freeze mouse movement for exactly 3 seconds
- **SC-006**: Players can understand the differences between difficulty levels from the selection screen descriptions without needing external documentation
- **SC-007**: The difficulty selection system does not add more than 10 seconds to the game startup time
- **SC-008**: Players report feeling appropriately challenged for their selected difficulty level in post-game feedback

## Assumptions

- Players are familiar with basic keyboard number keys (1-4) or can use mouse clicks to select options
- The game already has established mechanics for piece falling speed that can be adjusted per difficulty
- The existing energy block system (from previous features) can be extended with explosion mechanics
- Players expect increasing difficulty to correlate with faster gameplay and more hazards
- A 3-second mouse freeze is long enough to be challenging but not so long as to cause player frustration to the point of quitting
- The mouse cursor proximity detection for explosions uses a reasonable distance threshold (specific distance to be determined during implementation)
- The game has a pause function that can properly handle the mouse freeze state
- Players understand that Impossible mode is designed to be extremely difficult and may not be beatable by most players
