<template>
    <div class="register-container">
        <h2 class="text-center mb-4">Register</h2>
        <form @submit.prevent="handleSubmit">
            <div class="mb-3">
                <label for="username" class="form-label">Username</label>
                <input type="text" class="form-control" id="username" v-model="username" required />
            </div>

            <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input type="email" class="form-control" id="email" v-model="email" required />
            </div>

            <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input type="password" class="form-control" id="password" v-model="password" required />
            </div>

            <div class="d-flex justify-content-center mt-4">
                <button type="submit" class="btn btn-primary">
                    Register
                </button>
            </div>
        </form>
    </div>
</template>

<script>
import api from '@/api'; // Import the API configuration

export default {
    data() {
        return {
            username: '',
            email: '',
            password: '',
        };
    },
    methods: {
        async handleSubmit() {
            try {
                console.log(import.meta.env.VITE_API_BASE_URL);
                
                const response = await api.post('users/createUser', {
                    username: this.username,
                    email: this.email,
                    password: this.password,
                });

                // Handle the response (e.g., show a success message or redirect)
                console.log('User registered successfully:', response);
            } catch (error) {
                // Handle the error (e.g., show an error message)
                console.error('Registration failed:', error);
            }
        },
    },
};
</script>

<style scoped>
.register-container {
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
    padding: 2rem;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h2 {
    font-size: 24px;
    color: #333;
}

.form-label {
    font-weight: bold;
}

.btn {
    width: 100%;
}
</style>