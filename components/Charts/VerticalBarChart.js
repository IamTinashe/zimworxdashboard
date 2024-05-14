import { Bar, mixins } from 'vue-chartjs';

// Extract mixins
const { reactiveProp } = mixins;

// Extend Bar component
export default {
  extends: Bar,
  mixins: [reactiveProp],
  props: ['chartData', 'options'],
  mounted() {
    // Render the chart with the data and options passed as props
    this.renderChart(this.chartData, this.options);
  }
};