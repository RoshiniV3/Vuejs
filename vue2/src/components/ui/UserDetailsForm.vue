<template>
  <div class="card">
    <div class="card-body">
      <h5 class="card-title">User Details Form </h5>
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
              >
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
              >
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
              >
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
              >
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
                @blur="validateField('dateOfBirth')"
                @focus="markFieldAsTouched('dateOfBirth')"
              >
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
              >
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
                :class="{ 'is-invalid': errors.companyName }"
                id="companyName"
                v-model="formData.companyName"
                placeholder="Enter company name"
                @blur="validateField('companyName')"
              >
              <div v-if="errors.companyName" class="invalid-feedback">{{ errors.companyName }}</div>
            </div>

            <div class="col-md-6 mb-3">
              <label for="jobTitle" class="form-label">Job Title *</label>
              <input
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors.jobTitle }"
                id="jobTitle"
                v-model="formData.jobTitle"
                placeholder="Enter your job title"
                @blur="validateField('jobTitle')"
              >
              <div v-if="errors.jobTitle" class="invalid-feedback">{{ errors.jobTitle }}</div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="department" class="form-label">Department *</label>
              <select
                class="form-select"
                :class="{ 'is-invalid': errors.department }"
                id="department"
                v-model="formData.department"
                @blur="validateField('department')"
              >
                <option value="">Select Department</option>
                <option value="engineering">Engineering</option>
                <option value="marketing">Marketing</option>
                <option value="sales">Sales</option>
                <option value="hr">Human Resources</option>
                <option value="finance">Finance</option>
                <option value="operations">Operations</option>
              </select>
              <div v-if="errors.department" class="invalid-feedback">{{ errors.department }}</div>
            </div>

            <div class="col-md-6 mb-3">
              <label for="startDate" class="form-label">Start Date *</label>
              <input
                type="date"
                class="form-control"
                :class="{ 'is-invalid': errors.startDate }"
                id="startDate"
                v-model="formData.startDate"
                @blur="validateField('startDate')"
              >
              <div v-if="errors.startDate" class="invalid-feedback">{{ errors.startDate }}</div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="salary" class="form-label">Expected Salary *</label>
              <input
                type="number"
                class="form-control"
                :class="{ 'is-invalid': errors.salary }"
                id="salary"
                v-model="formData.salary"
                placeholder="Enter expected salary"
                min="0"
                @blur="validateField('salary')"
              >
              <div v-if="errors.salary" class="invalid-feedback">{{ errors.salary }}</div>
            </div>

            <div class="col-md-6 mb-3">
              <label for="workType" class="form-label">Work Type *</label>
              <select
                class="form-select"
                :class="{ 'is-invalid': errors.workType }"
                id="workType"
                v-model="formData.workType"
                @blur="validateField('workType')"
              >
                <option value="">Select Work Type</option>
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
              <div v-if="errors.workType" class="invalid-feedback">{{ errors.workType }}</div>
            </div>
          </div>
        </div>

        <!-- Step 3: EEO Information -->
        <div v-if="currentStep === 3" class="step-content">
          <h6 class="mb-3">Equal Employment Opportunity Information</h6>
          <p class="text-muted small mb-4">
            This information is voluntary and will be kept confidential. It is used only for compliance with federal reporting requirements.
          </p>

          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="gender" class="form-label">Gender</label>
              <select
                class="form-select"
                id="gender"
                v-model="formData.gender"
              >
                <option value="">Prefer not to answer</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="non-binary">Non-binary</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div class="col-md-6 mb-3">
              <label for="ethnicity" class="form-label">Ethnicity</label>
              <select
                class="form-select"
                id="ethnicity"
                v-model="formData.ethnicity"
              >
                <option value="">Prefer not to answer</option>
                <option value="hispanic">Hispanic or Latino</option>
                <option value="white">White</option>
                <option value="black">Black or African American</option>
                <option value="asian">Asian</option>
                <option value="native-american">American Indian or Alaska Native</option>
                <option value="pacific-islander">Native Hawaiian or Other Pacific Islander</option>
                <option value="two-or-more">Two or More Races</option>
              </select>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="veteran" class="form-label">Veteran Status</label>
              <select
                class="form-select"
                id="veteran"
                v-model="formData.veteran"
              >
                <option value="">Prefer not to answer</option>
                <option value="yes">Yes, I am a veteran</option>
                <option value="no">No, I am not a veteran</option>
              </select>
            </div>

            <div class="col-md-6 mb-3">
              <label for="disability" class="form-label">Disability Status</label>
              <select
                class="form-select"
                id="disability"
                v-model="formData.disability"
              >
                <option value="">Prefer not to answer</option>
                <option value="yes">Yes, I have a disability</option>
                <option value="no">No, I do not have a disability</option>
              </select>
            </div>
          </div>

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
              >
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
              v-if="currentStep === 3"
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

<script>
export default {
  name: 'FormWizard',
  data() {
    return {
      currentStep: 1,
      submitted: false,
      formData: {
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
        department: '',
        startDate: '',
        salary: '',
        workType: '',

        // Step 3: EEO Information
        gender: '',
        ethnicity: '',
        veteran: '',
        disability: '',
        termsAccepted: false
      },
      errors: {},
      touched: {}
    }
  },
  computed: {
    isStep1Valid() {
      const step1Fields = ['firstName', 'lastName', 'email', 'phone', 'dateOfBirth', 'address'];
      return step1Fields.every(field => {
        // Only validate if field has been touched or we're checking for navigation
        if (this.touched[field]) {
          this.validateField(field);
        }
        return this.formData[field] && this.formData[field].toString().trim() !== '';
      });
    },

    isStep2Valid() {
      const step2Fields = ['companyName', 'jobTitle', 'department', 'startDate', 'salary', 'workType'];
      return step2Fields.every(field => {
        // Only validate if field has been touched or we're checking for navigation
        if (this.touched[field]) {
          this.validateField(field);
        }
        return this.formData[field] && this.formData[field].toString().trim() !== '';
      });
    },

    isStep3Valid() {
      // Only validate if field has been touched or we're checking for navigation
      if (this.touched.termsAccepted) {
        this.validateField('termsAccepted');
      }
      return this.formData.termsAccepted;
    },

    isCurrentStepValid() {
      switch (this.currentStep) {
        case 1:
          return this.isStep1Valid;
        case 2:
          return this.isStep2Valid;
        case 3:
          return this.isStep3Valid;
        default:
          return false;
      }
    },

    isFormValid() {
      return this.isStep1Valid && this.isStep2Valid && this.isStep3Valid;
    }
  },
  methods: {
    markFieldAsTouched(fieldName) {
      this.$set(this.touched, fieldName, true);
    },

    validateField(fieldName) {
      this.$delete(this.errors, fieldName);

      const value = this.formData[fieldName];

      // Required field validation
      const requiredFields = [
        'firstName', 'lastName', 'email', 'phone', 'dateOfBirth', 'address',
        'companyName', 'jobTitle', 'department', 'startDate', 'salary', 'workType'
      ];

      if (requiredFields.includes(fieldName) && (!value || value.toString().trim() === '')) {
        this.$set(this.errors, fieldName, 'This field is required');
        return false;
      }

      // Specific field validations
      switch (fieldName) {
        case 'firstName':
        case 'lastName':
          if (value && value.length < 2) {
            this.$set(this.errors, fieldName, 'Must be at least 2 characters long');
            return false;
          }
          if (value && !/^[a-zA-Z\s]+$/.test(value)) {
            this.$set(this.errors, fieldName, 'Only letters and spaces are allowed');
            return false;
          }
          break;

        case 'email':
          if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            this.$set(this.errors, fieldName, 'Please enter a valid email address');
            return false;
          }
          break;

        case 'phone':
          if (value && !/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(value)) {
            this.$set(this.errors, fieldName, 'Please enter a valid phone number');
            return false;
          }
          break;

        case 'dateOfBirth':
          if (value) {
            const birthDate = new Date(value);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            if (age < 16 || age > 100) {
              this.$set(this.errors, fieldName, 'Age must be between 16 and 100 years');
              return false;
            }
          }
          break;

        case 'startDate':
          if (value) {
            const startDate = new Date(value);
            const today = new Date();
            if (startDate < today) {
              this.$set(this.errors, fieldName, 'Start date cannot be in the past');
              return false;
            }
          }
          break;

        case 'salary':
          if (value && (isNaN(value) || parseFloat(value) < 0)) {
            this.$set(this.errors, fieldName, 'Please enter a valid salary amount');
            return false;
          }
          if (value && parseFloat(value) < 20000) {
            this.$set(this.errors, fieldName, 'Salary must be at least $20,000');
            return false;
          }
          break;

        case 'termsAccepted':
          if (!value) {
            this.$set(this.errors, fieldName, 'You must accept the terms and conditions');
            return false;
          }
          break;
      }

      return true;
    },

    nextStep() {
      let canProceed = false;

      if (this.currentStep === 1) {
        // Mark all step 1 fields as touched and validate
        const step1Fields = ['firstName', 'lastName', 'email', 'phone', 'dateOfBirth', 'address'];
        step1Fields.forEach(field => {
          this.markFieldAsTouched(field);
          this.validateField(field);
        });
        canProceed = this.isStep1Valid;
      } else if (this.currentStep === 2) {
        // Mark all step 2 fields as touched and validate
        const step2Fields = ['companyName', 'jobTitle', 'department', 'startDate', 'salary', 'workType'];
        step2Fields.forEach(field => {
          this.markFieldAsTouched(field);
          this.validateField(field);
        });
        canProceed = this.isStep2Valid;
      }

      if (canProceed && this.currentStep < 3) {
        this.currentStep++;
      }
    },

    previousStep() {
      if (this.currentStep > 1) {
        this.currentStep--;
      }
    },

    handleSubmit() {
      // Mark terms as touched and validate
      this.markFieldAsTouched('termsAccepted');
      this.validateField('termsAccepted');

      if (this.isFormValid) {
        // Simulate form submission
        console.log('Form submitted:', this.formData);
        this.submitted = true;

        // Reset form after 3 seconds
        setTimeout(() => {
          this.clearForm();
          this.submitted = false;
        }, 3000);
      }
    },

    clearForm() {
      this.currentStep = 1;
      this.submitted = false;
      this.errors = {};
      this.touched = {};
      this.formData = {
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
        department: '',
        startDate: '',
        salary: '',
        workType: '',

        // Step 3: EEO Information
        gender: '',
        ethnicity: '',
        veteran: '',
        disability: '',
        termsAccepted: false
      };
    }
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
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: var(--color-secondary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.step-indicator.active {
  background-color: var(--card-blue);
  transform: scale(1.1);
}

.step-indicator.completed {
  background-color: var(--color-green);
}

.step-line {
  width: 60px;
  height: 3px;
  background-color: var(--color-light);
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.step-line.active {
  background-color: var(--card-blue);
}

.step-text {
  font-size: 14px;
  font-weight: 500;
  margin-left: 8px;
  white-space: nowrap;
}

.step-content {
  min-height: 400px;
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.form-label {
  font-weight: 500;
  color: var(--color-black);
  margin-bottom: 6px;
}

.form-control:focus,
.form-select:focus {
  border-color: var(--card-blue);
  box-shadow: 0 0 0 0.2rem rgba(8, 102, 198, 0.25);
}

.btn-primary {
  background-color: var(--card-blue);
  border-color: var(--card-blue);
  font-weight: 500;
}

.btn-primary:hover {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
}

.btn-success {
  background-color: var(--color-green);
  border-color: var(--color-green);
  font-weight: 500;
}

.btn-success:hover {
  background-color: var(--color-success);
  border-color: var(--color-success);
}

.btn-outline-danger {
  color: var(--color-red);
  border-color: var(--color-red);
}

.btn-outline-danger:hover {
  background-color: var(--color-red);
  border-color: var(--color-red);
}

.alert-success {
  background-color: rgba(0, 178, 151, 0.1);
  border-color: var(--color-green);
  color: var(--color-green);
}

.invalid-feedback {
  font-size: 12px;
}

.form-check-input:checked {
  background-color: var(--card-blue);
  border-color: var(--card-blue);
}

.form-check-input:focus {
  border-color: var(--card-blue);
  box-shadow: 0 0 0 0.2rem rgba(8, 102, 198, 0.25);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .step-indicators {
    justify-content: center;
  }

  .step-text {
    display: none;
  }

  .step-line {
    width: 40px;
  }
}
</style>
