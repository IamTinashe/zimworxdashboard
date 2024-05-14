<div>
  <canvas ref="pieChart" ></canvas>
</div>


<script>
import { Pie } from 'vue-chartjs';

export default {
  name: 'dso-pie-chart',
  extends: Pie,
  props: ['data'],
  mounted() {
    this.renderChart(this.chartData, this.options);
  },
  computed: {
    chartData() {
      return {
        labels: ["Single", "DSOs"],
        datasets: [
          {
            data: this.data,
            backgroundColor: [
              '#40E0D0',
              '#00FF00'
            ],
          },
        ],
      };
    },
    options() {
      return {
        responsive: true,
        maintainAspectRatio: false,
      };
    },
  },
};
</script>

<style scoped>
/* Add any custom styles here */
</style>
