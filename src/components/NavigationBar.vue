<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light px-3">
        <a class="navbar-brand" href="#">MyApp</a>
        <button class="navbar-toggler" type="button" @click="toggleMenu">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" :class="{ show: isMenuOpen }">
            <ul class="navbar-nav ms-auto">
                <li class="nav-item">
                    <router-link class="nav-link" to="/">Home</router-link>
                </li>
                <li class="nav-item">
                    <router-link class="nav-link" to="/about">About</router-link>
                </li>
                <li class="nav-item">
                    <router-link class="nav-link" to="/contact">Contact</router-link>
                </li>
                <!-- Dropdown Menu -->
                <li class="nav-item dropdown" @click="toggleDropdown">
                    <a class="nav-link dropdown-toggle" href="#" role="button">
                        Language
                    </a>
                    <ul class="dropdown-menu" :class="{ show: isDropdownOpen }">
                        <li><a class="dropdown-item" href="#" @click="switchLang('en')">English</a></li>
                        <li><a class="dropdown-item" href="#" @click="switchLang('fr')">Français</a></li>
                    </ul>
                </li>
            </ul>
        </div>
    </nav>
</template>

<script>
export default {
    data() {
        return {
            isMenuOpen: false,
            isDropdownOpen: false,
        };
    },
    methods: {
        toggleMenu() {
            this.isMenuOpen = !this.isMenuOpen;
        },
        toggleDropdown(event) {
            this.isDropdownOpen = !this.isDropdownOpen;
            event.stopPropagation(); // Prevent closing immediately
        },
        switchLang(lang) {
            console.log("Switching language to:", lang);
        },
    },
    mounted() {
        document.addEventListener("click", this.closeDropdown);
    },
    beforeUnmount() {
        document.removeEventListener("click", this.closeDropdown);
    },
    methods: {
        toggleMenu() {
            this.isMenuOpen = !this.isMenuOpen;
        },
        toggleDropdown(event) {
            this.isDropdownOpen = !this.isDropdownOpen;
            event.stopPropagation(); // Prevent closing when clicking inside
        },
        closeDropdown() {
            this.isDropdownOpen = false;
        },
        switchLang(lang) {
            console.log("Switching language to:", lang);
        },
    },
};
</script>

<style scoped>
.navbar {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar-toggler {
    border: none;
}

/* Ensure dropdown appears */
.dropdown-menu {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
}

.dropdown-menu.show {
    display: block;
}
</style>
