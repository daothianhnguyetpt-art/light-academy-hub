

# Kế Hoạch Fix: Thu Gọn Nội Dung Post Only-Text

## Vấn Đề Phát Hiện

Tính năng thu gọn hoạt động tốt với bài có media (line-clamp-2), nhưng không hoạt động với bài only-text (line-clamp-10). Nguyên nhân:

1. **Timing issue**: Khi component render, CSS `line-clamp` được apply nhưng `scrollHeight` chưa được tính đúng vì browser chưa paint xong
2. **Thiếu RAF**: Cần dùng `requestAnimationFrame` để chờ browser layout hoàn tất
3. **Thiếu resize listener**: Khi window resize, số dòng có thể thay đổi

## Giải Pháp

Cập nhật logic detect truncation trong `CollapsibleContent.tsx`:

```text
┌─────────────────────────────────────────────────────┐
│            FLOW DETECT TRUNCATION                    │
├─────────────────────────────────────────────────────┤
│                                                     │
│  1. Component Mount                                 │
│         ↓                                           │
│  2. Wait for requestAnimationFrame (browser paint) │
│         ↓                                           │
│  3. Check scrollHeight > clientHeight              │
│         ↓                                           │
│  4. Set isTruncated = true/false                   │
│         ↓                                           │
│  5. Listen for window resize → Re-check            │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## Thay Đổi Code

### File: `src/components/posts/CollapsibleContent.tsx`

**Trước (có vấn đề):**
```typescript
useEffect(() => {
  const checkTruncation = () => {
    if (contentRef.current) {
      const { scrollHeight, clientHeight } = contentRef.current;
      setIsTruncated(scrollHeight > clientHeight);
    }
  };

  checkTruncation();

  if (document.fonts?.ready) {
    document.fonts.ready.then(checkTruncation);
  }
}, [content, hasMedia]);
```

**Sau (fix):**
```typescript
useEffect(() => {
  const checkTruncation = () => {
    if (contentRef.current) {
      const { scrollHeight, clientHeight } = contentRef.current;
      // Add small tolerance (1px) for rounding issues
      setIsTruncated(scrollHeight > clientHeight + 1);
    }
  };

  // Use RAF to wait for browser paint
  const rafId = requestAnimationFrame(() => {
    checkTruncation();
  });

  // Also check after fonts load
  if (document.fonts?.ready) {
    document.fonts.ready.then(() => {
      requestAnimationFrame(checkTruncation);
    });
  }

  // Re-check on window resize
  const handleResize = () => {
    requestAnimationFrame(checkTruncation);
  };
  window.addEventListener('resize', handleResize);

  return () => {
    cancelAnimationFrame(rafId);
    window.removeEventListener('resize', handleResize);
  };
}, [content, hasMedia, isExpanded]);
```

## Chi Tiết Cải Tiến

| Cải tiến | Mô tả |
|----------|-------|
| **requestAnimationFrame** | Chờ browser paint xong trước khi check |
| **Tolerance 1px** | Tránh false negative do rounding errors |
| **Resize listener** | Re-check khi window resize |
| **isExpanded dependency** | Re-check khi toggle expand/collapse |
| **Cleanup function** | Dọn dẹp RAF và event listener |

## Các File Cần Thay Đổi

| File | Thay Đổi |
|------|----------|
| `src/components/posts/CollapsibleContent.tsx` | Cập nhật useEffect với RAF + resize listener |

## Kết Quả Mong Đợi

- Bài only-text dài > 10 dòng: Hiển thị nút "Đọc thêm" ✅
- Bài có media + text dài > 2 dòng: Vẫn hoạt động tốt ✅
- Responsive: Re-check khi resize window ✅
- Performance: Cleanup đúng cách khi unmount ✅

