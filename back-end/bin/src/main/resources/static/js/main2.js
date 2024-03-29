(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();


    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Sidebar Toggler
    $('.sidebar-toggler').click(function () {
        $('.sidebar, .content').toggleClass("open");
        return false;
    });


    // Progress Bar
    $('.pg-bar').waypoint(function () {
        $('.progress .progress-bar').each(function () {
            $(this).css("width", $(this).attr("aria-valuenow") + '%');
        });
    }, {offset: '80%'});


    // Calender
    $('#calender').datetimepicker({
        inline: true,
        format: 'L'
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        items: 1,
        dots: true,
        loop: true,
        nav : false
    });


})(jQuery);

// Function to disable inputs
function disableInputs() {
    var inputs = document.getElementsByTagName('input');
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].setAttribute('disabled', 'true');
    }
}

// Function to enable inputs
function enableInputs() {
    var inputs = document.getElementsByTagName('input');
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].removeAttribute('disabled');
    }
}

// Disable inputs initially
disableInputs();

// Function to update information
function logoutAcc() {

}

function updateProfilePicture() {
    // Tạo một đối tượng input
    var input = document.createElement('input');
    input.type = 'file';

    // Xác định kiểu tệp cho phép
    input.accept = 'image/*';

    // Xử lý sự kiện khi chọn tệp
    input.onchange = function(event) {
        var file = event.target.files[0];

        // Kiểm tra nếu tệp được chọn là hình ảnh
        if (file && file.type.startsWith('image')) {
            // Đọc tệp như URL
            var reader = new FileReader();
            reader.onload = function(e) {
                // Cập nhật src của thẻ <img> với đường dẫn hình ảnh mới
                document.querySelector('.img-account-profile').src = e.target.result;
            }
            reader.readAsDataURL(file);
        } else {
            // Xử lý khi người dùng chọn một tệp không phải là hình ảnh
            alert('Vui lòng chọn một tệp hình ảnh.');
        }
    };

    // Kích hoạt sự kiện click trên input
    input.click();
}

function displayEditForm() {
    document.getElementById("personalInfo").classList.add("d-none");
    document.getElementById("editForm").classList.remove("d-none");
}
function updateInfo() {
    // Lấy giá trị từ form chỉnh sửa
    var usernameValue = document.getElementById('inputUsername').value;
    var firstNameValue = document.getElementById('inputFirstName').value;
    var lastNameValue = document.getElementById('inputLastName').value;
    var orgNameValue = document.getElementById('inputOrgName').value;
    var emailAddressValue = document.getElementById('inputEmailAddress').value;
    var phoneValue = document.getElementById('inputPhone').value;
    var birthdayValue = document.getElementById('inputBirthday').value;

    // Thay thế nội dung trong form chỉnh sửa bằng thông tin đã cập nhật
    document.getElementById('personalInfo').innerHTML = `
            <form>
                <div class="mb-3">
                    <label class="small mb-1">Họ và tên</label>
                    <div>${usernameValue}</div>
                </div>
                <div class="row gx-3 mb-3">
                    <div class="col-md-6">
                        <label class="small mb-1">ID</label>
                        <div>${firstNameValue}</div>
                    </div>
                    <div class="col-md-6">
                        <label class="small mb-1" >Giới tính</label>
                        <div>${lastNameValue}</div>
                    </div>
                </div>
                <div class="row gx-3 mb-3">
                    <div class="mb-3">
                        <label class="small mb-1">Địa chỉ</label>
                        <div>${orgNameValue}</div>
                    </div>
                </div>
                <div class="mb-3">
                    <label class="small mb-1" >Email address</label>
                    <div>${emailAddressValue}</div>
                </div>
                <div class="row gx-3 mb-3">
                    <div class="col-md-6">
                        <label class="small mb-1">Phone number</label>
                        <div>${phoneValue}</div>
                    </div>
                    <div class="col-md-6">
                        <label class="small mb-1">Birthday</label>
                        <div>${birthdayValue}</div>
                    </div>
                </div>
                <button class="btn btn-primary" type="button" onclick="displayEditForm()">Chỉnh sửa thông tin</button>
            </form>
        `;
}

function cancelEdit() {
    // Đảm bảo rằng form chỉnh sửa được ẩn
    document.getElementById("editForm").classList.add("d-none");

    // Hiển thị form thông tin cá nhân
    document.getElementById("personalInfo").classList.remove("d-none");
}

function searchTable(inputId, tableId) {
    var input, filter, table, tr, td, i, j, txtValue;
    input = document.getElementById(inputId);
    filter = input.value.toUpperCase();
    table = document.getElementById(tableId);
    tr = table.getElementsByTagName("tr");

    for (i = 1; i < tr.length; i++) {
        var found = false;
        td = tr[i].getElementsByTagName("td");
        for (j = 0; j < td.length; j++) {
            var cell = td[j];
            if (cell) {
                txtValue = cell.textContent || cell.innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    found = true;
                    break;
                }
            }
        }
        if (found) {
            tr[i].style.display = "";
        } else {
            tr[i].style.display = "none";
        }
    }
}


function confirmRegistration(button) {
    var row = button.parentNode.parentNode
    var limit = parseInt(row.cells[4].innerHTML);

    var popupContainer = document.getElementById("popupContainer");
    var popupMessage = document.getElementById("popupMessage");

    if(limit === 0){
        popupMessage.innerHTML = "Xác nhận thành công";
    }
    else if (limit === 1)
    {
        popupMessage.innerHTML = "Đề tài này đã đủ số lượng đăng ký";
    }

    popupContainer.style.display = "flex";
}

function closePopup() {
    var popupContainer = document.getElementById("popupContainer");
    popupContainer.style.display = "none";
}
