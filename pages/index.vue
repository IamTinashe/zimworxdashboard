<template>
  <div class="container-fluid">
    <div class="row justify-content-center align-items-center vh-100" v-if="loading">
      <div class="col-12 text-center">
        <img src="/infinite-spinner.svg" style="width: 70%;" />
      </div>
    </div>
    <div class="row">
      <div class="col-12 col-md-12">
        <div class="row" v-if="!loading">
          <div class="col-12 col-md-12">
            <scorecardnumbers :date="date" :allreports="fetchedData" v-if="fetchedData" />
          </div>
        </div>
        <div class="row" v-if="!loading && monthlyReport">
          <div class="col-12 col-md-6">
            <div class="card">
              <div class="row">
                <div class="col-12 col-md-4" style="border-right: 1px solid #eee;">
                  <div class="card-header headerClasses">
                    <slot name="header">
                      <h4 class="card-title text-center">WARM Opportunities</h4>
                      <h3 class="card-title text-center py-0 my-0">{{ monthlyReport[monthlyReport.length - 1].warmLeads
                        }}
                      </h3>
                      <h3 class="card-category text-center mt-0 pt-0 pb-3 color-black">{{
      monthlyReport[monthlyReport.length - 1].warmSeats }} Seats</h3>
                    </slot>
                  </div>
                </div>
                <div class="col-12 col-md-4" style="border-right: 1px solid #eee;">
                  <div class="card-header headerClasses">
                    <slot name="header">
                      <h4 class="card-title text-center">MILD Opportunities</h4>
                      <h3 class="card-title text-center py-0 my-0">{{ monthlyReport[monthlyReport.length - 1].mildLeads
                        }}
                      </h3>
                      <h3 class="card-category text-center mt-0 pt-0 pb-3 color-black">{{
      monthlyReport[monthlyReport.length - 1].mildSeats }} Seats</h3>
                    </slot>
                  </div>
                </div>
                <div class="col-12 col-md-4">
                  <div class="card-header headerClasses">
                    <slot name="header">
                      <h4 class="card-title text-center">HOT Opportunities</h4>
                      <h3 class="card-title text-center py-0 my-0">{{ monthlyReport[monthlyReport.length - 1].hotLeads
                        }}
                      </h3>
                      <h3 class="card-category text-center mt-0 pt-0 pb-3 color-black">{{
      monthlyReport[monthlyReport.length - 1].hotSeats }} Seats</h3>
                    </slot>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-6">
            <div class="card text-center">
              <div class="row pb-4">
                <div class="col-12 col-md-4" style="border-right: 1px solid #eee;">
                  <div class="card-header headerClasses">
                    <slot name="header">
                      <h4 class="card-title">MTD Seats Won</h4>
                      <h3 class="card-title">{{ monthlyReport[monthlyReport.length - 1].seatedThisMonth }}</h3>
                    </slot>
                  </div>
                </div>
                <div class="col-12 col-md-4" style="border-right: 1px solid #eee;">
                  <div class="card-header headerClasses">
                    <slot name="header">
                      <h4 class="card-title">MTD Seats Lost</h4>
                      <h3 class="card-title">{{ monthlyReport[monthlyReport.length - 1].lostSeatsThisMonth }}</h3>
                    </slot>
                  </div>
                </div>
                <div class="col-12 col-md-4">
                  <div class="card-header headerClasses">
                    <slot name="header">
                      <h4 class="card-title">MTD Gained Seats</h4>
                      <h3 class="card-title">{{ monthlyReport[monthlyReport.length - 1].seatedThisMonth -
      monthlyReport[monthlyReport.length - 1].lostSeatsThisMonth }}</h3>
                    </slot>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12 col-md-8">
            <card type="chart">
              <template slot="header">
                <div class="row">
                  <div class="col-12 col-md-6">
                    <h5 class="card-category">Seat and Revenue Stats</h5>
                    <h2 class="card-title">Growth Rate</h2>
                  </div>
                  <div class="col-12 col-md-6 d-flex d-sm-block">
                    <div class="btn-group btn-group-toggle float-right" data-toggle="buttons">
                      <label v-for="(option, index) in bigLineChartCategories" :key="option.name"
                        class="btn btn-sm btn-primary btn-simple"
                        :class="{ active: bigLineChart.activeIndex === index }" :id="index"
                        @click="initBigChart(index)">
                        <input type="radio" name="options" autocomplete="off"
                          :checked="bigLineChart.activeIndex === index" />
                        <span class="d-none d-sm-block">{{ option.name }}</span>
                        <span class="d-block d-sm-none">
                          <i :class="option.icon"></i>
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </template>
              <div class="chart-area">
                <line-chart style="height: 100%" ref="bigChart" :chart-data="bigLineChart.chartData"
                  :gradient-colors="bigLineChart.gradientColors" :gradient-stops="bigLineChart.gradientStops"
                  :extra-options="bigLineChart.extraOptions">
                </line-chart>
              </div>
            </card>
              <card type="chart" v-if="!loading">
                <template slot="header">
                  <h3 class="card-title">
                    Seats By Salesperson
                  </h3>
                </template>
                <div class="chart-area">
                  <bar-chart style="height: 100%" :chart-data="blueBarChart.chartData"
                    :gradient-stops="blueBarChart.gradientStops" :extra-options="blueBarChart.extraOptions">
                  </bar-chart>
                </div>
              </card>
              <card type="chart" v-if="!loading">
                <template slot="header">
                  <h3 class="card-title">
                    Revenue By Salesperson
                  </h3>
                </template>
                <div class="chart-area">
                  <bar-chart style="height: 100%" :chart-data="purpleBarChart.chartData"
                    :gradient-stops="purpleBarChart.gradientStops" :extra-options="purpleBarChart.extraOptions">
                  </bar-chart>
                </div>
              </card>
          </div>
          <div class="col-12 col-md-4">
            <div class="card text-center" v-if="!loading">
              <div class="row">
                <div class="col-12 col-md-4" style="border-right: 1px solid #eee;">
                  <div class="card-header headerClasses">
                    <slot name="header">
                      <h4 class="card-title">Zimbabwe</h4>
                      <img src="/zimbabwe.png" style="width: 20px; margin-bottom: 5px;" />
                      <h3 class="card-title">{{ monthlyReport[monthlyReport.length - 1].zimbabweSeats }}</h3>
                    </slot>
                  </div>
                </div>
                <div class="col-12 col-md-4" style="border-right: 1px solid #eee;">
                  <div class="card-header headerClasses">
                    <slot name="header">
                      <h4 class="card-title">Costa Rica</h4>
                      <img src="/costa-rica.png" style="width: 20px; margin-bottom: 5px;" />
                      <h3 class="card-title">{{ monthlyReport[monthlyReport.length - 1].costaRicaSeats }}</h3>
                    </slot>
                  </div>
                </div>
                <div class="col-12 col-md-4">
                  <div class="card-header headerClasses">
                    <slot name="header">
                      <h4 class="card-title">Zambia</h4>
                      <img src="/zambia.png" style="width: 20px; margin-bottom: 5px;" />
                      <h3 class="card-title">{{ monthlyReport[monthlyReport.length - 1].zambiaSeats }}</h3>
                    </slot>
                  </div>
                </div>
              </div>
            </div>
            <div class="card" v-if="!loading">
              <h3 class="card-title p-4" style="font-weight: 100;">
                Seats By Industry
              </h3>
              <industry-pie-chart :data="activeClientList" v-if="!loading" />
            </div>
            <div class="card" v-if="!loading">
              <h3 class="card-title p-4" style="font-weight: 100;">
                {{ dsoData[1] }} DSOs
                <span style="float: right; font-size: 15px;">DSOs vs Single</span>
              </h3>
              <dso-pie-chart :data="dsoData" v-if="!loading" />
            </div>
          </div>
        </div>

        <div class="row" v-if="!loading">
          <div class="col-12">
            <card card-body-classes="table-full-width">
              <h4 slot="header" class="card-title">Salespersons</h4>
              <el-table :data="salespersonSummary">
                <el-table-column min-width="150" sortable label="Name" property="name"></el-table-column>
                <el-table-column min-width="100" sortable label="Total Seats" property="totalSeats"></el-table-column>
                <el-table-column max-width="50" sortable label="Clients" property="totalClients"></el-table-column>
                <el-table-column max-width="20" sortable label="Goal" property="goal"></el-table-column>
                <el-table-column max-width="30" sortable label="Forecast" property="forecast"></el-table-column>
                <el-table-column max-width="20" sortable align="right" header-align="right" label="Won"
                  property="won"></el-table-column>
              </el-table>
            </card>
          </div>
        </div>

        <div class="row" v-if="!loading">
          <div class="col-12 col-md-12">
            <card card-body-classes="table-full-width">
              <h4 slot="header" class="card-title">Top 10 Clients</h4>
              <el-table :data="tableData">
                <el-table-column min-width="150" sortable label="Name" property="name"></el-table-column>
                <el-table-column min-width="150" sortable label="Salesperson" property="salesperson"></el-table-column>
                <el-table-column min-width="150" sortable label="CSP" property="csp"></el-table-column>
                <el-table-column min-width="150" sortable label="Industry" property="industry"></el-table-column>
                <el-table-column max-width="50" sortable label="Tenure" property="tenure"></el-table-column>
                <el-table-column max-width="50" sortable label="Seats" property="totalSeats"></el-table-column>
                <el-table-column max-width="50" sortable align="right" header-align="right" label="Revenue"
                  property="revenue"></el-table-column>
              </el-table>
            </card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import LineChart from '@/components/Charts/LineChart';
import BarChart from '@/components/Charts/BarChart';
import SalesPieChart from '@/components/Charts/SalesPieChart.vue';
import IndustryPieChart from '@/components/Charts/IndustryPieChart.vue';
import DSOPieChart from '@/components/Charts/DSOPieChart.vue';
import * as chartConfigs from '@/components/Charts/config';
import TaskList from '@/components/Dashboard/TaskList';
import config from '@/config';
import { Table, TableColumn } from 'element-ui';
import statistics from '../assets/js/data.js';
import computations from '../assets/js/computations'

let bigChartLabels = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
let bigChartDatasetOptions = {
  fill: true,
  borderColor: config.colors.primary,
  borderWidth: 2,
  borderDash: [],
  borderDashOffset: 0.0,
  pointBackgroundColor: config.colors.primary,
  pointBorderColor: 'rgba(255,255,255,0)',
  pointHoverBackgroundColor: config.colors.primary,
  pointBorderWidth: 20,
  pointHoverRadius: 4,
  pointHoverBorderWidth: 15,
  pointRadius: 4,
}

export default {
  name: 'dashboard',
  components: {
    LineChart,
    BarChart,
    TaskList,
    [SalesPieChart.name]: SalesPieChart,
    [DSOPieChart.name]: DSOPieChart,
    [IndustryPieChart.name]: IndustryPieChart,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn
  },
  data() {
    return {
      byType: [],
      byCategory: [],
      activeClientList: [],
      avgTenure: 0,
      tableData: [{}],
      salespersonSummary: [{}],
      bigLineChart: {
        activeIndex: 0,
        chartData: {
          datasets: [{
            ...bigChartDatasetOptions,
            data: []
          }],
          labels: bigChartLabels
        },
        extraOptions: chartConfigs.purpleChartOptions,
        gradientColors: config.colors.primaryGradient,
        gradientStops: [1, 0.4, 0],
        categories: []
      },
      blueBarChart: {
        extraOptions: chartConfigs.barChartOptions,
        chartData: {
          labels: [],
          datasets: [
            {
              label: 'Salesperson',
              fill: true,
              borderColor: config.colors.info,
              borderWidth: 2,
              borderDash: [],
              borderDashOffset: 0.0,
              data: []
            }
          ]
        },
        gradientColors: config.colors.primaryGradient,
        gradientStops: [1, 0.4, 0]
      },
      purpleBarChart: {
        extraOptions: chartConfigs.barChartOptions,
        chartData: {
          labels: [],
          datasets: [
            {
              label: 'Salesperson',
              fill: true,
              borderColor: config.colors.info,
              borderWidth: 2,
              borderDash: [],
              borderDashOffset: 0.0,
              data: []
            }
          ]
        },
        gradientColors: config.colors.purpleGradient,
        gradientStops: [1, 0.4, 0]
      },
      date: new Date(),
      fetchedData: null,
      dsoData: [],
      loading: true,
      monthlyReport: [],
      thisMonthData: []
    };
  },
  computed: {
    enableRTL() {
      return this.$route.query.enableRTL;
    },
    isRTL() {
      return this.$rtl.isRTL;
    },
    bigLineChartCategories() {
      return [{ name: 'Revenue', icon: 'tim-icons icon-single-02' }, {
        name: 'Seats',
        icon: 'tim-icons icon-gift-2'
      }, { name: 'Clients', icon: 'tim-icons icon-tap-02' }];
    },
    today() {
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();

      today = mm + '/' + dd + '/' + yyyy;
      return today;
    },
  },
  methods: {
    initBigChart(index) {
      let chartData = {
        datasets: [{
          ...bigChartDatasetOptions,
          data: this.bigChartData[index]
        }],
        labels: bigChartLabels
      };
      this.$refs.bigChart.updateGradients(chartData);
      this.bigLineChart.chartData = chartData;
      this.bigLineChart.activeIndex = index;
    },
    setBigChartData() {
      let revenue = [];
      let seats = [];
      let clients = []

      for (const key in this.monthlyReport) {
        if (this.monthlyReport.hasOwnProperty(key)) {
          const value = this.monthlyReport[key];
          revenue[value.createdOn[1] - 1] = Math.ceil(value.totalRevenue);
          seats[value.createdOn[1] - 1] = value.totalSeats;
          clients[value.createdOn[1] - 1] = value.totalClients;
        }
      }

      this.bigChartData = [revenue, seats, clients];
      this.bigLineChart.chartData.datasets.data = this.bigChartData[0]
    },
    setAvgTenure() {
      let filteredData = this.activeClientList.filter(item => item.tenure !== null && !isNaN(item.tenure));

      if (filteredData.length === 0) {
        this.avgTenure = 0;
      } else {
        let totalTenure = filteredData.reduce((sum, item) => sum + item.tenure, 0);
        this.avgTenure = Math.ceil(totalTenure / filteredData.length);
      }
    },

    getTopTenClients(clients) {
      clients.sort((a, b) => b.totalSeats - a.totalSeats);
      let top10Clients = clients.slice(0, 10);
      top10Clients.forEach(client => {
        client.revenue = `$${Math.ceil(client.revenue)}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        client.tenure = this.formatDaysToYearsMonthsDays(client.tenure);
      });

      return top10Clients;
    },

    setClientsBySalesperson(clients) {
      let seats = 0;
      let salespersonData = {};
      clients.forEach(client => {
        seats = client.totalSeats + seats;
        let salesperson = client.salesperson;
        if (!salespersonData[salesperson]) {
          salespersonData[salesperson] = {
            name: salesperson,
            totalClients: 0,
            totalSeats: 0,
            totalRevenue: 0
          };
        }
        salespersonData[salesperson].totalClients++;
        salespersonData[salesperson].totalSeats += client.totalSeats;
        salespersonData[salesperson].totalRevenue += client.revenue;
      });

      console.log(seats)

      this.salespersonSummary = Object.values(salespersonData);
      this.salespersonSummary.sort((a, b) => b.totalSeats - a.totalSeats);
      this.salespersonSummary.forEach(salesperson => {
        salesperson.totalRevenue = Math.ceil(salesperson.totalRevenue);
        this.blueBarChart.chartData.labels.push(salesperson.name);
        this.blueBarChart.chartData.datasets[0].data.push(salesperson.totalSeats);

        this.purpleBarChart.chartData.labels.push(salesperson.name);
        this.purpleBarChart.chartData.datasets[0].data.push(salesperson.totalRevenue);
      })
    },

    formatDaysToYearsMonthsDays(totalDays) {
      const daysInYear = 365;
      const daysInMonth = 30;

      // Calculate years
      const years = Math.floor(totalDays / daysInYear);
      let remainingDays = totalDays % daysInYear;

      // Calculate months
      const months = Math.floor(remainingDays / daysInMonth);
      remainingDays = remainingDays % daysInMonth;

      // Remaining days
      const days = remainingDays;
      if (years > 0) {
        return `${years} years, ${months} months, ${days} days`;
      } else {
        return `${months} months, ${days} days`;
      }
    }
  },
  async mounted() {
    this.activeClientList = await statistics.getAllActiveClients();
    this.setClientsBySalesperson(this.activeClientList)
    this.tableData = this.getTopTenClients(this.activeClientList)
    this.setAvgTenure();
    this.fetchedData.sort(computations.compareCreatedOn);
    this.monthlyReport = computations.selectValidReports(this.fetchedData);
    
    this.monthlyReport.push(this.fetchedData[this.fetchedData.length - 1]);
    this.monthlyReport[this.monthlyReport.length - 1].totalClientFacing = this.monthlyReport[this.monthlyReport.length - 2].totalClientFacing + this.monthlyReport[this.monthlyReport.length - 1].seatedThisMonth - this.monthlyReport[this.monthlyReport.length - 1].lostSeatsThisMonth;
    this.monthlyReport[this.monthlyReport.length - 1].totalSeats = this.monthlyReport[this.monthlyReport.length - 1].totalClientFacing + this.monthlyReport[this.monthlyReport.length - 1].totalInternal;

    
    this.dsoData[0] = this.fetchedData[this.fetchedData.length - 1].totalSDDS - this.fetchedData[this.fetchedData.length - 1].totalDSOs;
    this.dsoData[1] = this.fetchedData[this.fetchedData.length - 1].totalDSOs;
    this.setBigChartData();
    this.initBigChart(0);
    this.loading = false;

  },

  async asyncData({ error }) {
    try {
      const response = await statistics.getAllReports();
      return { fetchedData: response };
    } catch (err) {
      error({ statusCode: 404, message: 'Data not found' });
    }
  },
}
</script>
<style>
.rectangle {
  height: 5px;
  width: 20px;
  border-radius: 2px;
  text-align: center;
  margin-top: 5px;
  float: left;
}

.legend {
  line-height: 1;
  float: left;
  margin-left: 5px;
  font-size: 11px;
  color: #a0a0a0 !important;
}

.color-black {
  color: black !important;
}
</style>
