import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const AboutUs = () => {
  return (
    <>
      <Header />

      <main className="container py-5">
        {/* Banner */}
        <section className="text-center mb-5">
          <h1 className="fw-bold mb-3">Về Chúng Tôi</h1>
          <p className="lead text-muted">
            Hệ thống Thư viện Điện tử hỗ trợ quản lý thư viện truyền thống
            thông qua việc số hóa các nghiệp vụ mượn trả sách, quản lý bạn đọc,
            quản lý đầu sách và vận hành thư viện hiệu quả.
          </p>
        </section>

        {/* Giới thiệu */}
        <section className="mb-5">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <h3 className="mb-3">Giới thiệu hệ thống</h3>
              <p>
                Hệ thống Thư viện Điện tử được xây dựng nhằm nâng cao hiệu quả
                quản lý và phục vụ bạn đọc thông qua việc ứng dụng công nghệ vào
                các hoạt động thư viện. Người dùng có thể tra cứu tài liệu,
                theo dõi lịch sử mượn trả, gửi yêu cầu gia hạn sách và cập nhật
                thông tin cá nhân trực tuyến.
              </p>

              <p>
                Bên cạnh đó, thủ thư và quản trị viên có thể quản lý đầu sách,
                xử lý các nghiệp vụ mượn trả, theo dõi tình trạng tài liệu,
                quản lý nhân viên và xử lý các trường hợp vi phạm theo quy định
                của thư viện.
              </p>
            </div>
          </div>
        </section>

        {/* Chức năng chính */}
        <section className="mb-5">
          <h3 className="text-center mb-4">Các chức năng nổi bật</h3>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5>📚 Quản lý mượn trả sách</h5>
                  <p>
                    Theo dõi phiếu mượn, trả sách, kiểm tra thời hạn và tình
                    trạng tài liệu một cách chính xác.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5>👤 Quản lý bạn đọc</h5>
                  <p>
                    Hỗ trợ đăng ký thẻ thư viện, quản lý hồ sơ người dùng và
                    theo dõi lịch sử hoạt động.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5>📖 Quản lý đầu sách</h5>
                  <p>
                    Quản lý thông tin sách, tác giả, ISBN, thể loại và số lượng
                    tài liệu trong thư viện.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5>⏳ Gia hạn sách</h5>
                  <p>
                    Hỗ trợ gia hạn tài liệu trực tuyến theo đúng quy định của
                    thư viện.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5>⚠️ Xử lý vi phạm</h5>
                  <p>
                    Quản lý các trường hợp trả sách quá hạn, hư hỏng hoặc mất
                    tài liệu và thực hiện bồi thường.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5>👨‍💼 Quản lý nhân viên</h5>
                  <p>
                    Quản lý tài khoản nhân viên, phân quyền và theo dõi hoạt
                    động trong hệ thống.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quy định */}
        <section>
          <div className="card border-0 bg-light">
            <div className="card-body p-4">
              <h3 className="mb-3">Quy định mượn sách</h3>

              <ul className="mb-0">
                <li>Mỗi lượt mượn tối đa 03 tài liệu.</li>
                <li>Thời hạn mượn mang về tối đa 07 ngày.</li>
                <li>Mỗi lần gia hạn thêm 03 ngày.</li>
                <li>Tối đa 02 lần gia hạn cho một lượt mượn.</li>
                <li>
                  Các trường hợp trả trễ, làm hỏng hoặc mất tài liệu sẽ được xử
                  lý theo quy định của thư viện.
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default AboutUs;