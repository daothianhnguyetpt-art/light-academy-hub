
# Kế Hoạch: Modal Thông Báo Chuyển Hướng Light Law

## Tổng Quan

Thêm modal thông báo nhẹ nhàng, dễ thương khi user đăng nhập mà chưa accept Light Law. Modal giải thích tình huống và cho user lựa chọn trước khi redirect.

## Luồng Mới

```text
┌─────────────────────────────────────────────────────────────────┐
│ User đăng nhập thành công (Google / Email / Wallet)            │
└─────────────────────────────────────────────────────────────────┘
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
          │ Vào app      │   │ ✨ HIỆN MODAL        │
          │ bình thường  │   │ THÔNG BÁO ✨         │
          └──────────────┘   └──────────────────────┘
                                       │
                     ┌─────────────────┴─────────────────┐
                     ▼                                   ▼
              ┌────────────┐                    ┌────────────────┐
              │ Click OK   │                    │ Đăng xuất &    │
              │            │                    │ Tiếp tục Guest │
              └────────────┘                    └────────────────┘
                     │                                   │
                     ▼                                   ▼
              ┌────────────┐                    ┌────────────────┐
              │ Navigate   │                    │ signOut() →    │
              │ /light-law │                    │ Ở trang hiện   │
              └────────────┘                    │ tại với Guest  │
                                                └────────────────┘
```

## Thiết Kế Modal

```text
┌─────────────────────────────────────────────────────┐
│                                                     │
│                    🌟 ✨ 🌟                         │
│                                                     │
│              Chào mừng bạn đến với                  │
│              FUN Ecosystem! 💫                      │
│                                                     │
│   ─────────────────────────────────────────────    │
│                                                     │
│   Để trở thành thành viên chính thức, bạn cần      │
│   đồng ý với Luật Ánh Sáng của chúng tôi.          │
│                                                     │
│   Bạn sẽ được chuyển đến trang Luật Ánh Sáng       │
│   để tìm hiểu và xác nhận. 🕊️                      │
│                                                     │
│   ┌─────────────────────────────────────────────┐  │
│   │  ✨ OK, Đưa con đến Ánh Sáng               │  │
│   └─────────────────────────────────────────────┘  │
│                                                     │
│          Đăng xuất & Tiếp tục ở chế độ Khách       │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## Chi Tiết Kỹ Thuật

### File 1: Tạo mới `src/components/auth/LightLawRedirectModal.tsx`

Modal nhẹ nhàng, tươi sáng với:
- Emoji và icon dễ thương
- Gradient background nhẹ
- Nội dung ngắn gọn, thân thiện
- Nút chính: "OK, Đưa con đến Ánh Sáng" (màu gold, nổi bật)
- Nút phụ: "Đăng xuất & Tiếp tục ở chế độ Khách" (text link nhẹ)

```typescript
interface LightLawRedirectModalProps {
  open: boolean;
  onConfirm: () => void;        // Navigate to /light-law
  onContinueAsGuest: () => void; // Sign out & stay as guest
}

export function LightLawRedirectModal({
  open,
  onConfirm,
  onContinueAsGuest,
}: LightLawRedirectModalProps) {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent 
        className="sm:max-w-md"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        // Ẩn nút X - modal bắt buộc chọn 1 trong 2
      >
        {/* Header với emoji */}
        <div className="text-center mb-4">
          <div className="text-3xl mb-2">🌟 ✨ 🌟</div>
          <DialogTitle className="text-xl font-display">
            Chào mừng bạn đến với
            <br />
            <span className="text-gradient-gold">FUN Ecosystem!</span> 💫
          </DialogTitle>
        </div>

        {/* Nội dung */}
        <div className="text-center space-y-3 text-muted-foreground">
          <p>
            Để trở thành thành viên chính thức, bạn cần đồng ý với 
            <span className="text-foreground font-medium"> Luật Ánh Sáng </span>
            của chúng tôi.
          </p>
          <p className="text-sm">
            Bạn sẽ được chuyển đến trang Luật Ánh Sáng để tìm hiểu và xác nhận. 🕊️
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-6 space-y-3">
          <Button
            onClick={onConfirm}
            className="w-full btn-primary-gold"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            OK, Đưa con đến Ánh Sáng
          </Button>
          
          <button
            onClick={onContinueAsGuest}
            className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
          >
            Đăng xuất & Tiếp tục ở chế độ Khách
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

### File 2: Cập nhật `src/components/auth/LightLawGuard.tsx`

Thay vì redirect ngay, hiện modal trước:

```typescript
import { ReactNode, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { LightLawRedirectModal } from "./LightLawRedirectModal";

export function LightLawGuard({ children }: { children: ReactNode }) {
  const { user, loading: authLoading, signOut } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const navigate = useNavigate();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (authLoading || profileLoading) return;

    // User đăng nhập nhưng chưa accept Light Law
    if (user && profile && !profile.light_law_accepted_at) {
      // Không hiện modal nếu đang ở /light-law
      if (location.pathname !== "/light-law") {
        setShowModal(true);
      }
    } else {
      setShowModal(false);
    }
  }, [user, profile, authLoading, profileLoading, location.pathname]);

  const handleConfirm = () => {
    setShowModal(false);
    navigate("/light-law");
  };

  const handleContinueAsGuest = async () => {
    setShowModal(false);
    await signOut();
    // Ở lại trang hiện tại với tư cách guest
  };

  return (
    <>
      {children}
      <LightLawRedirectModal
        open={showModal}
        onConfirm={handleConfirm}
        onContinueAsGuest={handleContinueAsGuest}
      />
    </>
  );
}
```

## Đặc Điểm Modal

| Yếu tố | Chi tiết |
|--------|----------|
| **Tone** | Thân thiện, ấm áp, không đe dọa |
| **Emoji** | 🌟 ✨ 💫 🕊️ - tươi sáng, tích cực |
| **Màu sắc** | Gold gradient cho highlight, nền sáng |
| **Nút chính** | "OK, Đưa con đến Ánh Sáng" - gold, nổi bật |
| **Nút phụ** | Text link nhẹ nhàng, không áp lực |
| **Không có nút X** | Bắt buộc chọn 1 trong 2 options |

## Các File Cần Thay Đổi

| File | Hành động |
|------|-----------|
| `src/components/auth/LightLawRedirectModal.tsx` | **Tạo mới** |
| `src/components/auth/LightLawGuard.tsx` | Thêm state modal + handlers |

## Kết Quả Mong Đợi

| Trường hợp | Hành vi |
|------------|---------|
| User mới đăng nhập | Hiện modal dễ thương thông báo |
| User click "OK" | Đóng modal → Navigate /light-law |
| User click "Đăng xuất & Guest" | Đóng modal → signOut() → Ở lại trang |
| User cũ (đã accept) | Không hiện modal |
| User đang ở /light-law | Không hiện modal (tránh loop) |

## Thời Gian Thực Hiện

Ước tính: 10 phút
