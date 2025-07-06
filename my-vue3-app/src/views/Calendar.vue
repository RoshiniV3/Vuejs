<template>
  <div class="calendar-page">
    <div class="container-fluid">
      <!-- Page Header -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h2 class="page-title">Calendar</h2>
              <p class="text-muted">Manage your schedule and appointments</p>
            </div>
            <button class="btn btn-primary" @click="addEvent">
              <i class="bi bi-plus-circle me-1"></i>
              Add Event
            </button>
          </div>
        </div>
      </div>

      <!-- Calendar Content -->
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <div class="d-flex justify-content-between align-items-center">
                <h5 class="card-title mb-0">{{ currentMonth }} {{ currentYear }}</h5>
                <div class="calendar-nav">
                  <button class="btn btn-outline-secondary btn-sm me-2" @click="previousMonth">
                    <i class="bi bi-chevron-left"></i>
                  </button>
                  <button class="btn btn-outline-secondary btn-sm me-2" @click="today">
                    Today
                  </button>
                  <button class="btn btn-outline-secondary btn-sm" @click="nextMonth">
                    <i class="bi bi-chevron-right"></i>
                  </button>
                </div>
              </div>
            </div>
            <div class="card-body p-0">
              <div class="calendar-grid">
                <!-- Calendar Header -->
                <div class="calendar-header">
                  <div class="calendar-day-header" v-for="day in daysOfWeek" :key="day">
                    {{ day }}
                  </div>
                </div>
                
                <!-- Calendar Days -->
                <div class="calendar-body">
                  <div
                    v-for="day in calendarDays"
                    :key="`${day.date}-${day.month}`"
                    class="calendar-day"
                    :class="{
                      'other-month': day.isOtherMonth,
                      'today': day.isToday,
                      'has-events': day.events.length > 0
                    }"
                    @click="selectDay(day)"
                  >
                    <div class="day-number">{{ day.date }}</div>
                    <div class="day-events">
                      <div
                        v-for="event in day.events.slice(0, 2)"
                        :key="event.id"
                        class="event-dot"
                        :style="{ backgroundColor: event.color }"
                        :title="event.title"
                      ></div>
                      <div v-if="day.events.length > 2" class="more-events">
                        +{{ day.events.length - 2 }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Events List -->
      <div class="row mt-4" v-if="selectedDay">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">
                Events for {{ selectedDay.date }} {{ currentMonth }} {{ currentYear }}
              </h5>
            </div>
            <div class="card-body">
              <div v-if="selectedDay.events.length === 0" class="text-muted text-center py-4">
                No events scheduled for this day
              </div>
              <div v-else>
                <div
                  v-for="event in selectedDay.events"
                  :key="event.id"
                  class="event-item d-flex align-items-center mb-3"
                >
                  <div
                    class="event-color"
                    :style="{ backgroundColor: event.color }"
                  ></div>
                  <div class="event-details flex-grow-1">
                    <h6 class="event-title mb-1">{{ event.title }}</h6>
                    <small class="text-muted">{{ event.time }}</small>
                  </div>
                  <button class="btn btn-sm btn-outline-danger" @click="deleteEvent(event.id)">
                    <i class="bi bi-trash"></i>
                  </button>
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
import { ref, computed, onMounted } from 'vue'

interface CalendarEvent {
  id: number
  title: string
  time: string
  color: string
}

interface CalendarDay {
  date: number
  month: number
  year: number
  isOtherMonth: boolean
  isToday: boolean
  events: CalendarEvent[]
}

const currentDate = ref<Date>(new Date())
const selectedDay = ref<CalendarDay | null>(null)

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

// Sample events
const events = ref<CalendarEvent[]>([
  { id: 1, title: 'Team Meeting', time: '10:00 AM', color: '#0866c6' },
  { id: 2, title: 'Project Review', time: '2:00 PM', color: '#00b297' },
  { id: 3, title: 'Client Call', time: '4:00 PM', color: '#dc3545' }
])

const currentMonth = computed(() => monthNames[currentDate.value.getMonth()])
const currentYear = computed(() => currentDate.value.getFullYear())

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())
  
  const days: CalendarDay[] = []
  const today = new Date()
  
  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    
    const dayEvents = date.getDate() === 15 && date.getMonth() === month ? events.value : []
    
    days.push({
      date: date.getDate(),
      month: date.getMonth(),
      year: date.getFullYear(),
      isOtherMonth: date.getMonth() !== month,
      isToday: date.toDateString() === today.toDateString(),
      events: dayEvents
    })
  }
  
  return days
})

const previousMonth = (): void => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
  selectedDay.value = null
}

const nextMonth = (): void => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
  selectedDay.value = null
}

const today = (): void => {
  currentDate.value = new Date()
  selectedDay.value = null
}

const selectDay = (day: CalendarDay): void => {
  if (!day.isOtherMonth) {
    selectedDay.value = day
  }
}

const addEvent = (): void => {
  const title = prompt('Enter event title:')
  if (title) {
    const newEvent: CalendarEvent = {
      id: Date.now(),
      title,
      time: '12:00 PM',
      color: '#0866c6'
    }
    events.value.push(newEvent)
  }
}

const deleteEvent = (eventId: number): void => {
  events.value = events.value.filter(event => event.id !== eventId)
}

onMounted(() => {
  // Select today by default
  const today = calendarDays.value.find(day => day.isToday && !day.isOtherMonth)
  if (today) {
    selectedDay.value = today
  }
})
</script>

<style scoped>
.page-title {
  color: var(--color-black);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.calendar-grid {
  display: flex;
  flex-direction: column;
}

.calendar-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
}

.calendar-day-header {
  padding: 1rem;
  text-align: center;
  font-weight: 600;
  color: var(--color-black);
  border-right: 1px solid #dee2e6;
}

.calendar-day-header:last-child {
  border-right: none;
}

.calendar-body {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(6, 1fr);
}

.calendar-day {
  min-height: 100px;
  padding: 0.5rem;
  border-right: 1px solid #dee2e6;
  border-bottom: 1px solid #dee2e6;
  cursor: pointer;
  transition: background-color 0.2s ease;
  position: relative;
}

.calendar-day:hover {
  background-color: #f8f9fa;
}

.calendar-day:last-child {
  border-right: none;
}

.calendar-day.other-month {
  color: #6c757d;
  background-color: #f8f9fa;
}

.calendar-day.today {
  background-color: rgba(8, 102, 198, 0.1);
}

.calendar-day.today .day-number {
  background-color: var(--card-blue);
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.day-number {
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.day-events {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
}

.event-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.more-events {
  font-size: 0.75rem;
  color: #6c757d;
  margin-left: 2px;
}

.event-item {
  padding: 0.75rem;
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
  background-color: #f8f9fa;
}

.event-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 0.75rem;
  flex-shrink: 0;
}

.event-title {
  margin: 0;
  font-weight: 600;
  color: var(--color-black);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .calendar-day {
    min-height: 80px;
    padding: 0.25rem;
  }
  
  .calendar-day-header {
    padding: 0.5rem;
    font-size: 0.875rem;
  }
  
  .day-number {
    font-size: 0.875rem;
  }
}
</style>
