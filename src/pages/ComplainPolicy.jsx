import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const ComplaintPolicy = () => {
  return (
    <>
      <Header />

      <main className="container py-5">
        <div className="text-center mb-5">
          <h1 className="fw-bold">Chính Sách Giải Quyết Khiếu Nại</h1>
          <p className="text-muted">
            Quy trình tiếp nhận, xử lý và phản hồi các khiếu nại của bạn đọc.
          </p>
        </div>

        <div className="card shadow-sm border-0">
          <div className="card-body p-4">
            <h4>1. Cơ chế tiếp nhận và giải quyết khiếu nại</h4>

            <p>
              Thư viện cam kết tiếp nhận và xử lý mọi phản ánh, khiếu nại của
              bạn đọc liên quan đến việc sử dụng hệ thống, thông tin cá nhân,
              hoạt động mượn trả tài liệu và các dịch vụ do thư viện cung cấp.
            </p>

            <p>
              Bạn đọc có thể gửi khiếu nại trực tiếp tại thư viện hoặc thông qua
              các kênh liên hệ chính thức như email, số điện thoại hỗ trợ hoặc
              biểu mẫu liên hệ trên website.
            </p>

            <p>
              Sau khi tiếp nhận, thư viện sẽ tiến hành xác minh thông tin, đối
              chiếu dữ liệu trên hệ thống và thực hiện xử lý theo quy định hiện
              hành. Kết quả xử lý sẽ được thông báo đến người khiếu nại trong
              thời gian phù hợp.
            </p>

            <p>
              Trong trường hợp phát sinh tranh chấp hoặc sai lệch dữ liệu liên
              quan đến việc mượn trả tài liệu, gia hạn sách, xử lý vi phạm hoặc
              thông tin tài khoản, thư viện sẽ căn cứ trên dữ liệu được lưu trữ
              trong hệ thống để xem xét và giải quyết một cách khách quan,
              minh bạch.
            </p>

            <p>
              Mọi khiếu nại sẽ được ưu tiên giải quyết trên tinh thần hợp tác,
              đảm bảo quyền lợi của bạn đọc và tuân thủ các quy định của thư
              viện cũng như pháp luật hiện hành.
            </p>

            <hr />

            <h5>Thông tin liên hệ</h5>

            <ul className="mb-0">
              <li>Email: nguyenquangdiepnx1@gmail.com</li>
              <li>Hotline: 0123 456 789</li>
              <li>Địa chỉ: Thư viện NHP</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ComplaintPolicy;