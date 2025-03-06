<template>
    <div class="login-container">
        <div class="login-form">
            <h2>Login</h2>
            <form @submit.prevent="handleSubmit">
                <div class="mb-3">
                    <label for="username" class="form-label">Username</label>
                    <input v-model="username" type="text" id="username" class="form-control"
                        placeholder="Enter username" required />
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label">Password</label>
                    <input v-model="password" type="password" id="password" class="form-control"
                        placeholder="Enter password" required />
                </div>
                <button type="submit" class="btn btn-primary w-100">Login</button>
            </form>
            <div v-if="errorMessage" class="alert alert-danger mt-3">
                {{ errorMessage }}
            </div>
        </div>
    </div>
</template>

<script>
// import api from '@/api';  // Import the API configuration
import axios from "axios";
import { encryptData } from "@/utils/crypto"; // Adjust path if needed

export default {
    data() {
        return {
            username: "",
            password: "",
            errorMessage: "",
        };
    },
    methods: {
        async handleSubmit() {
            try {
                // Replace with your API endpoint
                const response = await axios.post(import.meta.env.VITE_API_BASE_URL + "/login", {
                    username: this.username,
                    password: this.password,
                });

                // Handle the response (e.g., show a success message or redirect)
                // console.log("Login successful:", response);
                // You can store the token or user data in localStorage/sessionStorage

                localStorage.setItem("auth_token", response.data.token);
                localStorage.setItem("refresh_token", response.data.refreshToken);
                console.log(response.data.result.username);
                
                localStorage.setItem("username", encryptData(response.data.result.username));
                this.$router.push("/dashboard"); // Redirect to a different page, like dashboard
            } catch (error) {
                console.log(error);
                // Handle the error (e.g., show an error message)
                // console.error("Login failed:", error);
                this.errorMessage = "Invalid username or password.";
            }
        },
    },
};
</script>

<style scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f4f4f4;
}

.login-form {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
}

h2 {
    text-align: center;
    margin-bottom: 20px;
}

button {
    margin-top: 20px;
}
</style>