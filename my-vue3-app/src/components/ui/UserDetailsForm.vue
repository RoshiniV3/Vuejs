<template>
  <div class="card h-100 d-flex flex-column">
    <div class="card-body flex-grow-1 d-flex flex-column">
      <h5 class="card-title">User Details Form</h5>
      <p class="text-muted mb-4">Complete all steps to submit your application</p>

      <!-- Step indicators -->
      <div class="d-flex align-items-center mb-4 step-indicators">
        <div class="d-flex align-items-center">
          <div class="step-indicator" :class="{ active: currentStep >= 1, completed: currentStep > 1 }">
            <i v-if="currentStep > 1" class="bi bi-check"></i>
            <span v-else class="step-number">1</span>
          </div>
          <span class="step-text" :class="{ 'text-muted': currentStep < 1 }">User Details</span>
        </div>

        <div class="step-line mx-3" :class="{ active: currentStep > 1 }"></div>

        <div class="d-flex align-items-center">
          <div class="step-indicator" :class="{ active: currentStep >= 2, completed: currentStep > 2 }">
            <i v-if="currentStep > 2" class="bi bi-check"></i>
            <span v-else class="step-number">2</span>
          </div>
          <span class="step-text" :class="{ 'text-muted': currentStep < 2 }">Company Details</span>
        </div>

        <div class="step-line mx-3" :class="{ active: currentStep > 2 }"></div>

        <div class="d-flex align-items-center">
          <div class="step-indicator" :class="{ active: currentStep >= 3, completed: currentStep > 3 }">
            <i v-if="currentStep > 3" class="bi bi-check"></i>
            <span v-else class="step-number">3</span>
          </div>
          <span class="step-text" :class="{ 'text-muted': currentStep < 3 }">EEO Information</span>
        </div>
      </div>

      <!-- Form content -->
      <form @submit.prevent="handleSubmit">
        <!-- Step 1: User Details -->
        <div v-if="currentStep === 1" class="step-content">
          <h6 class="mb-3">Personal Information</h6>

          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="firstName" class="form-label">First Name *</label>
              <input
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors.firstName && touched.firstName }"
                id="firstName"
                v-model="formData.firstName"
                placeholder="Enter your first name"
                @blur="validateField('firstName')"
                @focus="markFieldAsTouched('firstName')"
              />
              <div v-if="errors.firstName && touched.firstName" class="invalid-feedback">{{ errors.firstName }}</div>
            </div>

            <div class="col-md-6 mb-3">
              <label for="lastName" class="form-label">Last Name *</label>
              <input
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors.lastName && touched.lastName }"
                id="lastName"
                v-model="formData.lastName"
                placeholder="Enter your last name"
                @blur="validateField('lastName')"
                @focus="markFieldAsTouched('lastName')"
              />
              <div v-if="errors.lastName && touched.lastName" class="invalid-feedback">{{ errors.lastName }}</div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="email" class="form-label">Email Address *</label>
              <input
                type="email"
                class="form-control"
                :class="{ 'is-invalid': errors.email && touched.email }"
                id="email"
                v-model="formData.email"
                placeholder="Enter your email"
                @blur="validateField('email')"
                @focus="markFieldAsTouched('email')"
              />
              <div v-if="errors.email && touched.email" class="invalid-feedback">{{ errors.email }}</div>
            </div>

            <div class="col-md-6 mb-3">
              <label for="phone" class="form-label">Phone Number *</label>
              <input
                type="tel"
                class="form-control"
                :class="{ 'is-invalid': errors.phone && touched.phone }"
                id="phone"
                v-model="formData.phone"
                placeholder="(555) 123-4567"
                @blur="validateField('phone')"
                @focus="markFieldAsTouched('phone')"
              />
              <div v-if="errors.phone && touched.phone" class="invalid-feedback">{{ errors.phone }}</div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="dateOfBirth" class="form-label">Date of Birth *</label>
              <input
                type="date"
                class="form-control"
                :class="{ 'is-invalid': errors.dateOfBirth && touched.dateOfBirth }"
                id="dateOfBirth"
                v-model="formData.dateOfBirth"
                placeholder="mm/dd/yyyy"
                @blur="validateField('dateOfBirth')"
                @focus="markFieldAsTouched('dateOfBirth')"
              />
              <div v-if="errors.dateOfBirth && touched.dateOfBirth" class="invalid-feedback">{{ errors.dateOfBirth }}</div>
            </div>

            <div class="col-md-6 mb-3">
              <label for="address" class="form-label">Address *</label>
              <input
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors.address && touched.address }"
                id="address"
                v-model="formData.address"
                placeholder="Enter your address"
                @blur="validateField('address')"
                @focus="markFieldAsTouched('address')"
              />
              <div v-if="errors.address && touched.address" class="invalid-feedback">{{ errors.address }}</div>
            </div>
          </div>
        </div>

        <!-- Step 2: Company Details -->
        <div v-if="currentStep === 2" class="step-content">
          <h6 class="mb-3">Company Information</h6>

          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="companyName" class="form-label">Company Name *</label>
              <input
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors.companyName && touched.companyName }"
                id="companyName"
                v-model="formData.companyName"
                placeholder="Enter company name"
                @blur="validateField('companyName')"
                @focus="markFieldAsTouched('companyName')"
              />
              <div v-if="errors.companyName && touched.companyName" class="invalid-feedback">{{ errors.companyName }}</div>
            </div>

            <div class="col-md-6 mb-3">
              <label for="jobTitle" class="form-label">Job Title *</label>
              <input
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors.jobTitle && touched.jobTitle }"
                id="jobTitle"
                v-model="formData.jobTitle"
                placeholder="Enter your job title"
                @blur="validateField('jobTitle')"
                @focus="markFieldAsTouched('jobTitle')"
              />
              <div v-if="errors.jobTitle && touched.jobTitle" class="invalid-feedback">{{ errors.jobTitle }}</div>
            </div>
          </div>
        </div>

        <!-- Step 3: EEO Information -->
        <div v-if="currentStep === 3" class="step-content">
          <h6 class="mb-3">Equal Employment Opportunity Information</h6>

          <div class="mb-4">
            <div class="form-check">
              <input
                class="form-check-input"
                :class="{ 'is-invalid': errors.termsAccepted && touched.termsAccepted }"
                type="checkbox"
                id="termsAccepted"
                v-model="formData.termsAccepted"
                @change="validateField('termsAccepted')"
                @focus="markFieldAsTouched('termsAccepted')"
              />
              <label class="form-check-label" for="termsAccepted">
                I agree to the terms and conditions and privacy policy *
              </label>
              <div v-if="errors.termsAccepted && touched.termsAccepted" class="invalid-feedback d-block">{{ errors.termsAccepted }}</div>
            </div>
          </div>
        </div>

        <!-- Navigation buttons -->
        <div class="d-flex justify-content-between mt-4">
          <button
            type="button"
            class="btn btn-outline-secondary"
            @click="previousStep"
            :disabled="currentStep === 1"
          >
            <i class="bi bi-arrow-left me-1"></i>
            Previous
          </button>

          <div class="d-flex gap-2">
            <button type="button" class="btn btn-outline-danger" @click="clearForm">
              <i class="bi bi-trash me-1"></i>
              Clear All
            </button>

            <button
              v-if="currentStep < 3"
              type="button"
              class="btn btn-primary"
              @click="nextStep"
              :disabled="!isCurrentStepValid"
            >
              Next
              <i class="bi bi-arrow-right ms-1"></i>
            </button>

            <button
              v-else
              type="submit"
              class="btn btn-success"
              :disabled="!isFormValid"
            >
              <i class="bi bi-check-circle me-1"></i>
              Submit Application
            </button>
          </div>
        </div>
      </form>

      <!-- Success message -->
      <div v-if="submitted" class="alert alert-success mt-4">
        <i class="bi bi-check-circle me-2"></i>
        <strong>Success!</strong> Your application has been submitted successfully.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  address: string
  companyName: string
  jobTitle: string
  termsAccepted: boolean
}

const currentStep = ref<number>(1)
const submitted = ref<boolean>(false)
const formData = ref<FormData>({
  // Step 1: User Details
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  address: '',

  // Step 2: Company Details
  companyName: '',
  jobTitle: '',

  // Step 3: Terms
  termsAccepted: false
})

const errors = ref<Record<string, string>>({})
const touched = ref<Record<string, boolean>>({})

const isStep1Valid = computed(() => {
  const step1Fields: (keyof FormData)[] = ['firstName', 'lastName', 'email', 'phone', 'dateOfBirth', 'address']
  return step1Fields.every(field => {
    if (touched.value[field]) {
      validateField(field)
    }
    const value = formData.value[field]
    return value && value.toString().trim() !== ''
  })
})

const isStep2Valid = computed(() => {
  const step2Fields: (keyof FormData)[] = ['companyName', 'jobTitle']
  return step2Fields.every(field => {
    if (touched.value[field]) {
      validateField(field)
    }
    const value = formData.value[field]
    return value && value.toString().trim() !== ''
  })
})

const isStep3Valid = computed(() => {
  if (touched.value.termsAccepted) {
    validateField('termsAccepted')
  }
  return formData.value.termsAccepted
})

const isCurrentStepValid = computed(() => {
  switch (currentStep.value) {
    case 1: return isStep1Valid.value
    case 2: return isStep2Valid.value
    case 3: return isStep3Valid.value
    default: return false
  }
})

const isFormValid = computed(() => {
  return isStep1Valid.value && isStep2Valid.value && isStep3Valid.value
})

const markFieldAsTouched = (fieldName: string): void => {
  touched.value[fieldName] = true
}

const validateField = (fieldName: string): boolean => {
  delete errors.value[fieldName]

  const value = formData.value[fieldName as keyof FormData]

  // Required field validation
  const requiredFields = [
    'firstName', 'lastName', 'email', 'phone', 'dateOfBirth', 'address',
    'companyName', 'jobTitle'
  ]

  if (requiredFields.includes(fieldName) && (!value || value.toString().trim() === '')) {
    errors.value[fieldName] = 'This field is required'
    return false
  }

  // Specific field validations
  switch (fieldName) {
    case 'firstName':
    case 'lastName':
      if (value && value.length < 2) {
        errors.value[fieldName] = 'Must be at least 2 characters long'
        return false
      }
      if (value && !/^[a-zA-Z\s]+$/.test(value)) {
        errors.value[fieldName] = 'Only letters and spaces are allowed'
        return false
      }
      break

    case 'email':
      if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errors.value[fieldName] = 'Please enter a valid email address'
        return false
      }
      break

    case 'phone':
      if (value && !/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(value)) {
        errors.value[fieldName] = 'Please enter a valid phone number'
        return false
      }
      break

    case 'dateOfBirth':
      if (value) {
        const birthDate = new Date(value)
        const today = new Date()
        const age = today.getFullYear() - birthDate.getFullYear()
        if (age < 16 || age > 100) {
          errors.value[fieldName] = 'Age must be between 16 and 100 years'
          return false
        }
      }
      break

    case 'termsAccepted':
      if (!value) {
        errors.value[fieldName] = 'You must accept the terms and conditions'
        return false
      }
      break
  }

  return true
}

const nextStep = (): void => {
  let canProceed = false

  if (currentStep.value === 1) {
    // Mark all step 1 fields as touched and validate
    const step1Fields = ['firstName', 'lastName', 'email', 'phone', 'dateOfBirth', 'address']
    step1Fields.forEach(field => {
      markFieldAsTouched(field)
      validateField(field)
    })
    canProceed = isStep1Valid.value
  } else if (currentStep.value === 2) {
    // Mark all step 2 fields as touched and validate
    const step2Fields = ['companyName', 'jobTitle']
    step2Fields.forEach(field => {
      markFieldAsTouched(field)
      validateField(field)
    })
    canProceed = isStep2Valid.value
  }

  if (canProceed && currentStep.value < 3) {
    currentStep.value++
  }
}

const previousStep = (): void => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const handleSubmit = (): void => {
  // Mark terms as touched and validate
  markFieldAsTouched('termsAccepted')
  validateField('termsAccepted')

  if (isFormValid.value) {
    // Simulate form submission
    console.log('Form submitted:', formData.value)
    submitted.value = true

    // Reset form after 3 seconds
    setTimeout(() => {
      clearForm()
      submitted.value = false
    }, 3000)
  }
}

const clearForm = (): void => {
  currentStep.value = 1
  submitted.value = false
  errors.value = {}
  touched.value = {}
  formData.value = {
    // Step 1: User Details
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',

    // Step 2: Company Details
    companyName: '',
    jobTitle: '',

    // Step 3: Terms
    termsAccepted: false
  }
}
</script>

<style scoped>
.step-indicators {
  overflow-x: auto;
  white-space: nowrap;
  padding-bottom: 10px;
}

.step-indicator {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #e9ecef;
  color: #6c757d;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
}

.step-indicator.active {
  background-color: var(--card-blue);
  color: white;
}

.step-indicator.completed {
  background-color: var(--color-green);
  color: white;
}

.step-text {
  margin-left: 8px;
  font-weight: 500;
  font-size: 14px;
}

.step-line {
  height: 2px;
  background-color: #e9ecef;
  flex: 1;
  transition: background-color 0.3s ease;
}

.step-line.active {
  background-color: var(--card-blue);
}

.step-content {
  min-height: 200px;
}

.card {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .step-indicators {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .step-line {
    display: none;
  }

  .form-row {
    flex-direction: column;
  }

  .form-row .col-md-6 {
    margin-bottom: 1rem;
  }
}
</style>
