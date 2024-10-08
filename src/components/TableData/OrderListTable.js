import React, { useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import dayjs from 'dayjs';
import ServiceOrderDetails from '../ServiceOrderDetails'; // Import the ServiceOrderDetails component

function createData(stt, madon, trangthai, ngaytao, thanhtoan, khachhang, tongtien) {
    return { stt, madon, trangthai, ngaytao, thanhtoan, khachhang, tongtien };
}

const rows = [
    createData(1, 'MD001', 'Đã xử lý', '2024-09-10T14:30:00', 'Đã thanh toán', 'Nguyễn Văn A', 1500000),
    createData(2, 'MD002', 'Chờ xử lý', '2024-09-11T09:15:00', 'Chưa thanh toán', 'Trần Thị B', 2000000),
    createData(3, 'MD003', 'Đã xử lý', '2024-09-12T10:45:00', 'Đã thanh toán', 'Lê Văn C', 2500000),
];

export default function OrderListTable({ filter }) {
    const [selectedOrder, setSelectedOrder] = useState(null); // State for selected order
    const [dialogOpen, setDialogOpen] = useState(false); // State to control dialog visibility

    const filteredRows = rows.filter((row) => {
        if (filter === "All") return true;

        switch (filter) {
            case "Pending":
                return row.trangthai === "Chờ xử lý";
            case "Done":
                return row.trangthai === "Đã xử lý";
            case "NotPaid":
                return row.thanhtoan === "Chưa thanh toán";
            case "Paid":
                return row.thanhtoan === "Đã thanh toán";
            default:
                return true;
        }
    });

    const handleRowClick = (row) => {
        setSelectedOrder(row); // Set the selected order
        setDialogOpen(true); // Open the dialog
    };

    const handleCloseDialog = () => {
        setDialogOpen(false); // Close the dialog
    };

    return (
        <>
            <TableContainer component={Paper} sx={{ width: "1080px" }}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left" sx={{ fontWeight: "bold", width: "50px" }}>STT</TableCell>
                            <TableCell align="left" sx={{ fontWeight: "bold", width: "150px" }}>Mã Đơn</TableCell>
                            <TableCell align="left" sx={{ fontWeight: "bold", width: "150px" }}>Trạng Thái</TableCell>
                            <TableCell align="left" sx={{ fontWeight: "bold", width: "200px" }}>Ngày Tạo</TableCell>
                            <TableCell align="left" sx={{ fontWeight: "bold", width: "150px" }}>Thanh Toán</TableCell>
                            <TableCell align="left" sx={{ fontWeight: "bold", width: "200px" }}>Khách Hàng</TableCell>
                            <TableCell align="left" sx={{ fontWeight: "bold", width: "150px" }}>Tổng Tiền</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredRows.map((row) => (
                            <TableRow key={row.madon} onClick={() => handleRowClick(row)} sx={{ "&:last-child td, &:last-child th": { border: 0 }, cursor: 'pointer' }}>
                                <TableCell align="left">{row.stt}</TableCell>
                                <TableCell align="left">{row.madon}</TableCell>
                                <TableCell align="left">{row.trangthai}</TableCell>
                                <TableCell align="left">{dayjs(row.ngaytao).format('DD/MM/YYYY HH:mm')}</TableCell>
                                <TableCell align="left">{row.thanhtoan}</TableCell>
                                <TableCell align="left">{row.khachhang}</TableCell>
                                <TableCell align="left">{row.tongtien.toLocaleString('vi-VN')} đ</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Render ServiceOrderDetails Dialog */}
            {selectedOrder && (
                <ServiceOrderDetails open={dialogOpen} onClose={handleCloseDialog} orderData={selectedOrder} />
            )}
        </>
    );
}