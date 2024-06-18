<template>
  <div class="container-fluid">
    <div class="row justify-content-center align-items-center vh-100" v-if="loading">
      <div class="col-12 text-center">
        <img src="/infinite-spinner.svg" style="width: 70%;" />
      </div>
    </div>
    <div class="row" v-else>
      <div class="col-12">
        <div class="row">
          <div class="col-md-6 col-12">
            {{ selectedMonthYear }}
          </div>
          <div class="col-md-6 col-12">
            <v-date-picker float-right v-model="selectedDate" :allowed-dates="allowedDates" :min="minDate" :max="maxDate" type="month"/>
          </div>
        </div>
      </div>
      <div class="col-12">
        <v-container>
          <div class="card py-5">
            <h3 class="card-title px-5">Client Roll-Offs</h3>
            <div class="row">
              <!--<div class="col-md-3 col-12">
                <v-row>
                  <v-col>
                    <apexchart type="donut" ref="apexChartIndustryType" :options="chartOptions"
                      :series="series" @dataPointSelection="handleDataPointSelection"></apexchart>
                  </v-col>
                </v-row>
              </div>
              <div class="col-md-3 col-12">
                <v-row>
                  <v-col>
                    <apexchart type="donut" ref="apexChartIndustryType" :options="chartOptions"
                      :series="series" @dataPointSelection="handleDataPointSelection"></apexchart>
                  </v-col>
                </v-row>
              </div> -->
              <div class="col-md-3 col-12">
                <v-row>
                  <v-col>
                    <apexchart type="donut" width="400" ref="apexChartSpecialty" :options="specialtyClientChart.chartOptions"
                      :series="specialtyClientChart.series" @dataPointSelection="handleSpecialtyDataPointSelection"></apexchart>
                  </v-col>
                </v-row>
              </div>
              <div class="col-md-3 col-12">
                <v-row>
                  <v-col>
                    <apexchart type="donut" width="400" ref="apexChartIndustryType" :options="industryClientChart.chartOptions"
                      :series="industryClientChart.series" @dataPointSelection="handleIndustryDataPointSelection"></apexchart>
                  </v-col>
                </v-row>
              </div>
            </div>
          </div>

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
      specialties: {},
      selectedMonthYear: "",
      industryClientChart: { chartOptions: { series: [], chart: { type: 'pie'}, labels: [], legend: {
            position: 'bottom',
            formatter: function (seriesName, opts) {
              return [seriesName, " - ", opts.w.globals.series[opts.seriesIndex]].join('');
            }
          } }},
      specialtyClientChart: { chartOptions: { series: [], chart: { type: 'pie'}, labels: [], legend: {
            position: 'bottom',
            formatter: function (seriesName, opts) {
              return [seriesName, " - ", opts.w.globals.series[opts.seriesIndex]].join('');
            }
          } }},
      isModalVisible: false,
      selectedIndustry: '',
      selectedSpecialty: '',
      filteredData: [],
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Industry', value: 'industry' },
        { text: 'Specialty', value: 'specialty' },
        { text: 'Salesperson', value: 'salesperson' },
        { text: 'CSP', value: 'csp' },
        { text: 'Seats', value: 'totalSeats' },
        { text: 'Tenure', value: 'tenure' },
        { text: 'State', value: 'state' }
      ],
      menu: false
    }
  },
  watch: {
    selectedDate(val) {
      this.filterByMonth();
      this.getSelectedMonthYear(val);
    },
    'industryClientChart.chartOptions.series': {
      handler(newSeries) {
        if (this.$refs.apexChartIndustryType) {
          this.$refs.apexChartIndustryType.updateSeries(newSeries);
          this.$refs.apexChartIndustryType.updateOptions({ labels: this.industryClientChart.chartOptions.labels });
        }
      },
      deep: true
    },
    'specialtyClientChart.chartOptions.series': {
      handler(newSeries) {
        if (this.$refs.apexChartSpecialty) {
          this.$refs.apexChartSpecialty.updateSeries(newSeries);
          this.$refs.apexChartSpecialty.updateOptions({ labels: this.specialtyClientChart.chartOptions.labels });
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
    getSelectedMonthYear(date) {
      let [year, month] = date.split('-');
      let monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      let monthIndex = parseInt(month, 10) - 1;
      this.selectedMonthYear = monthNames[monthIndex] + " " + year;
    },
    async getInactiveClients() {
      return await statistics.getAllInactiveClients();
    },
    prepareChartData() {
      this.thisMonthData.forEach(customer => {
        if (!this.industries[customer.industry]) {
          this.industries[customer.industry] = []
        }
        if(!this.specialties[customer.specialty]){
          this.specialties[customer.specialty] = []
        }

        this.specialties[customer.specialty].push(customer)
        this.industries[customer.industry].push(customer)
      })

      this.specialtyClientChart.chartOptions.series = Object.values(this.specialties).map(specialty => specialty.length)
      this.specialtyClientChart.chartOptions.labels = Object.keys(this.specialties)

      this.industryClientChart.chartOptions.series = Object.values(this.industries).map(industry => industry.length)
      this.industryClientChart.chartOptions.labels = Object.keys(this.industries)

    },
    handleIndustryDataPointSelection(event, chartContext, config) {
      this.selectedIndustry = this.industryClientChart.chartOptions.labels[config.dataPointIndex]
      this.filteredData = this.industries[this.selectedIndustry]
      this.isModalVisible = true
    },
    handleSpecialtyDataPointSelection(event, chartContext, config) {
      this.selectedSpecialty = this.specialtyClientChart.chartOptions.labels[config.dataPointIndex]
      this.filteredData = this.specialties[this.selectedSpecialty]
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
      this.specialties = {};
      this.thisMonthData.forEach(customer => {
        const customerDate = new Date(customer.rollOffDate);
        const customerMonth = customerDate.getMonth() + 1;
        const customerYear = customerDate.getFullYear();
        if (customerMonth === month && customerYear === year) {
          if (!this.industries[customer.industry]) {
            this.industries[customer.industry] = [];
          }
          this.industries[customer.industry].push(customer);

          if (!this.specialties[customer.specialty]) {
            this.specialties[customer.specialty] = [];
          }
          this.specialties[customer.specialty].push(customer);
        }
      });
      this.industryClientChart.chartOptions.series = Object.values(this.industries).map(industry => industry.length);
      this.industryClientChart.chartOptions.labels = Object.keys(this.industries);

      this.specialtyClientChart.chartOptions.series = Object.values(this.specialties).map(specialty => specialty.length)
      this.specialtyClientChart.chartOptions.labels = Object.keys(this.specialties)
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

.float-right{
  float: right !important;
}
</style>
