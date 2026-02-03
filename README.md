# Cartpanda Funnel Builder

A drag-and-drop visual editor for building sales funnels with upsells and downsells. Built as a practical test for Cartpanda's Front-end Engineer position.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- Modern browser with ES6+ support

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd cartpanda-funnel-builder

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:5173` (or the port Vite assigns).

## 📋 Features

### Core Functionality
- **Visual Canvas**: Infinite pan-able canvas with zoom controls and grid background
- **5 Node Types**: Sales Page, Order Page, Upsell, Downsell, Thank You
- **Drag & Drop**: Drag nodes from palette onto canvas
- **Connections**: Visual arrows connecting nodes with validation rules
- **Auto-increment Labels**: Upsell/Downsell nodes automatically numbered

### Validation & Rules
- Real-time validation with visual warnings
- Thank You nodes cannot have outgoing connections
- Sales Page should have exactly one outgoing connection
- Orphan node detection

### Persistence
- Auto-save to localStorage
- Export funnel as JSON file
- Import funnel from JSON file
- Manual save/load controls

### Polish Features
- Undo/Redo (50 state history)
- Delete nodes and edges (Backspace/Delete keys)
- Multi-select support (Cmd/Ctrl + click)
- Mini-map for navigation
- Validation panel with error/warning summary

## 🏗️ Architecture Overview

### Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **React Flow** for graph/canvas functionality
- **Tailwind CSS** for styling
- **ESLint** for code quality

### Project Structure

```
src/
├── components/          # React components
│   ├── canvas/          # Canvas-related components
│   ├── nodes/           # Node type components
│   ├── palette/         # Node palette sidebar
│   ├── layout/         # Layout components
│   └── ui/             # Reusable UI components
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
├── constants/           # Configuration constants
└── types/               # TypeScript type definitions
```

### Key Architectural Decisions

#### 1. Custom Hooks Pattern
Business logic is extracted into reusable hooks:
- `useFunnelState`: Central state management
- `useNodeFactory`: Node creation logic
- `useValidation`: Real-time validation
- `useUndoRedo`: History management
- `useLocalStorage`: Persistence layer

**Rationale**: Keeps components clean, logic testable, and promotes reusability.

#### 2. Separation of Concerns
- **Components**: Pure presentation logic
- **Hooks**: Business logic and state
- **Utils**: Pure functions (validation, persistence)
- **Constants**: Configuration and magic strings

**Rationale**: Makes codebase maintainable and easier to reason about.

#### 3. React Flow Integration
Uses React Flow for canvas functionality rather than building from scratch.

**Rationale**: 
- Saves significant development time
- Handles complex edge cases (pan, zoom, connections)
- Well-maintained library with good TypeScript support
- Customizable enough for our needs

#### 4. TypeScript Strict Mode
All code is strictly typed with no `any` types.

**Rationale**: Catches errors at compile time, improves IDE support, and serves as documentation.

#### 5. Validation State Enrichment
Validation state is computed and attached to nodes at render time rather than stored.

**Rationale**: 
- Single source of truth (nodes + edges)
- Validation always reflects current state
- No sync issues between stored and computed state

## 🎯 Design Decisions & Tradeoffs

### What We Built

1. **Visual Editor Only**: No actual page editing functionality
   - **Why**: Focus on core drag-and-drop UX and validation
   - **Tradeoff**: Can't edit node content, but keeps scope manageable

2. **localStorage for Persistence**: No backend required
   - **Why**: Simple, works offline, no auth needed
   - **Tradeoff**: Limited to single browser, but sufficient for MVP

3. **React Flow Over Custom Canvas**: Using library instead of building from scratch
   - **Why**: Faster development, handles complex interactions
   - **Tradeoff**: Larger bundle size (~300KB), but saves weeks of development

4. **Simple Undo/Redo**: Stack-based history, not time-travel debugging
   - **Why**: Simpler implementation, sufficient for user needs
   - **Tradeoff**: Can't inspect intermediate states, but 50-state limit is reasonable

5. **No Unit Tests**: Focus on working implementation
   - **Why**: Time constraints, practical test scope
   - **Tradeoff**: Less confidence in edge cases, but code is structured for easy testing later

6. **Validation Panel Over Inline Errors**: Separate panel instead of inline messages
   - **Why**: Cleaner UI, doesn't clutter canvas
   - **Tradeoff**: Less immediate feedback, but visual indicators on nodes help

### What We Skipped (Intentionally)

1. **Real Page Editing**: Nodes are visual representations only
   - **Why**: Out of scope for visual editor test
   - **Tradeoff**: Can't edit page content, but focuses on funnel structure visualization

2. **Backend Integration**: All state is client-side
   - **Why**: Test requirement specifies visual editor only, no backend needed
   - **Tradeoff**: No cloud sync, but localStorage is sufficient for MVP

3. **Authentication**: Not required for this test
   - **Why**: Explicitly not evaluated per requirements
   - **Tradeoff**: No multi-user support, but keeps scope focused

4. **Advanced Animations**: Basic transitions only
   - **Why**: Focus on core functionality over polish
   - **Tradeoff**: Less polished feel, but faster development and smaller bundle

5. **Collaborative Editing**: Single-user focus
   - **Why**: Not required for test, adds significant complexity
   - **Tradeoff**: No real-time collaboration, but sufficient for single-user use case

6. **Version History**: Basic undo/redo only
   - **Why**: Simple undo/redo meets requirements
   - **Tradeoff**: No persistent history or branching, but 50-state limit covers most needs

7. **Snap-to-Grid**: Nodes can be placed freely
   - **Why**: Not critical for MVP, can be added later if needed
   - **Tradeoff**: Less precise alignment, but more flexible positioning

8. **Keyboard Drag-and-Drop**: Mouse/touch required for dragging
   - **Why**: Keyboard drag-and-drop is complex and non-standard
   - **Tradeoff**: Less accessible for keyboard-only users, but ARIA labels and keyboard navigation provided for other interactions

## ♿ Accessibility

### WCAG Compliance

- **ARIA Labels**: All interactive elements properly labeled
- **Keyboard Navigation**: Tab order, focus management
- **Screen Reader Support**: Semantic HTML, sr-only text
- **Color Contrast**: WCAG AA compliant
- **Focus Indicators**: Visible focus rings on all interactive elements

### Keyboard Shortcuts

- `Delete` / `Backspace`: Delete selected nodes/edges
- `Cmd/Ctrl + Click`: Multi-select nodes
- `Ctrl + Z`: Undo (browser default)
- `Ctrl + Shift + Z`: Redo (browser default)

## 🐛 Known Limitations

1. **Undo/Redo**: History is lost on page refresh (not persisted)
2. **Node Counters**: Reset on import/load (could be improved)
3. **Validation**: Some rules are warnings, not enforced
4. **Mobile**: Not optimized for touch devices
5. **Performance**: May slow with 100+ nodes (no virtualization)

## 🔮 Future Improvements

If this were a production app, I'd prioritize:

1. **Testing**: Unit tests for hooks/utils, integration tests for flows
2. **Performance**: Virtualization for large canvases, memoization optimization
3. **UX**: Better error messages, loading states, toast notifications
4. **Features**: Node templates, copy/paste, snap-to-grid
5. **Backend**: Real persistence, collaboration, version control
6. **Mobile**: Touch-optimized interactions

## 📝 Development Notes

### Adding a New Node Type

1. Add type to `src/types/funnel.types.ts`
2. Add template to `src/constants/nodeConfig.ts`
3. Create component in `src/components/nodes/`
4. Register in `src/hooks/useNodeTypes.ts`
5. Update validation rules if needed

### Modifying Validation Rules

Edit `src/utils/nodeValidation.ts` and `src/hooks/useValidation.ts`. Validation state is computed on-demand, so changes take effect immediately.

## 📄 License

This project was built as a practical test for Cartpanda. All rights reserved.

---

**Built with ❤️ for Cartpanda**
