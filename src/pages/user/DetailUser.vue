<template>
    <div class="container mt-4">
        <h2 class="text-center text-primary">User Details</h2>

        <!-- Loading Spinner -->
        <div v-if="isLoading" class="d-flex justify-content-center my-4">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="alert alert-danger">
            {{ errorMessage }}
        </div>

        <!-- User Details Form -->
        <form v-if="!isLoading" @submit.prevent="updateUser">
            <div class="mb-3">
                <label for="userId" class="form-label">User ID</label>
                <input type="text" id="userId" class="form-control" v-model="user.user_id" disabled />
            </div>

            <div class="mb-3">
                <label for="username" class="form-label">Username</label>
                <input type="text" id="username" class="form-control" v-model="user.username" required />
            </div>

            <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input type="email" id="email" class="form-control" v-model="user.email" required />
            </div>

            <div class="mb-3">
                <label for="createdAt" class="form-label">Created At</label>
                <input type="text" id="createdAt" class="form-control" :value="formattedDate(user.created_at)"
                    disabled />
            </div>

            <div class="mb-3">
                <label for="updatedAt" class="form-label">Updated At</label>
                <input type="text" id="updatedAt" class="form-control" :value="formattedDate(user.updated_at)"
                    disabled />
            </div>

            <button type="submit" class="btn btn-success">Update</button>
        </form>

        <hr />
        <button type="button" class="btn btn-danger mt-2 mb-4" @click="showModal = true">Delete</button>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showModal" class="modal fade show" tabindex="-1" aria-labelledby="deleteModalLabel"
        style="display: block;" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="deleteModalLabel">Confirm Delete</h5>
                    <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p class="text-center">Are you sure you want to delete this user?</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
                    <button type="button" class="btn btn-danger" @click="confirmDelete">Delete</button>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "@/api";

export default {
    setup() {
        const route = useRoute();
        const router = useRouter();
        const isLoading = ref(false);
        const errorMessage = ref("");
        const showModal = ref(false); // Use ref for reactivity

        // Ensure user object is always available
        const user = ref({
            user_id: "",
            username: "",
            email: "",
            created_at: "",
            updated_at: "",
        });

        const fetchUserDetails = async () => {
            isLoading.value = true;
            try {
                const response = await api.get(`/users/getById/${route.params.user_id}`);
                user.value = response.result;
            } catch (error) {
                errorMessage.value = "Failed to load user details.";
            } finally {
                isLoading.value = false;
            }
        };

        const updateUser = async () => {
            try {
                await api.put(`/users/updateUser/${user.value.user_id}`, {
                    username: user.value.username,
                    email: user.value.email,
                });
                alert("User updated successfully!");
                router.push("/list-user");
            } catch (error) {
                alert("Failed to update user.");
            }
        };

        const deleteUser = async () => {
            try {
                this.userToDelete = userId;
                // this.showModal = true; // Show the modal
            } catch (error) {
                alert("Failed to update user.");
            }
        };

        const closeModal = async () => {
            showModal.value = false;
        };

        const confirmDelete = async () => {
            try {
                if (!user.value.user_id) {
                    return;
                }

                const response = await api.delete(`/users/deleteUser/${user.value.user_id}`);
                if (response.status == 200) {
                    closeModal();
                    router.push("/list-user");
                }
            } catch (error) {
                alert("Failed to delete user.");
            }
        }

        const formattedDate = (date) => new Date(date).toLocaleString();

        onMounted(fetchUserDetails);

        return {
            user,
            isLoading,
            errorMessage,
            updateUser,
            formattedDate,
            deleteUser,
            showModal,
            closeModal,
            confirmDelete
        };
    },
};
</script>

<style scoped>
.container {
    max-width: 600px;
}

/* Make the modal content look nice */
.modal-content {
    border-radius: 8px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
}

/* Improve the button hover effects */
.btn-danger,
.btn-secondary {
    transition: all 0.3s ease;
}

.btn-danger:hover {
    background-color: #c82333;
    border-color: #bd2130;
}

.btn-secondary:hover {
    background-color: #6c757d;
    border-color: #5a6268;
}

/* Custom styling for modal text */
.modal-body p {
    font-size: 16px;
    color: #555;
    font-weight: 500;
}

/* Improve close button position */
.modal-header .close {
    font-size: 1.5rem;
    color: #000;
}

/* Center the modal */
.modal-dialog-centered {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
}
</style>
