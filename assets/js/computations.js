class Computations {
      static isLastDayOfMonth(date) {
        const nextDay = new Date(date);
        nextDay.setDate(date.getDate() + 1);
        return nextDay.getMonth() !== date.getMonth();
      }

      static isThisMonth(createdOn, date) {
        return createdOn.getMonth() == date.getMonth();
      }

      static selectValidReports(data){
        return data.filter(obj => {
          const createdOn = new Date(obj.createdOn[0], obj.createdOn[1] - 1, obj.createdOn[2]);
          return this.isLastDayOfMonth(createdOn);
        });
      }
      static compareCreatedOn(a, b) {
        const dateA = new Date(a.createdOn[0], a.createdOn[1] - 1, a.createdOn[2]);
        const dateB = new Date(b.createdOn[0], b.createdOn[1] - 1, b.createdOn[2]);
  
        if (dateA < dateB) { return -1;}
        if (dateA > dateB) { return 1;}
        return 0;
      }
      static selectDataByDate(month, year, dataArray){
        return dataArray.find(obj => {
          const objMonth = obj.createdOn[1];
          const objYear = obj.createdOn[0];
          return objMonth === month && objYear === year;
        });
      }

      static getDaysInMonth(month, year) {
        return new Date(year, month, 0).getDate();
      }

      static selectThisMonthReports(data, date){
        return data.filter(obj => {
          const createdOn = new Date(obj.createdOn[0], obj.createdOn[1] - 1, obj.createdOn[2]);
          return this.isThisMonth(createdOn, date);
        });
      }
}
export default Computations;