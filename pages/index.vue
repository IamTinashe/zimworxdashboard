<template>
  <div class="row">
    <!-- Big Chart -->
    <div class="col-12">
      <div class="row" v-if="!loading">
        <div class="col-12">
          <scorecardnumbers :date="date" :allreports="fetchedData" v-if="fetchedData" />
        </div>
      </div>
      <div class="row" v-if="!loading && monthlyReport">
        <div class="col-6">
          <div class="card">
            <div class="row">
              <div class="col-4" style="border-right: 1px solid #eee;">
                <div class="card-header headerClasses">
                  <slot name="header">
                    <h4 class="card-title text-center">WARM Opportunities</h4>
                    <h3 class="card-title text-center py-0 my-0">{{ monthlyReport[monthlyReport.length - 1].warmLeads }}</h3>
                    <h3 class="card-category text-center mt-0 pt-0 pb-3 color-black">{{ monthlyReport[monthlyReport.length - 1].warmSeats }} Seats</h3>
                  </slot>
                </div>
              </div>
              <div class="col-4" style="border-right: 1px solid #eee;">
                <div class="card-header headerClasses">
                  <slot name="header">
                    <h4 class="card-title text-center">MILD Opportunities</h4>
                    <h3 class="card-title text-center py-0 my-0">{{ monthlyReport[monthlyReport.length - 1].mildLeads }}</h3>
                    <h3 class="card-category text-center mt-0 pt-0 pb-3 color-black">{{ monthlyReport[monthlyReport.length - 1].mildSeats }} Seats</h3>
                  </slot>
                </div>
              </div>
              <div class="col-4">
                <div class="card-header headerClasses">
                  <slot name="header">
                    <h4 class="card-title text-center">HOT Opportunities</h4>
                    <h3 class="card-title text-center py-0 my-0">{{ monthlyReport[monthlyReport.length - 1].hotLeads }}</h3>
                    <h3 class="card-category text-center mt-0 pt-0 pb-3 color-black">{{ monthlyReport[monthlyReport.length - 1].hotSeats }} Seats</h3>
                  </slot>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-6">
          <div class="card text-center">
            <div class="row pb-4">
              <div class="col-4" style="border-right: 1px solid #eee;">
                <div class="card-header headerClasses">
                  <slot name="header">
                    <h4 class="card-title">MTD Seats Won</h4>
                    <h3 class="card-title">{{ monthlyReport[monthlyReport.length - 1].seatedThisMonth }}</h3>
                  </slot>
                </div>
              </div>
              <div class="col-4" style="border-right: 1px solid #eee;">
                <div class="card-header headerClasses">
                  <slot name="header">
                    <h4 class="card-title">MTD Seats Lost</h4>
                    <h3 class="card-title">{{ monthlyReport[monthlyReport.length - 1].lostSeatsThisMonth }}</h3>
                  </slot>
                </div>
              </div>
              <div class="col-4">
                <div class="card-header headerClasses">
                  <slot name="header">
                    <h4 class="card-title">MTD Gained Seats</h4>
                    <h3 class="card-title">{{ monthlyReport[monthlyReport.length - 1].seatedThisMonth - monthlyReport[monthlyReport.length - 1].lostSeatsThisMonth }}</h3>
                  </slot>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-8">
          <card type="chart">
            <template slot="header">
              <div class="row">
                <div class="col-sm-6">
                  <h5 class="card-category">Seat and Revenue Stats</h5>
                  <h2 class="card-title">Growth Rate</h2>
                </div>
                <div class="col-sm-6 d-flex d-sm-block">
                  <div class="btn-group btn-group-toggle float-right" data-toggle="buttons">
                    <label v-for="(option, index) in bigLineChartCategories" :key="option.name"
                      class="btn btn-sm btn-primary btn-simple" :class="{ active: bigLineChart.activeIndex === index }"
                      :id="index" @click="initBigChart(index)">
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

          <div class="row">
            <div class="col-12">
              <card type="chart" v-if="!loading">
                <template slot="header">
                  <h5 class="card-category">This Month Seats</h5>
                  <h3 class="card-title">
                    <i class="tim-icons icon-bell-55 text-primary "></i>
                    {{ thisMonthData[thisMonthData.length - 1].seatedThisMonth }}
                    Seats<span style="float: right; font-size: 15px;">MTD Seats By Type</span>
                  </h3>
                </template>
                <div class="row">
                  <div class="col-10">

                    <div class="chart-area">
                      <line-chart style="height: 100%" :chart-data="purpleLineChart.chartData"
                        :gradient-colors="purpleLineChart.gradientColors"
                        :gradient-stops="purpleLineChart.gradientStops" :extra-options="purpleLineChart.extraOptions">
                      </line-chart>
                    </div>
                  </div>
                  <div class="col-2">
                    <div class="row mb-4" v-for="(item, index) in byType">
                      <div class="rectangle" :style="{ backgroundColor: item.color }"></div>
                      <p class="legend"> {{ item.number[item.number.length - 1] }} {{ item.label }}</p>
                    </div>
                  </div>
                </div>
              </card>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <card type="chart" v-if="!loading">
                <template slot="header">
                  <h5 class="card-category">This Month Seats</h5>
                  <h3 class="card-title">
                    <i class="tim-icons icon-bell-55 text-primary "></i> MTD Seats By Categories
                  </h3>
                </template>
                <div class="row">
                  <div class="col-10">
                    <div class="chart-area">
                      <line-chart style="height: 100%" :chart-data="greenLineChart.chartData"
                        :gradient-colors="greenLineChart.gradientColors" :gradient-stops="greenLineChart.gradientStops"
                        :extra-options="greenLineChart.extraOptions">
                      </line-chart>
                    </div>
                  </div>
                  <div class="col-2">
                    <div class="row mb-3" v-for="(item, index) in byCategory">
                      <div class="rectangle" :style="{ backgroundColor: item.color }"></div>
                      <p class="legend"> {{ item.number[item.number.length - 1] }} {{ item.label }}</p>
                    </div>
                  </div>
                </div>
              </card>
            </div>
          </div>
        </div>
        <div class="col-4">
          <div class="card text-center" v-if="!loading">
            <div class="row">
              <div class="col-4" style="border-right: 1px solid #eee;">
                <div class="card-header headerClasses">
                  <slot name="header">
                    <h4 class="card-title">Zimbabwe</h4>
                    <img src="/zimbabwe.png" style="width: 20px; margin-bottom: 5px;"/>
                    <h3 class="card-title">{{ monthlyReport[monthlyReport.length - 1].zimbabweSeats }}</h3>
                  </slot>
                </div>
              </div>
              <div class="col-4" style="border-right: 1px solid #eee;">
                <div class="card-header headerClasses">
                  <slot name="header">
                    <h4 class="card-title">Costa Rica</h4>
                    <img src="/costa-rica.png" style="width: 20px; margin-bottom: 5px;"/>
                    <h3 class="card-title">{{ monthlyReport[monthlyReport.length - 1].costaRicaSeats }}</h3>
                  </slot>
                </div>
              </div>
              <div class="col-4">
                <div class="card-header headerClasses">
                  <slot name="header">
                    <h4 class="card-title">Zambia</h4>
                    <img src="/zambia.png" style="width: 20px; margin-bottom: 5px;"/>
                    <h3 class="card-title">{{ monthlyReport[monthlyReport.length - 1].zambiaSeats }}</h3>
                  </slot>
                </div>
              </div>
            </div>
          </div>
          <div class="card">
            <h3 class="card-title p-4" style="font-weight: 100;">
              Seats By Industry
            </h3>
            <industry-pie-chart :data="activeClientList" v-if="!loading" />
          </div>
          <div class="card">
            <h3 class="card-title p-4" style="font-weight: 100;">
              {{ dsoData[1] }} DSOs
              <span style="float: right; font-size: 15px;">DSOs vs Single</span>
            </h3>
            <dso-pie-chart :data="dsoData" v-if="!loading" />
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-4" v-if="!loading">
          <card type="chart">
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
          <card type="chart">
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
        <div class="col-8">
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
        <div class="col-12">
          <card card-body-classes="table-full-width">
            <h4 slot="header" class="card-title">Top 10 Clients</h4>
            <el-table :data="tableData">
              <el-table-column min-width="150" sortable label="Name" property="name"></el-table-column>
              <el-table-column min-width="150" sortable label="Salesperson" property="salesperson"></el-table-column>
              <el-table-column min-width="150" sortable label="Industry" property="industry"></el-table-column>
              <el-table-column min-width="100" sortable label="Locations"
                property="numberOfLocations"></el-table-column>
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
      purpleLineChart: {
        extraOptions: chartConfigs.purpleChartOptions,
        chartData: {
          labels: [],
          datasets: []
        },
        gradientColors: config.colors.primaryGradient,
        gradientStops: [1, 0.2, 0]
      },
      greenLineChart: {
        extraOptions: chartConfigs.greenChartOptions,
        chartData: {
          labels: [],
          datasets: []
        },
        gradientColors: [
          'rgba(66,134,121,0.15)',
          'rgba(66,134,121,0.0)',
          'rgba(66,134,121,0)'
        ],
        gradientStops: [1, 0.4, 0]
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
    setMTDSeatsByRole(date) {
      let days = computations.getDaysInMonth(date.getMonth(), date.getFullYear());
      let labels = []
      for (let i = 1; i <= days; i++) { labels.push(i); }
      this.greenLineChart.chartData.labels = labels;

      this.thisMonthData = computations.selectThisMonthReports(this.fetchedData, date);

      let tempArray = [];
      let j = 0;
      for (let i = 1; i <= this.thisMonthData.length; i++) {
        if (this.thisMonthData[j].createdOn[2] == i && j < this.thisMonthData.length) {
          tempArray[i - 1] = this.thisMonthData[j];
          j++;
        } else {
          tempArray[i - 1] = this.thisMonthData[0];
        }
      }

      this.thisMonthData = tempArray;
      this.greenLineChart.extraOptions.scales.yAxes[0].ticks.suggestedMax = this.thisMonthData[this.thisMonthData.length - 1].seatedThisMonth;

      let totalClosedSDDSThisMonth = [];
      let totalClosedRCMThisMonth = [];
      let totalClosedEAThisMonth = [];
      let totalClosedBusDevThisMonth = [];
      let totalClosedUKThisMonth = [];
      let totalSeats = [];
      let count = 0;
      let seatData = [];

      for (const key in this.thisMonthData) {
        if (this.thisMonthData.hasOwnProperty(key)) {
          const value = this.thisMonthData[key];
          totalClosedSDDSThisMonth.push(this.thisMonthData[count].totalClosedSDDSThisMonth);
          totalClosedRCMThisMonth.push(this.thisMonthData[count].totalClosedRCMThisMonth);
          totalClosedEAThisMonth.push(this.thisMonthData[count].totalClosedEAThisMonth);
          totalClosedBusDevThisMonth.push(this.thisMonthData[count].totalClosedBusDevThisMonth);
          totalClosedUKThisMonth.push(this.thisMonthData[count].totalClosedUKThisMonth);
          totalSeats.push(this.thisMonthData[count].seatedThisMonth)
          count++;
        }
      }

      seatData.push({ number: totalSeats, label: "Total Seats", color: config.colors.primary })
      seatData.push({ number: totalClosedSDDSThisMonth, label: "SDDS", color: "#FFCE56" })
      seatData.push({ number: totalClosedRCMThisMonth, label: "RCM", color: "#36A2EB" })
      seatData.push({ number: totalClosedEAThisMonth, label: "EA", color: "#FF9900" })
      seatData.push({ number: totalClosedBusDevThisMonth, label: "Bus. Dev.", color: "#9966CC" })
      seatData.push({ number: totalClosedUKThisMonth, label: "UK", color: "#FF6384" })


      this.byCategory = seatData;

      let i = 0;
      for (i = 0; i < seatData.length; i++) {
        this.greenLineChart.chartData.datasets.push({
          label: seatData[i].label,
          fill: true,
          borderColor: seatData[i].color,
          borderWidth: 2,
          borderDash: [],
          borderDashOffset: 0.0,
          pointBackgroundColor: seatData[i].color,
          pointBorderColor: 'rgba(255,255,255,0)',
          pointHoverBackgroundColor: seatData[i].color,
          pointBorderWidth: 10,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 15,
          pointRadius: 1,
          data: seatData[i].number
        });
      }
    },

    setMTDSeatsByCategory(date) {
      let days = computations.getDaysInMonth(date.getMonth(), date.getFullYear());
      let labels = []
      for (let i = 1; i <= days; i++) { labels.push(i); }
      this.purpleLineChart.chartData.labels = labels;

      this.thisMonthData = computations.selectThisMonthReports(this.fetchedData, date);

      let tempArray = [];
      let j = 0;
      for (let i = 1; i <= this.thisMonthData.length; i++) {
        if (this.thisMonthData[j].createdOn[2] == i && j < this.thisMonthData.length) {
          tempArray[i - 1] = this.thisMonthData[j];
          j++;
        } else {
          tempArray[i - 1] = this.thisMonthData[0];
        }
      }

      this.thisMonthData = tempArray;
      this.purpleLineChart.extraOptions.scales.yAxes[0].ticks.suggestedMax = this.thisMonthData[this.thisMonthData.length - 1].seatedThisMonth;

      let newSeats = [];
      let additionalSeats = [];
      let replacements = [];
      let internal = [];
      let totalSeats = [];
      let count = 0;
      let seatData = [];

      for (const key in this.thisMonthData) {
        if (this.thisMonthData.hasOwnProperty(key)) {
          const value = this.thisMonthData[key];
          newSeats.push(this.thisMonthData[count].totalClosedNewSeatsThisMonth);
          additionalSeats.push(this.thisMonthData[count].totalClosedAdditionalSeatsThisMonth)
          replacements.push(this.thisMonthData[count].totalClosedReplacementSeatsThisMonth)
          internal.push(this.thisMonthData[count].totalClosedInternalSeatsThisMonth)
          totalSeats.push(this.thisMonthData[count].seatedThisMonth)
          count++;
        }
      }

      seatData.push({ number: totalSeats, label: "Total Seats", color: config.colors.primary })
      seatData.push({ number: newSeats, label: "New Seats", color: "#9966CC" })
      seatData.push({ number: additionalSeats, label: "Additional Seats", color: "#FF6347" })
      seatData.push({ number: replacements, label: "Replacement Seats", color: "#FF8C00" })
      seatData.push({ number: internal, label: "Internal Seats", color: "#87CEEB" })


      this.byType = seatData;

      let i = 0;
      for (i = 0; i < seatData.length; i++) {
        this.purpleLineChart.chartData.datasets.push({
          label: seatData[i].label,
          fill: true,
          borderColor: seatData[i].color,
          borderWidth: 2,
          borderDash: [],
          borderDashOffset: 0.0,
          pointBackgroundColor: seatData[i].color,
          pointBorderColor: 'rgba(255,255,255,0)',
          pointHoverBackgroundColor: seatData[i].color,
          pointBorderWidth: 10,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 15,
          pointRadius: 1,
          data: seatData[i].number
        });
      }
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
      });

      return top10Clients;
    },

    setClientsBySalesperson(clients) {
      let salespersonData = {};
      clients.forEach(client => {
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

      this.salespersonSummary = Object.values(salespersonData);
      this.salespersonSummary.sort((a, b) => b.totalSeats - a.totalSeats);
      this.salespersonSummary.forEach(salesperson => {
        salesperson.totalRevenue = Math.ceil(salesperson.totalRevenue);
        this.blueBarChart.chartData.labels.push(salesperson.name);
        this.blueBarChart.chartData.datasets[0].data.push(salesperson.totalSeats);

        this.purpleBarChart.chartData.labels.push(salesperson.name);
        this.purpleBarChart.chartData.datasets[0].data.push(salesperson.totalRevenue);
      })
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
    this.dsoData[0] = this.fetchedData[this.fetchedData.length - 1].totalSDDS - this.fetchedData[this.fetchedData.length - 1].totalDSOs;
    this.dsoData[1] = this.fetchedData[this.fetchedData.length - 1].totalDSOs;
    this.setBigChartData();
    this.setMTDSeatsByCategory(this.date);
    this.setMTDSeatsByRole(this.date);
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

.color-black{
  color: black !important;
}
</style>
