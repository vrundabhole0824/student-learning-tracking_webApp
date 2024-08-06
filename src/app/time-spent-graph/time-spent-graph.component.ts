import { Component, ElementRef } from '@angular/core';
import { Chart } from 'chart.js';
import { registerables } from 'chart.js';
import { FetchDataServiceService } from '../fetch-data-service.service';
Chart.register(...registerables);

@Component({
  selector: 'app-time-spent-graph',
  templateUrl: './time-spent-graph.component.html',
  styleUrls: ['./time-spent-graph.component.css'],
})
export class TimeSpentGraphComponent {
  chart: any = [];
  constructor(
    private elementRef: ElementRef,
    private getdata: FetchDataServiceService
  ) {}
  latestResults: any[] = [];

  ngOnInit() {
    this.getdata.getdata().subscribe((res: any) => {
      console.log(res);
      console.log(res.dashboardData.lastestResults);
      this.latestResults = res.dashboardData.timeSpentData.days;
      console.log(this.latestResults);
      const days = Object.keys(res.dashboardData.timeSpentData.days);
      console.log(days);
      const categories = Object.keys(
        res.dashboardData.timeSpentData.days[days[0]]
      );
      console.log(categories);
      const datasets = categories.map((category: string, index: number) => ({
        label: category,
        data: days.map(
          (day: string) =>
            res.dashboardData.timeSpentData.days![day][category] || 0
        ),
        backgroundColor: this.getColor(index),
        borderWidth: 0,
      }));

      const canvas = this.elementRef.nativeElement.querySelector('#piechart');
      const context = canvas.getContext('2d');
      // const days = Object.keys(this.latestResults);

      var myChart = new Chart(context, {
        type: 'bar',

        data: {
          labels: days,
          datasets: datasets,
        },
        options: {
          scales: {
            x: {
              stacked: true,
              grid: {
                display: false,
              },

              beginAtZero: false,
            },
            y: {
              stacked: true,
              grid: {
                display: false, 
              },
              ticks: {
                display: false,
              },
              beginAtZero: false,
            },
          },
        },
      });
    });
  }

  getColor(index: number) {
    const colors = ['#198754', '#FFC107', '#5E6EED', '#574476'];

    if (index >= 0 && index < colors.length) {
      return colors[index];
    } else {
      return '#000000';
    }
  }
}
