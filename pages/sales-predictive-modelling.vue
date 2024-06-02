<template>
  <div class="container-fluid">
    <div class="row justify-content-center align-items-center vh-100" v-if="loading">
      <div class="col-12 text-center">
        <img src="/infinite-spinner.svg" style="width: 70%;" />
      </div>
    </div>
    <div class="row" v-else>
      <div class="col">
        <div class="card">
          <div class="card p-3">
              <h2 class="card-title" style="color: #000;">Predictive Modelling For Seats</h2>
            </div>
          <div>
            <apexchart type="bar" :options="chartOptions" :series="series"></apexchart>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import statistics from "../assets/js/data.js";

export default {
  data() {
    return {
      loading: true,
      series: [],
      chartOptions: {
        chart: {
          type: 'bar',
          height: 350,
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '50%',
          },
        },
        xaxis: {
          categories: [],
        },
        yaxis: {
          title: {
            text: 'Predicted Seats',
          },
        },
        legend: {
          position: 'bottom',
          horizontalAlign: 'center',
        },
        fill: {
          opacity: 1,
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return val + " seats";
            },
          },
        },
      },
    };
  },
  async mounted() {
    await this.loadData();
    this.loading = false;
  },
  methods: {
    async loadData() {
      let data = await statistics.getForecast();

      let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      let months = [];
      let totalSeatCounts = [];

      data.forEach((monthData) => {
        let month = monthNames[monthData.month - 1];
        months.push(month);

        let totalSeatCount = monthData.salespersonSeatCounts.reduce((acc, spData) => acc + spData.seatCount, 0);
        totalSeatCounts.push(totalSeatCount);
      });

      this.series = [{
        name: 'Total Seat Count',
        data: totalSeatCounts,
      }];

      this.chartOptions.xaxis.categories = months;
    },
  },
};
</script>

<style scoped>
</style>
