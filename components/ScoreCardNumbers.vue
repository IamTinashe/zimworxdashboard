<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-2">
        <scorecard title="Monthly Revenue" :value="selectedData.totalRevenue" :previousValue="previousData.totalRevenue"
          :revenue="true" />
      </div>
      <div class="col-2">
        <scorecard title="Total Team Members" :value="selectedData.totalSeats" :previousValue="previousData.totalSeats"
          :revenue="false" />
      </div>
      <div class="col-2">
        <scorecard title="Total Client Facing" :value="selectedData.totalClientFacing"
          :previousValue="previousData.totalClientFacing" :revenue="false" />
      </div>
      <div class="col-2">
        <scorecard title="Total Internal" :value="selectedData.totalInternal"
          :previousValue="previousData.totalInternal" :revenue="false" />
      </div>
      <div class="col-2">
        <scorecard title="Total Clients" :value="selectedData.totalClients" :previousValue="previousData.totalClients"
          :revenue="false" />
      </div>
      <div class="col-2">
        <scorecard title="Offices Supported" :value="selectedData.totalOfficesSupported"
          :previousValue="previousData.totalOfficesSupported" :revenue="false" />
      </div>
    </div>
  </div>
</template>

<script>
import computations from '../assets/js/computations'
export default {
  name: 'scorecardnumbers',
  props: {
    date: {
      type: Date,
      description: 'Selected Date'
    },
    allreports: {
      type: Array,
      description: "All reports",
      default: () => []
    }
  },
  data() {
    return {
      selectedData: [],
      previousData: [],
      dailyreports: []
    }
  },
  mounted() {
    this.dailyreports = computations.selectValidReports(this.allreports);
    this.dailyreports.push(this.allreports[this.allreports.length - 1]);
    this.dailyreports.sort(computations.compareCreatedOn);
    this.selectedData = computations.selectDataByDate(this.date.getMonth() + 1, this.date.getFullYear(), this.dailyreports);
    this.previousData = this.dailyreports[this.dailyreports.indexOf(this.selectedData) - 1];
  },
  methods: {
  }
}
</script>