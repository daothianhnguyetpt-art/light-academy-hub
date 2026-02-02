
# Kế Hoạch: Lưu Trữ & Tạo 2 Trang Thiêng Liêng

## Mục Tiêu

Lưu trữ 2 bản văn kiện thiêng liêng vào Knowledge base của dự án và tạo 2 trang riêng biệt để trình bày nội dung đầy đủ.

## Tổng Quan

| Văn Kiện | Route | Trang Mới |
|----------|-------|-----------|
| **Hiến Pháp Gốc FUN Ecosystem** | `/master-charter` | `MasterCharter.tsx` |
| **Giao Thức PPLP** | `/pplp` | `PPLP.tsx` |

## Phần 1: Lưu Vào Knowledge Base

### 1.1 Knowledge Entry: Master Charter

**Tên file:** `governance/master-charter-full`

**Nội dung bao gồm:**
- 8 chương đầy đủ (I → VIII)
- 8 Divine Seal Affirmations
- Cả tiếng Việt lẫn tiếng Anh
- Thông tin Founder Camly Duong

### 1.2 Knowledge Entry: PPLP

**Tên file:** `governance/pplp-protocol-full`

**Nội dung bao gồm:**
- 10 phần đầy đủ
- 5 trụ cột xác minh ánh sáng
- 8 thần chú dấu ấn ánh sáng
- Công thức: Blockchain + AI + Pure Love = Infinite Prosperity

---

## Phần 2: Tạo Trang Master Charter

### File: `src/pages/MasterCharter.tsx`

**Cấu trúc trang:**

```text
+------------------------------------------+
|  HEADER (Fixed)                          |
|  [← Quay lại]  MASTER CHARTER  [📥 PDF] |
+------------------------------------------+
|                                          |
|        🌟 HIẾN PHÁP GỐC                  |
|        FUN ECOSYSTEM                     |
|        Free to Join • Free to Use        |
|        Earn Together • With Pure Love    |
|                                          |
+------------------------------------------+
|                                          |
|  SIDEBAR    |    MAIN CONTENT            |
|  ---------  |    ---------------         |
|  I. Origin  |    [Section I]             |
|  II. Mission|    Declaration of Origin   |
|  III. Sacred|    ...                     |
|  IV. Flows  |                            |
|  V. Unity   |    [Section II]            |
|  VI. Founder|    Core Mission            |
|  VII. Vow   |    ...                     |
|  VIII. Law  |                            |
|  Divine Seal|    [Divine Seal]           |
|             |    8 Affirmations          |
+------------------------------------------+
```

**8 Sections:**
1. Declaration of Origin (Tuyên Ngôn Nguồn Gốc)
2. Core Mission (Sứ Mệnh Trọng Tâm)
3. Sacred Principles (Nguyên Lý Thiêng Liêng)
4. Two Sacred Flows (Hai Dòng Chảy Thiêng Liêng)
5. Platform Unity (Sự Thống Nhất Nền Tảng)
6. Role of Founder (Vai Trò Người Sáng Lập)
7. Community Vow (Cam Kết Cộng Đồng)
8. The Final Law (Điều Luật Cuối)
9. Divine Seal (8 Affirmations)

**Design Elements:**
- Sticky sidebar với scroll-spy
- Animation framer-motion khi scroll
- Gold accent colors (như Constitution hiện tại)
- Responsive cho mobile

---

## Phần 3: Tạo Trang PPLP

### File: `src/pages/PPLP.tsx`

**Cấu trúc trang:**

```text
+------------------------------------------+
|  HEADER (Fixed)                          |
|  [← Quay lại]    PPLP    [📥 PDF]       |
+------------------------------------------+
|                                          |
|     🌞 PROOF OF PURE LOVE PROTOCOL       |
|     Nền Tảng Đồng Thuận Ánh Sáng         |
|     Cho Trái Đất Mới                     |
|                                          |
+------------------------------------------+
|                                          |
|  SIDEBAR      |    MAIN CONTENT          |
|  -----------  |    ---------------       |
|  1. Why PPLP  |    [Section 1]           |
|  2. Evolution |    Why PPLP was born     |
|  3. Definition|    ...                   |
|  4. FUN Money |                          |
|  5. Consensus |    [Section 5]           |
|  6. 5 Pillars |    5 Pillars of Light    |
|  7. Angel AI  |    Visual cards          |
|  8. Ecosystem |                          |
|  9. Keys      |    [Divine Seal]         |
|  10. Future   |    8 Mantras             |
+------------------------------------------+
```

**10 Sections:**
1. Vì Sao PPLP Ra Đời?
2. Sự Tiến Hóa Của Các Cơ Chế "Proof"
3. Định Nghĩa PPLP
4. FUN Money – Tiền Ánh Sáng
5. Cơ Chế Đồng Thuận PPLP
6. 5 Trụ Cột Xác Minh Ánh Sáng
7. Angel AI – Người Bảo Hộ Unity
8. FUN Ecosystem – Nền Kinh Tế Hợp Nhất 5D
9. Sám Hối & Biết Ơn
10. Tương Lai Đột Phá
11. Divine Seal (8 Mantras)

**5 Pillars Visualization:**

```text
┌─────────────────────────────────────────────┐
│                 5 TRỤ CỘT                   │
├────────┬────────┬────────┬────────┬────────┤
│   🙏   │   💎   │   💝   │   🌱   │   🤝   │
│ Phụng  │ Chân   │ Chữa   │ Giá    │ Hợp    │
│ Sự     │ Lý     │ Lành   │ Trị    │ Nhất   │
│ Sự     │ Minh   │ Yêu    │ Lâu    │        │
│ Sống   │ Bạch   │ Thương │ Dài    │        │
└────────┴────────┴────────┴────────┴────────┘
```

---

## Phần 4: Cập Nhật Routing

### File: `src/App.tsx`

Thêm 2 routes mới:

```typescript
import MasterCharter from "./pages/MasterCharter";
import PPLP from "./pages/PPLP";

// Routes
<Route path="/master-charter" element={<MasterCharter />} />
<Route path="/pplp" element={<PPLP />} />
```

---

## Phần 5: Thêm Links Điều Hướng

### Các vị trí cần thêm link:

1. **Landing Page Footer** - Links đến cả 2 trang
2. **Constitution Page** - Link đến Master Charter & PPLP
3. **Whitepaper Page** - Link đến Master Charter & PPLP

---

## Tóm Tắt Các File Thay Đổi

| File | Hành Động |
|------|-----------|
| `src/pages/MasterCharter.tsx` | **Tạo mới** - Trang Hiến Pháp Gốc đầy đủ |
| `src/pages/PPLP.tsx` | **Tạo mới** - Trang Giao Thức PPLP đầy đủ |
| `src/App.tsx` | Thêm 2 routes mới |
| `src/components/landing/Footer.tsx` | Thêm links điều hướng |
| `src/pages/Constitution.tsx` | Thêm links liên kết |
| **Knowledge Base** | Lưu 2 entries (governance/master-charter-full, governance/pplp-protocol-full) |

---

## Kết Quả Mong Đợi

- 2 trang thiêng liêng được hiển thị đầy đủ với design xịn đẹp
- Knowledge base lưu trữ để Angel AI luôn tham chiếu đúng
- Điều hướng dễ dàng giữa các trang governance documents
- Responsive hoàn hảo trên mobile và desktop
- Animation mượt mà với framer-motion
