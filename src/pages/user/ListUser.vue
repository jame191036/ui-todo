<template>
    <div class="container mt-4">
        <!-- Title -->
        <h2 class="text-center mb-4 text-primary">User List</h2>

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
                <label>Username</label>
                <input type="text" v-model="filters.username" class="form-control" placeholder="username" />
            </div>
            <div class="col-md-4">
                <label>Email</label>
                <input type="text" v-model="filters.email" class="form-control" placeholder="email" />
            </div>
            <div class="col-md-2">
                <button class="btn btn-primary w-100 mt-4" @click="getOverView">
                    search
                </button>
            </div>
        </div>

        <!-- User Table -->
        <div v-if="!isLoading && users.length > 0">
            <table class="table table-hover shadow-sm">
                <thead class="table-primary">
                    <tr>
                        <th class="text-start">No.</th>
                        <th class="text-start" @click="sortData('user_id')" style="cursor: pointer;">
                            User ID <span v-if="sortBy === 'user_id'">{{ sortOrder === 'ASC' ? '↑' : '↓' }}</span>
                        </th>
                        <th style="cursor: pointer;">
                            Username
                        </th>
                        <th style="cursor: pointer;">
                            Email
                        </th>
                        <!-- <th @click="sortData('username')" style="cursor: pointer;">
                            Username <span v-if="sortBy === 'username'">{{ sortOrder === 'ASC' ? '↑' : '↓' }}</span>
                        </th>
                        <th @click="sortData('email')" style="cursor: pointer;">
                            Email <span v-if="sortBy === 'email'">{{ sortOrder === 'ASC' ? '↑' : '↓' }}</span>
                        </th> -->
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user, index in users" :key="user.user_id">
                        <td class="text-start">{{ index + 1 }}</td>
                        <td class="text-start">{{ user.user_id }}</td>
                        <td>{{ user.username }}</td>
                        <td>{{ user.email }}</td>
                        <td>
                            <router-link :to="'/detail-user/' + user.user_id">View Details</router-link>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- No Data Message -->
        <div v-if="!isLoading && users.length === 0" class="text-center text-muted">
            No users found.
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
        const users = ref([]); // Store users data
        const isLoading = ref(false);
        const errorMessage = ref("");
        const currentPage = ref(1);
        const limit = ref(5); // Default limit
        const totalPages = ref(1); // Will be updated dynamically
        const filters = ref({ username: "", email: "" }); // Filtering fields
        const limitOptions = [5, 10, 20, 50]; // Dropdown options
        const sortBy = ref("user_id");
        const sortOrder = ref("ASC");

        // Fetch users when the component is mounted
        onMounted(() => {
            getOverView();
        });

        // Fetch users from API
        const getOverView = async () => {
            isLoading.value = true;
            try {
                const token = localStorage.getItem("auth_token");

                if (!token) {
                    throw new Error("No authorization token found.");
                }

                const response = await api.post("/users/getOverView", {
                    page: currentPage.value,
                    limit: limit.value,
                    username: filters.value.username || null,
                    email: filters.value.email || null,
                    sortBy: sortBy.value,
                    sortOrder: sortOrder.value,
                }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.result) {
                    users.value = response.result.data || [];
                    totalPages.value = response.result.totalPages || 1;
                } else {
                    users.value = [];
                    totalPages.value = 1;
                }
            } catch (error) {
                console.error("Error fetching data:", error.message);
                users.value = [];
                errorMessage.value = "Failed to load users.";
            } finally {
                isLoading.value = false;
            }
        };

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
            users,
            isLoading,
            errorMessage,
            currentPage,
            totalPages,
            prevPage,
            nextPage,
            goToPage,
            limit,
            limitOptions,
            filters,
            getOverView: getOverView,
            sortBy,
            sortOrder,
            sortData
        };
    },
};
</script>

<style scoped>
/* Table Styling */
.table {
    border-radius: 8px;
    overflow: hidden;
}

.table-hover tbody tr:hover {
    background-color: #f8f9fa;
    transition: background 0.3s ease;
}

/* Loading Spinner */
.spinner-border {
    width: 3rem;
    height: 3rem;
}

/* Pagination Styles */
.pagination {
    display: flex;
    gap: 5px;
}

.page-item {
    cursor: pointer;
}

.page-link {
    border-radius: 6px;
    padding: 8px 12px;
    font-size: 16px;
}

.page-item.active .page-link {
    background-color: #007bff;
    color: white;
    border-color: #007bff;
}

/* Responsive Design */
@media (max-width: 768px) {
    .table {
        font-size: 14px;
    }
}
</style>
