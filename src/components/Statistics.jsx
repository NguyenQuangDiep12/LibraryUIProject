import React from 'react'

const Statistics = () => {
  return (
    <>
        {/* --- CÁC WIDGET THỐNG KÊ (4 ô trên cùng) --- */}
        <div className="row g-4 mb-4">
        {/* Card 1: Tổng sách */}
        <div className="col-12 col-md-6 col-xl-3">
            <div className="card h-100 shadow-sm border-0 border-start border-primary border-4">
            <div className="card-body">
                <h6 className="card-title text-muted fw-semibold">Tổng sách</h6>
                <p className="card-text fs-2 fw-bold text-primary mb-0">6</p>
            </div>
            </div>
        </div>
        {/* Card 2: Tổng người dùng */}
        <div className="col-12 col-md-6 col-xl-3">
            <div className="card h-100 shadow-sm border-0 border-start border-success border-4">
            <div className="card-body">
                <h6 className="card-title text-muted fw-semibold">Tổng người dùng</h6>
                <p className="card-text fs-2 fw-bold text-success mb-0">6</p>
            </div>
            </div>
        </div>
        {/* Card 3: Phiếu mượn */}
        <div className="col-12 col-md-6 col-xl-3">
            <div className="card h-100 shadow-sm border-0 border-start border-info border-4">
            <div className="card-body">
                <h6 className="card-title text-muted fw-semibold">Phiếu mượn</h6>
                <p className="card-text fs-2 fw-bold text-info mb-0">9</p>
            </div>
            </div>
        </div>
        {/* Card 4: Quá hạn */}
        <div className="col-12 col-md-6 col-xl-3">
            <div className="card h-100 shadow-sm border-0 border-start border-danger border-4">
            <div className="card-body">
                <h6 className="card-title text-muted fw-semibold">Quá hạn</h6>
                <p className="card-text fs-2 fw-bold text-danger mb-0">0</p>
            </div>
            </div>
        </div>
        </div>
        {/* --- CÁC BẢNG DỮ LIỆU (2 bảng bên dưới) --- */}
        <div className="row g-4">
        
        {/* Bảng 1: Top sách mượn nhiều */}
        <div className="col-12 col-lg-6">
            <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white border-bottom py-3">
                <h6 className="mb-0 text-dark d-flex align-items-center fw-bold">
                <span className="me-2">🏆</span> Top sách mượn nhiều
                </h6>
            </div>
            <div className="card-body p-0">
                <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                    <thead className="table-light text-muted small">
                    <tr>
                        <th className="px-4 py-3 border-0">#</th>
                        <th className="px-4 py-3 border-0">TÊN SÁCH</th>
                        <th className="px-4 py-3 border-0 text-end">LƯỢT MƯỢN</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td className="px-4 py-3">1</td>
                        <td className="px-4 py-3">The Day of the Jackal</td>
                        <td className="px-4 py-3 text-end">
                        <span className="badge bg-primary rounded-pill">8</span>
                        </td>
                    </tr>
                    <tr>
                        <td className="px-4 py-3">2</td>
                        <td className="px-4 py-3">Mắt Biếc</td>
                        <td className="px-4 py-3 text-end">
                        <span className="badge bg-primary rounded-pill">5</span>
                        </td>
                    </tr>
                    <tr>
                        <td className="px-4 py-3">3</td>
                        <td className="px-4 py-3">Dế Mèn Phiêu Lưu Ký</td>
                        <td className="px-4 py-3 text-end">
                        <span className="badge bg-primary rounded-pill">1</span>
                        </td>
                    </tr>
                    </tbody>
                </table>
                </div>
            </div>
            </div>
        </div>
        {/* Bảng 2: Phiếu quá hạn cần xử lý */}
        <div className="col-12 col-lg-6">
            <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white border-bottom py-3">
                <h6 className="mb-0 text-danger d-flex align-items-center fw-bold">
                <span className="me-2">⚠️</span> Phiếu quá hạn cần xử lý
                </h6>
            </div>
            <div className="card-body d-flex flex-column">
                <div className="d-flex justify-content-between text-muted small fw-bold mb-3 px-2">
                <span>ĐỘC GIẢ</span>
                <span>HẠN TRẢ</span>
                <span>QUÁ HẠN</span>
                </div>
                <div className="flex-grow-1 d-flex align-items-center justify-content-center p-4 border rounded">
                <p className="text-muted mb-0">Không có phiếu quá hạn</p>
                </div>
            </div>
            </div>
        </div>
        </div>
    </>
  )
}

export default Statistics;