# Feature Specification: Game Settings with Speed Display

**Feature Branch**: `002-show-speed-number`  
**Created**: October 15, 2025  
**Status**: Draft  
**Input**: User description: "show speed number - Thêm nút Settings - Cho phép hiển thị số tốc độ hay không trong settings - Chuyển các giá trị có thể config vào settings"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Current Game Speed (Priority: P1)

Players want to see the current speed level of their game to understand how fast blocks are falling and to track their progression.

**Why this priority**: This is the core value of the feature - providing players with real-time feedback about game difficulty. It can be implemented and tested independently without requiring the settings menu.

**Independent Test**: Can be fully tested by starting a game and observing the speed number displayed on screen. Delivers immediate value by showing players their current game speed.

**Acceptance Scenarios**:

1. **Given** player is in an active game, **When** game is running, **Then** current speed number is visible on screen
2. **Given** player completes a line, **When** speed increases, **Then** displayed speed number updates to reflect new speed
3. **Given** player uses a power-up that affects speed, **When** speed changes, **Then** displayed number reflects the current speed

---

### User Story 2 - Access Settings Menu (Priority: P2)

Players want to access a settings menu to customize their gameplay experience.

**Why this priority**: Provides the foundation for configuration but has value even with minimal settings. Players can access it independently to see available options.

**Independent Test**: Can be tested by clicking the Settings button and verifying the menu opens with current configuration options. Delivers value by giving players control over their experience.

**Acceptance Scenarios**:

1. **Given** player is on the main menu, **When** player clicks Settings button, **Then** settings menu opens
2. **Given** player is in an active game, **When** player clicks Settings button, **Then** settings menu opens and game pauses
3. **Given** settings menu is open, **When** player closes the menu, **Then** settings are saved and player returns to previous screen

---

### User Story 3 - Toggle Speed Display Visibility (Priority: P2)

Players want to choose whether the speed number is displayed during gameplay to customize their visual experience.

**Why this priority**: Enhances user control and addresses different player preferences (some may find the number distracting). Works independently once settings menu exists.

**Independent Test**: Can be tested by toggling the setting and starting a game to verify speed number appears or disappears accordingly. Delivers value by letting players customize their UI.

**Acceptance Scenarios**:

1. **Given** player is in settings menu, **When** player toggles "Show Speed" option ON, **Then** speed number displays during gameplay
2. **Given** player is in settings menu, **When** player toggles "Show Speed" option OFF, **Then** speed number is hidden during gameplay
3. **Given** player has set speed display preference, **When** player starts a new game, **Then** preference is remembered and applied

---

### User Story 4 - Configure Game Parameters (Priority: P3)

Players want to adjust configurable game parameters (such as starting speed, speed increase rate, etc.) to customize difficulty and gameplay experience.

**Why this priority**: Provides advanced customization for experienced players. Less critical than viewing speed and basic settings access, but adds depth to the gaming experience.

**Independent Test**: Can be tested by changing a parameter in settings, starting a game, and observing that the game behavior reflects the configuration. Delivers value by enabling custom difficulty levels.

**Acceptance Scenarios**:

1. **Given** player is in settings menu, **When** player adjusts a configurable parameter, **Then** new value is displayed and preview of impact is shown (if applicable)
2. **Given** player has modified game parameters, **When** player starts a new game, **Then** game uses the configured values
3. **Given** player wants to revert changes, **When** player clicks "Reset to Default", **Then** all parameters return to original values

---

### Edge Cases

- What happens when speed number display is toggled during an active game?
- How does the system handle invalid parameter values entered in settings?
- What happens when settings menu is opened on different screen sizes (mobile vs desktop)?
- How does the game handle conflicting settings (e.g., speed parameters that would make game unplayable)?
- What happens if player closes settings without explicitly saving?

## Requirements *(mandatory)*

### Functional Requirements

#### Speed Display Requirements

- **FR-001**: System MUST display the current game speed as a numerical value during active gameplay
- **FR-002**: System MUST update the speed display in real-time when speed changes occur
- **FR-003**: System MUST calculate and display speed based on the game's current difficulty level
- **FR-004**: Speed display MUST be visible and readable without obstructing gameplay area

#### Settings Menu Requirements

- **FR-005**: System MUST provide a Settings button accessible from the main menu
- **FR-006**: System MUST provide a Settings button accessible during active gameplay
- **FR-007**: System MUST pause the game when Settings menu is opened during gameplay
- **FR-008**: System MUST resume the game state when Settings menu is closed during gameplay
- **FR-009**: Settings menu MUST be closable through explicit user action (close button or equivalent)

#### Speed Display Toggle Requirements

- **FR-010**: Settings menu MUST include a toggle option for showing/hiding the speed number
- **FR-011**: System MUST persist the speed display preference across game sessions
- **FR-012**: System MUST apply the speed display preference immediately when toggled during gameplay
- **FR-013**: Default setting MUST show speed number (opt-out model)

#### Configurable Parameters Requirements

- **FR-014**: Settings menu MUST allow configuration of game parameters that currently exist as hardcoded values
- **FR-015**: System MUST validate all parameter inputs to ensure game remains playable
- **FR-016**: System MUST persist all configured parameters across game sessions
- **FR-017**: Settings menu MUST provide a "Reset to Default" option to restore original values
- **FR-018**: System MUST apply new parameter values when a new game starts (not mid-game)

#### Settings Persistence Requirements

- **FR-019**: System MUST save all settings changes when Settings menu is closed
- **FR-020**: System MUST load saved settings when game starts
- **FR-021**: System MUST handle cases where no saved settings exist (use defaults)

### Key Entities

- **GameSettings**: Represents all user-configurable preferences including speed display visibility, game parameters (starting speed, speed increment, etc.), and other gameplay configurations
- **SpeedIndicator**: Represents the visual display of current game speed, with properties for visibility state, current speed value, and display position
- **GameSpeed**: Represents the current speed level of the game, which changes based on player progress and configured parameters

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Players can view current game speed within 1 second of game start
- **SC-002**: Players can access settings menu within 2 clicks from any game state
- **SC-003**: Players can toggle speed display visibility and see the change applied immediately (within 0.5 seconds)
- **SC-004**: Settings changes persist across 100% of game sessions when browser storage is available
- **SC-005**: Settings menu loads and displays within 1 second of being opened
- **SC-006**: 90% of players can successfully find and modify settings on first attempt without instructions
- **SC-007**: Game remains playable and stable with all valid parameter configurations
- **SC-008**: Players can reset all settings to default values within 2 clicks

## Assumptions

- **Settings Storage**: Settings will be persisted using browser's local storage mechanism (standard for web games)
- **Default Speed Display**: Speed number will be shown by default, giving players the option to hide it if preferred
- **Settings Application**: Parameter changes will apply to new games only, not modify ongoing games mid-session
- **Configurable Parameters**: Parameters to be made configurable will be identified from existing game code (e.g., starting speed, speed increase per level, initial block drop delay, etc.)
- **Settings Menu Design**: Settings menu will follow standard UI patterns for web-based games with clear labels and controls
- **Performance**: Settings menu operations (open, close, save) will not cause noticeable lag or interruption
- **Browser Compatibility**: Settings persistence will degrade gracefully if local storage is unavailable (use session-only defaults)
- **Mobile Responsiveness**: Settings menu will be usable on both desktop and mobile screen sizes

## Out of Scope

- Visual themes or skins for the game
- Audio settings (volume, sound effects on/off) - unless already present in current code
- Keyboard control remapping
- Multiple player profiles or accounts
- Settings import/export functionality
- Advanced statistics or analytics dashboard
- Language/localization settings
- Accessibility-specific settings (though basic usability should be maintained)
