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
          <div class="col-12 col-md-4">
            <div class="card text-center">
              <h2 class="card-title" style="color: #000;">{{ selectedMonthYear }}</h2>
            </div>
          </div>
          <div class="col-md-6"></div>
          <div class="col-md-2 col-12">
            <v-btn :color="defaultColor" class="mb-3" @click="dialog = true">Select Month</v-btn>
            <v-dialog v-model="dialog" max-width="300" class="elevation-1 mt-0">
              <v-card>
                <v-card-title class="headline">Select a Month</v-card-title>
                <v-card-text>
                  <v-date-picker float-right v-model="selectedDate" :allowed-dates="allowedDates" :min="minDate"
                    :max="maxDate" type="month" />
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn :color="defaultColor" @click="dialog = false">OK</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </div>
        </div>
        <div class="card pb-3">
          <div class="row">
            <div class="col-md-3 col-12">
              <div class="card-header headerClasses">
                    <slot name="header">
                      <h4 class="card-title text-center">Total Seats Lost</h4>
                      <h3 class="card-title text-center py-0 my-0">{{ totalSeatsLost }} Seats</h3>
                    </slot>
                  </div>
            </div>
            <v-divider class="mx-4 mt-3" inset vertical></v-divider>
            <div class="col-md-3 col-12">
              <div class="card-header headerClasses">
                    <slot name="header">
                      <h4 class="card-title text-center">Total Clients Lost</h4>
                      <h3 class="card-title text-center py-0 my-0">{{ totalClientsLost }} Clients</h3>
                    </slot>
                  </div>
            </div>
            <v-divider class="mx-4 mt-3" inset vertical></v-divider>
          </div>
        </div>
      </div>
      <div class="col-12">
        <v-container>
          <div class="card py-5">
            <div class="row">
              <!--<div class="col-md-3 col-12">
                <v-row>
                  <v-col>
                    <apexchart type="donut" ref="apexChartIndustryType" :options="chartOptions"
                      :series="series" @dataPointSelection="handleDataPointSelection"></apexchart>
                  </v-col>
                </v-row>
              </div> -->
              <div class="col-md-3 col-12 text-center">
                <v-row>
                  <v-col>
                    <p>Clients By CSPs</p>
                    <apexchart type="donut" width="400" ref="apexChartCSP" :options="cspClientChart.chartOptions"
                      :series="cspClientChart.series" @dataPointSelection="handleCSPDataPointSelection"></apexchart>
                  </v-col>
                </v-row>
              </div>
              <div class="col-md-3 col-12 text-center">
                <v-row>
                  <v-col>
                    <p>Clients By Specialty</p>
                    <apexchart type="donut" width="400" ref="apexChartSpecialty"
                      :options="specialtyClientChart.chartOptions" :series="specialtyClientChart.series"
                      @dataPointSelection="handleSpecialtyDataPointSelection"></apexchart>
                  </v-col>
                </v-row>
              </div>
              <div class="col-md-3 col-12 text-center">
                <v-row>
                  <v-col>
                    <p>Clients By Industry</p>
                    <apexchart type="donut" width="400" ref="apexChartIndustryType"
                      :options="industryClientChart.chartOptions" :series="industryClientChart.series"
                      @dataPointSelection="handleIndustryDataPointSelection"></apexchart>
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
                <v-btn color="primary" @click="downloadCsv">Download CSV</v-btn>
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
      defaultColor: '#42b883',
      minDate: "2021-01",
      selectedDate: this.getFormattedDate(new Date()), // Format to "YYYY-MM"
      maxDate: this.getFormattedDate(new Date(new Date().getFullYear() + 10, 11, 31)), // 10 years in the future
      industries: {},
      specialties: {},
      csps: {},
      selectedMonthYear: "",
      dialog: false,
      totalClientsLost: 0,
      totalSeatsLost: 0,
      industryClientChart: {
        chartOptions: {
          series: [], chart: { type: 'pie' }, labels: [], legend: {
            position: 'bottom',
            formatter: function (seriesName, opts) {
              return [seriesName, " - ", opts.w.globals.series[opts.seriesIndex]].join('');
            }
          }
        }
      },
      specialtyClientChart: {
        chartOptions: {
          series: [], chart: { type: 'pie' }, labels: [], legend: {
            position: 'bottom',
            formatter: function (seriesName, opts) {
              return [seriesName, " - ", opts.w.globals.series[opts.seriesIndex]].join('');
            }
          }
        }
      },
      cspClientChart: {
        chartOptions: {
          series: [], chart: { type: 'pie' }, labels: [], legend: {
            position: 'bottom',
            formatter: function (seriesName, opts) {
              return [seriesName, " - ", opts.w.globals.series[opts.seriesIndex]].join('');
            }
          }
        }
      },
      isModalVisible: false,
      selectedIndustry: '',
      selectedSpecialty: '',
      selectedCSP: '',
      filteredData: [],
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Industry', value: 'industry' },
        { text: 'Specialty', value: 'specialty' },
        { text: 'Salesperson', value: 'salesperson' },
        { text: 'CSP', value: 'csp' },
        { text: 'Seats', value: 'totalSeats' },
        { text: 'Tenure', value: 'tenure' },
        { text: 'Roll-Off Date', value: 'rollOffDate' },
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
    'cspClientChart.chartOptions.series': {
      handler(newSeries) {
        if (this.$refs.apexChartCSP) {
          this.$refs.apexChartCSP.updateSeries(newSeries);
          this.$refs.apexChartCSP.updateOptions({ labels: this.cspClientChart.chartOptions.labels });
        }
      },
      deep: true
    },
  },
  async mounted() {

    this.data = await this.getInactiveClients();
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
    handleCSPDataPointSelection(event, chartContext, config) {
      this.selectedCSP = this.cspClientChart.chartOptions.labels[config.dataPointIndex]
      this.filteredData = this.csps[this.selectedCSP]
      this.isModalVisible = true
    },
    filterByMonth() {
      this.thisMonthData = this.data;
      const [year, month] = this.selectedDate.split('-').map(Number);
      this.industries = {};
      this.specialties = {};
      this.csps = {};
      this.thisMonthData.forEach(customer => {
        const customerDate = new Date(customer.rollOffDate);
        const customerMonth = customerDate.getMonth() + 1;
        const customerYear = customerDate.getFullYear();
        if (customerMonth === month && customerYear === year) {
          this.totalClientsLost++;
          this.totalSeatsLost = this.totalSeatsLost + customer.totalSeats;
          if (!this.industries[customer.industry]) {
            this.industries[customer.industry] = [];
          }
          this.industries[customer.industry].push(customer);

          if (!this.specialties[customer.specialty]) {
            this.specialties[customer.specialty] = [];
          }
          this.specialties[customer.specialty].push(customer);

          if (!this.csps[customer.csp]) {
            this.csps[customer.csp] = [];
          }
          this.csps[customer.csp].push(customer);
        }
      });
      this.industryClientChart.chartOptions.series = Object.values(this.industries).map(industry => industry.length);
      this.industryClientChart.chartOptions.labels = Object.keys(this.industries);

      this.specialtyClientChart.chartOptions.series = Object.values(this.specialties).map(specialty => specialty.length)
      this.specialtyClientChart.chartOptions.labels = Object.keys(this.specialties)

      this.cspClientChart.chartOptions.series = Object.values(this.csps).map(csp => csp.length)
      this.cspClientChart.chartOptions.labels = Object.keys(this.csps)
    },
    downloadCsv() {
      let csvContent = this.convertToCsv(this.filteredData);
      let blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      let link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', 'clients_list.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    convertToCsv(data) {
      let headers = this.headers.map(header => header.text);
      let rows = data.map(item => {
        return this.headers.map(header => item[header.value]);
      });
      let csv = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
      return csv;
    }
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

.float-right {
  float: right !important;
}
</style>
