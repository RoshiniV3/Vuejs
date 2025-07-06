<template>
  <div class="card h-100 d-flex flex-column">
    <div class="card-header bg-dark text-white">
      <h5 class="card-title mb-0">User Directory</h5>
    </div>
    <div class="card-body p-0 flex-grow-1 d-flex">
      <!-- Users List -->
      <div class="user-list">
        <div class="user-section h-100 d-flex flex-column">
          <div class="section-header">
            <div class="d-flex align-items-center justify-content-between">
              <div class="d-flex align-items-center">
                <i class="bi bi-chevron-down me-2"></i>
                <span>Users</span>
                <span v-if="searchQuery" class="user-count">({{ filteredUsers.length }})</span>
              </div>
              <div class="sort-controls">
                <button
                  type="button"
                  class="btn btn-sm btn-outline-secondary sort-btn"
                  :class="{ active: sortOrder === 'asc' }"
                  @click="setSortOrder('asc')"
                  title="Sort A-Z"
                >
                  <i class="bi bi-sort-alpha-down"></i>
                </button>
                <button
                  type="button"
                  class="btn btn-sm btn-outline-secondary sort-btn ms-1"
                  :class="{ active: sortOrder === 'desc' }"
                  @click="setSortOrder('desc')"
                  title="Sort Z-A"
                >
                  <i class="bi bi-sort-alpha-up"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Search Bar -->
          <div class="search-section">
            <div class="search-container">
              <input
                type="text"
                class="form-control search-input"
                placeholder="Search users..."
                v-model="searchQuery"
                @input="onSearchInput"
              />
              <i class="bi bi-search search-icon"></i>
              <button
                v-if="searchQuery"
                type="button"
                class="btn-clear"
                @click="clearSearch"
                title="Clear search"
              >
                <i class="bi bi-x"></i>
              </button>
            </div>
          </div>

          <div class="user-items flex-grow-1">
            <div
              v-for="user in filteredAndSortedUsers"
              :key="user.id"
              class="user-item"
              :class="{ active: selectedUser && selectedUser.id === user.id }"
              @click="selectUser(user)"
            >
              {{ user.name }}
            </div>

            <!-- No results message -->
            <div v-if="searchQuery && filteredAndSortedUsers.length === 0" class="no-results">
              <i class="bi bi-search me-2"></i>
              No users found matching "{{ searchQuery }}"
            </div>
          </div>
        </div>
      </div>
      
      <!-- User Details -->
      <div v-if="selectedUser" class="user-details">
        <div class="user-profile">
          <div class="user-avatar">
            <img :src="selectedUser.avatar" :alt="selectedUser.name" class="avatar-img">
          </div>
          <h4 class="user-name">{{ selectedUser.name }}</h4>
          <p class="user-email">{{ selectedUser.email }}</p>
          <span class="user-badge">{{ selectedUser.role }}</span>
        </div>
        
        <div class="user-info">
          <div class="info-row">
            <span class="info-label">Company:</span>
            <span class="info-value">{{ selectedUser.company }}</span>
          </div>
          
          <div class="info-row">
            <span class="info-label">Website:</span>
            <a :href="selectedUser.website" class="info-link">{{ selectedUser.websiteDisplay }}</a>
          </div>
          
          <div class="info-row">
            <span class="info-label">Phone:</span>
            <span class="info-value">{{ selectedUser.phone }}</span>
          </div>

          <div class="info-row">
            <span class="info-label">Email Address:</span>
            <span class="info-value">{{ selectedUser.email }}</span>
          </div>

          <div class="info-row">
            <span class="info-label">Occupation:</span>
            <span class="info-value">{{ selectedUser.role }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface User {
  id: number
  name: string
  email: string
  role: string
  company: string
  website: string
  websiteDisplay: string
  phone: string
  avatar: string
}

const selectedUser = ref<User | null>(null)
const sortOrder = ref<'asc' | 'desc'>('asc')
const searchQuery = ref<string>('')

const users = ref<User[]>([
  {
    id: 1,
    name: 'Loanne Graham',
    email: 'loanne@example.com',
    role: 'Manager',
    company: 'Deckow Crist',
    website: 'https://anastasia.net',
    websiteDisplay: 'anastasia.net',
    phone: '010-692-6593 x09125',
    avatar: 'https://i.pravatar.cc/80?img=1'
  },
  {
    id: 2,
    name: 'Ervin Howell',
    email: 'Shanna@melissa.tv',
    role: 'Antonette',
    company: 'Deckow Crist',
    website: 'https://anastasia.net',
    websiteDisplay: 'anastasia.net',
    phone: '010-692-6593 x09125',
    avatar: 'https://i.pravatar.cc/80?img=2'
  },
  {
    id: 3,
    name: 'Clementine Bauch',
    email: 'Nathan@yesenia.net',
    role: 'Samantha',
    company: 'Romaguera-Jacobson',
    website: 'https://ramiro.info',
    websiteDisplay: 'ramiro.info',
    phone: '1-463-123-4447',
    avatar: 'https://i.pravatar.cc/80?img=3'
  },
  {
    id: 4,
    name: 'Patricia Lebsack',
    email: 'Julianne.OConner@kory.org',
    role: 'Karianne',
    company: 'Robel-Corkery',
    website: 'https://kale.biz',
    websiteDisplay: 'kale.biz',
    phone: '493-170-9623 x156',
    avatar: 'https://i.pravatar.cc/80?img=4'
  },
  {
    id: 5,
    name: 'Chelsey Dietrich',
    email: 'chelsey@example.com',
    role: 'Developer',
    company: 'Tech Solutions',
    website: 'https://techsolutions.com',
    websiteDisplay: 'techsolutions.com',
    phone: '010-555-7777',
    avatar: 'https://i.pravatar.cc/80?img=5'
  },
  {
    id: 6,
    name: 'Mrs. Dennis Schulist',
    email: 'dennis@example.com',
    role: 'Consultant',
    company: 'Consulting Group',
    website: 'https://consulting.com',
    websiteDisplay: 'consulting.com',
    phone: '010-666-8888',
    avatar: 'https://i.pravatar.cc/80?img=6'
  },
  {
    id: 7,
    name: 'Kurtis Weissnat',
    email: 'kurtis@example.com',
    role: 'Analyst',
    company: 'Data Analytics',
    website: 'https://dataanalytics.com',
    websiteDisplay: 'dataanalytics.com',
    phone: '010-777-9999',
    avatar: 'https://i.pravatar.cc/80?img=7'
  },
  {
    id: 8,
    name: 'Nicholas Runolfsdottir V',
    email: 'nicholas@example.com',
    role: 'Designer',
    company: 'Design Studio',
    website: 'https://designstudio.com',
    websiteDisplay: 'designstudio.com',
    phone: '010-888-0000',
    avatar: 'https://i.pravatar.cc/80?img=8'
  },
  {
    id: 9,
    name: 'Glenna Reichert',
    email: 'glenna@example.com',
    role: 'Coordinator',
    company: 'Coordination Ltd',
    website: 'https://coordination.com',
    websiteDisplay: 'coordination.com',
    phone: '010-111-9999',
    avatar: 'https://i.pravatar.cc/80?img=9'
  },
  {
    id: 10,
    name: 'Clementina DuBuque',
    email: 'clementina@example.com',
    role: 'Administrator',
    company: 'Admin Corp',
    website: 'https://admin.com',
    websiteDisplay: 'admin.com',
    phone: '010-000-1111',
    avatar: 'https://i.pravatar.cc/80?img=10'
  }
])

const filteredUsers = computed(() => {
  if (!searchQuery.value.trim()) {
    return users.value
  }

  const query = searchQuery.value.toLowerCase().trim()
  return users.value.filter(user => {
    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.company.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query)
    )
  })
})

const filteredAndSortedUsers = computed(() => {
  const sorted = [...filteredUsers.value].sort((a, b) => {
    const nameA = a.name.toLowerCase()
    const nameB = b.name.toLowerCase()

    if (sortOrder.value === 'asc') {
      return nameA.localeCompare(nameB)
    } else {
      return nameB.localeCompare(nameA)
    }
  })

  return sorted
})

const selectUser = (user: User): void => {
  selectedUser.value = user
}

const setSortOrder = (order: 'asc' | 'desc'): void => {
  sortOrder.value = order
}

const onSearchInput = (): void => {
  // If the currently selected user is not in the filtered results, clear selection
  if (selectedUser.value && !filteredUsers.value.some(user => user.id === selectedUser.value!.id)) {
    selectedUser.value = null
  }
}

const clearSearch = (): void => {
  searchQuery.value = ''
}

onMounted(() => {
  // Select Clementine Bauch by default to match the image
  selectedUser.value = users.value[2]
})
</script>

<style scoped>
.card {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.card-header.bg-dark {
  background-color: #343a40 !important;
  border-bottom: 1px solid #495057;
}

.user-list {
  width: 280px;
  border-right: 1px solid #e5e7eb;
  flex-shrink: 0;
  background-color: #f8f9fa;
}

.search-section {
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
  background-color: #ffffff;
}

.search-container {
  position: relative;
}

.search-input {
  width: 100%;
  padding: 8px 32px 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--card-blue);
  box-shadow: 0 0 0 0.2rem rgba(8, 102, 198, 0.25);
}

.search-input::placeholder {
  color: #999;
}

.search-icon {
  position: absolute;
  right: 32px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  pointer-events: none;
}

.btn-clear {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 2px;
  border-radius: 2px;
  transition: color 0.2s ease;
}

.btn-clear:hover {
  color: #666;
}

.section-header {
  padding: 12px 16px;
  background-color: #f1f3f4;
  border-bottom: 1px solid #e5e7eb;
  font-weight: 600;
  font-size: 14px;
}

.user-count {
  color: var(--card-blue);
  font-weight: 500;
  margin-left: 4px;
}

.sort-controls {
  display: flex;
  gap: 4px;
}

.sort-btn {
  padding: 2px 6px;
  font-size: 12px;
  border-radius: 3px;
  transition: all 0.2s ease;
}

.sort-btn.active {
  background-color: var(--card-blue);
  border-color: var(--card-blue);
  color: white;
}

.user-items {
  max-height: 400px;
  overflow-y: auto;
}

.user-item {
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s ease;
  font-size: 14px;
}

.user-item:hover {
  background-color: #f8f9fa;
}

.user-item.active {
  background-color: var(--card-blue);
  color: white;
}

.no-results {
  padding: 20px 16px;
  text-align: center;
  color: #999;
  font-style: italic;
}

.user-details {
  flex: 1;
  padding: 20px;
  min-height: 600px;
  background-color: #ffffff;
}

.user-profile {
  text-align: center;
  margin-bottom: 30px;
}

.user-avatar {
  margin-bottom: 15px;
}

.avatar-img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid var(--color-light);
}

.user-name {
  margin-bottom: 5px;
  color: var(--color-black);
}

.user-email {
  color: var(--card-blue);
  margin-bottom: 10px;
}

.user-badge {
  background-color: var(--color-red);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.user-info {
  text-align: left;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid var(--color-light);
}

.info-label {
  font-weight: 600;
  color: var(--color-black);
  min-width: 120px;
}

.info-value {
  color: #666;
  text-align: right;
}

.info-link {
  color: var(--card-blue);
  text-decoration: none;
}

.info-link:hover {
  text-decoration: underline;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .user-list {
    width: 240px;
  }

  .user-details {
    padding: 15px;
    min-height: 500px;
  }

  .search-section {
    padding: 10px 12px;
  }

  .section-header {
    padding: 10px 12px;
    font-size: 13px;
  }

  .user-item {
    padding: 10px 12px;
    font-size: 13px;
  }

  .user-profile {
    padding: 15px;
  }

  .profile-header h5 {
    font-size: 16px;
  }

  .info-label {
    min-width: 100px;
    font-size: 13px;
  }

  .info-value {
    font-size: 13px;
  }
}
</style>
