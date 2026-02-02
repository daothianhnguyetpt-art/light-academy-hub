

# Kế Hoạch: Thêm 2 Infographic vào Trang Master Charter

## Mục Tiêu

Thêm 2 hình infographic (phiên bản English và Vietnamese) về Master Charter vào trang `/master-charter` để người dùng có thể xem tổng quan nội dung một cách trực quan.

## Vị Trí Đặt Infographic

Sẽ thêm một section mới ngay sau Hero Section và trước Main Content, hiển thị cả 2 infographic với tabs chuyển đổi ngôn ngữ:

```text
+------------------------------------------+
|  HERO SECTION                            |
|  HIẾN PHÁP GỐC - FUN ECOSYSTEM           |
+------------------------------------------+
|                                          |
|     📊 INFOGRAPHIC SECTION (MỚI)         |
|     ┌──────────────────────────────┐     |
|     │  [Tiếng Việt] | [English]    │     |
|     │                              │     |
|     │     ┌────────────────┐       │     |
|     │     │                │       │     |
|     │     │  INFOGRAPHIC   │       │     |
|     │     │    IMAGE       │       │     |
|     │     │                │       │     |
|     │     └────────────────┘       │     |
|     │                              │     |
|     │  [Xem toàn màn hình] [Tải về]│     |
|     └──────────────────────────────┘     |
|                                          |
+------------------------------------------+
|  MAIN CONTENT (Sidebar + Content)        |
+------------------------------------------+
```

## Các File Thay Đổi

| File | Hành Động |
|------|-----------|
| `src/assets/master-charter-en.jpg` | Copy từ user-uploads |
| `src/assets/master-charter-vn.jpg` | Copy từ user-uploads |
| `src/pages/MasterCharter.tsx` | Thêm Infographic Section mới |

## Chi Tiết Kỹ Thuật

### 1. Copy Images vào `src/assets/`

- `user-uploads://Master_Charter_-_EN.jpg` → `src/assets/master-charter-en.jpg`
- `user-uploads://Master_Charter_-_VN.jpg` → `src/assets/master-charter-vn.jpg`

### 2. Cập nhật `MasterCharter.tsx`

**Thêm imports:**
```typescript
import masterCharterEN from "@/assets/master-charter-en.jpg";
import masterCharterVN from "@/assets/master-charter-vn.jpg";
```

**Thêm state cho language toggle:**
```typescript
const [infographicLang, setInfographicLang] = useState<'vi' | 'en'>('vi');
```

**Thêm Infographic Section giữa Hero và Mobile Navigation:**

```text
┌─────────────────────────────────────────┐
│  Infographic Section                    │
├─────────────────────────────────────────┤
│  - Language toggle tabs (VN / EN)       │
│  - Image container với aspect ratio     │
│  - Click để zoom toàn màn hình          │
│  - Nút Download infographic             │
│  - Responsive cho mobile                │
└─────────────────────────────────────────┘
```

### 3. Tính Năng UI

| Tính năng | Mô tả |
|-----------|-------|
| **Language Tabs** | Hai nút "Tiếng Việt" và "English" để chuyển đổi |
| **Image Display** | Hiển thị ảnh với border gold, shadow đẹp |
| **Zoom Modal** | Click vào ảnh để mở modal xem toàn màn hình |
| **Download Button** | Nút tải về infographic hiện tại |
| **Animation** | Fade transition khi chuyển ngôn ngữ |
| **Responsive** | Ảnh tự scale theo màn hình |

### 4. Styling

```css
/* Infographic container */
- Border: 2px solid gold/30
- Border radius: 16px
- Box shadow: subtle gold glow
- Background: white/50 backdrop blur
- Hover: scale up slightly (1.02)
```

## Kết Quả Mong Đợi

- Users có thể xem nhanh toàn bộ Master Charter qua infographic
- Có thể chuyển đổi giữa tiếng Việt và English
- Click để zoom toàn màn hình đọc chi tiết
- Có thể tải về chia sẻ cho người khác
- Design đẹp, phù hợp với tông màu "Light Academic" của trang

