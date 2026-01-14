# Tauri Architecture Specification

## Purpose

This document specifies the architecture for rebuilding RadFlow as a native desktop application using Tauri. It maps the current feature set to a Rust backend with a React frontend, enabling true native capabilities.

---

## Why Tauri?

### Current Limitations
The web-based architecture has constraints.

**Problems:**
- Requires dev server running
- HTTP overhead for filesystem access
- No native git integration
- Limited CLI tool integration
- Can't run without browser
- Heavy for a local tool

### Tauri Benefits
Native architecture solves these problems.

**Advantages:**
- Single binary distribution (~10MB)
- Direct filesystem access
- Native git via git2-rs
- Process spawning for CLI tools
- Runs without browser/server
- OS-native performance

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    RadFlow Desktop                       │
├────────────────────────┬────────────────────────────────┤
│      Rust Backend      │        React Frontend          │
├────────────────────────┼────────────────────────────────┤
│                        │                                │
│  ┌──────────────────┐  │  ┌──────────────────────────┐  │
│  │   File System    │  │  │    Variables Editor      │  │
│  │   • Watch        │  │  │    Typography Editor     │  │
│  │   • Read/Write   │  │  │    Component Preview     │  │
│  │   • Index        │  │  │    Asset Browser         │  │
│  └──────────────────┘  │  │    Canvas View           │  │
│                        │  │    Search                │  │
│  ┌──────────────────┐  │  └──────────────────────────┘  │
│  │      Git         │  │                                │
│  │   • Status       │  │  ┌──────────────────────────┐  │
│  │   • Commit       │  │  │    State Management      │  │
│  │   • Fetch/Pull   │  │  │    (Zustand)             │  │
│  │   • Diff         │  │  └──────────────────────────┘  │
│  └──────────────────┘  │                                │
│                        │  ┌──────────────────────────┐  │
│  ┌──────────────────┐  │  │    Tauri IPC Bridge      │  │
│  │    Parsers       │  │  │    (Commands)            │  │
│  │   • CSS          │  │  └──────────────────────────┘  │
│  │   • TSX          │  │                                │
│  │   • Theme        │  │                                │
│  └──────────────────┘  │                                │
│                        │                                │
│  ┌──────────────────┐  │                                │
│  │   CLI/Process    │  │                                │
│  │   • Spawn        │  │                                │
│  │   • AI Tools     │  │                                │
│  └──────────────────┘  │                                │
│                        │                                │
└────────────────────────┴────────────────────────────────┘
```

---

## Rust Backend Modules

### File System Module
Native filesystem operations.

**Responsibilities:**
- Read files with proper encoding
- Write files atomically
- Watch directories for changes
- Build and maintain file index
- Handle file locks

**Key Functions:**
- `read_file(path)` → File content
- `write_file(path, content)` → Success/Error
- `watch_directory(path)` → Event stream
- `index_directory(path)` → File tree
- `file_exists(path)` → Boolean

### CSS Parser Module
Parse and manipulate CSS.

**Responsibilities:**
- Parse @theme blocks
- Parse @layer blocks
- Extract token definitions
- Modify token values
- Regenerate valid CSS

**Key Functions:**
- `parse_css(content)` → CSS AST
- `extract_tokens(ast)` → Token list
- `update_token(ast, name, value)` → Modified AST
- `serialize_css(ast)` → CSS string

**Recommended Crate:** `lightningcss`

### TSX Parser Module
Parse React components.

**Responsibilities:**
- Extract component definitions
- Parse props interfaces
- Identify variants and sizes
- Extract default values
- Understand component structure

**Key Functions:**
- `parse_component(content)` → Component metadata
- `extract_props(ast)` → Props list
- `find_variants(ast)` → Variant definitions
- `update_styles(ast, changes)` → Modified AST

**Recommended Crate:** `swc` (SWC Rust bindings)

### Git Module
Native git operations.

**Responsibilities:**
- Repository status
- Staging and committing
- Fetching and pulling
- Diff generation
- Branch management

**Key Functions:**
- `repo_status(path)` → Status info
- `stage_files(paths)` → Success/Error
- `commit(message)` → Commit hash
- `fetch(remote)` → Success/Error
- `diff(from, to)` → Diff content
- `current_branch()` → Branch name

**Recommended Crate:** `git2`

### Process Module
Spawn and manage external processes.

**Responsibilities:**
- Spawn CLI tools
- Capture output
- Handle stdin/stdout
- Manage long-running processes
- AI CLI integration

**Key Functions:**
- `spawn(command, args)` → Process handle
- `spawn_with_stdin(command, input)` → Output
- `kill_process(handle)` → Success/Error
- `get_output(handle)` → Output stream

### Project Index Module
Build and query project index.

**Responsibilities:**
- Index all components
- Index all tokens
- Index all assets
- Provide fast search
- Keep index updated

**Key Functions:**
- `build_index(root)` → Project index
- `search(query)` → Results
- `get_component(name)` → Component data
- `get_token(name)` → Token data
- `refresh_index()` → Updated index

### Theme Module
Theme management operations.

**Responsibilities:**
- List available themes
- Switch active theme
- Read theme configuration
- Write theme changes
- Theme file resolution

**Key Functions:**
- `list_themes()` → Theme list
- `get_active_theme()` → Theme ID
- `switch_theme(id)` → Success/Error
- `get_theme_paths(id)` → File paths
- `save_theme_changes(id, changes)` → Success/Error

---

## Tauri Commands

### Command Pattern
How frontend communicates with backend.

**Pattern:**
```
Frontend (React)
     │
     │  invoke("command_name", { args })
     ▼
Tauri IPC Bridge
     │
     │  Rust handler function
     ▼
Backend (Rust)
     │
     │  Return Result<T, Error>
     ▼
Frontend receives response
```

### File Commands

| Command | Args | Returns |
|---------|------|---------|
| `read_file` | path: String | content: String |
| `write_file` | path: String, content: String | success: bool |
| `list_directory` | path: String | entries: Vec<Entry> |
| `watch_start` | path: String | watch_id: String |
| `watch_stop` | watch_id: String | success: bool |

### Parser Commands

| Command | Args | Returns |
|---------|------|---------|
| `parse_css` | content: String | tokens: TokenList |
| `parse_component` | path: String | component: ComponentMeta |
| `update_css_token` | path: String, name: String, value: String | success: bool |

### Git Commands

| Command | Args | Returns |
|---------|------|---------|
| `git_status` | repo_path: String | status: RepoStatus |
| `git_commit` | message: String, files: Vec<String> | commit_hash: String |
| `git_fetch` | remote: String | success: bool |
| `git_diff` | from: String, to: String | diff: DiffResult |
| `git_log` | count: u32 | commits: Vec<Commit> |

### Project Commands

| Command | Args | Returns |
|---------|------|---------|
| `index_project` | root: String | index: ProjectIndex |
| `search_project` | query: String | results: SearchResults |
| `get_component` | name: String | component: ComponentData |
| `list_components` | - | components: Vec<ComponentMeta> |

### Theme Commands

| Command | Args | Returns |
|---------|------|---------|
| `list_themes` | - | themes: Vec<Theme> |
| `get_current_theme` | - | theme_id: String |
| `switch_theme` | theme_id: String | success: bool |
| `save_theme` | changes: ThemeChanges | success: bool |

---

## Frontend Adaptation

### State Management
Keep Zustand store architecture.

**Changes:**
- Replace API calls with Tauri invoke
- Add loading states for IPC
- Handle native errors
- File watcher integration

### Component Reuse
Most React components unchanged.

**Reusable:**
- UI components (buttons, inputs, panels)
- Editor interfaces
- Preview renderers
- Layout components

**Modified:**
- Data fetching hooks
- File operations
- Save/load logic

### New Frontend Additions
Canvas editor components.

**New Components:**
- Canvas renderer
- Node components
- Layers panel
- Selection overlay
- Zoom controls

---

## Event System

### File Watcher Events
Real-time file change notifications.

**Events:**
- `file:created` — New file added
- `file:modified` — File content changed
- `file:deleted` — File removed
- `file:renamed` — File moved/renamed

### Git Events
Repository state changes.

**Events:**
- `git:status_changed` — Working tree changed
- `git:commit_created` — New commit
- `git:fetch_complete` — Remote fetched
- `git:branch_changed` — Branch switched

### Theme Events
Theme-related changes.

**Events:**
- `theme:switched` — Active theme changed
- `theme:modified` — Theme values changed
- `theme:created` — New theme added

---

## Data Flow

### Reading Design Tokens
How tokens load on startup.

**Flow:**
1. Frontend requests current theme
2. Backend returns theme ID and paths
3. Frontend requests CSS content
4. Backend reads and parses CSS
5. Backend returns parsed tokens
6. Frontend populates store
7. UI renders token editors

### Saving Token Changes
How edits persist.

**Flow:**
1. User edits token value
2. Frontend updates store (pending)
3. User clicks Save
4. Frontend invokes save command
5. Backend updates CSS AST
6. Backend writes file atomically
7. Backend returns success
8. Frontend clears pending state
9. File watcher confirms change

### Component Discovery
How components are indexed.

**Flow:**
1. App starts or project opens
2. Frontend requests index build
3. Backend walks component directories
4. Backend parses each component file
5. Backend builds searchable index
6. Backend returns component metadata
7. Frontend populates components store
8. UI renders component browser

---

## Migration Path

### Phase 1: Tauri Shell
Wrap existing app with minimal changes.

**Steps:**
- Create Tauri project structure
- Configure build for React
- Replace Next.js with Vite
- Basic file read/write commands
- Verify existing UI works

### Phase 2: Native Filesystem
Replace HTTP-based file operations.

**Steps:**
- Implement all file commands
- Replace API routes with invoke
- Add file watcher
- Test file operations

### Phase 3: Native Parsers
Move parsing to Rust.

**Steps:**
- Implement CSS parser with lightningcss
- Implement TSX parser with SWC
- Replace JS parsers with Rust commands
- Verify parsing accuracy

### Phase 4: Git Integration
Add native git support.

**Steps:**
- Implement git2 wrapper
- Add status display
- Add commit capability
- Add fetch/pull capability
- Add diff viewing

### Phase 5: Project Index
Build fast search system.

**Steps:**
- Implement index builder
- Add incremental updates
- Create search interface
- Integrate with UI search

### Phase 6: Canvas Editor
Add new canvas view.

**Steps:**
- Implement canvas renderer
- Add node system
- Add selection system
- Add layers panel
- Integrate with existing data

---

## Recommended Crates

| Crate | Purpose | Version |
|-------|---------|---------|
| tauri | App framework | 2.0 |
| git2 | Git operations | 0.18 |
| notify | File watching | 6.0 |
| lightningcss | CSS parsing | 1.0 |
| swc_ecma_parser | TSX parsing | 0.144 |
| serde | Serialization | 1.0 |
| serde_json | JSON handling | 1.0 |
| tokio | Async runtime | 1.0 |
| anyhow | Error handling | 1.0 |
| tantivy | Full-text search | 0.21 |

---

## Project Structure

```
radflow/
├── src-tauri/
│   ├── src/
│   │   ├── main.rs           # Tauri entry point
│   │   ├── lib.rs            # Module exports
│   │   ├── commands/
│   │   │   ├── mod.rs
│   │   │   ├── file.rs       # File commands
│   │   │   ├── git.rs        # Git commands
│   │   │   ├── parser.rs     # Parser commands
│   │   │   ├── project.rs    # Project commands
│   │   │   └── theme.rs      # Theme commands
│   │   ├── parser/
│   │   │   ├── mod.rs
│   │   │   ├── css.rs        # CSS parsing
│   │   │   └── tsx.rs        # TSX parsing
│   │   ├── watcher/
│   │   │   └── mod.rs        # File watcher
│   │   ├── index/
│   │   │   └── mod.rs        # Project indexer
│   │   └── types/
│   │       └── mod.rs        # Shared types
│   ├── Cargo.toml
│   ├── tauri.conf.json
│   └── build.rs
├── src/                      # React frontend
│   ├── components/
│   ├── store/
│   ├── hooks/
│   ├── canvas/               # New canvas components
│   └── ...
├── package.json
├── vite.config.ts
└── index.html
```

---

## Success Criteria

### Performance
- Cold start < 500ms
- File operations < 10ms
- Search results < 50ms
- UI interactions < 16ms

### Reliability
- No data loss on crash
- Atomic file writes
- Graceful error handling
- Recovery from edge cases

### Compatibility
- macOS 11+
- Windows 10+
- Linux (major distros)

### Distribution
- Single binary
- No runtime dependencies
- Auto-update support
- Code signing ready

---

## Research Notes

### Complexity Assessment
**Reference Document** — This spec defines the technical foundation. Research is for implementation.

### Research Required

**Tauri 2.0**
- Tauri 2.0 stable release status
- Migration from Tauri 1.x patterns
- Plugin ecosystem
- IPC patterns and best practices

**CSS Parsing (lightningcss)**
- API for parsing CSS custom properties
- AST modification and serialization
- Error handling for malformed CSS
- Performance characteristics

**TSX Parsing (SWC)**
- swc_ecma_parser API
- TypeScript interface extraction
- JSX traversal patterns
- Props default value extraction

**Git Operations (git2)**
- Repository initialization and detection
- Staging and committing files
- Status and diff operations
- Branch management

**File Watching (notify)**
- Debouncing file events
- Recursive directory watching
- Cross-platform behavior differences
- Performance with large directories

**Search (tantivy)**
- Schema definition for design system content
- Index building and updating
- Fuzzy search configuration
- Query syntax

### Search Terms
```
"tauri 2.0 tutorial"
"tauri 2.0 migration guide"
"lightningcss rust api"
"lightningcss parse custom properties"
"swc_ecma_parser typescript example"
"swc extract interface rust"
"git2-rs tutorial"
"git2 commit example rust"
"notify-rs debounce"
"tantivy tutorial"
"tantivy fuzzy search"
```

### Crate Documentation Links

| Crate | Docs |
|-------|------|
| Tauri | https://tauri.app/v2/guides/ |
| lightningcss | https://docs.rs/lightningcss/ |
| swc_ecma_parser | https://rustdoc.swc.rs/swc_ecma_parser/ |
| git2 | https://docs.rs/git2/ |
| notify | https://docs.rs/notify/ |
| tantivy | https://docs.rs/tantivy/ |

### Proof-of-Concept Priority

Before full implementation, build small POCs for:

1. **CSS Parsing** — Parse @theme block, extract tokens, modify, serialize
2. **TSX Parsing** — Extract props interface from component file
3. **Git Commit** — Stage files, create commit, get status
4. **File Watcher** — Watch directory, debounce events, trigger callbacks
5. **Search Index** — Index components, fuzzy search, rank results

### Technical Risks

| Risk | Mitigation |
|------|------------|
| lightningcss doesn't support @theme | Use regex fallback or custom parser |
| SWC API complexity | Start with simple cases, expand |
| git2 cross-platform issues | Test on macOS, Windows, Linux early |
| Tantivy memory usage | Benchmark with large projects |

### Open Questions
- Tauri 2.0: stable enough for production?
- Vite vs other bundlers for frontend?
- Monorepo structure: separate crates or single src-tauri?
- Auto-update: Tauri built-in or custom?
- Code signing: Apple notarization process?
