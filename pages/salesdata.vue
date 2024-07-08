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
              <h3 class="card-title" style="color: #000;">{{ selectedPeriod }}</h3>
            </div>
          </div>
          <div class="col-md-4"></div>
          <div class="col-md-2 col-12">
            <v-btn :color="defaultColor" class="mb-3" @click="dialogForStart = true">Start Month</v-btn>
            <v-dialog v-model="dialogForStart" max-width="300" class="elevation-1 mt-0">
              <v-card>
                <v-card-title class="headline">Select a Month</v-card-title>
                <v-card-text>
                  <v-date-picker v-model="startDate" :allowed-dates="allowedDates" :min="minDate" :max="maxDate"
                    class="mt-4" type="month" />
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn :color="defaultColor" @click="dialogForStart = false">OK</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </div>
          <div class="col-md-2 col-12">
            <v-btn :color="defaultColor" class="mb-3" @click="dialogForEnd = true">End Month</v-btn>
            <v-dialog v-model="dialogForEnd" max-width="300" class="elevation-1 mt-0">
              <v-card>
                <v-card-title class="headline">Select a Month</v-card-title>
                <v-card-text>
                  <v-date-picker v-model="endDate" :allowed-dates="allowedDates" :min="minDate" :max="maxDate"
                    class="mt-4" type="month" />
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn :color="defaultColor" @click="dialogForEnd = false">OK</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </div>
        </div>
      </div>
      <div class="col-12" v-if="monthlyReport.length && error.length <= 0">
        <div class="row">
          <div class="col-12">
            <div class="card pb-3">
              <div class="row">
                <div class="col-12 col-md-4">
                  <div class="card-header headerClasses">
                    <slot name="header">
                      <h4 class="card-title text-center">Total Seats</h4>
                      <h3 class="card-title text-center py-0 my-0">{{ totalSeatsWon }} Seats</h3>
                    </slot>
                  </div>
                </div>
                <v-divider class="mx-4" inset vertical></v-divider>
                <div class="col-12 col-md-2">
                  <div class="card-header headerClasses">
                    <slot name="header">
                      <h4 class="card-title text-center">New Seats</h4>
                      <h3 class="card-title text-center py-0 my-0">{{ totalNewWon }} Seats</h3>
                    </slot>
                  </div>
                </div>
                <v-divider class="mx-4" inset vertical></v-divider>
                <div class="col-12 col-md-2">
                  <div class="card-header headerClasses">
                    <slot name="header">
                      <h4 class="card-title text-center">Additional Seats</h4>
                      <h3 class="card-title text-center py-0 my-0">{{ totalAdditionalWon }} Seats</h3>
                    </slot>
                  </div>
                </div>
                <v-divider class="mx-4" inset vertical></v-divider>
                <div class="col-12 col-md-2">
                  <div class="card-header headerClasses">
                    <slot name="header">
                      <h4 class="card-title text-center">Replacement Seats</h4>
                      <h3 class="card-title text-center py-0 my-0">{{ totalReplacementWon }} Seats</h3>
                    </slot>
                  </div>
                </div>
              </div>
            </div>
            <div class="card pb-3">
              <div class="row">
                <div class="col-12 col-md-3">
                  <div class="card-header headerClasses">
                    <slot name="header">
                      <h4 class="card-title text-center">Top Industry</h4>
                      <h3 class="card-title text-center py-0 my-0">{{ topIndustry.name }}</h3>
                      <h4 class="card-title text-center mt-0 pt-0 pb-3 color-black">{{ topIndustry.seats }} Seats</h4>
                    </slot>
                  </div>
                </div>
                <div class="col-12 col-md-3">
                  <div class="card-header headerClasses">
                    <slot name="header">
                      <h4 class="card-title text-center">Top Category</h4>
                      <h3 class="card-title text-center py-0 my-0">{{ topCategory.name }}</h3>
                      <h4 class="card-title text-center mt-0 pt-0 pb-3 color-black">{{ topCategory.seats }} Seats</h4>
                    </slot>
                  </div>
                </div>
                <div class="col-12 col-md-3">
                  <div class="card-header headerClasses">
                    <slot name="header">
                      <h4 class="card-title text-center">Top Salesperson</h4>
                      <h3 class="card-title text-center py-0 my-0">{{ topSalesperson.name }}</h3>
                      <h4 class="card-title text-center mt-0 pt-0 pb-3 color-black">{{ topSalesperson.seats }} Seats
                      </h4>
                    </slot>
                  </div>
                </div>
                <div class="col-12 col-md-3">
                  <div class="card-header headerClasses">
                    <slot name="header">
                      <h4 class="card-title text-center">Top Client</h4>
                      <h3 class="card-title text-center py-0 my-0">{{ topClient.name }}</h3>
                      <h4 class="card-title text-center mt-0 pt-0 pb-3 color-black">{{ topClient.seats }} Seats</h4>
                    </slot>
                  </div>
                </div>
              </div>
            </div>
            <div class="card text-center py-5">
              <div class="row">
                <div class="col-12 col-md-4">
                  <h3 class="card-title">Seats By Salespeople</h3>
                  <div id="chart">
                    <apexchart type="donut" style="width: 100%;" ref="apexChartSalespeople"
                      :options="donutSalespeople.chartOptions" :series="donutSalespeople.series"
                      @dataPointSelection="openModalForSalesPie" />
                  </div>
                </div>
                <div class="col-12 col-md-4">
                  <h3 class="card-title">Seats By Category</h3>
                  <div id="chart">
                    <apexchart type="donut" style="width: 100%;" ref="apexChartSeatCategory"
                      :options="donutSeatCategory.chartOptions" :series="donutSeatCategory.series"
                      @dataPointSelection="openModalForCategoryPie" />
                  </div>
                </div>
                <div class="col-12 col-md-4">
                  <h3 class="card-title">Seats By Industry</h3>
                  <div id="chart">
                    <apexchart type="donut" style="width: 100%;" ref="apexChartIndustryType"
                      :options="donutIndustryType.chartOptions" :series="donutIndustryType.series"
                      @dataPointSelection="openModalForIndustryPie" />
                  </div>
                </div>
              </div>

            </div>
            <div class="card text-center py-5">
              <div class="row">
                <div class="col-12">
                  <h3 class="card-title text-left px-3">Actual vs Forecast vs Goal</h3>
                  <apexchart type="bar" height="500" ref="apexChartActualForecast"
                    :options="actualForecast.chartOptions" :series="actualForecast.chartSeries" />
                </div>
              </div>
            </div>
            <v-data-table :headers="headers" :items="summarizedData" class="elevation-1" @click:row="openModal">
              <template v-slot:top>
                <v-toolbar flat>
                  <v-toolbar-title>Sales Summary</v-toolbar-title>
                  <v-divider class="mx-4" inset vertical></v-divider>
                </v-toolbar>
              </template>
            </v-data-table>
            <v-dialog v-model="isModalOpen" min-width="800px">
              <v-card>
                <v-card-title>
                  <span class="headline">{{ selectedSalesPerson.salesPerson }}</span>
                </v-card-title>
                <v-card-text>
                  <v-data-table :headers="modalHeaders" :items="filteredSalesData" @click:row="openOpportunity"
                    class="elevation-1"></v-data-table>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="isModalOpen = false">
                    Close
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </div>
        </div>
      </div>
      <div class="col-12" v-else>
        <div class="row">
          <div class="col-12">
            <div class="card text-center py-5">
              <h3 class="card-title">{{ error }}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import statistics from "../assets/js/data.js";

export default {
  name: "salesdata",
  data() {
    return {
      selectedPeriod: [],
      forecastActual: [],
      defaultColor: '#42b883',
      dialogForStart: false,
      dialogForEnd: false,
      minDate: "2021-01",
      maxDate: this.getFormattedDate(),
      startDate: this.getFormattedDate(),
      endDate: this.getFormattedDate(),
      loading: true,
      allOpportunites: [],
      monthlyReport: [],
      totalSeatsWon: 0,
      totalAdditionalWon: 0,
      totalNewWon: 0,
      totalReplacementWon: 0,
      topSalesperson: {
        name: "",
        seats: 0
      },
      topCategory: {
        name: "",
        seats: 0
      },
      topClient: {
        name: "",
        seats: 0
      },
      topIndustry: {
        name: "",
        seats: 0
      },
      headers: [
        { text: "Salesperson", value: "salesPerson" },
        { text: "Total Seats Won", value: "totalSeats" },
        { text: "New Seats", value: "newSeats" },
        { text: "Additional Seats", value: "additionalSeats" },
        { text: "Replacement Seats", value: "replacementSeats" },
        { text: "Prospective Clients", value: "prospectiveClients" },
      ],
      modalHeaders: [
        { text: "Company", value: "company" },
        { text: "Salesperson", value: "salesPerson" },
        { text: "Category", value: "seatCategory" },
        { text: "Seats", value: "seatCount" },
        { text: "Industry", value: "industryType" },
        { text: "Seat Type", value: "seatType" },
        { text: "Client Type", value: "clientType" },
        { text: "Days To Close", value: "totalTimeToClose" },
        { text: "Start Date", value: "startDate" },
      ],
      summarizedData: [],
      isModalOpen: false,
      selectedSalesPerson: {},
      filteredSalesData: [],
      donutSalespeople: {
        series: [],
        chartOptions: {
          chart: {
            type: 'donut'
          },
          labels: [],
          colors: ['#FF6384', '#36A2EB', '#FFCE56', '#FF9900', '#33FF99', '#9966CC', '#FF69B4', '#00CED1', '#FF6347', '#8A2BE2', '#20B2AA', '#FFA07A'],
          responsive: [{
            breakpoint: 480,
            options: {
              chart: {
                width: 200
              },
              legend: {
                position: 'bottom'
              }
            }
          }],
          legend: {
            position: 'bottom',
            formatter: function (seriesName, opts) {
              return [seriesName, " - ", opts.w.globals.series[opts.seriesIndex]].join('');
            }
          }
        }
      },
      donutSeatCategory: {
        series: [],
        chartOptions: {
          chart: {
            type: 'donut'
          },
          labels: [],
          responsive: [{
            breakpoint: 480,
            options: {
              chart: {
                width: 300
              },
              legend: {
                position: 'bottom'
              }
            }
          }],
          legend: {
            position: 'bottom',
            formatter: function (seriesName, opts) {
              return [seriesName, " - ", opts.w.globals.series[opts.seriesIndex]].join('');
            }
          }
        }
      },
      donutIndustryType: {
        series: [],
        chartOptions: {
          chart: {
            type: 'donut'
          },
          labels: [],
          colors: ['#DA70D6', '#87CEEB', '#FF8C00', '#00FF00', '#33FF99', '#9966CC', '#00CED1', '#FF6347', '#FF69B4', '#8A2BE2', '#20B2AA', '#FFA07A'],
          responsive: [{
            breakpoint: 480,
            options: {
              chart: {
                width: 300
              },
              legend: {
                position: 'bottom'
              }
            }
          }],
          legend: {
            position: 'bottom',
            formatter: function (seriesName, opts) {
              return [seriesName, " - ", opts.w.globals.series[opts.seriesIndex]].join('');
            }
          }
        }
      },
      actualForecast: {
        chartOptions: {
          chart: {
            type: 'bar',
            height: 350,
          },
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: '55%',
              endingShape: 'rounded',
            },
          },
          dataLabels: {
            enabled: false,
          },
          stroke: {
            show: true,
            width: 2,
            colors: ['transparent'],
          },
          xaxis: {
            categories: [],
          },
          yaxis: {
            title: {
              text: 'Seats Won',
            },
          },
          fill: {
            opacity: 1,
          },
          tooltip: {
            y: {
              formatter: function (val) {
                return val
              },
            },
          },
        },
        chartSeries: [],
      },
      error: ""
    };
  },
  watch: {
    startDate(date) {
      this.generateReport(date, this.endDate);
    },
    endDate(date) {
      this.generateReport(this.startDate, date);
    },
    'donutSalespeople.series': {
      handler(newSeries) {
        if (this.$refs.apexChartSalespeople) {
          this.$refs.apexChartSalespeople.updateSeries(newSeries);
          this.$refs.apexChartSalespeople.updateOptions({ labels: this.donutSalespeople.chartOptions.labels });
        }
      },
      deep: true
    },
    'donutSeatCategory.series': {
      handler(newSeries) {
        if (this.$refs.apexChartSeatCategory) {
          this.$refs.apexChartSeatCategory.updateSeries(newSeries);
          this.$refs.apexChartSeatCategory.updateOptions({ labels: this.donutSeatCategory.chartOptions.labels });
        }
      },
      deep: true
    },
    'donutIndustryType.series': {
      handler(newSeries) {
        if (this.$refs.apexChartIndustryType) {
          this.$refs.apexChartIndustryType.updateSeries(newSeries);
          this.$refs.apexChartIndustryType.updateOptions({ labels: this.donutIndustryType.chartOptions.labels });
        }
      },
      deep: true
    },
    'actualForecast.chartSeries': {
      handler(newSeries) {
        if (this.$refs.apexChartActualForecast) {
          this.$refs.apexChartActualForecast.updateSeries(newSeries);
        }
      },
      deep: true
    },
    'actualForecast.chartOptions.xaxis.categories': {
      handler(newCategories) {
        if (this.$refs.apexChartActualForecast) {
          this.$refs.apexChartActualForecast.updateOptions({
            xaxis: {
              categories: newCategories
            }
          });
        }
      },
      deep: true
    }
  },
  methods: {
    allowedDates: val => true,
    getFormattedDate() {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    dateConvertor: (date) => {
      let formattedDate = new Date(date * 1000);
      let dayOfMonth = formattedDate.getDate();
      let month = formattedDate.getMonth() + 1;
      let year = formattedDate.getFullYear();
      let formattedDayOfMonth = dayOfMonth < 10 ? '0' + dayOfMonth : dayOfMonth;
      let formattedMonth = month < 10 ? '0' + month : month;

      return `${formattedMonth}-${formattedDayOfMonth}-${year}`;
    },
    getSelectedPeriod(startDate, endDate) {
      let [startYear, startMonth] = startDate.split('-');
      let [endYear, endMonth] = endDate.split('-');

      let monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];

      let startMonthIndex = parseInt(startMonth, 10) - 1;
      let endMonthIndex = parseInt(endMonth, 10) - 1;

      this.selectedPeriod = monthNames[startMonthIndex] + " " + startYear + " - " + monthNames[endMonthIndex] + " " + endYear;
    },
    filterByClosedMonthYear(data, startMonth, startYear, endMonth, endYear) {
      return data.filter(item => {
        if (item.startDate && (item.stage == "Closed Won" || item.stage == "Payments" || item.stage == "Billing")) {
          item.startDate += 5 * 3600;
          let startDate = new Date(item.startDate * 1000);

          return startDate.getMonth() <= endMonth && startDate.getFullYear() <= endYear && startDate.getMonth() >= startMonth && startDate.getFullYear() >= startYear;
        }
        return false;
      });
    },
    getMonthFromString(dateString) {
      const parts = dateString.split("-");
      const month = parseInt(parts[1], 10);
      return month - 1;
    },
    openOpportunity: (item) => {
      const url = `https://zimworx.odoo.com/web?#id=${item.id}&menu_id=255&cids=2&action=380&model=crm.lead&view_type=form`;
      window.open(url, '_blank');
    },
    getYearFromString(dateString) {
      const parts = dateString.split('-');
      if (parts.length >= 1) {
        return parseInt(parts[0]);
      } else {
        return null;
      }
    },
    filterBySeatCount: (data) => {
      return data.filter(item => item.seatCount !== 0);
    },
    summarizeData(salesData) {
      const summary = {};
      this.totalAdditionalWon = 0;
      this.totalReplacementWon = 0;
      this.totalNewWon = 0;

      salesData.forEach(entry => {
        let salesperson = entry.salesPerson;
        if (!summary[salesperson]) {
          summary[salesperson] = {
            salesPerson: salesperson,
            additionalSeats: 0,
            replacementSeats: 0,
            newSeats: 0,
            totalSeats: 0,
            prospectiveClients: 0
          };
        }

        summary[salesperson].totalSeats += entry.seatCount;


        if (entry.seatType === "Additional Seats") {
          summary[salesperson].additionalSeats += entry.seatCount;
        } else if (entry.seatType === "Replacement Seats") {
          summary[salesperson].replacementSeats += entry.seatCount;
          this.totalReplacementWon += entry.seatCount;
        } else if (entry.seatType === "New Seats") {
          summary[salesperson].newSeats += entry.seatCount;
          this.totalNewWon += entry.seatCount;
        }

        if (entry.clientType === "Prospective") {
          summary[salesperson].prospectiveClients++;
        }
      });

      this.summarizedData = Object.values(summary)
        .map(item => {
          item.totalSeats = item.totalSeats - item.replacementSeats;
          return item;
        })
        .filter(item => item.totalSeats > 0)
        .sort((a, b) => b.totalSeats - a.totalSeats);

      this.topSalesperson.name = this.summarizedData[0].salesPerson;
      this.topSalesperson.seats = this.summarizedData[0].totalSeats;

      this.totalSeatsWon = this.summarizedData.reduce(
        (sum, entry) => sum + entry.totalSeats,
        0
      );
      this.totalAdditionalWon = this.summarizedData.reduce(
        (sum, entry) => sum + entry.additionalSeats,
        0
      );
    },

    actualForecashChart(data) {
      let parts = this.selectedPeriod.split(' ');
      let monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];

      let startMonth = monthNames.indexOf(parts[0]);
      let startYear = parts[1];
      let endMonth = monthNames.indexOf(parts[3]);
      let endYear = parts[4];

      let filteredData = data.filter(item => {
        const itemDate = new Date(item.year, item.month - 1);
        const startDate = new Date(startYear, startMonth);
        const endDate = new Date(endYear, endMonth);

        return itemDate >= startDate && itemDate <= endDate;
      });

      const salespersons = [...new Set(filteredData.map(item => item.salesperson))];
      const actual = salespersons.map(salesperson => {
        return filteredData
          .filter(item => item.salesperson === salesperson)
          .reduce((sum, item) => sum + item.actual, 0);
      });

      const goal = salespersons.map(salesperson => {
        return filteredData
          .filter(item => item.salesperson === salesperson)
          .reduce((sum, item) => sum + item.goal, 0);
      });

      const forecasted = salespersons.map(salesperson => {
        return filteredData
          .filter(item => item.salesperson === salesperson)
          .reduce((sum, item) => sum + item.forecasted, 0);
      });

      // Combine salespersons, actual, goal, and forecasted into a single array for sorting
      const combined = salespersons.map((salesperson, index) => {
        return {
          salesperson,
          actual: actual[index],
          goal: goal[index],
          forecasted: forecasted[index]
        };
      });

      // Sort combined array by goal
      combined.sort((a, b) => b.actual - a.actual);

      // Separate sorted data back into individual arrays
      const sortedSalespersons = combined.map(item => item.salesperson);
      const sortedActual = combined.map(item => item.actual);
      const sortedGoal = combined.map(item => item.goal);
      const sortedForecasted = combined.map(item => item.forecasted);

      // Calculate total sums
      const totalActual = sortedActual.reduce((sum, value) => sum + value, 0);
      const totalGoal = sortedGoal.reduce((sum, value) => sum + value, 0);
      const totalForecasted = sortedForecasted.reduce((sum, value) => sum + value, 0);

      // Append "Total" to salespersons and total sums to respective arrays
      sortedSalespersons.push("Total");
      sortedActual.push(totalActual);
      sortedGoal.push(totalGoal);
      sortedForecasted.push(totalForecasted);

      this.actualForecast.chartOptions.xaxis.categories = sortedSalespersons;

      this.actualForecast.chartOptions = {
        ...this.actualForecast.chartOptions,
        xaxis: {
          categories: sortedSalespersons
        },
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return val.toFixed(0);
          }
        },
        plotOptions: {
          bar: {
            dataLabels: {
              position: 'top'
            }
          }
        },
      };

      this.actualForecast.chartSeries = [
        { name: 'Actual', data: sortedActual },
        { name: 'Forecast (Beginning of the month)', data: sortedForecasted },
        { name: 'Goal', data: sortedGoal },
      ];
    },
    openModal(item) {
      this.selectedSalesPerson = item;
      this.filteredSalesData = this.monthlyReport.filter(
        entry => entry.salesPerson === item.salesPerson && entry.seatType !== "Replacement Seats"
      );
      this.filteredSalesData = this.filteredSalesData.map(item => ({
        ...item,
        closedDate: this.dateConvertor(item.closedDate),
        startDate: this.dateConvertor(item.startDate),
        seatCategory: item.seatCategory == 'SDDS' ? 'Dental Coordinator' : item.seatCategory
      }));


      this.isModalOpen = true;
    },

    openModalForSalesPie(event, chartContext, config) {
      this.selectedSalesPerson = this.donutSalespeople.chartOptions.labels[config.dataPointIndex];
      this.filteredSalesData = this.monthlyReport.filter(
        entry => entry.salesPerson === this.selectedSalesPerson && entry.seatType !== "Replacement Seats"
      );
      this.filteredSalesData = this.filteredSalesData.map(item => ({
        ...item,
        closedDate: this.dateConvertor(item.closedDate),
        startDate: this.dateConvertor(item.startDate),
        seatCategory: item.seatCategory == 'SDDS' ? 'Dental Coordinator' : item.seatCategory
      }));

      this.isModalOpen = true;
    },

    openModalForCategoryPie(event, chartContext, config) {
      let category = this.donutSeatCategory.chartOptions.labels[config.dataPointIndex];
      category = category == 'Dental Coordinator' ? 'SDDS' : category;
      this.filteredSalesData = this.monthlyReport.filter(
        entry => entry.seatCategory === category && entry.seatType !== "Replacement Seats"
      );
      this.filteredSalesData = this.filteredSalesData.map(item => ({
        ...item,
        closedDate: this.dateConvertor(item.closedDate),
        startDate: this.dateConvertor(item.startDate),
        seatCategory: item.seatCategory == 'SDDS' ? 'Dental Coordinator' : item.seatCategory
      }));

      this.isModalOpen = true;
    },

    openModalForIndustryPie(event, chartContext, config) {
      let industry = this.donutIndustryType.chartOptions.labels[config.dataPointIndex];
      this.filteredSalesData = this.monthlyReport.filter(
        entry => entry.industryType === industry && entry.seatType !== "Replacement Seats"
      );
      this.filteredSalesData = this.filteredSalesData.map(item => ({
        ...item,
        closedDate: this.dateConvertor(item.closedDate),
        startDate: this.dateConvertor(item.startDate),
        seatCategory: item.seatCategory == 'SDDS' ? 'Dental Coordinator' : item.seatCategory
      }));

      this.isModalOpen = true;
    },

    dataToDonut(data) {
      let salespersons = [];
      let totalSeats = [];

      data.forEach(value => {
        if (value.seatType != "Replacement Seats") {
          salespersons.push(value.salesPerson);
          totalSeats.push(value.totalSeats);
        }
      });

      this.donutSalespeople.chartOptions.labels = salespersons;
      this.donutSalespeople.series = totalSeats;
    },

    groupSeatCategoryBySeatCount(data) {
      let groupedData = {};
      this.donutSeatCategory.chartOptions.labels = [];
      this.donutSeatCategory.series = [];

      data.forEach(item => {
        let { seatCategory, seatCount } = item;
        if (item.seatType != "Replacement Seats") {
          if (groupedData[seatCategory]) {
            groupedData[seatCategory] += seatCount;
          } else {
            groupedData[seatCategory] = seatCount;
          }
        }
      });

      let result = Object.keys(groupedData).map(category => ({
        seatCategory: category,
        totalSeats: groupedData[category]
      }));
      result.sort((a, b) => b.totalSeats - a.totalSeats);

      result.forEach(value => {
        this.donutSeatCategory.chartOptions.labels.push(value.seatCategory);
        this.donutSeatCategory.series.push(value.totalSeats);
      });
      if (this.donutSeatCategory.chartOptions && this.donutSeatCategory.chartOptions.labels) {
        this.donutSeatCategory.chartOptions.labels = this.donutSeatCategory.chartOptions.labels.map(label => {
          return label === 'SDDS' ? 'Dental Coordinator' : label;
        });
      }
      this.topCategory.name = result[0].seatCategory == 'SDDS' ? 'Dental Coordinator' : result[0].seatCategory;
      this.topCategory.seats = result[0].totalSeats;
    },

    groupSeatIndustryBySeatCount(data) {
      let groupedData = {};
      this.donutIndustryType.chartOptions.labels = [];
      this.donutIndustryType.series = [];

      data.forEach(item => {
        let { industryType, seatCount } = item;
        if (item.seatType != "Replacement Seats") {
          if (groupedData[industryType]) {
            groupedData[industryType] = groupedData[industryType] + seatCount;
          } else {
            groupedData[industryType] = seatCount;
          }
        }
      });

      let result = Object.keys(groupedData).map(category => ({
        IndustryType: category,
        totalSeats: groupedData[category]
      }));
      result.sort((a, b) => b.totalSeats - a.totalSeats);

      result.forEach(value => {
        this.donutIndustryType.chartOptions.labels.push(value.IndustryType);
        this.donutIndustryType.series.push(value.totalSeats);
      });
      this.topIndustry.name = result[0].IndustryType;
      this.topIndustry.seats = result[0].totalSeats;
    },
    getCompanyWithHighestSeats(data) {
      let seatCounts = {};
      data.forEach(item => {
        let { company, seatCount } = item;
        if (seatCounts[company]) {
          seatCounts[company] += seatCount;
        } else {
          seatCounts[company] = seatCount;
        }
      });

      let maxSeats = 0;
      let topCompany = "";

      for (let company in seatCounts) {
        if (seatCounts[company] > maxSeats) {
          maxSeats = seatCounts[company];
          topCompany = company;
        }
      }

      this.topClient.name = topCompany;
      this.topClient.seats = maxSeats;
    },
    generateReport(startDate, endDate) {
      this.loading = true;
      this.error = "";

      startDate = startDate.length <= 7 ? startDate + "-28" : startDate;
      endDate = endDate.length <= 7 ? endDate + "-28" : endDate;
      let start = new Date(startDate);
      let end = new Date(endDate);

      if (end < start) {
        this.error = "End date must be after Start date";
        this.loading = false;
      } else {

        let endMonth = this.getMonthFromString(endDate);
        let endYear = this.getYearFromString(endDate);

        let startMonth = this.getMonthFromString(startDate);
        let startYear = this.getYearFromString(startDate);

        this.getSelectedPeriod(startDate, endDate);
        let data = this.filterByClosedMonthYear(this.allOpportunites, startMonth, startYear, endMonth, endYear);
        this.monthlyReport = this.filterBySeatCount(data);

        if (this.monthlyReport.length > 0) {
          this.getCompanyWithHighestSeats(this.monthlyReport);
          this.summarizeData(this.monthlyReport);
          this.groupSeatCategoryBySeatCount(this.monthlyReport);
          this.groupSeatIndustryBySeatCount(this.monthlyReport);
          this.actualForecashChart(this.forecastActual);
          this.dataToDonut(this.summarizedData);
        } else {
          this.error = "There is no data for the selected period";
        }
      }

      this.loading = false;
    }
  },
  async mounted() {
    this.allOpportunites = await statistics.getAllOpportunities();
    this.forecastActual = await statistics.getSalesStats(2024);
    this.generateReport(this.startDate, this.endDate);
    this.loading = false;
  }
};
</script>

<style scoped>
.elevation-1 {
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}

.v-dialog__container {
  display: block !important;
}
</style>
