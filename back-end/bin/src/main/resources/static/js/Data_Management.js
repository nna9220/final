//SINH VIÊN
//Xóa sinh viên
function deleteRowSV(row) {
    var confirmation = confirm("Bạn chắc chắn muốn xóa dữ liệu này???");
    if (confirmation) {
        var i = row.parentNode.parentNode.rowIndex;
        document.getElementById("myTable").deleteRow(i);
    }
}

// Hiển thị form thêm
function hienThiForm() {
    var form = document.getElementById('add-form');
    form.style.display = 'block';
}

// Xử lý thêm sinh viên
function themSinhVien() {
    var mssv = document.getElementById('mssv').value;
    var hoTen = document.getElementById('hoTen').value;
    var ngaySinh = document.getElementById('ngaySinh').value;
    var email = document.getElementById('email').value;
    var diaChi = document.getElementById('diaChi').value;
    var soDienThoai = document.getElementById('soDienThoai').value;
    var nganh = document.getElementById('nganh').value;
    var chuyenNganh = document.getElementById('chuyenNganh').value;

    // Thêm logic xử lý dữ liệu tại đây

    // Sau khi thêm, ẩn form
    var form = document.getElementById('add-form');
    form.style.display = 'none';
}

// Xử lý hủy
function huy() {
    var form = document.getElementById('add-form');
    form.style.display = 'none';
}

var currentRowIndex; // Biến để lưu trữ chỉ mục của hàng đang được chỉnh sửa

// Hàm để sửa đổi dữ liệu khi click vào nút Edit
function editRowSV(row) {
    var editForm = document.getElementById("edit-form");
    editForm.style.display = "block";

    // Lấy chỉ mục của hàng đang được chỉnh sửa
    var table = document.getElementById('myTable');
    var cells = row.parentNode.parentNode.cells;
    for (var i = 1; i < table.rows.length; i++) {
        if (table.rows[i] === row.parentNode.parentNode) {
            currentRowIndex = i;
            break;
        }
    }

    // Điền dữ liệu từ hàng vào form chỉnh sửa
    document.getElementById("edit-mssv").value = cells[0].innerText;
    document.getElementById("edit-hoTen").value = cells[1].innerText;
    document.getElementById("edit-ngaySinh").value = cells[2].innerText;
    document.getElementById("edit-email").value = cells[3].innerText;
    document.getElementById("edit-diaChi").value = cells[4].innerText;
    document.getElementById("edit-soDienThoai").value = cells[5].innerText;
    document.getElementById("edit-nganh").value = cells[6].innerText;
    document.getElementById("edit-chuyenNganh").value = cells[7].innerText;
}

// Hàm để cập nhật dữ liệu sau khi chỉnh sửa
function capNhatSinhVien() {
    var table = document.getElementById('myTable');
    var row = table.rows[currentRowIndex];

    // Lấy dữ liệu từ form chỉnh sửa
    row.cells[0].innerText = document.getElementById("edit-mssv").value;
    row.cells[1].innerText = document.getElementById("edit-hoTen").value;
    row.cells[2].innerText = document.getElementById("edit-ngaySinh").value;
    row.cells[3].innerText = document.getElementById("edit-email").value;
    row.cells[4].innerText = document.getElementById("edit-diaChi").value;
    row.cells[5].innerText = document.getElementById("edit-soDienThoai").value;
    row.cells[6].innerText = document.getElementById("edit-nganh").value;
    row.cells[7].innerText = document.getElementById("edit-chuyenNganh").value;

    // Ẩn form chỉnh sửa
    var editForm = document.getElementById("edit-form");
    editForm.style.display = "none";
}

// Hàm để hủy bỏ việc chỉnh sửa
function huyCapNhat() {
    var editForm = document.getElementById("edit-form");
    editForm.style.display = "none";
}

//-----------------GIẢNG VIÊN -----------------------
function deleteRowGV(row) {
    var confirmation = confirm("Bạn chắc chắn muốn xóa dữ liệu này???");
    if (confirmation) {
        var i = row.parentNode.parentNode.rowIndex;
        document.getElementById("GiangVienList").deleteRow(i);
    }
}

function themGiangVien() {
    var mssv = document.getElementById('mssv').value;
    var hoTen = document.getElementById('hoTen').value;
    var ngaySinh = document.getElementById('ngaySinh').value;
    var email = document.getElementById('email').value;
    var diaChi = document.getElementById('diaChi').value;
    var soDienThoai = document.getElementById('soDienThoai').value;
    var nganh = document.getElementById('nganh').value;
    var chuyenNganh = document.getElementById('chuyenNganh').value;

    // Thêm logic xử lý dữ liệu tại đây

    // Sau khi thêm, ẩn form
    var form = document.getElementById('add-form');
    form.style.display = 'none';
}


function editRowGV(row) {
    var editForm = document.getElementById("edit-form");
    editForm.style.display = "block";

    // Lấy chỉ mục của hàng đang được chỉnh sửa
    var table = document.getElementById('GiangVienList');
    var cells = row.parentNode.parentNode.cells;
    for (var i = 1; i < table.rows.length; i++) {
        if (table.rows[i] === row.parentNode.parentNode) {
            currentRowIndex = i;
            break;
        }
    }

    // Điền dữ liệu từ hàng vào form chỉnh sửa
    document.getElementById("edit-mssv").value = cells[0].innerText;
    document.getElementById("edit-hoTen").value = cells[1].innerText;
    document.getElementById("edit-ngaySinh").value = cells[2].innerText;
    document.getElementById("edit-email").value = cells[3].innerText;
    document.getElementById("edit-diaChi").value = cells[4].innerText;
    document.getElementById("edit-soDienThoai").value = cells[5].innerText;
    document.getElementById("edit-nganh").value = cells[6].innerText;
    document.getElementById("edit-chuyenNganh").value = cells[7].innerText;
}

// Hàm để cập nhật dữ liệu sau khi chỉnh sửa
function capNhatGiangVien() {
    var table = document.getElementById('GiangVienList');
    var row = table.rows[currentRowIndex];

    // Lấy dữ liệu từ form chỉnh sửa
    row.cells[0].innerText = document.getElementById("edit-mssv").value;
    row.cells[1].innerText = document.getElementById("edit-hoTen").value;
    row.cells[2].innerText = document.getElementById("edit-ngaySinh").value;
    row.cells[3].innerText = document.getElementById("edit-email").value;
    row.cells[4].innerText = document.getElementById("edit-diaChi").value;
    row.cells[5].innerText = document.getElementById("edit-soDienThoai").value;
    row.cells[6].innerText = document.getElementById("edit-nganh").value;
    row.cells[7].innerText = document.getElementById("edit-chuyenNganh").value;

    // Ẩn form chỉnh sửa
    var editForm = document.getElementById("edit-form");
    editForm.style.display = "none";
}


function themNienKhoa() {
    var hoTen = document.getElementById('nienKhoa').value;

    // Thêm logic xử lý dữ liệu tại đây

    // Sau khi thêm, ẩn form
    var form = document.getElementById('add-form');
    form.style.display = 'none';
}

function capNhatNienKhoa() {
    var table = document.getElementById('NienKhoaList');
    var row = table.rows[currentRowIndex];

    // Lấy dữ liệu từ form chỉnh sửa
    row.cells[0].innerText = document.getElementById("edit-maNienKhoa").value;
    row.cells[1].innerText = document.getElementById("edit-NienKhoa").value;

    // Ẩn form chỉnh sửa
    var editForm = document.getElementById("edit-form");
    editForm.style.display = "none";
}


