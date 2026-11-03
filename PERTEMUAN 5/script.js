// File: script.js
document.addEventListener("DOMContentLoaded", () => {
    // 1. Ambil elemen DOM
    const todoForm = document.querySelector("#todoForm");
    const taskInput = document.querySelector("#taskInput");
    const inputError = document.querySelector("#inputError");
    const todoList = document.querySelector("#todoList");
    const inputError1 = document.querySelector("#inputError1");

    // 2. Fungsi membaca dan menyimpan ke LocalStorage
    const getTasks = () => JSON.parse(localStorage.getItem("todo_tasks")) || [];
    const saveTasks = (tasks) => localStorage.setItem("todo_tasks",JSON.stringify(tasks));

    // 3. Fungsi menampilkan daftar tugas ke layar
    const renderTasks = () => {
        const tasks = getTasks();
        todoList.innerHTML = "";
        if (tasks.length === 0) {
            todoList.innerHTML = "<p style='text-align:center; color:#64748b; fontsize:13px; padding:10px;'>Belum ada tugas tersimpan.</p>";
            return;
        }

        tasks.forEach((task, index) => {
            const li = document.createElement("li");
            li.className = `todo-item ${task.completed ? 'completed' : ''}`;
            
            li.innerHTML = `
                <span class="todo-text">${task.text}</span>
                <div class="todo-actions">
                    <button class="action-btn complete-btn" data-index="${index}">
                        ${task.completed ? 'Batal' : 'Selesai'}
                    </button>
                    <button class="action-btn delete-btn" data-index="${index}">Hapus</button>
                </div>
            `;
            todoList.appendChild(li);
        });
    };

    // 4. Tambah tugas saat formulir dikirim
    todoForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const taskText = taskInput.value.trim();
        const data = getTasks()

        // Validasi input sederhana
        if (taskText.length < 3) {
            taskInput.classList.add("error");
            inputError.textContent = "Tugas tidak boleh kurang dari 3 karakter!";
            inputError.style.display = "block";
            return;
        }

        if (data.length >= 5) {
            taskInput.classList.add("error");
            inputError.textContent = 'Tugas Maksimal 5!'
            inputError.style.display = "block";
            return;
        }

        // Jika valid, hilangkan pesan error
        taskInput.classList.remove("error");
        inputError.style.display = "none";

        // Simpan tugas baru ke array LocalStorage
        const tasks = getTasks();
        tasks.push({ text: taskText, completed: false });
        saveTasks(tasks);

        taskInput.value = "";
        renderTasks();
    });

    // 5. Tangani klik tombol Selesai dan Hapus menggunakan Event Listener pada todoList
    todoList.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        if (index === undefined) return;

        const tasks = getTasks();

        if (e.target.classList.contains("complete-btn")) {
            tasks[index].completed = !tasks[index].completed;
            saveTasks(tasks);
            renderTasks();
        } else if (e.target.classList.contains("delete-btn")) {
            tasks.splice(index, 1);
            saveTasks(tasks);
            renderTasks();
        }
    });


    // 6. fitur 1 - task counter
     const taskCounter = document.querySelector("#taskCounter");
      const updateTaskCounter = () => {
        const tasks = getTasks();

        const completedCount = tasks.filter(
            task => task.completed === true
        ).length;

        const unfinishedCount = tasks.length - completedCount;

         taskCounter.textContent =
            `Total: ${tasks.length} Tugas | Selesai: ${completedCount} | Belum Selesai: ${unfinishedCount}`;
    };

    // Memperbarui counter ketika tugas ditambahkan
    todoForm.addEventListener("submit", () => {
        setTimeout(updateTaskCounter, 0);
    });

    // Memperbarui counter ketika tugas diselesaikan atau dihapus
    todoList.addEventListener("click", () => {
        setTimeout(updateTaskCounter, 0);
    });

    // 7. fitur 2 - hapus semua tugas selesai
    const clearCompletedBtn = document.querySelector("#clearCompletedBtn");
    clearCompletedBtn.addEventListener("click", () => {

        const tasks = getTasks();

        // Memfilter tugas yang belum selesai
        const remainingTasks = tasks.filter(
            task => task.completed !== true
        );

        // Menyimpan kembali tugas yang belum selesai
        saveTasks(remainingTasks);

        // Memperbarui tampilan daftar tugas
        renderTasks();

        // Memperbarui jumlah tugas
        updateTaskCounter();
    });

    // 8. fitur 3 - konfirmasi hapus
     todoList.addEventListener("click", (e) => {

        if (e.target.classList.contains("delete-btn")) {

            const confirmed = confirm(
                "Apakah Anda yakin ingin menghapus tugas ini?"
            );

            // Jika Cancel, batalkan proses penghapusan
            if (!confirmed) {
                e.preventDefault();
                e.stopImmediatePropagation();
            }
        }

    }, true);

    // Render pertama kali saat halaman selesai dimuat
    renderTasks();
    updateTaskCounter();
});
