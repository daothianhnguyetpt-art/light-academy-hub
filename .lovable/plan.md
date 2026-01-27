

# Kế Hoạch: Sửa Light Law - Bỏ Modal, Navigate Đến Trang /light-law

## Tổng Quan Thay Đổi

### Vấn đề 1: Light Law hiển thị 2 lần
- Bỏ step "light-law" trong `AuthDialog.tsx`
- Luôn hiển thị thẳng Auth Methods

### Vấn đề 2: Thay modal bằng navigate đến trang
- Cập nhật `LightLawGuard.tsx` để navigate đến `/light-law` thay vì hiện modal
- Cập nhật trang `LightLaw.tsx` để xử lý user đã đăng nhập
- Xóa file `LightLawModal.tsx` (không còn cần thiết)

## Luồng Mới

```text
┌─────────────────────────────────────────────────────────────────┐
│ User click "Đăng nhập" → AuthDialog hiện Auth Methods trực tiếp │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
              ┌───────────────────────────────┐
              │ User đăng nhập thành công     │
              │ (Google / Email / Wallet)     │
              └───────────────────────────────┘
                              │
                              ▼
              ┌───────────────────────────────┐
              │ LightLawGuard kiểm tra:       │
              │ profile.light_law_accepted_at │
              └───────────────────────────────┘
                     │              │
                   CÓ             CHƯA
                     │              │
                     ▼              ▼
          ┌──────────────┐   ┌──────────────────────┐
          │ Tiếp tục     │   │ Navigate đến         │
          │ bình thường  │   │ /light-law           │
          └──────────────┘   └──────────────────────┘
                                       │
                                       ▼
                             ┌──────────────────────┐
                             │ User tick 5 checkbox │
                             │ & click Đồng Ý       │
                             └──────────────────────┘
                                       │
                     ┌─────────────────┼─────────────────┐
                     ▼                                   ▼
              ┌────────────┐                    ┌────────────────┐
              │ Lưu DB +   │                    │ "Tiếp tục      │
              │ Celebration│                    │  Guest"        │
              │ → /social  │                    │ → signOut      │
              └────────────┘                    └────────────────┘
```

## Chi Tiết Kỹ Thuật

### File 1: `src/components/auth/AuthDialog.tsx`

**Thay đổi chính:**
- Bỏ state `step` (không còn cần 2 bước)
- Bỏ state `checkedItems`, hàm `handleCheckChange`, `handleAcceptLightLaw`
- Bỏ import `LightLawContent`, `Checkbox`
- Bỏ nút "Quay lại"
- Luôn render `AuthMethodSelector` trực tiếp

```typescript
// BỎ: step, checkedItems, allChecked, handleCheckChange, handleAcceptLightLaw
// BỎ: AnimatePresence, motion cho step switching
// BỎ: Nút "Quay lại"
// GIỮ: AuthMethodSelector render trực tiếp
```

### File 2: `src/components/auth/LightLawGuard.tsx`

**Thay đổi chính:**
- Thay vì `setShowModal(true)` → dùng `navigate("/light-law")`
- Bỏ import `LightLawModal`
- Bỏ các handler cho modal
- Đơn giản hóa logic

```typescript
import { ReactNode, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";

export function LightLawGuard({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (authLoading || profileLoading) return;

    // User đã đăng nhập nhưng chưa accept Light Law
    if (user && profile && !profile.light_law_accepted_at) {
      // Tránh redirect loop nếu đang ở trang /light-law
      if (location.pathname !== "/light-law") {
        navigate("/light-law");
      }
    }
  }, [user, profile, authLoading, profileLoading, navigate, location.pathname]);

  return <>{children}</>;
}
```

### File 3: `src/pages/LightLaw.tsx`

**Thay đổi chính:**
- Thêm logic cho user đã đăng nhập (gọi `acceptLightLaw()` từ useProfile)
- Cập nhật `handleEnter()` để gọi API lưu database
- Cập nhật `handleGuest()` để signOut nếu đang đăng nhập
- Thêm confetti celebration khi accept thành công

```typescript
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useConfetti } from "@/contexts/ConfettiContext";

export default function LightLaw() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { acceptLightLaw } = useProfile();
  const { triggerConfetti } = useConfetti();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEnter = async () => {
    if (!allChecked || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      // Nếu đã đăng nhập → lưu vào database
      if (user) {
        const success = await acceptLightLaw();
        if (success) {
          localStorage.setItem("light_law_accepted", "true");
          triggerConfetti();
          navigate("/social-feed");
        }
      } else {
        // Nếu chưa đăng nhập → chỉ lưu localStorage (cho guest)
        localStorage.setItem("light_law_accepted", "true");
        navigate("/social-feed");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuest = async () => {
    // Nếu đang đăng nhập → signOut trước
    if (user) {
      await signOut();
    }
    navigate("/social-feed");
  };

  // ... rest of component
}
```

### File 4: Xóa `src/components/auth/LightLawModal.tsx`

Không còn cần thiết vì đã chuyển sang dùng trang /light-law.

## Các File Cần Thay Đổi

| File | Hành động |
|------|-----------|
| `src/components/auth/AuthDialog.tsx` | Đơn giản hóa - bỏ step light-law |
| `src/components/auth/LightLawGuard.tsx` | Navigate thay vì modal |
| `src/pages/LightLaw.tsx` | Thêm logic cho user đã đăng nhập |
| `src/components/auth/LightLawModal.tsx` | **XÓA** (không còn dùng) |

## Kết Quả Mong Đợi

| Trường hợp | Hành vi |
|------------|---------|
| User click đăng nhập | Hiện thẳng Auth Methods |
| User mới đăng nhập xong | Navigate đến /light-law (trang đẹp, scroll thoải mái) |
| User tick 5 điều + Đồng ý | Lưu DB + Celebration + Navigate /social-feed |
| User chọn "Xem với tư cách khách" | SignOut (nếu đang login) + Navigate /social-feed |
| User cũ (đã accept trong DB) | Không bị redirect, vào app bình thường |

## Ưu Điểm

1. **Trải nghiệm tốt hơn**: Trang /light-law đẹp, scroll thoải mái, không bị giới hạn modal
2. **Đơn giản hơn**: Bỏ component modal, logic tập trung vào 1 trang
3. **Không duplicate**: Chỉ 1 nơi kiểm tra Light Law (LightLawGuard)
4. **Dễ maintain**: Ít code hơn, dễ debug hơn

## Thời Gian Thực Hiện

Ước tính: 15 phút

