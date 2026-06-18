import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const PrivacyPolicy = () => {
  return (
    <>
      <Header />

      <main className="container py-5">
        <div className="text-center mb-5">
          <h1 className="fw-bold">Chính Sách Bảo Mật</h1>
          <p className="text-muted">
            Cam kết bảo vệ thông tin cá nhân của bạn đọc khi sử dụng Hệ thống
            Thư viện Điện tử.
          </p>
        </div>

        <div className="card shadow-sm border-0">
          <div className="card-body p-4">

            <section className="mb-4">
              <h4>1. Mục đích thu thập thông tin</h4>
              <p>
                Hệ thống thu thập các thông tin cần thiết nhằm phục vụ việc
                đăng ký tài khoản, cấp thẻ thư viện, quản lý hoạt động mượn trả
                tài liệu và nâng cao chất lượng dịch vụ thư viện.
              </p>
            </section>

            <section className="mb-4">
              <h4>2. Thông tin được thu thập</h4>
              <ul>
                <li>Họ và tên.</li>
                <li>Địa chỉ.</li>
                <li>Số điện thoại.</li>
                <li>Email.</li>
                <li>Thông tin tài khoản đăng nhập.</li>
                <li>Lịch sử mượn, trả và gia hạn tài liệu.</li>
              </ul>
            </section>

            <section className="mb-4">
              <h4>3. Mục đích sử dụng thông tin</h4>
              <ul>
                <li>Quản lý tài khoản và hồ sơ bạn đọc.</li>
                <li>Hỗ trợ quá trình mượn, trả và gia hạn sách.</li>
                <li>Thông báo về thời hạn trả sách hoặc các vi phạm liên quan.</li>
                <li>Cải thiện chất lượng dịch vụ thư viện.</li>
                <li>Thực hiện các yêu cầu quản lý theo quy định của thư viện.</li>
              </ul>
            </section>

            <section className="mb-4">
              <h4>4. Bảo mật thông tin</h4>
              <p>
                Hệ thống áp dụng các biện pháp kỹ thuật và quản lý phù hợp nhằm
                bảo vệ thông tin cá nhân khỏi việc truy cập, sử dụng hoặc tiết
                lộ trái phép. Chỉ những cá nhân được phân quyền mới có quyền
                truy cập dữ liệu liên quan.
              </p>
            </section>

            <section className="mb-4">
              <h4>5. Chia sẻ thông tin</h4>
              <p>
                Thông tin cá nhân của bạn đọc không được bán, trao đổi hoặc
                cung cấp cho bên thứ ba ngoài phạm vi quản lý của thư viện,
                trừ khi có yêu cầu từ cơ quan có thẩm quyền theo quy định của
                pháp luật.
              </p>
            </section>

            <section className="mb-4">
              <h4>6. Quyền của người dùng</h4>
              <ul>
                <li>Tra cứu thông tin cá nhân của mình.</li>
                <li>Cập nhật hoặc yêu cầu chỉnh sửa thông tin khi cần thiết.</li>
                <li>Yêu cầu hỗ trợ khi phát hiện dữ liệu không chính xác.</li>
                <li>Được thông báo về các thay đổi liên quan đến chính sách bảo mật.</li>
              </ul>
            </section>

            <section>
              <h4>7. Thay đổi chính sách</h4>
              <p>
                Thư viện có quyền cập nhật hoặc điều chỉnh Chính sách Bảo mật
                nhằm phù hợp với hoạt động quản lý và các quy định pháp luật
                hiện hành. Các thay đổi sẽ được công bố trên hệ thống.
              </p>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default PrivacyPolicy;