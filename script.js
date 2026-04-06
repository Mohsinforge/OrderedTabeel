// User data - 100 users for better pagination
const generateUsers = () => {
    const firstNames = ['Arnold', 'Melvin', 'Alicia', 'Brian', 'Beau', 'Vildan', 'Sedef', 'Chloe', 'Mark', 'Julie', 'David', 'Emma', 'Lucas', 'Sophie', 'James', 'Mia', 'Oliver', 'Ava', 'William', 'Isabella', 'Henry', 'Charlotte', 'Alexander', 'Amelia', 'Daniel', 'Harper', 'Matthew', 'Evelyn', 'Joseph', 'Abigail', 'Samuel', 'Emily', 'Benjamin', 'Elizabeth', 'Jacob', 'Mila', 'Michael', 'Ella', 'Ethan', 'Avery', 'Alexander', 'Sofia', 'Joshua', 'Camila', 'Andrew', 'Aria', 'Ryan', 'Scarlett', 'Nathan', 'Grace'];
    
    const lastNames = ['Morrison', 'Watkins', 'Menard', 'Phillips', 'Roberts', 'Tazegül', 'Aykaç', 'McKinney', 'Holmes', 'Fisher', 'Chen', 'Wilson', 'Brown', 'Martin', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Clark', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts', 'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker', 'Cruz'];
    
    const countries = ['Australia', 'United States', 'Switzerland', 'New Zealand', 'Turkey', 'United Kingdom', 'Ireland', 'Canada', 'Germany', 'France', 'Japan', 'Brazil', 'India', 'Mexico', 'Spain', 'Italy', 'Netherlands', 'Sweden', 'Norway', 'Denmark'];
    
    const animals = ['panda', 'koala', 'elephant', 'zebra', 'wolf', 'swan', 'goose', 'butterfly', 'tiger', 'lion', 'eagle', 'shark', 'dolphin', 'penguin', 'fox', 'bear', 'hawk', 'owl', 'raven', 'cobra', 'panther', 'jaguar', 'leopard', 'cheetah', 'falcon', 'dragon', 'phoenix', 'unicorn', 'griffin', 'hydra'];
    
    const userData = [];
    
    for (let i = 0; i < 100; i++) {
        const firstName = firstNames[i % firstNames.length];
        const lastName = lastNames[i % lastNames.length];
        const country = countries[i % countries.length];
        const animal = animals[i % animals.length];
        const number = Math.floor(Math.random() * 900) + 100;
        
        userData.push({
            name: `${firstName} ${lastName}`,
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
            username: `${animal}${number}`,
            country: country
        });
    }
    
    return userData;
};

// State
let users = [];
let currentPage = 1;
const rowsPerPage = 10;
let sortColumn = null;
let sortDirection = 'asc';

// DOM Elements
const tableBody = document.getElementById('tableBody');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageNum = document.getElementById('pageNum');
const darkModeToggle = document.getElementById('darkModeToggle');
const tableHeaders = document.querySelectorAll('th[data-sort]');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchUsers();
    loadDarkMode();
});

// Fetch users
function fetchUsers() {
    tableBody.innerHTML = '<tr><td colspan="4" class="loading">Loading users...</td></tr>';
    
    setTimeout(() => {
        users = generateUsers();
        sortUsers();
        renderTable();
        updatePagination();
    }, 500);
}

// Sort users
function sortUsers() {
    if (!sortColumn) return;
    
    users.sort((a, b) => {
        const aVal = a[sortColumn].toLowerCase();
        const bVal = b[sortColumn].toLowerCase();
        
        if (sortDirection === 'asc') {
            return aVal > bVal ? 1 : -1;
        } else {
            return aVal < bVal ? 1 : -1;
        }
    });
}

// Render table
function renderTable() {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const pageUsers = users.slice(start, end);
    
    tableBody.innerHTML = '';
    
    pageUsers.forEach(user => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td data-label="Name">${user.name}</td>
            <td data-label="Email">${user.email}</td>
            <td data-label="Username">${user.username}</td>
            <td data-label="Country">${user.country}</td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Get total pages
function getTotalPages() {
    return Math.ceil(users.length / rowsPerPage);
}

// Update pagination
function updatePagination() {
    const totalPages = getTotalPages();
    
    // Update page number display
    pageNum.textContent = `${currentPage} of ${totalPages}`;
    
    // Disable/enable buttons
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage >= totalPages;
}

// Go to previous page
function goToPrevPage() {
    if (currentPage > 1) {
        currentPage--;
        renderTable();
        updatePagination();
    }
}

// Go to next page
function goToNextPage() {
    const totalPages = getTotalPages();
    if (currentPage < totalPages) {
        currentPage++;
        renderTable();
        updatePagination();
    }
}

// Event Listeners - ONLY click events (removed mousedown to prevent double firing)
prevBtn.addEventListener('click', goToPrevPage);
nextBtn.addEventListener('click', goToNextPage);

// Sorting
tableHeaders.forEach(header => {
    header.addEventListener('click', () => {
        const column = header.dataset.sort;
        
        tableHeaders.forEach(h => {
            h.classList.remove('sort-asc', 'sort-desc');
        });
        
        if (sortColumn === column) {
            sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            sortColumn = column;
            sortDirection = 'asc';
        }
        
        header.classList.add(sortDirection === 'asc' ? 'sort-asc' : 'sort-desc');
        
        sortUsers();
        currentPage = 1;
        renderTable();
        updatePagination();
    });
});

// Dark Mode Toggle
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    darkModeToggle.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
}

function loadDarkMode() {
    const isDark = localStorage.getItem('darkMode') === 'true';
    if (isDark) {
        document.body.classList.add('dark-mode');
        darkModeToggle.textContent = '☀️ Light Mode';
    }
}

darkModeToggle.addEventListener('click', toggleDarkMode);