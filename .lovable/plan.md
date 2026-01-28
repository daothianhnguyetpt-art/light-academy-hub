
# Kế Hoạch: Thu Gọn Nội Dung Post + Nút "Đọc Thêm"

## Mục Tiêu

Thêm tính năng thu gọn nội dung post dài với nút "Đọc thêm" để giữ feed gọn gàng và dễ đọc.

## Quy Tắc Thu Gọn

| Loại Post | Số Dòng Hiển Thị | Điều Kiện |
|-----------|------------------|-----------|
| **Text-only** (không có media) | ~10 dòng | Thu gọn nếu dài hơn |
| **Có hình ảnh/video** | ~2 dòng | Thu gọn nếu dài hơn |

## Giải Pháp Kỹ Thuật

### Tạo Component `CollapsibleContent.tsx`

Component tái sử dụng để xử lý logic thu gọn:

```text
┌─────────────────────────────────────────────┐
│ Post Content (Thu gọn)                      │
│                                             │
│ "Lorem ipsum dolor sit amet, consectetur   │
│ adipiscing elit. Sed do eiusmod tempor..."  │
│                                             │
│ [Đọc thêm]                                  │
└─────────────────────────────────────────────┘

        ↓ Click "Đọc thêm" ↓

┌─────────────────────────────────────────────┐
│ Post Content (Mở rộng)                      │
│                                             │
│ "Lorem ipsum dolor sit amet, consectetur   │
│ adipiscing elit. Sed do eiusmod tempor      │
│ incididunt ut labore et dolore magna        │
│ aliqua. Ut enim ad minim veniam, quis       │
│ nostrud exercitation ullamco laboris..."    │
│                                             │
│ [Thu gọn]                                   │
└─────────────────────────────────────────────┘
```

### Cách Tính Số Dòng

Sử dụng CSS `line-clamp` để giới hạn số dòng hiển thị:
- `line-clamp-10` cho text-only posts
- `line-clamp-2` cho posts có media

### Phát Hiện Nội Dung Bị Cắt

So sánh `scrollHeight` với `clientHeight` của element để biết text có bị cắt hay không.

## Các Bước Thực Hiện

### Bước 1: Tạo Component `CollapsibleContent.tsx`

Tạo file mới `src/components/posts/CollapsibleContent.tsx`:

```typescript
interface CollapsibleContentProps {
  content: string;
  hasMedia: boolean;
}
```

**Logic chính:**
- Props: `content` (nội dung), `hasMedia` (có media hay không)
- State: `isExpanded` (đang mở rộng hay thu gọn)
- State: `isTruncated` (nội dung có bị cắt hay không)
- Sử dụng `useRef` + `useEffect` để detect truncation
- Áp dụng `line-clamp-10` hoặc `line-clamp-2` dựa trên `hasMedia`

### Bước 2: Cập Nhật `SocialFeed.tsx`

Thay thế phần hiển thị content:

```typescript
// Trước:
<p className="text-foreground mb-4 leading-relaxed whitespace-pre-wrap">
  {post.content}
</p>

// Sau:
<CollapsibleContent 
  content={post.content} 
  hasMedia={!!post.media_url} 
/>
```

### Bước 3: Thêm Translations

Thêm vào các file i18n:

```json
{
  "socialFeed": {
    "readMore": "Đọc thêm",
    "showLess": "Thu gọn"
  }
}
```

## Chi Tiết Component

### CollapsibleContent.tsx

```typescript
// Logic phát hiện truncation
useEffect(() => {
  if (contentRef.current) {
    setIsTruncated(
      contentRef.current.scrollHeight > contentRef.current.clientHeight
    );
  }
}, [content]);

// CSS classes
const lineClampClass = hasMedia ? "line-clamp-2" : "line-clamp-10";

// Render
<div>
  <p 
    ref={contentRef}
    className={cn(
      "text-foreground leading-relaxed whitespace-pre-wrap",
      !isExpanded && lineClampClass
    )}
  >
    {content}
  </p>
  
  {isTruncated && (
    <button onClick={() => setIsExpanded(!isExpanded)}>
      {isExpanded ? t('socialFeed.showLess') : t('socialFeed.readMore')}
    </button>
  )}
</div>
```

## Các File Cần Thay Đổi

| File | Thay Đổi |
|------|----------|
| `src/components/posts/CollapsibleContent.tsx` | **Tạo mới** - Component thu gọn nội dung |
| `src/pages/SocialFeed.tsx` | Import và sử dụng CollapsibleContent |
| `src/i18n/locales/vi.json` | Thêm `readMore`, `showLess` |
| `src/i18n/locales/en.json` | Thêm `readMore`, `showLess` |
| `src/i18n/locales/ja.json` | Thêm `readMore`, `showLess` |
| `src/i18n/locales/zh.json` | Thêm `readMore`, `showLess` |
| `src/i18n/locales/ko.json` | Thêm `readMore`, `showLess` |

## Kết Quả Mong Đợi

- Post text-only dài > 10 dòng: Hiển thị 10 dòng + nút "Đọc thêm"
- Post có media + text dài > 2 dòng: Hiển thị 2 dòng + nút "Đọc thêm"
- Post ngắn: Hiển thị đầy đủ, không có nút "Đọc thêm"
- Nút "Thu gọn" xuất hiện khi đã mở rộng
- Animation mượt mà khi toggle
