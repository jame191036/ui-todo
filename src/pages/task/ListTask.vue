<template>
    <div class="container mt-4">
        <!-- Title -->
        <h2 class="text-center mb-4 text-primary">Task List</h2>

        <!-- Loading Spinner -->
        <div v-if="isLoading" class="d-flex justify-content-center my-4">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>

        <!-- Error Message -->
        <div v-if="!isLoading && errorMessage" class="alert alert-danger">
            {{ errorMessage }}
        </div>

        <!-- Filter Inputs -->
        <div class="row mb-3">
            <div class="col-md-4">
                <label>Title</label>
                <input type="text" v-model="filters.title" class="form-control" placeholder="Title" />
            </div>
            <div class="col-md-4">
                <label>Status</label>
                <input type="text" v-model="filters.status" class="form-control" placeholder="Status" />
            </div>
            <div class="col-md-4">
                <label>Priority</label>
                <input type="text" v-model="filters.priority" class="form-control" placeholder="Priority" />
            </div>
            <div class="col-md-4">
                <label>Due date</label>
                <input type="text" v-model="filters.due_date" class="form-control" placeholder="Due date" />
            </div>
            <div class="col-md-4">
            </div>
            <div class="col-md-2">
                <button class="btn btn-primary w-100 mt-4" @click="getOverView">
                    Search
                </button>
            </div>
        </div>

        <div v-if="!isLoading && tasks.length > 0">
            <table class="table table-hover shadow-sm">
                <thead class="table-primary">
                    <tr>
                        <th class="text-start">No.</th>
                        <th class="text-start" @click="sortData('task_id')" style="cursor: pointer;">ID
                            <span v-if="sortBy === 'task_id'">{{ sortOrder === 'ASC' ? '↑' : '↓' }}</span>
                        </th>
                        <th class="text-start" @click="sortData('title')" style="cursor: pointer;">Title<span
                                v-if="sortBy === 'task_id'">{{ sortOrder === 'ASC' ? '↑' : '↓' }}</span>
                        </th>
                        <th class="text-start" @click="sortData('status')" style="cursor: pointer;">Status
                            <span v-if="sortBy === 'status'">{{ sortOrder === 'ASC' ? '↑' : '↓' }}</span>
                        </th>
                        <th class="text-start" @click="sortData('priority')" style="cursor: pointer;">Priority
                            <span v-if="sortBy === 'priority'">{{ sortOrder === 'ASC' ? '↑' : '↓' }}</span>
                        </th>
                        <th class="text-start" @click="sortData('due_date')" style="cursor: pointer;">Due Date
                            <span v-if="sortBy === 'due_date'">{{ sortOrder === 'ASC' ? '↑' : '↓' }}</span>
                        </th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="task, index in tasks" :key="task.tasl_id">
                        <td class="text-start">{{ index + 1 }}</td>
                        <td class="text-start">{{ task.task_id }}</td>
                        <td class="text-start">{{ task.title }}</td>
                        <td class="text-start">{{ task.status }}</td>
                        <td class="text-start">{{ task.priority }}</td>
                        <td class="text-start">{{ new Date(task.due_date).toLocaleDateString("en-GB") }}</td>
                        <td><router-link :to="'/detail-task/' + task.task_id">View Details</router-link></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- No Data Message -->
        <div v-if="!isLoading && tasks.length === 0" class="text-center text-muted">
            No tasks found.
        </div>

        <!-- Pagination Controls with Page Limit Dropdown -->
        <nav v-if="!isLoading && totalPages > 1" class="d-flex justify-content-between align-items-center mt-4">
            <!-- Page Limit Dropdown -->
            <div class="d-flex align-items-center">
                <label for="limitSelect" class="me-2">Show:</label>
                <select id="limitSelect" class="form-select w-auto" v-model="limit" @change="getOverView">
                    <option v-for="option in limitOptions" :key="option" :value="option">
                        {{ option }} per page
                    </option>
                </select>
            </div>

            <!-- Pagination Controls -->
            <ul class="pagination mb-0">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                    <button class="page-link" @click="prevPage">Previous</button>
                </li>

                <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: currentPage === page }">
                    <button class="page-link" @click="goToPage(page)">{{ page }}</button>
                </li>

                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                    <button class="page-link" @click="nextPage">Next</button>
                </li>
            </ul>
        </nav>

    </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import api from "@/api"; // Import API configuration

export default {
    setup() {
        const tasks = ref([]); // Store tasks data
        const isLoading = ref(false);
        const errorMessage = ref("");
        const currentPage = ref(1);
        const limit = ref(5); // Default limit
        const totalPages = ref(1); // Will be updated dynamically
        const filters = ref({ user_id: "", title: "", status: "", priority: "", due_date: "" }); // Filtering fields
        const limitOptions = [5, 10, 20, 50]; // Dropdown options
        const sortBy = ref("task_id");
        const sortOrder = ref("ASC");

        onMounted(() => {
            getOverView();
        });

        const getOverView = async () => {
            isLoading.value = true;
            try {
                const token = localStorage.getItem("auth_token");

                if (!token) {
                    throw new Error("No authorization token found.");
                }

                const response = await api.post("/tasks/getOverView", {
                    page: currentPage.value,
                    limit: limit.value,
                    user_id: filters.value.user_id || null,
                    title: filters.value.title || null,
                    status: filters.value.status || null,
                    priority: filters.value.priority || null,
                    due_date: filters.value.due_date || null,
                    sortBy: sortBy.value,
                    sortOrder: sortOrder.value,
                }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.result) {
                    tasks.value = response.result.data || [];
                    totalPages.value = response.result.totalPages || 1;
                    console.log('tasks', tasks);

                } else {
                    tasks.value = [];
                    totalPages.value = 1;
                }
            } catch (error) {
                console.error("Error fetching data:", error.message);
                tasks.value = [];
                errorMessage.value = "Failed to load tasks.";
            } finally {
                isLoading.value = false;
            }
        }

        const sortData = (column) => {
            if (sortBy.value === column) {
                sortOrder.value = sortOrder.value === "ASC" ? "DESC" : "ASC";
            } else {
                sortBy.value = column;
                sortOrder.value = "ASC";
            }
            getOverView();
        }

        // Pagination functions
        const goToPage = (page) => {
            if (page >= 1 && page <= totalPages.value) {
                currentPage.value = page;
            }
        };

        const prevPage = () => {
            if (currentPage.value > 1) {
                currentPage.value--;
            }
        };

        const nextPage = () => {
            if (currentPage.value < totalPages.value) {
                currentPage.value++;
            }
        };

        // Watch for changes in page number and fetch new data
        watch(currentPage, getOverView);
        watch(limit, () => {
            currentPage.value = 1; // Reset to page 1 when limit changes
            getOverView();
        });

        return {
            tasks,
            isLoading,
            errorMessage,
            currentPage,
            limit,
            totalPages,
            filters,
            limitOptions,
            sortBy,
            sortOrder,
            getOverView,
            goToPage,
            prevPage,
            nextPage,
            sortData
        }
    }
};
</script>