

# Kế Hoạch: Bảo Vệ Luật Ánh Sáng Với Tùy Chọn Guest Mode

## Tổng Quan

Đảm bảo mọi user mới đều phải đồng ý Luật Ánh Sáng để sử dụng đầy đủ hệ sinh thái FUN Academy. Nếu không đồng ý, user có thể tiếp tục ở chế độ Guest (xem nội dung công khai).

## Luồng Hoạt Động

```text
┌─────────────────────────────────────────────────────────────────┐
│                     USER ĐĂNG NHẬP                              │
│            (Google OAuth / Wallet / Email)                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
              ┌───────────────────────────────┐
              │ Authentication thành công     │
              └───────────────────────────────┘
                              │
                              ▼
              ┌───────────────────────────────┐
              │ Kiểm tra database:            │
              │ light_law_accepted_at != null?│
              └───────────────────────────────┘
                     │              │
                   YES             NO
                     │              │
                     ▼              ▼
          ┌──────────────┐   ┌──────────────────────┐
          │ Cho vào app  │   │ HIỆN MODAL LIGHT LAW │
          │ đầy đủ       │   │ (Có thể đóng)        │
          └──────────────┘   └──────────────────────┘
                                       │
                     ┌─────────────────┼─────────────────┐
                     │                 │                 │
                     ▼                 ▼                 ▼
              ┌────────────┐   ┌────────────┐   ┌────────────────┐
              │ Click X    │   │ Đồng ý     │   │ Click "Tiếp    │
              │ (đóng)     │   │ đủ 5 điều  │   │ tục Guest"     │
              └────────────┘   └────────────┘   └────────────────┘
                     │                 │                 │
                     ▼                 ▼                 ▼
              ┌────────────┐   ┌────────────┐   ┌────────────────┐
              │ Đăng xuất  │   │ Lưu DB +   │   │ Đăng xuất      │
              │ → Guest    │   │ Vào app OK │   │ → Guest        │
              └────────────┘   └────────────┘   └────────────────┘
```

## Chi Tiết Kỹ Thuật

### File 1: Tạo mới `src/components/auth/LightLawGuard.tsx`

Component wrapper kiểm tra và hiển thị modal Light Law:

```typescript
export function LightLawGuard({ children }: { children: ReactNode }) {
  const { user, loading: authLoading, signOut } = useAuth();
  const { profile, loading: profileLoading, acceptLightLaw } = useProfile();
  const [showModal, setShowModal] = useState(false);
  const { triggerCelebration } = useConfetti();

  useEffect(() => {
    if (!authLoading && !profileLoading && user && profile) {
      if (!profile.light_law_accepted_at) {
        setShowModal(true);
      }
    }
  }, [user, profile, authLoading, profileLoading]);

  const handleAccept = async () => {
    await acceptLightLaw();
    localStorage.setItem("light_law_accepted", "true");
    setShowModal(false);
    triggerCelebration(); // Celebration sau khi accept
  };

  const handleContinueAsGuest = async () => {
    await signOut();
    setShowModal(false);
  };

  const handleClose = async () => {
    await signOut();
    setShowModal(false);
  };

  return (
    <>
      {children}
      <LightLawModal 
        open={showModal}
        onAccept={handleAccept}
        onContinueAsGuest={handleContinueAsGuest}
        onClose={handleClose}
      />
    </>
  );
}
```

### File 2: Tạo mới `src/components/auth/LightLawModal.tsx`

Modal với 3 lựa chọn:

```typescript
interface LightLawModalProps {
  open: boolean;
  onAccept: () => void;
  onContinueAsGuest: () => void;
  onClose: () => void;
}

export function LightLawModal({ 
  open, 
  onAccept, 
  onContinueAsGuest,
  onClose 
}: LightLawModalProps) {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const allChecked = CHECKLIST_ITEMS.every((id) => checkedItems[id]);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-xl md:max-w-2xl">
        {/* Nút X vẫn có - click sẽ trigger onClose → signOut */}
        
        <LightLawContent 
          checkedItems={checkedItems}
          onCheckChange={handleCheckChange}
        />

        {/* Nút Đồng Ý */}
        <Button
          onClick={onAccept}
          disabled={!allChecked}
          className="w-full btn-primary-gold"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          CON ĐỒNG Ý & BƯỚC VÀO ÁNH SÁNG
        </Button>

        {/* Separator */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              hoặc
            </span>
          </div>
        </div>

        {/* Nút tiếp tục Guest */}
        <Button
          variant="ghost"
          onClick={onContinueAsGuest}
          className="w-full text-muted-foreground hover:text-foreground"
        >
          Tiếp tục chế độ khách (Guest)
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Chế độ khách chỉ có thể xem nội dung công khai
        </p>
      </DialogContent>
    </Dialog>
  );
}
```

### File 3: Cập nhật `src/App.tsx`

Wrap app với LightLawGuard:

```typescript
import { LightLawGuard } from "@/components/auth/LightLawGuard";

const App = () => (
  <LanguageProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ConfettiProvider>
          <BrowserRouter>
            <LightLawGuard>
              <Toaster />
              <Sonner />
              <Routes>
                {/* ... all routes */}
              </Routes>
            </LightLawGuard>
          </BrowserRouter>
        </ConfettiProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </LanguageProvider>
);
```

### File 4: Giữ nguyên `src/components/auth/AuthDialog.tsx`

Logic hiện tại vẫn hoạt động tốt cho flow đăng ký email (kiểm tra localStorage trước).

## Giao Diện Modal

```text
┌─────────────────────────────────────────────────────┐
│                                               [X]   │
│                                                     │
│              ✨ LUẬT ÁNH SÁNG ✨                    │
│                                                     │
│  ☐ Con xin sống CHÂN THẬT                          │
│  ☐ Con xin sống CÓ TRÁCH NHIỆM                     │
│  ☐ Con xin học hỏi và TRƯỞNG THÀNH                 │
│  ☐ Con xin hành động từ TÌNH YÊU                   │
│  ☐ Con xin là ÁNH SÁNG cho thế giới                │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  ✨ CON ĐỒNG Ý & BƯỚC VÀO ÁNH SÁNG         │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│                    ─── hoặc ───                     │
│                                                     │
│         Tiếp tục chế độ khách (Guest)              │
│                                                     │
│    Chế độ khách chỉ có thể xem nội dung công khai  │
└─────────────────────────────────────────────────────┘
```

## Kết Quả Mong Đợi

| Hành động | Kết quả |
|-----------|---------|
| User mới đăng nhập → Đồng ý | Vào app đầy đủ + Celebration |
| User mới đăng nhập → Click X | Đăng xuất → Guest mode |
| User mới đăng nhập → "Tiếp tục Guest" | Đăng xuất → Guest mode |
| User cũ (đã accept trong DB) | Bỏ qua modal → Vào app bình thường |

## Ưu Điểm

1. **Tôn trọng quyền lựa chọn**: User có thể từ chối mà không bị khóa
2. **Rõ ràng hậu quả**: Guest mode chỉ xem được nội dung công khai
3. **Trải nghiệm tốt**: Celebration đúng lúc, không ép buộc
4. **Bảo vệ nguyên tắc**: Chỉ ai đồng ý Light Law mới là thành viên chính thức

## Các File Cần Thay Đổi

| File | Hành động |
|------|-----------|
| `src/components/auth/LightLawGuard.tsx` | Tạo mới |
| `src/components/auth/LightLawModal.tsx` | Tạo mới |
| `src/App.tsx` | Wrap với LightLawGuard |
| `src/components/auth/AuthDialog.tsx` | Giữ nguyên |

## Thời Gian Thực Hiện

Ước tính: 20 phút

