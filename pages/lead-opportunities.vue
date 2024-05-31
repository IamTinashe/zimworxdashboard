<template>
  <div class="container-fluid">
    <div class="row" v-if="loading">
      <img src="/infinite-spinner.svg" />
    </div>
    <div class="row" v-else>
      <div class="col-12">
        <div class="card">
          <v-date-picker v-model="date" :allowed-dates="allowedDates" class="mt-4" :min="minDate" :max="maxDate" />
        </div>
        <div class="row">
          <div class="col-12">
            <v-data-table :headers="headers" :items="summarizedData" class="elevation-1" @click:row="openModal">
              <template v-slot:top>
                <v-toolbar flat>
                  <v-toolbar-title>Sales Summary</v-toolbar-title>
                  <v-divider class="mx-4" inset vertical></v-divider>
                  <v-toolbar-title>{{ totalSeatsWon }} Seats Won</v-toolbar-title>
                </v-toolbar>
              </template>
            </v-data-table>
            <v-dialog v-model="isModalOpen" min-width="800px">
              <v-card>
                <v-card-title>
                  <span class="headline">{{ selectedSalesPerson.salesPerson }}</span>
                </v-card-title>
                <v-card-text>
                  <v-data-table :headers="modalHeaders" :items="filteredSalesData" class="elevation-1"></v-data-table>
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
    </div>
  </div>
</template>

<script>
import statistics from "../assets/js/data.js";

export default {
  name: "lead-opportunities",
  data() {
    return {
      minDate: "2021-01-01",
      maxDate: this.getFormattedDate(),
      date: this.getFormattedDate(),
      loading: true,
      allOpportunites: [],
      monthlyReport: [],
      totalSeatsWon: 0,
      headers: [
        { text: "Salesperson", value: "salesPerson" },
        { text: "Prospective Clients", value: "prospectiveClients" },
        { text: "Additional Seats", value: "additionalSeats" },
        { text: "Replacement Seats", value: "replacementSeats" },
        { text: "New Seats", value: "newSeats" },
        { text: "Total Seats Won", value: "totalSeats" }
      ],
      modalHeaders: [
        { text: "Company", value: "company" },
        { text: "Seat Type", value: "seatType" },
        { text: "Seat Count", value: "seatCount" },
        { text: "Client Type", value: "clientType" },
        { text: "Seat Category", value: "seatCategory" }
      ],
      summarizedData: [],
      isModalOpen: false,
      selectedSalesPerson: {},
      filteredSalesData: []
    };
  },
  watch: {
    date(newDate) {
      this.generateReport(newDate);
    }
  },
  methods: {
    allowedDates: val => parseInt(val.split("-")[2], 10) % 2 === 0,
    getFormattedDate() {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    filterByClosedMonthYear(data, month, year) {
      return data.filter(item => {
        if (item.closedDate) {
          let closedDate = new Date(item.closedDate * 1000);
          return closedDate.getMonth() === month && closedDate.getFullYear() === year;
        }
        return false;
      });
    },
    getMonthFromString(dateString) {
      const parts = dateString.split("-");
      const month = parseInt(parts[1], 10);
      return month - 1;
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
        this.totalSeatsWon = salesData.reduce(
          (sum, entry) => sum + entry.seatCount,
          0
        );

        if (entry.seatType === "Additional Seats") {
          summary[salesperson].additionalSeats += entry.seatCount;
        } else if (entry.seatType === "Replacement Seats") {
          summary[salesperson].replacementSeats += entry.seatCount;
        } else if (entry.seatType === "New Seats") {
          summary[salesperson].newSeats += entry.seatCount;
        }

        if (entry.clientType === "Prospective") {
          summary[salesperson].prospectiveClients++;
        }
      });

      this.summarizedData = Object.values(summary)
        .filter(item => item.totalSeats > 0)
        .sort((a, b) => b.totalSeats - a.totalSeats);
    },
    openModal(item) {
      this.selectedSalesPerson = item;
      this.filteredSalesData = this.monthlyReport.filter(
        entry => entry.salesPerson === item.salesPerson
      );
      this.isModalOpen = true;
    },
    generateReport(date) {
      this.loading = true;
      let month = this.getMonthFromString(date);
      let year = this.getYearFromString(date);
      let data = this.filterByClosedMonthYear(this.allOpportunites, month, year);
      this.monthlyReport = this.filterBySeatCount(data);
      this.summarizeData(this.monthlyReport);
      this.loading = false;
    }
  },
  async mounted() {
    this.allOpportunites = await statistics.getAllOpportunities();
    this.generateReport(this.date);
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
