<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="row" v-if="!loading">
          <div class="col-2">
            <regularscorecard title="Total SDDS Revenue" :value="report.totalRevenue" :revenue="true" />
          </div>
          <div class="col-2">
            <regularscorecard title="Average Seat Fee" :value="report.averageSeatFee" :revenue="true" />
          </div>
          <div class="col-2">
            <regularscorecard title="Total Offices Supported" :value="report.totalOfficesSupported"/>
          </div>
          <div class="col-2">
            <regularscorecard title="Total SDDS Seats" :value="report.totalSeats" />
          </div>
          <div class="col-2">
            <regularscorecard title="Total SDDS Clients" :value="report.totalClients" />
          </div>
          <div class="col-2">
            <regularscorecard title="Total DSOs Supported" :value="report.totalDSOs" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import SalesPieChart from '@/components/Charts/SalesPieChart.vue';
import DSOPieChart from '@/components/Charts/DSOPieChart.vue';
import * as chartConfigs from '@/components/Charts/config';
import config from '@/config';
import { Table, TableColumn } from 'element-ui';
import statistics from '../assets/js/data.js';
import computations from '../assets/js/computations'
import regularscorecard from '../components/Cards/Regularscorecard.vue'

export default {
  name: 'supportdds',
  components: {
    regularscorecard,
  },
  data() {
    return {
      date: new Date(),
      loading: true,
      dentalClients: [],
      report: {}
    };
  },
  computed: {

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
    generateReport() {
      this.report.totalClients = this.dentalClients.length;
      this.report.totalSeats = this.dentalClients.reduce((sum, client) => sum + client.totalSeats, 0)
      this.report.totalClientFacing = this.dentalClients.reduce((sum, client) => sum + client.revenue, 0)
      this.report.totalUSStates = this.getUniqueStates(this.dentalClients)
      this.report.totalCountries = this.getUniqueCountries(this.dentalClients)
      this.report.totalSDDS = this.dentalClients.length;
      this.report.totalRCM = this.getRCMClients(this.dentalClients)
      this.report.totalDSOs = this.getDSO(this.dentalClients)
      this.report.totalOfficesSupported = this.dentalClients.reduce((sum, client) => sum + client.numberOfLocations, 0)
      this.report.totalRevenue = this.dentalClients.reduce((sum, client) => sum + client.revenue, 0)
      this.report.totalInternal = 140
      this.report.averageTenure = Math.ceil(this.dentalClients.reduce((sum, client) => sum + client.tenure, 0) / this.dentalClients.length)
      this.report.averageSeatFee = Math.ceil(this.report.totalRevenue / this.dentalClients.length)
    },

    getUniqueStates(clients) {
      let states = clients.map(client => client.state);
      let uniqueStates = [...new Set(states)];
      return uniqueStates.length;
    },
    getUniqueCountries(clients) {
      let countries = clients.map(client => client.country);
      let uniqueCountries = [...new Set(countries)];
      return uniqueCountries.length;
    },
    getRCMClients(clients) {
      let rcmTrueClients = clients.filter(client => client.rcm === true);
      return rcmTrueClients.length;
    },
    getDSO(clients) {
      let dsoTrueClients = clients.filter(client => client.dso === true);
      return dsoTrueClients.length;
    },
  },
  async mounted() {
    let clients = await statistics.getAllActiveClients();
    this.dentalClients = clients.filter(client => client.industry === "Dental");
    this.generateReport();
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
</style>
