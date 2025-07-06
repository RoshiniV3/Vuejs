<template>
  <div class="col-md-3">
    <div class="card text-white" :class="'bg-' + color">
      <div class="card-body d-flex align-items-center">
        <i :class="icon" class="fs-2 me-3"></i>
        <div>
          <h5 class="card-title mb-1">{{ title }}</h5>
          <h6 class="card-subtitle">{{ value }}</h6>
          <small>{{ subtitle }}</small>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    value: String,
    subtitle: String,
    icon: String,
    color: String
  }
}
</script>
