<template>
    <div class="card">
      <div class="card-header" v-if="title">
        <slot name="header">
          <h4 class="card-title mb-0 pb-0">{{ title }}</h4>
        </slot>
      </div>
      <div class="card-body">
        <h3 class="card-title py-0 my-0">
          <span v-if="revenue">{{ revenueFormatter(value) }} </span>
          <span v-else>{{ value }} </span>
        </h3>
      </div>
    </div>
  </template>
  <script>
  export default {
    name: 'regularscorecard',
    props: {
      title: {
        type: String,
        description: 'Card title'
      },
      value: {
        type: Number,
        description: 'Value'
      },
      revenue: {
        type: Boolean,
        description: "Revenue Figure"
      }
    },
    methods: {
      revenueFormatter(number) {
        let numberStr = String(Math.ceil(number))
        return "$" + numberStr.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }
    }
  };
  </script>
  <style>
  h4, .h4{
    font-size: .9rem;
  }
  </style>
  