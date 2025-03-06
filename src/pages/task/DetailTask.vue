<template>
    <div class="container mt-4">
        <h2 class="text-center text-primary">Task Details</h2>

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

        </form>
        
    </div>
</template>
<script></script>