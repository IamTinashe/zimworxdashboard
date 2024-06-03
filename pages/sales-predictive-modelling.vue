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
            endingShape: 'rounded',
          },
        },
        xaxis: {
          categories: [],
        },
        yaxis: {
          title: {
            text: 'Seats',
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
  methods: {
    async loadData() {
      let data = await statistics.getForecast();
      let actual = await statistics.getAllReports();
      actual = this.getLastDayOfMonthData(actual);

      let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      let months = [];
      let totalSeatCounts = [];
      let seatedThisMonthCounts = [];

      data.forEach((monthData, index) => {
        let month = monthNames[monthData.month - 1];
        months.push(month);

        let totalSeatCount = monthData.salespersonSeatCounts.reduce((acc, spData) => acc + spData.seatCount, 0);
        totalSeatCounts.push(totalSeatCount);

        // Get the corresponding actual data for the same month
        let actualData = actual.lastDayData.find(d => d.createdOn[1] === monthData.month);
        seatedThisMonthCounts.push(actualData ? actualData.seatedThisMonth : 0);
      });

      this.series = [
        {
          name: 'Predicted Seats',
          data: totalSeatCounts,
        },
        {
          name: 'Actual Seats',
          data: seatedThisMonthCounts,
        },
      ];

      this.chartOptions.xaxis.categories = months;
    },
    getLastDayOfMonthData(data) {
      const groupedData = {};
      const lastDayData = [];

      data.forEach(item => {
        const [year, month, day] = item.createdOn;
        const key = `${year}-${month}`;
        
        if (!groupedData[key] || day > groupedData[key].createdOn[2]) {
          groupedData[key] = item;
        }
      });

      for (const key in groupedData) {
        lastDayData.push(groupedData[key]);
      }

      return {
        lastDayData,
        lastObject: data[data.length - 1]
      };
    },
  },
  async mounted() {
    await this.loadData();
    this.loading = false;
  },
};
</script>

<style scoped>
</style>
