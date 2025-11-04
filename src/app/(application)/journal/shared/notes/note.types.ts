export interface Note {
  id: string;
  title: string;
  content: string;
  createdBy: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  lastModified: string;
  tags: string[];
}

export interface NoteFormData {
  title: string;
  content: string;
  tags: string[];
}

export interface NoteListItem {
  id: string;
  title: string;
  preview: string;
  date: string;
  tags: string[];
}
