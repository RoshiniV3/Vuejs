<template>
  <div class="mailbox-page">
    <div class="container-fluid">
      <!-- Page Header -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h2 class="page-title">Mailbox</h2>
              <p class="text-muted">Manage your messages and communications</p>
            </div>
            <button class="btn btn-primary" @click="composeEmail">
              <i class="bi bi-plus-circle me-1"></i>
              Compose
            </button>
          </div>
        </div>
      </div>

      <!-- Mailbox Content -->
      <div class="row">
        <!-- Sidebar -->
        <div class="col-md-3">
          <div class="card">
            <div class="card-body p-0">
              <div class="mailbox-sidebar">
                <div
                  v-for="folder in folders"
                  :key="folder.name"
                  class="folder-item"
                  :class="{ active: selectedFolder === folder.name }"
                  @click="selectFolder(folder.name)"
                >
                  <i :class="folder.icon" class="me-2"></i>
                  {{ folder.name }}
                  <span v-if="folder.count > 0" class="badge bg-primary ms-auto">
                    {{ folder.count }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Email List -->
        <div class="col-md-4">
          <div class="card">
            <div class="card-header">
              <div class="d-flex justify-content-between align-items-center">
                <h6 class="mb-0">{{ selectedFolder }}</h6>
                <button class="btn btn-sm btn-outline-secondary" @click="refreshEmails">
                  <i class="bi bi-arrow-clockwise"></i>
                </button>
              </div>
            </div>
            <div class="card-body p-0">
              <div class="email-list">
                <div
                  v-for="email in filteredEmails"
                  :key="email.id"
                  class="email-item"
                  :class="{ 
                    active: selectedEmail?.id === email.id,
                    unread: !email.read
                  }"
                  @click="selectEmail(email)"
                >
                  <div class="email-header">
                    <div class="email-sender">{{ email.sender }}</div>
                    <div class="email-time">{{ formatTime(email.time) }}</div>
                  </div>
                  <div class="email-subject">{{ email.subject }}</div>
                  <div class="email-preview">{{ email.preview }}</div>
                  <div class="email-actions">
                    <i v-if="email.important" class="bi bi-star-fill text-warning"></i>
                    <i v-if="email.hasAttachment" class="bi bi-paperclip text-muted"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Email Content -->
        <div class="col-md-5">
          <div class="card">
            <div class="card-header" v-if="selectedEmail">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <h6 class="mb-1">{{ selectedEmail.subject }}</h6>
                  <small class="text-muted">
                    From: {{ selectedEmail.sender }} &lt;{{ selectedEmail.email }}&gt;
                  </small>
                </div>
                <div class="email-toolbar">
                  <button class="btn btn-sm btn-outline-secondary me-1" @click="replyEmail">
                    <i class="bi bi-reply"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-secondary me-1" @click="forwardEmail">
                    <i class="bi bi-arrow-right"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-danger" @click="deleteEmail">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
            <div class="card-body">
              <div v-if="!selectedEmail" class="text-center text-muted py-5">
                <i class="bi bi-envelope-open display-4 mb-3"></i>
                <p>Select an email to view its content</p>
              </div>
              <div v-else class="email-content">
                <div class="email-meta mb-3">
                  <small class="text-muted">
                    Received: {{ formatDateTime(selectedEmail.time) }}
                  </small>
                </div>
                <div class="email-body" v-html="selectedEmail.content"></div>
                <div v-if="selectedEmail.hasAttachment" class="email-attachments mt-3">
                  <h6>Attachments</h6>
                  <div class="attachment-item">
                    <i class="bi bi-file-earmark-text me-2"></i>
                    document.pdf (245 KB)
                    <button class="btn btn-sm btn-outline-primary ms-2">
                      <i class="bi bi-download"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Email {
  id: number
  sender: string
  email: string
  subject: string
  preview: string
  content: string
  time: Date
  read: boolean
  important: boolean
  hasAttachment: boolean
  folder: string
}

interface Folder {
  name: string
  icon: string
  count: number
}

const selectedFolder = ref<string>('Inbox')
const selectedEmail = ref<Email | null>(null)

const folders = ref<Folder[]>([
  { name: 'Inbox', icon: 'bi bi-inbox', count: 3 },
  { name: 'Sent', icon: 'bi bi-send', count: 0 },
  { name: 'Drafts', icon: 'bi bi-file-earmark-text', count: 1 },
  { name: 'Trash', icon: 'bi bi-trash', count: 0 },
  { name: 'Spam', icon: 'bi bi-shield-exclamation', count: 0 }
])

const emails = ref<Email[]>([
  {
    id: 1,
    sender: 'John Doe',
    email: 'john@example.com',
    subject: 'Project Update - Q4 Review',
    preview: 'Hi team, I wanted to share the latest updates on our Q4 project...',
    content: `
      <p>Hi team,</p>
      <p>I wanted to share the latest updates on our Q4 project. We've made significant progress and are on track to meet our deadlines.</p>
      <p>Key highlights:</p>
      <ul>
        <li>Development phase is 85% complete</li>
        <li>Testing has begun and initial results are positive</li>
        <li>Client feedback has been incorporated</li>
      </ul>
      <p>Please let me know if you have any questions.</p>
      <p>Best regards,<br>John</p>
    `,
    time: new Date(2024, 0, 15, 10, 30),
    read: false,
    important: true,
    hasAttachment: true,
    folder: 'Inbox'
  },
  {
    id: 2,
    sender: 'Sarah Wilson',
    email: 'sarah@company.com',
    subject: 'Meeting Reminder - Tomorrow 2PM',
    preview: 'Just a quick reminder about our meeting scheduled for tomorrow...',
    content: `
      <p>Hi there,</p>
      <p>Just a quick reminder about our meeting scheduled for tomorrow at 2PM in the conference room.</p>
      <p>Agenda items:</p>
      <ul>
        <li>Budget review</li>
        <li>Timeline discussion</li>
        <li>Resource allocation</li>
      </ul>
      <p>See you there!</p>
      <p>Sarah</p>
    `,
    time: new Date(2024, 0, 14, 16, 45),
    read: true,
    important: false,
    hasAttachment: false,
    folder: 'Inbox'
  },
  {
    id: 3,
    sender: 'Tech Support',
    email: 'support@techcorp.com',
    subject: 'System Maintenance Notification',
    preview: 'We will be performing scheduled maintenance on our systems...',
    content: `
      <p>Dear User,</p>
      <p>We will be performing scheduled maintenance on our systems this weekend from 2AM to 6AM EST.</p>
      <p>During this time, you may experience:</p>
      <ul>
        <li>Temporary service interruptions</li>
        <li>Slower response times</li>
        <li>Limited access to certain features</li>
      </ul>
      <p>We apologize for any inconvenience.</p>
      <p>Tech Support Team</p>
    `,
    time: new Date(2024, 0, 13, 9, 15),
    read: false,
    important: false,
    hasAttachment: false,
    folder: 'Inbox'
  }
])

const filteredEmails = computed(() => {
  return emails.value.filter(email => email.folder === selectedFolder.value)
})

const selectFolder = (folderName: string): void => {
  selectedFolder.value = folderName
  selectedEmail.value = null
}

const selectEmail = (email: Email): void => {
  selectedEmail.value = email
  if (!email.read) {
    email.read = true
    // Update folder count
    const folder = folders.value.find(f => f.name === email.folder)
    if (folder && folder.count > 0) {
      folder.count--
    }
  }
}

const formatTime = (date: Date): string => {
  const now = new Date()
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
  
  if (diffInHours < 24) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } else {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
  }
}

const formatDateTime = (date: Date): string => {
  return date.toLocaleString()
}

const composeEmail = (): void => {
  console.log('Compose new email')
  // Implement compose functionality
}

const refreshEmails = (): void => {
  console.log('Refresh emails')
  // Implement refresh functionality
}

const replyEmail = (): void => {
  console.log('Reply to email')
  // Implement reply functionality
}

const forwardEmail = (): void => {
  console.log('Forward email')
  // Implement forward functionality
}

const deleteEmail = (): void => {
  if (selectedEmail.value) {
    const emailIndex = emails.value.findIndex(e => e.id === selectedEmail.value!.id)
    if (emailIndex > -1) {
      emails.value.splice(emailIndex, 1)
      selectedEmail.value = null
    }
  }
}
</script>

<style scoped>
.page-title {
  color: var(--color-black);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.mailbox-sidebar {
  padding: 0;
}

.folder-item {
  padding: 0.75rem 1rem;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
}

.folder-item:hover {
  background-color: #f8f9fa;
}

.folder-item.active {
  background-color: var(--card-blue);
  color: white;
}

.email-list {
  max-height: 600px;
  overflow-y: auto;
}

.email-item {
  padding: 1rem;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.2s ease;
  position: relative;
}

.email-item:hover {
  background-color: #f8f9fa;
}

.email-item.active {
  background-color: rgba(8, 102, 198, 0.1);
  border-left: 3px solid var(--card-blue);
}

.email-item.unread {
  background-color: #fff;
  font-weight: 600;
}

.email-item.unread::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background-color: var(--card-blue);
}

.email-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
}

.email-sender {
  font-weight: 600;
  color: var(--color-black);
}

.email-time {
  font-size: 0.75rem;
  color: #6c757d;
}

.email-subject {
  font-weight: 500;
  margin-bottom: 0.25rem;
  color: var(--color-black);
}

.email-preview {
  font-size: 0.875rem;
  color: #6c757d;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.email-actions {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.25rem;
}

.email-content {
  line-height: 1.6;
}

.email-meta {
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #dee2e6;
}

.email-body {
  color: var(--color-black);
}

.email-body p {
  margin-bottom: 1rem;
}

.email-body ul {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

.attachment-item {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background-color: #f8f9fa;
  border-radius: 0.375rem;
  margin-bottom: 0.5rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .col-md-3, .col-md-4, .col-md-5 {
    margin-bottom: 1rem;
  }
  
  .email-toolbar {
    display: flex;
    gap: 0.25rem;
  }
  
  .email-toolbar .btn {
    padding: 0.25rem 0.5rem;
  }
}
</style>
