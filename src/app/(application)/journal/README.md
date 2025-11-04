# Journal Feature

A note-taking application following the UI_STRUCTURE.md guidelines.

## Structure

```
journal/
├── shared/                    # Feature domains
│   └── notes/                 # Everything notes-related
│       ├── index.ts           # Barrel export
│       ├── note-actions.ts    # Server actions (CRUD)
│       ├── note.types.ts      # TypeScript types
│       ├── note-list-item.tsx # Note list item component
│       └── note-editor.tsx    # Note editor component
│
├── components/                # Page-level components
│   ├── index.ts               # Barrel export
│   └── journal-sidebar.tsx    # Sidebar with notes list
│
└── page.tsx                   # Main journal page
```

## Features

- **Notes Management**: Create, read, update, and delete notes
- **Rich Text Editor**: Full-featured editor with formatting tools
- **Tags**: Organize notes with tags
- **Search**: Find notes quickly (TODO)
- **Auto-save**: Automatic saving as you type (TODO)

## Usage

```typescript
// Import from feature root
import { NoteEditor, createNoteAction, type Note } from "./shared/notes";

// Use server actions
const result = await createNoteAction({
  title: "My Note",
  content: "Note content",
  tags: ["personal"],
});
```

## Components

### NoteListItem
Displays a note in the sidebar list with preview and tags.

### NoteEditor
Full-featured rich text editor with:
- Title editing
- Content editing
- Tag management
- Formatting toolbar
- Metadata display

### JournalSidebar
Sidebar component showing:
- "Add new note" button
- List of all notes
- Active note highlighting

## Server Actions

All server actions follow the Result pattern:

```typescript
type Result<T> =
  | { success: true; data: T }
  | { success: false; error: { message: string; code?: string } };
```

### Available Actions

- `fetchNotesAction()` - Get all notes
- `fetchNoteAction(id)` - Get single note
- `createNoteAction(data)` - Create new note
- `updateNoteAction(id, data)` - Update note
- `deleteNoteAction(id)` - Delete note

## TODO

- [ ] Connect to real API (currently using mock data)
- [ ] Add search functionality
- [ ] Implement auto-save
- [ ] Add note deletion UI
- [ ] Add rich text formatting (currently textarea)
- [ ] Add image/video upload
- [ ] Add note sharing
- [ ] Add note templates
- [ ] Add export functionality
- [ ] Add tests
