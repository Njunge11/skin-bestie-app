# Journal Backend Optimization Plan

## Current Implementation (Temporary)

The journal feature currently uses **in-memory mock data** with a single endpoint that returns ALL journal entries with FULL content:

```typescript
GET /api/journeys (mock - fetchJourneysAction)
{
  success: true,
  data: [
    { id: "1", title: "...", content: "...FULL LEXICAL JSON...", ... },
    { id: "2", title: "...", content: "...FULL LEXICAL JSON...", ... },
    // ... all 20 entries with full content
  ]
}
```

**Scalability Issues:**
- ❌ Fetches full content for ALL entries (~100KB+ payload with 20 entries)
- ❌ Loads 19 entries' content that aren't being viewed
- ❌ High memory usage in browser
- ❌ Slow on poor network connections
- ❌ Doesn't scale beyond 20-50 entries

---

## Recommended Backend Implementation

### **API Endpoints**

#### 1. List Journals (Lightweight + First Entry Content)

```http
GET /api/consumer-app/journeys?userId={userId}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-1",
      "title": "Starting My Journey",
      "content": "{...full Lexical JSON...}",  // ✅ Include content for FIRST entry only
      "createdBy": {
        "id": "user-123",
        "name": "John Doe"
      },
      "createdAt": "2024-01-15T10:30:00Z",
      "lastModified": "2024-01-15T10:30:00Z",
      "tags": ["routine", "beginner"]
    },
    {
      "id": "uuid-2",
      "title": "Week 2: Purging Phase",
      "content": null,  // ❌ No content for other entries
      "createdBy": {
        "id": "user-123",
        "name": "John Doe"
      },
      "createdAt": "2024-01-29T08:15:00Z",
      "lastModified": "2024-01-29T08:15:00Z",
      "tags": ["progress", "breakout"]
    }
    // ... rest of entries without content field
  ]
}
```

**Query Parameters (Optional Future Enhancement):**
- `?includeContent=first` (default) - Include content for first entry only
- `?includeContent=recent3` - Include content for 3 most recent entries
- `?includeContent=none` - No content, pure lightweight list

**Sort Order:**
- Entries sorted by `createdAt` descending (newest first)

**Payload Size:**
- Lightweight: ~2KB (metadata for 20 entries)
- First entry content: ~5KB
- **Total: ~7KB** vs current ~100KB

---

#### 2. Get Single Journal (Full Content)

```http
GET /api/consumer-app/journeys/:journeyId?userId={userId}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-2",
    "title": "Week 2: Purging Phase",
    "content": "{...full Lexical JSON...}",  // ✅ Full content
    "createdBy": {
      "id": "user-123",
      "name": "John Doe"
    },
    "createdAt": "2024-01-29T08:15:00Z",
    "lastModified": "2024-01-29T08:15:00Z",
    "tags": ["progress", "breakout"]
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": {
    "message": "Journey not found",
    "code": "NOT_FOUND"
  }
}
```

---

#### 3. Create Journal

```http
POST /api/consumer-app/journeys
Content-Type: application/json

{
  "userId": "user-123",
  "title": "Untitled Journal Entry",
  "content": "",
  "tags": []
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-new",
    "title": "Untitled Journal Entry",
    "content": "",
    "createdBy": {
      "id": "user-123",
      "name": "John Doe"
    },
    "createdAt": "2024-11-08T14:30:00Z",
    "lastModified": "2024-11-08T14:30:00Z",
    "tags": []
  }
}
```

---

#### 4. Update Journal

```http
PATCH /api/consumer-app/journeys/:journeyId
Content-Type: application/json

{
  "userId": "user-123",
  "title": "Updated Title",  // Optional
  "content": "{...updated Lexical JSON...}",  // Optional
  "tags": ["updated", "tags"]  // Optional
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-2",
    "title": "Updated Title",
    "content": "{...updated Lexical JSON...}",
    "createdBy": {
      "id": "user-123",
      "name": "John Doe"
    },
    "createdAt": "2024-01-29T08:15:00Z",
    "lastModified": "2024-11-08T14:45:00Z",  // Updated timestamp
    "tags": ["updated", "tags"]
  }
}
```

---

#### 5. Delete Journal

```http
DELETE /api/consumer-app/journeys/:journeyId?userId={userId}
```

**Response:**
```json
{
  "success": true,
  "data": null
}
```

---

## Frontend Implementation Changes

### Current Code (Using Mock Data)

**File:** `src/app/(application)/journal/actions/journey-actions.ts`

```typescript
// CURRENT: Returns all entries with full content
export async function fetchJourneysAction(): Promise<Result<Journey[]>> {
  // ... mock data with full content for all entries
  return { success: true, data: journeys };
}
```

### Updated Code (With Real Backend)

```typescript
/**
 * Fetch all journeys with lightweight data + first entry content
 */
export async function fetchJourneysAction(): Promise<Result<Journey[]>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: { message: "Unauthorized", code: "UNAUTHORIZED" },
      };
    }

    const result = await api.get(
      `/api/consumer-app/journeys?userId=${session.user.id}`
    );

    return { success: true, data: result.data };
  } catch (error) {
    console.error("Error fetching journeys:", error);
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : "Failed to fetch journeys",
      },
    };
  }
}

/**
 * Fetch single journey with full content
 * Only called when navigating to an entry that doesn't have content cached
 */
export async function fetchJourneyAction(
  journeyId: string
): Promise<Result<Journey>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: { message: "Unauthorized", code: "UNAUTHORIZED" },
      };
    }

    const result = await api.get(
      `/api/consumer-app/journeys/${journeyId}?userId=${session.user.id}`
    );

    return { success: true, data: result.data };
  } catch (error) {
    console.error("Error fetching journey:", error);

    if ((error as ApiError).status === 404) {
      return {
        success: false,
        error: { message: "Journey not found", code: "NOT_FOUND" },
      };
    }

    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : "Failed to fetch journey",
      },
    };
  }
}
```

### Page Component Logic

**File:** `src/app/(application)/journal/page.tsx`

```typescript
const { data, isLoading, error } = useJourneys();
const journeys = data?.success ? data.data : [];
const firstEntry = journeys[0];

// First entry already has content from list query - no need for second fetch!
const selectedEntry = firstEntry
  ? {
      ...firstEntry,
      // Apply draft recovery logic
      content: localDraft?.timestamp > new Date(firstEntry.lastModified).getTime()
        ? localDraft.content
        : firstEntry.content,
      title: localDraft?.timestamp > new Date(firstEntry.lastModified).getTime()
        ? localDraft.title
        : firstEntry.title,
    }
  : null;
```

**File:** `src/app/(application)/journal/[id]/page.tsx`

```typescript
const { data: journeysData } = useJourneys();
const journeys = journeysData?.success ? journeysData.data : [];

// Find entry in cached list
const cachedEntry = journeys.find(j => j.id === id);

// Only fetch full content if not in cache or content is null
const { data: journeyData, isLoading: isLoadingEntry } = useJourney(id, {
  enabled: !cachedEntry || cachedEntry.content === null,
});

// Use cached entry if it has content, otherwise use fetched data
const serverEntry = (cachedEntry?.content ? cachedEntry : journeyData?.success ? journeyData.data : null);
```

---

## Benefits of This Approach

### ✅ Performance
- **Initial load:** ~7KB vs ~100KB (93% reduction)
- **First view:** Instant (no second query)
- **Subsequent views:** Fetch on-demand (~5KB per entry)

### ✅ Scalability
- Works with 100+ entries
- Works with 1000+ entries (with pagination)
- Minimal memory footprint

### ✅ Network Efficiency
- Only fetches what's needed
- Mobile-friendly (low data usage)
- Fast on slow connections

### ✅ User Experience
- Sidebar loads instantly
- First entry loads instantly
- Smooth navigation
- Proper loading states for on-demand fetches

### ✅ Caching Strategy
- TanStack Query caches individual entries
- Navigate back = instant (cached)
- Fresh data on invalidation
- Optimistic updates work perfectly

---

## Migration Checklist

### Backend Tasks
- [ ] Create `GET /api/consumer-app/journeys` endpoint
  - [ ] Return lightweight list
  - [ ] Include full content for first entry only
  - [ ] Sort by createdAt descending
  - [ ] Validate userId authentication
- [ ] Create `GET /api/consumer-app/journeys/:id` endpoint
  - [ ] Return single entry with full content
  - [ ] Validate userId ownership
  - [ ] Return 404 if not found
- [ ] Create `POST /api/consumer-app/journeys` endpoint
  - [ ] Validate request body
  - [ ] Validate userId authentication
  - [ ] Return created entry
- [ ] Create `PATCH /api/consumer-app/journeys/:id` endpoint
  - [ ] Support partial updates
  - [ ] Update lastModified timestamp
  - [ ] Validate userId ownership
- [ ] Create `DELETE /api/consumer-app/journeys/:id` endpoint
  - [ ] Validate userId ownership
  - [ ] Soft delete or hard delete (TBD)
- [ ] Add proper error handling
- [ ] Add input validation/sanitization

### Frontend Tasks
- [ ] Update `fetchJourneysAction()` to call real API
- [ ] Update `fetchJourneyAction()` to call real API
- [ ] Update `createJourneyAction()` to call real API
- [ ] Update `updateJourneyAction()` to call real API
- [ ] Implement `deleteJourneyAction()` (currently TODO)
- [ ] Update `[id]/page.tsx` to check cache before fetching
- [ ] Test optimistic cache updates still work
- [ ] Test draft recovery logic
- [ ] Add loading states for on-demand fetches
- [ ] Handle 404 errors gracefully
- [ ] Remove mock data initialization

### Testing
- [ ] Test initial load performance
- [ ] Test navigation between entries
- [ ] Test creating new entries
- [ ] Test updating entries
- [ ] Test deleting entries
- [ ] Test with slow network (throttling)
- [ ] Test with 100+ entries
- [ ] Test error states
- [ ] Test authentication/authorization

---

## Database Schema (Reference)

### journeys table
```sql
CREATE TABLE journeys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content JSONB,  -- Lexical JSON format
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_modified TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  INDEX idx_journeys_user_id (user_id),
  INDEX idx_journeys_created_at (created_at DESC)
);
```

**Indexes:**
- `user_id` - Fast filtering by user
- `created_at DESC` - Fast sorting (newest first)

---

## Future Enhancements (Optional)

### Pagination
```http
GET /api/consumer-app/journeys?userId={userId}&page=1&limit=20
```

### Search/Filter
```http
GET /api/consumer-app/journeys?userId={userId}&search=skincare&tags=routine
```

### Infinite Scroll
- Load 20 entries initially
- Load more as user scrolls sidebar
- Uses TanStack Query's `useInfiniteQuery`

### Public/Private Sharing
- Add `isPublic` field to Journey model
- Implement sharing with coach
- Add `PATCH /api/consumer-app/journeys/:id/visibility` endpoint

---

## Notes

- This document was created on **2024-11-08**
- Current implementation uses in-memory mock data
- Mock data will be removed once backend endpoints are ready
- Frontend is already optimized for this pattern
- No breaking changes required for existing frontend code

---

## Contact

For questions about this implementation, contact the development team.
