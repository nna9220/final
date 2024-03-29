// script.js
function openTaskForm() {
    var formContainer = document.getElementById('task-form-container');
    formContainer.innerHTML = `
        <form id="task-form">
            <label for="taskName">Tên task:</label>
            <input type="text" id="taskName" required><br>

            <label for="project">Chọn dự án:</label>
            <select id="project" required>
                <!-- Các dự án sẽ được thêm vào đây -->
            </select><br>

            <label for="description">Mô tả:</label>
            <textarea id="description" required></textarea><br>

            <label for="assignee">Chọn người thực hiện:</label>
            <select id="assignee" required>
                <!-- Các người thực hiện sẽ được thêm vào đây -->
            </select><br>

            <label for="deadline">Thời gian hoàn thành:</label>
            <input type="date" id="deadline" required><br>

            <label for="attachment">Tệp đính kèm:</label>
            <input type="file" id="attachment"><br>

            <button type="button" onclick="saveTask()">Lưu</button>
            <button type="button" onclick="closeTaskForm()">Hủy</button>
        </form>
    `;

    // Thêm logic để điền dự án và người thực hiện vào các dropdown (select) ở đây

    formContainer.classList.remove('hidden');
}

// script.js

function saveTask() {
    var taskName = document.getElementById('taskName').value;
    var project = document.getElementById('project').value;
    var description = document.getElementById('description').value;
    var assignee = document.getElementById('assignee').value;
    var deadline = document.getElementById('deadline').value;

    // Thêm logic để lưu task (có thể lưu vào một mảng, cơ sở dữ liệu, hoặc nơi khác)
    var task = {
        name: taskName,
        project: project,
        description: description,
        assignee: assignee,
        deadline: deadline
    };

    // Hiển thị thông tin task trên danh sách
    displayTask(task);

    // Đóng form
    closeTaskForm();
}

function displayTask(task) {
    var taskListContainer = document.getElementById('task-list');

    var taskElement = document.createElement('div');
    taskElement.innerHTML = `
        <p><strong>Tên task:</strong> ${task.name}</p>
        <p><strong>Mô tả:</strong> ${task.description}</p>
        <p><strong>Người thực hiện:</strong> ${task.assignee}</p>
        <p><strong>Thời gian hoàn thành:</strong> ${task.deadline}</p>
        <hr>
    `;

    taskListContainer.appendChild(taskElement);
}



function closeTaskForm() {
    var formContainer = document.getElementById('task-form-container');
    formContainer.innerHTML = ''; // Xóa nội dung form
    formContainer.classList.add('hidden');
}
