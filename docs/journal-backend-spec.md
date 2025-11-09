# Journal Backend Integration Specification

**Phase 1: Create Journal + Entries + Image Support**

---

## Database Schema

### 1. `journals` Table (Main Journal Entries)

```sql
CREATE TABLE journals (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Foreign Keys
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Content Fields
  title TEXT NOT NULL DEFAULT 'Untitled Journal Entry',
  content JSONB,  -- Lexical Editor JSON format (see format below)
  tags TEXT[] DEFAULT '{}',

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_modified TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Indexes
  CONSTRAINT journals_title_not_empty CHECK (char_length(title) > 0)
);

-- Indexes for performance
CREATE INDEX idx_journals_user_id ON journals(user_id);
CREATE INDEX idx_journals_created_at ON journals(user_id, created_at DESC);
CREATE INDEX idx_journals_last_modified ON journals(last_modified DESC);
```

**Field Details:**

- **`id`**: UUID, auto-generated
- **`user_id`**: Links to authenticated user, cascade delete on user deletion
- **`title`**: Non-empty text, max recommended 255 chars for UI
- **`content`**: JSONB storing Lexical editor state (see Content Format section)
- **`tags`**: Array of strings for categorization (e.g., `["routine", "progress"]`)
- **`created_at`**: Timestamp when entry was created
- **`last_modified`**: Timestamp when entry was last updated (auto-update on PATCH)

---

## Content Format (Lexical JSON)

The `content` field stores Lexical editor state as JSON. Here's the structure:

### Empty Content (New Entry)
```json
{
  "root": {
    "children": [],
    "direction": "ltr",
    "format": "",
    "indent": 0,
    "type": "root",
    "version": 1
  }
}
```

### Text Content Example
```json
{
  "root": {
    "children": [
      {
        "children": [
          {
            "detail": 0,
            "format": 0,
            "mode": "normal",
            "style": "",
            "text": "This is my first journal entry!",
            "type": "text",
            "version": 1
          }
        ],
        "direction": "ltr",
        "format": "",
        "indent": 0,
        "type": "paragraph",
        "version": 1
      }
    ],
    "direction": "ltr",
    "format": "",
    "indent": 0,
    "type": "root",
    "version": 1
  }
}
```

### Image Node Example
```json
{
  "root": {
    "children": [
      {
        "children": [
          {
            "detail": 0,
            "format": 0,
            "mode": "normal",
            "style": "",
            "text": "Here's my progress photo:",
            "type": "text",
            "version": 1
          }
        ],
        "direction": "ltr",
        "format": "",
        "indent": 0,
        "type": "paragraph",
        "version": 1
      },
      {
        "type": "image",
        "version": 1,
        "src": "https://cdn.skinbestie.com/journals/user-123/abc123.jpg",
        "altText": "Progress photo - Day 30",
        "width": 800,
        "height": 600,
        "maxWidth": 500,
        "showCaption": false,
        "caption": {
          "editorState": {
            "root": {
              "children": [],
              "direction": null,
              "format": "",
              "indent": 0,
              "type": "root",
              "version": 1
            }
          }
        }
      }
    ],
    "direction": "ltr",
    "format": "",
    "indent": 0,
    "type": "root",
    "version": 1
  }
}
```

**Image Node Fields:**
- `type`: Always `"image"`
- `src`: Public URL from `journal_images.public_url`
- `altText`: Accessibility text
- `width/height`: Original dimensions
- `maxWidth`: Display width (user can resize in editor)
- `showCaption`: Boolean for caption visibility
- `caption`: Nested editor state for image caption

**Important:** The `src` URL is the public CDN URL returned from the image upload endpoint.

---

## API Endpoints

### 1. Create Journal Entry

**Endpoint:**
```http
POST /api/consumer-app/journals
Content-Type: application/json
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "userId": "uuid-user-123",
  "title": "Untitled Journal Entry",
  "content": {
    "root": {
      "children": [],
      "direction": "ltr",
      "format": "",
      "indent": 0,
      "type": "root",
      "version": 1
    }
  },
  "tags": []
}
```

**Request Fields:**
- `userId` (required): UUID of authenticated user (verify against auth token)
- `title` (optional): Entry title, defaults to "Untitled Journal Entry"
- `content` (optional): Lexical JSON, defaults to empty state
- `tags` (optional): Array of tag strings, defaults to empty array

**Validation:**
- Verify `userId` matches authenticated user
- Validate `title` is not empty if provided
- Validate `content` is valid JSON if provided
- Validate `tags` is an array if provided
- Reject if user has reached max entries limit (if any)

**Success Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-new-entry",
    "title": "Untitled Journal Entry",
    "content": {
      "root": {
        "children": [],
        "direction": "ltr",
        "format": "",
        "indent": 0,
        "type": "root",
        "version": 1
      }
    },
    "createdBy": {
      "id": "uuid-user-123",
      "name": "John Doe"
    },
    "createdAt": "2024-11-08T14:30:00Z",
    "lastModified": "2024-11-08T14:30:00Z",
    "tags": []
  }
}
```

**Error Responses:**

**401 Unauthorized:**
```json
{
  "success": false,
  "error": {
    "message": "Unauthorized",
    "code": "UNAUTHORIZED"
  }
}
```

**400 Bad Request:**
```json
{
  "success": false,
  "error": {
    "message": "Invalid content format",
    "code": "VALIDATION_ERROR"
  }
}
```

---

### 2. Update Journal Entry

**Endpoint:**
```http
PATCH /api/consumer-app/journals/:journalId
Content-Type: application/json
Authorization: Bearer {access_token}
```

**Request Body (all fields optional):**
```json
{
  "userId": "uuid-user-123",
  "title": "Updated Title",
  "content": {
    "root": {
      "children": [
        {
          "children": [
            {
              "text": "Updated content",
              "type": "text",
              "version": 1
            }
          ],
          "type": "paragraph",
          "version": 1
        }
      ],
      "direction": "ltr",
      "format": "",
      "indent": 0,
      "type": "root",
      "version": 1
    }
  },
  "tags": ["updated", "progress"]
}
```

**Validation:**
- Verify `userId` matches authenticated user
- Verify user owns the journal entry
- Validate fields if provided
- Auto-update `last_modified` timestamp

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-entry",
    "title": "Updated Title",
    "content": { /* updated Lexical JSON */ },
    "createdBy": {
      "id": "uuid-user-123",
      "name": "John Doe"
    },
    "createdAt": "2024-11-08T14:30:00Z",
    "lastModified": "2024-11-08T15:45:00Z",  // ← Updated
    "tags": ["updated", "progress"]
  }
}
```

**Error Responses:**

**404 Not Found:**
```json
{
  "success": false,
  "error": {
    "message": "Journal not found",
    "code": "NOT_FOUND"
  }
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "error": {
    "message": "You don't have permission to update this journal",
    "code": "FORBIDDEN"
  }
}
```

---

### 3. Get Presigned URL for Image Upload

**Endpoint:**
```http
POST /api/consumer-app/journals/presigned-url
Content-Type: application/json
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "userId": "uuid-user-123",
  "fileName": "progress-photo.jpg",
  "fileType": "image/jpeg",
  "fileSize": 245678
}
```

**Request Fields:**
- `userId` (required): UUID of authenticated user
- `fileName` (required): Original filename
- `fileType` (required): MIME type (image/jpeg, image/png, image/webp, image/gif)
- `fileSize` (required): File size in bytes

**Validation:**
- Verify userId matches authenticated user
- Validate fileType is an allowed image type
- Validate fileSize is under limit (10MB recommended)

**Backend Processing:**
1. Generate unique storage key: `journals/{userId}/{uuid}.{ext}`
2. Generate presigned URL for S3 PUT operation (expires in 5 minutes)
3. Generate public CDN URL for the file
4. Return presigned URL + public URL

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "presignedUrl": "https://s3.amazonaws.com/skinbestie-uploads/journals/uuid-user-123/abc123.jpg?AWSAccessKeyId=...&Signature=...&Expires=...",
    "publicUrl": "https://cdn.skinbestie.com/journals/uuid-user-123/abc123.jpg",
    "storageKey": "journals/uuid-user-123/abc123.jpg"
  }
}
```

**Response Fields:**
- `presignedUrl`: Temporary S3 upload URL (valid for 5 minutes)
- `publicUrl`: Permanent CDN URL to use in editor
- `storageKey`: S3 object key (for debugging/logging)

**Error Responses:**

**400 Bad Request (file too large):**
```json
{
  "success": false,
  "error": {
    "message": "File size exceeds 10MB limit",
    "code": "FILE_TOO_LARGE"
  }
}
```

**400 Bad Request (invalid type):**
```json
{
  "success": false,
  "error": {
    "message": "Invalid file type. Allowed: jpeg, png, webp, gif",
    "code": "INVALID_FILE_TYPE"
  }
}
```

---

## Image Upload Flow (Presigned URL)

### Step 1: User Pastes/Uploads Image in Editor

Frontend captures image via:
- Paste event
- File input dialog
- Drag & drop

### Step 2: Frontend Requests Presigned URL from Backend

```typescript
// Frontend code example
async function uploadImage(file: File) {
  // Step 2a: Get presigned URL from backend
  const presignedResponse = await fetch(
    '/api/consumer-app/journals/presigned-url',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: session.user.id,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      }),
    }
  );

  const presignedData = await presignedResponse.json();
  if (!presignedData.success) {
    throw new Error(presignedData.error.message);
  }

  return presignedData.data;
}
```

### Step 3: Backend Generates Presigned URL

1. Validate file type and size
2. Generate unique storage key: `journals/{userId}/{uuid}.{ext}`
3. Create S3 presigned URL (PUT, expires in 5 min)
4. Return presigned URL + public CDN URL

### Step 4: Frontend Uploads Directly to S3

```typescript
async function uploadToS3(file: File, presignedUrl: string) {
  // Upload directly to S3 using presigned URL
  const uploadResponse = await fetch(presignedUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });

  if (!uploadResponse.ok) {
    throw new Error('Failed to upload to S3');
  }
}
```

### Step 5: Extract Image Dimensions (Client-Side)

```typescript
function getImageDimensions(file: File): Promise<{width: number, height: number}> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}
```

### Step 6: Complete Upload Flow

```typescript
async function handleImageUpload(file: File) {
  try {
    // 1. Get presigned URL
    const { presignedUrl, publicUrl } = await uploadImage(file);

    // 2. Upload to S3
    await uploadToS3(file, presignedUrl);

    // 3. Get dimensions
    const { width, height } = await getImageDimensions(file);

    // 4. Insert into editor
    editor.update(() => {
      const imageNode = $createImageNode({
        src: publicUrl,  // Use CDN URL
        altText: 'Progress photo',
        width,
        height,
        maxWidth: 500,
      });

      $insertNodes([imageNode]);
    });

    return publicUrl;
  } catch (error) {
    console.error('Image upload failed:', error);
    toast.error('Failed to upload image');
  }
}
```

### Step 7: Frontend Saves Content with Image URL

When user finishes editing, save journal content:
```typescript
await updateJournalAction(journalId, {
  content: editor.getEditorState().toJSON(),
  // Content now includes image node with publicUrl from CDN
});
```

### Why Presigned URLs?

**Benefits:**
- ✅ **No backend bottleneck** - Files upload directly to S3
- ✅ **Faster uploads** - No proxy through backend server
- ✅ **Lower backend costs** - Backend doesn't handle large file transfers
- ✅ **Scalable** - S3 handles all the heavy lifting
- ✅ **Secure** - Presigned URL expires in 5 minutes

**Flow Summary:**
1. Frontend → Backend: "Give me upload permission"
2. Backend → Frontend: "Here's a presigned URL (valid 5 min)"
3. Frontend → S3: Uploads file directly
4. Frontend → Editor: Inserts CDN URL
5. Frontend → Backend: Saves content with CDN URL

---

## Image Lifecycle & Orphaned Files

### When Images Are Uploaded

Images are uploaded **immediately** when user adds them to the editor:
- User pastes/selects image → Upload starts immediately
- Image appears in editor once upload completes
- No "pending upload" state on save

### Image Resizing

Resizing is **client-side only** (no re-upload):
- User drags corner to resize → Updates `maxWidth` in image node
- Same CDN URL, different display size
- Original high-res image preserved in S3
- No orphaned files created

### Image Deletion & Orphaned Files

**Current Strategy: Accept Orphaned Files (Option 1)**

When user deletes image from editor:
- Image removed from editor content
- File remains in S3 (orphaned)
- No automatic cleanup

**Scenarios that create orphaned files:**
1. User uploads image but deletes it before saving
2. User uploads image, saves, then deletes it later
3. User uploads image but abandons draft entirely
4. User uploads image accidentally

**Why This Is Acceptable:**
- ✅ Simple implementation (no complex tracking)
- ✅ Storage costs are minimal (~$0.023/GB/month on S3)
- ✅ Typical journal entry: 2-3 images × 500KB = ~1.5MB
- ✅ Even 1000 orphaned images = ~$0.02/month storage cost
- ✅ Can add cleanup later via S3 lifecycle rules if needed

**Future Cleanup Options (Optional):**
- Add S3 lifecycle rule to delete old uploads from `temp/` folder
- Periodic background job to scan for orphaned images
- Manual admin cleanup tool

**Note:** For MVP, no cleanup is implemented. Storage costs are negligible at small-to-medium scale.

---

## Storage Recommendations

### Option 1: AWS S3 + CloudFront (Recommended)

**Bucket Structure:**
```
skinbestie-journals/
  └── journals/
      └── {userId}/
          ├── abc123.jpg
          ├── def456.png
          └── ghi789.webp
```

**Configuration:**
- Bucket: Private (not public)
- CloudFront: Public CDN with signed URLs (optional)
- CORS: Allow uploads from your domain

**Public URL Format:**
```
https://cdn.skinbestie.com/journals/{userId}/{imageId}.{ext}
```

### Option 2: Cloudinary (Easier Setup)

- Automatic image optimization
- Auto format conversion (WebP)
- Responsive image URLs
- Built-in transformations

**Public URL Format:**
```
https://res.cloudinary.com/skinbestie/image/upload/v1699123456/journals/{userId}/{imageId}.jpg
```

### Option 3: Vercel Blob Storage

- Simple API
- Built-in CDN
- Good for serverless

---

## Security Considerations

### 1. Authentication
- All endpoints require valid Bearer token
- Verify `userId` matches authenticated user

### 2. Authorization
- Users can only create/update/delete their own journals
- Users can only upload images to their own journals

### 3. File Upload Security
- Validate MIME type (server-side check, not just extension)
- Scan for malware (if uploading to S3, use Lambda trigger)
- Limit file size (10MB recommended)
- Generate unique filenames (prevent overwrites)
- Store in user-specific folders

### 4. Content Validation
- Validate Lexical JSON structure
- Sanitize image URLs in content (must match `journal_images.public_url`)
- Prevent XSS in image alt text

### 5. Rate Limiting
- Limit journal creation (e.g., 100 per day per user)
- Limit image uploads (e.g., 20 per hour per user)

---

## Testing Checklist

### Create Journal
- [ ] Create with default values
- [ ] Create with custom title
- [ ] Create with custom content
- [ ] Create with tags
- [ ] Reject if unauthorized
- [ ] Reject if invalid userId
- [ ] Reject if invalid content format

### Update Journal
- [ ] Update title only
- [ ] Update content only
- [ ] Update tags only
- [ ] Update all fields
- [ ] Auto-update `last_modified`
- [ ] Reject if unauthorized
- [ ] Reject if user doesn't own entry
- [ ] Reject if entry not found

### Upload Image
- [ ] Upload JPEG image
- [ ] Upload PNG image
- [ ] Upload WebP image
- [ ] Extract dimensions correctly
- [ ] Generate unique storage key
- [ ] Store metadata in database
- [ ] Return correct public URL
- [ ] Reject if unauthorized
- [ ] Reject if file too large
- [ ] Reject if invalid file type
- [ ] Reject if user doesn't own journal

### Edge Cases
- [ ] Upload image to non-existent journal
- [ ] Create journal with very long title (10000+ chars)
- [ ] Create journal with huge content (1MB+ JSON)
- [ ] Upload 0-byte file
- [ ] Upload corrupted image file
- [ ] Concurrent updates to same journal

---

## Notes

- Created: 2024-11-08
- Phase: 1 (Create + Images)
- Next Phase: List journals, get single journal, delete journal
- Frontend is ready to integrate once these endpoints are available

---

## Example Integration Timeline

**Day 1-2:** Database schema + migrations
**Day 3-4:** Create journal endpoint + tests
**Day 4-5:** Update journal endpoint + tests
**Day 6-8:** Image upload endpoint + S3 setup + tests
**Day 9:** Integration testing with frontend
**Day 10:** Bug fixes + deployment

Total: ~2 weeks for complete Phase 1 integration
