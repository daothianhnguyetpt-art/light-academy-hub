
# Kế Hoạch: Bỏ Qua Luật Ánh Sáng Cho User Đã Đồng Ý

## Tổng Quan

Hiện tại, mỗi lần mở dialog đăng nhập, user đều phải đồng ý lại Luật Ánh Sáng. Cần sửa để nếu user đã từng đồng ý trước đó thì tự động chuyển đến màn hình chọn phương thức đăng nhập.

## Luồng Hiện Tại

```text
+--------------------+     +-------------------+     +------------------+
| Mở Auth Dialog     | --> | Hiện Light Law    | --> | Tick 5 điều      |
|                    |     | (LUÔN LUÔN)       |     | khoản            |
+--------------------+     +-------------------+     +------------------+
                                                              |
                                                              v
                                                     +------------------+
                                                     | Chọn phương thức |
                                                     | đăng nhập        |
                                                     +------------------+
```

## Luồng Sau Khi Sửa

```text
+--------------------+     +-------------------+
| Mở Auth Dialog     | --> | Kiểm tra đã đồng  |
|                    |     | ý chưa?           |
+--------------------+     +-------------------+
                                    |
                     +--------------+--------------+
                     |                             |
                     v                             v
           +------------------+          +------------------+
           | ĐÃ ĐỒNG Ý       |          | CHƯA ĐỒNG Ý      |
           | (localStorage    |          | Hiện Light Law   |
           | hoặc database)   |          +------------------+
           +------------------+                   |
                     |                            v
                     |                   +------------------+
                     |                   | Tick 5 điều khoản|
                     |                   +------------------+
                     |                            |
                     v                            v
           +------------------+          +------------------+
           | Chuyển thẳng đến | <-----   | Lưu đồng ý &     |
           | Auth Methods     |          | chuyển tiếp      |
           +------------------+          +------------------+
```

## Chi Tiết Kỹ Thuật

### File cần chỉnh sửa

**`src/components/auth/AuthDialog.tsx`**

### Thay đổi cụ thể

1. **Thêm logic kiểm tra khi component mount hoặc khi dialog mở**

   Trong `useEffect`, kiểm tra:
   - `localStorage.getItem("light_law_accepted")` - cho guest
   - `profile?.light_law_accepted_at` - cho user đã đăng nhập (nếu có)

2. **Cập nhật initial state của `step`**

   Thay vì luôn bắt đầu ở `"light-law"`, sử dụng `useEffect` để set step dựa trên trạng thái đồng ý.

3. **Xử lý edge case khi reset dialog**

   Khi đóng dialog, chỉ reset checkboxes nhưng giữ nguyên step nếu đã đồng ý.

### Code thay đổi

```typescript
// Thêm useEffect để kiểm tra trạng thái đồng ý
useEffect(() => {
  if (open) {
    // Kiểm tra localStorage (cho cả guest và user đã login)
    const hasLocalAcceptance = localStorage.getItem("light_law_accepted") === "true";
    
    if (hasLocalAcceptance) {
      setStep("auth-methods");
    } else {
      setStep("light-law");
    }
  }
}, [open]);

// Cập nhật handleOpenChange - chỉ reset checkboxes, không reset step nếu đã đồng ý
const handleOpenChange = (newOpen: boolean) => {
  if (!newOpen) {
    setTimeout(() => {
      setCheckedItems({});
      // Không reset step nữa - để useEffect xử lý khi mở lại
    }, 300);
  }
  onOpenChange(newOpen);
};
```

### Lý do thiết kế

- **Sử dụng localStorage làm nguồn chính**: Vì khi chưa đăng nhập thì không có profile trong database. LocalStorage được lưu ngay khi user đồng ý, trước cả khi đăng nhập.
- **Giữ nguyên logic lưu vào database**: Sau khi đăng nhập thành công, `acceptLightLaw()` vẫn được gọi để đồng bộ vào database.
- **Đơn giản & hiệu quả**: Không cần fetch profile trước khi hiện dialog.

## Kết Quả Mong Đợi

| Trường hợp | Hành vi |
|------------|---------|
| User mới, chưa từng đồng ý | Hiện Light Law → tick 5 điều → Auth Methods |
| User đã đồng ý, đăng xuất, đăng nhập lại | Hiện thẳng Auth Methods |
| User xóa localStorage | Hiện Light Law lại (đây là hành vi hợp lý) |
| User mới trên thiết bị mới | Hiện Light Law (localStorage trống) |

## Thời Gian Thực Hiện

Ước tính: 5 phút - Chỉ cần thay đổi nhỏ trong 1 file.
