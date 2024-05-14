<div>
  <canvas ref="pieChart" ></canvas>
</div>


<script>
import { Pie } from 'vue-chartjs';

export default {
  name: 'sales-pie-chart',
  extends: Pie,
  props: ['data'],
  mounted() {
    this.renderChart(this.chartData, this.options);
  },
  computed: {
    chartData() {
      // Prepare data for the pie chart
      const salespersons = {};
      this.data.forEach(item => {
        if (item.salesperson in salespersons) {
          salespersons[item.salesperson] += item.totalTeamMembers;
        } else {
          salespersons[item.salesperson] = item.totalTeamMembers;
        }
      });

      return {
        labels: Object.keys(salespersons),
        datasets: [
          {
            data: Object.values(salespersons),
            backgroundColor: [
              '#FF6384',  // Red
              '#36A2EB',  // Blue
              '#FFCE56',  // Yellow
              '#FF9900',  // Orange
              '#33FF99',  // Green
              '#9966CC',  // Lavender
              '#FF69B4',  // Deep Pink
              '#00CED1',  // Dark Turquoise
              '#FF6347',  // Tomato
              '#8A2BE2',  // Blue Violet
              '#20B2AA',  // Light Sea Green
              '#FFA07A',  // Light Salmon
              '#1E90FF',  // Dodger Blue
              '#ADFF2F',  // Green Yellow
              '#FF4500',  // Orange Red
              '#40E0D0',  // Turquoise
              '#DA70D6',  // Orchid
              '#87CEEB',  // Sky Blue
              '#FF8C00',  // Dark Orange
              '#00FF00'   // Lime Green
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
