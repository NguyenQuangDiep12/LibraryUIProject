import React, { useState, useEffect } from 'react';
import { statsApi } from '../apis/apis';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation, faTrophy } from '@fortawesome/free-solid-svg-icons';

const StatisticsContent = () => {
  const [stats, setStats] = useState({ totalBooks: 0, totalUsers: 0, totalBorrows: 0, overdue: 0 });
  const [topBooks, setTopBooks] = useState([]);
  const [overdueRecords, setOverdueRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [overviewRes, topBooksRes, overdueRes] = await Promise.all([
        statsApi.getOverview(),
        statsApi.getTopBooks({ top: 5 }),
        statsApi.getOverdue()
      ]);

      // Parse Overview Stats
      const overviewData = overviewRes?.data !== undefined ? overviewRes.data : overviewRes?.Data;
      if (overviewData) {
        setStats({
          totalBooks: overviewData.totalBooks ?? overviewData.TotalBooks ?? 0,
          totalUsers: overviewData.totalUsers ?? overviewData.TotalUsers ?? 0,
          totalBorrows: overviewData.totalBorrowRecords ?? overviewData.TotalBorrowRecords ?? 0,
          overdue: overviewData.totalOverdueRecords ?? overviewData.TotalOverdueRecords ?? 0
        });
      }

      // Parse Top Books
      const topBooksData = topBooksRes?.data !== undefined ? topBooksRes.data : topBooksRes?.Data;
      if (Array.isArray(topBooksData)) {
        setTopBooks(topBooksData);
      } else if (topBooksData && Array.isArray(topBooksData.items)) {
        setTopBooks(topBooksData.items);
      }

      // Parse Overdue Records
      const overdueData = overdueRes?.data !== undefined ? overdueRes.data : overdueRes?.Data;
      if (Array.isArray(overdueData)) {
        setOverdueRecords(overdueData);
      }

    } catch (error) {
      console.error("Lỗi khi tải thống kê:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center py-5">
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Đang tải thống kê...</span>
        </div>
        <div className="text-muted small">Đang lấy dữ liệu thống kê...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Hàng 1: Thẻ thống kê */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card shadow-sm border-0 border-start border-4 border-primary rounded-2 h-100">
            <div className="card-body py-4">
              <p className="text-muted mb-1 small fw-semibold text-uppercase">Tổng sách</p>
              <h3 className="mb-0 text-primary fw-bold">{stats.totalBooks}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0 border-start border-4 border-success rounded-2 h-100">
            <div className="card-body py-4">
              <p className="text-muted mb-1 small fw-semibold text-uppercase">Tổng người dùng</p>
              <h3 className="mb-0 text-success fw-bold">{stats.totalUsers}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0 border-start border-4 border-info rounded-2 h-100">
            <div className="card-body py-4">
              <p className="text-muted mb-1 small fw-semibold text-uppercase">Phiếu mượn</p>
              <h3 className="mb-0 text-info fw-bold">{stats.totalBorrows}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0 border-start border-4 border-danger rounded-2 h-100">
            <div className="card-body py-4">
              <p className="text-muted mb-1 small fw-semibold text-uppercase">Quá hạn</p>
              <h3 className="mb-0 text-danger fw-bold">{stats.overdue}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Hàng 2: Bảng chi tiết */}
      <div className="row g-3">
        {/* Top Sách */}
        <div className="col-md-6">
          <div className="card shadow-sm border-0 rounded-2 h-100">
            <div className="card-header bg-white border-bottom py-3">
              <h6 className="mb-0 text-dark fw-bold"><FontAwesomeIcon icon={faTrophy}/> Top sách mượn nhiều</h6>
            </div>
            <div className="card-body p-0">
              <table className="table mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th className="text-muted small py-2 px-4" style={{ width: '60px' }}>#</th>
                    <th className="text-muted small py-2 px-4">TÊN SÁCH</th>
                    <th className="text-muted small py-2 px-4 text-center" style={{ width: '120px' }}>LƯỢT MƯỢN</th>
                  </tr>
                </thead>
                <tbody>
                  {topBooks.length > 0 ? topBooks.map((b, i) => {
                    const bookId = b.bookId ?? b.BookId;
                    const title = b.title ?? b.Title;
                    const borrowCount = b.borrowCount ?? b.BorrowCount ?? 0;
                    return (
                      <tr key={bookId ?? i}>
                        <td className="px-4 py-3 text-muted">{i + 1}</td>
                        <td className="px-4 py-3 fw-medium text-dark">{title}</td>
                        <td className="px-4 py-3 text-center">
                          <span className="badge bg-primary rounded-pill px-3 py-1.5">{borrowCount}</span>
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan={3} className="text-center py-4 text-secondary">
                        Không có dữ liệu
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Cần xử lý quá hạn */}
        <div className="col-md-6">
          <div className="card shadow-sm border-0 rounded-2 h-100">
            <div className="card-header bg-white border-bottom py-3">
              <h6 className="mb-0 text-danger fw-bold"><FontAwesomeIcon icon={faTriangleExclamation}/> Phiếu quá hạn cần xử lý</h6>
            </div>
            <div className="card-body p-0">
              <table className="table mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th className="text-muted small py-2 px-4">ĐỘC GIẢ</th>
                    <th className="text-muted small py-2 px-4">HẠN TRẢ</th>
                    <th className="text-muted small py-2 px-4 text-center" style={{ width: '120px' }}>QUÁ HẠN</th>
                  </tr>
                </thead>
                <tbody>
                  {overdueRecords.length > 0 ? overdueRecords.map((r, i) => {
                    const borrowId = r.borrowId ?? r.BorrowId;
                    const readerName = r.readerName ?? r.ReaderName ?? 'N/A';
                    const dueDate = r.dueDate ?? r.DueDate;
                    const overdueDays = r.overdueDays ?? r.OverdueDays ?? 0;
                    return (
                      <tr key={borrowId ?? i}>
                        <td className="px-4 py-3 fw-medium text-dark">{readerName}</td>
                        <td className="px-4 py-3 text-muted">
                          {dueDate ? new Date(dueDate).toLocaleDateString('vi-VN') : 'N/A'}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="badge bg-danger px-2 py-1.5">{overdueDays} ngày</span>
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan={3} className="text-center py-4 text-secondary">
                        Không có dữ liệu quá hạn
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsContent;