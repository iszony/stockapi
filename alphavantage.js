var options = {
  chart: {
    renderTo: 'container',
    type: 'line'
  },
  title: {
    text: ' vállalat tőzsdei ára'
  },
  subtitle: {
    text: 'Az elmúlt 100 nap adatai.'
  },
  xAxis: {
    type: 'datetime',
    dateTimeLabelFormats: {
      day: '%e. %b.',
      year: '%Y'
    },
    tickInterval: 24 * 3600 * 1000,
    reversed: true,
    title: {
      text: 'Date',
      /*type: 'dateTime',
      labels: {
        format: {
          value: '%Y-%m-%d'
        }*/
      // tickPixelInterval: 40,
      //categories: ['']
    },
  },
  yAxis: {
    title: {
      text: 'Stock value',
    }
  },
  series: [{
    name: 'valami',
    data: []
  }]
}
$(() => {
  var company;
  $('button').click(() => {
    $('.spinner-border').removeClass('d-none');
    company = $('input').val();
    var endpoint = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=' + company + '&outputsize=compact&apikey=FHYQKU2LGM1ZKCW9';
    $.ajax(
      endpoint, {
        success: data => {
          if (data.hasOwnProperty("Error Message")) {
            $('.data input').addClass('is-invalid');
            $('.data .ivalid-feedback').show();
            $('.spinner-border').addClass('d-none');
          } else {
            $('.data input').removeClass('is-invalid');
            $('.data .ivalid-feedback').hide();
            loadDatas(data);
          }
        },
        method: 'GET',
        dataType: 'json',
      }
    );
  });

  function loadDatas(data) {
    //options.xAxis.categories = [];
    options.series[0].data = [];
    let days = [];
    for (var day in data["Time Series (Daily)"]) {
      let date = day.toString().split('-');
      let dayData = [Date.UTC(parseInt(date[0]), parseInt(date[1]) - 1, parseInt(date[2])), parseInt(data["Time Series (Daily)"][day]["4. close"])];
      options.series[0].data.push(dayData);
      options.series[0].data.sort(function(a, b) {
        return a[0] - b[0]
      });
      //   days.push(day.toString());
      //   options.series[0].data.push(parseInt(data["Time Series (Daily)"][day]["4. close"]));
    }
    options.series[0].name = data["Meta Data"]["2. Symbol"];
    options.title.text = data["Meta Data"]["2. Symbol"] + ' vállalat tőzsdei ára';
    // options.xAxis.categories = days;
    let mychart = new Highcharts.Chart(options);
    $('.spinner-border').addClass('d-none');
  }
});
