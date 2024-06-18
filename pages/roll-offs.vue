<template>
  <div class="container-fluid">
    <div class="row justify-content-center align-items-center vh-100" v-if="loading">
      <div class="col-12 text-center">
        <img src="/infinite-spinner.svg" style="width: 70%;" />
      </div>
    </div>
    <div class="row" v-else>
      <v-date-picker
                v-model="selectedDate"
                :allowed-dates="allowedDates"
                :min="minDate"
                :max="maxDate"
                type="month"
              ></v-date-picker>
      <v-container>
        <v-row>
          <v-col>
            <apexchart type="pie" height="350" ref="apexChartIndustryType" :options="chartOptions" :series="series"
              @dataPointSelection="handleDataPointSelection"></apexchart>
          </v-col>
        </v-row>
        <v-dialog v-model="isModalVisible" min-width="600px">
          <v-card>
            <v-card-title>Customers List</v-card-title>
            <v-card-text>
              <v-data-table :items="filteredData" :headers="headers"></v-data-table>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="isModalVisible = false">Close</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </div>
  </div>
</template>

<script>
import statistics from "../assets/js/data.js";

export default {
  data() {
    return {
      loading: true,
      data: [],
      thisMonthData: [],
      minDate: "2021-01",
      selectedDate: this.getFormattedDate(new Date()), // Format to "YYYY-MM"
      maxDate: this.getFormattedDate(new Date(new Date().getFullYear() + 10, 11, 31)), // 10 years in the future
      industries: {},
      series: [],
      chartOptions: {
        series: [],
        chart: {
          type: 'pie'
        },
        labels: []
      },
      isModalVisible: false,
      selectedIndustry: '',
      filteredData: [],
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Industry', value: 'industry' },
        { text: 'Salesperson', value: 'salesperson' },
        { text: 'CSP', value: 'csp' },
        { text: 'Tenure', value: 'tenure' },
        { text: 'State', value: 'state' }
      ],
      menu: false
    }
  },
  watch: {
    selectedDate() {
      this.filterByMonth()
    },
    'chartOptions.series': {
      handler(newSeries) {
        if (this.$refs.apexChartIndustryType) {
          this.$refs.apexChartIndustryType.updateSeries(newSeries);
          this.$refs.apexChartIndustryType.updateOptions({ labels: this.chartOptions.labels });
        }
      },
      deep: true
    },
  },
  async mounted() {

    this.data = await this.getInactiveClients();
    this.prepareChartData()
    this.loading = false;
  },
  methods: {
    allowedDates: val => true,
    getFormattedDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      return `${year}-${month}`;
    },
    async getInactiveClients() {
      return await statistics.getAllInactiveClients();
    },
    prepareChartData() {
      this.thisMonthData.forEach(customer => {
        if (!this.industries[customer.industry]) {
          this.industries[customer.industry] = []
        }
        this.industries[customer.industry].push(customer)
      })
      this.chartOptions.series = Object.values(this.industries).map(industry => industry.length)
      this.chartOptions.labels = Object.keys(this.industries)
    },
    handleDataPointSelection(event, chartContext, config) {
      this.selectedIndustry = this.chartOptions.labels[config.dataPointIndex]
      this.filteredData = this.industries[this.selectedIndustry]
      this.isModalVisible = true
    },
    filterByMonth() {
      if (!this.selectedDate) {
        this.prepareChartData();
        return;
      }
      this.thisMonthData = this.data;
      const [year, month] = this.selectedDate.split('-').map(Number);
      this.industries = {};
      this.thisMonthData.forEach(customer => {
        const customerDate = new Date(customer.rollOffDate);
        const customerMonth = customerDate.getMonth() + 1;
        const customerYear = customerDate.getFullYear();
        if (customerMonth === month && customerYear === year) {
          if (!this.industries[customer.industry]) {
            this.industries[customer.industry] = [];
          }
          this.industries[customer.industry].push(customer);
        }
      });
      this.chartOptions.series = Object.values(this.industries).map(industry => industry.length);
      this.chartOptions.labels = Object.keys(this.industries);
    },
  }
}
</script>

<style>
.elevation-1 {
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}

.v-dialog__container {
  display: block !important;
}
</style>
