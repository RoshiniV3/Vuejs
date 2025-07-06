<template>
  <div class="card">
    <div class="card-header bg-dark text-white">
      <h5 class="card-title mb-0">User Directory</h5>
    </div>
    <div class="card-body p-0">
      <!-- Users List -->
      <div class="user-list">
        <div class="user-section">
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

          <div class="user-items">
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

<script>
export default {
  name: 'UserDirectory',
  data() {
    return {
      selectedUser: null,
      sortOrder: 'asc', // 'asc' for A-Z, 'desc' for Z-A
      searchQuery: '',
      users: [
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
          email: 'clementine@example.com',
          role: 'Developer',
          company: 'Tech Corp',
          website: 'https://techcorp.com',
          websiteDisplay: 'techcorp.com',
          phone: '010-123-4567',
          avatar: 'https://i.pravatar.cc/80?img=3'
        },
        {
          id: 4,
          name: 'Patricia Lebsack',
          email: 'patricia@example.com',
          role: 'Designer',
          company: 'Design Studio',
          website: 'https://designstudio.com',
          websiteDisplay: 'designstudio.com',
          phone: '010-987-6543',
          avatar: 'https://i.pravatar.cc/80?img=4'
        },
        {
          id: 5,
          name: 'Chelsey Dietrich',
          email: 'chelsey@example.com',
          role: 'Analyst',
          company: 'Data Inc',
          website: 'https://datainc.com',
          websiteDisplay: 'datainc.com',
          phone: '010-555-0123',
          avatar: 'https://i.pravatar.cc/80?img=5'
        },
        {
          id: 6,
          name: 'Mrs. Dennis Schulist',
          email: 'dennis@example.com',
          role: 'Consultant',
          company: 'Consulting LLC',
          website: 'https://consulting.com',
          websiteDisplay: 'consulting.com',
          phone: '010-444-5555',
          avatar: 'https://i.pravatar.cc/80?img=6'
        },
        {
          id: 7,
          name: 'Kurtis Weissnat',
          email: 'kurtis@example.com',
          role: 'Engineer',
          company: 'Engineering Co',
          website: 'https://engineering.com',
          websiteDisplay: 'engineering.com',
          phone: '010-333-7777',
          avatar: 'https://i.pravatar.cc/80?img=7'
        },
        {
          id: 8,
          name: 'Nicholas Runolfsdottir V',
          email: 'nicholas@example.com',
          role: 'Specialist',
          company: 'Specialist Group',
          website: 'https://specialist.com',
          websiteDisplay: 'specialist.com',
          phone: '010-222-8888',
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
      ]
    }
  },
  computed: {
    filteredUsers() {
      if (!this.searchQuery.trim()) {
        return this.users;
      }

      const query = this.searchQuery.toLowerCase().trim();
      return this.users.filter(user => {
        return (
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.company.toLowerCase().includes(query) ||
          user.role.toLowerCase().includes(query)
        );
      });
    },

    filteredAndSortedUsers() {
      const sorted = [...this.filteredUsers].sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();

        if (this.sortOrder === 'asc') {
          return nameA.localeCompare(nameB);
        } else {
          return nameB.localeCompare(nameA);
        }
      });

      return sorted;
    }
  },
  mounted() {
    // Select the second user (Ervin Howell) by default to match the image
    this.selectedUser = this.users[1];
  },
  methods: {
    selectUser(user) {
      this.selectedUser = user;
    },

    setSortOrder(order) {
      this.sortOrder = order;
    },

    onSearchInput() {
      // If the currently selected user is not in the filtered results, clear selection
      if (this.selectedUser && !this.filteredUsers.some(user => user.id === this.selectedUser.id)) {
        this.selectedUser = null;
      }
    },

    clearSearch() {
      this.searchQuery = '';
      // Optionally, you could restore the previously selected user here
    }
  }
}
</script>

<style scoped>
.card-header.bg-dark {
  background-color: var(--color-black) !important;
}

.user-list {
  width: 250px;
  float: left;
  border-right: 1px solid var(--color-light);
}

.search-section {
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-light);
  background-color: #f8f9fa;
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
  color: var(--color-red);
}

.section-header {
  padding: 12px 16px;
  font-weight: 500;
  color: var(--color-black);
  border-bottom: 1px solid var(--color-light);
}

.user-count {
  font-size: 12px;
  color: var(--color-secondary);
  margin-left: 4px;
}

.sort-controls {
  display: flex;
  align-items: center;
}

.sort-btn {
  padding: 4px 8px;
  border: 1px solid var(--color-secondary);
  background-color: transparent;
  color: var(--color-secondary);
  font-size: 12px;
  transition: all 0.2s ease;
}

.sort-btn:hover {
  background-color: var(--color-light);
  border-color: var(--color-black);
  color: var(--color-black);
}

.sort-btn.active {
  background-color: var(--card-blue);
  border-color: var(--card-blue);
  color: white;
}

.sort-btn.active:hover {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
}

.user-items {
  overflow-y: auto;
}

.user-item {
  padding: 8px 16px;
  cursor: pointer;
  border-bottom: 1px solid #f8f9fa;
  transition: background-color 0.2s;
}

.user-item:hover {
  background-color: var(--color-light);
}

.user-item.active {
  background-color: var(--card-blue);
  color: white;
}

.no-results {
  padding: 16px;
  text-align: center;
  color: var(--color-secondary);
  font-style: italic;
}

.user-details {
  margin-left: 250px;
  padding: 20px;
  min-height: 600px;
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
  font-weight: 500;
  color: var(--color-black);
}

.info-value {
  color: var(--color-secondary);
}

.info-link {
  color: var(--card-blue);
  text-decoration: none;
}

.info-link:hover {
  text-decoration: underline;
}

/* Clear float */
.card-body::after {
  content: "";
  display: table;
  clear: both;
}
</style>
