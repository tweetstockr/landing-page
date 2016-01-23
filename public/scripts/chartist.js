var socket = io('http://localhost:4000'); // Este é o endereço da API
​
socket.on('connect', function(){
  console.log('connected!');
  socket.emit('update-me');
});

var data = {
  labels: [],
  series: [
    []
  ]
};

var seq = 0
  , delays = 80
  , durations = 500;
​
socket.on('update', function(msg) {
  var trend = msg[0];
  var graphData = data.series[0];

  console.log('Trend: ', trend);
  console.log('Time: ', time);
  console.log('Data: ', graphData);

  for(var i = 9; i > 0; i--) {
    console.log('History: ', trend.history[i]);
    var graphData = data.series[0];
    var price = trend.history[i].price;
    var hours = new Date(trend.history[i].created).getHours();
    var minutes = new Date(trend.history[i].created).getMinutes();
    var time = hours + ':' + minutes;

    graphData.push(price);
    data.labels.push(time);  
  }

  $('#trendName').html(trend.name);

  new Chartist.Line('.ct-chart', data, {
    showArea: true
  }).on('created', function() {
    seq = 0;
  }).on('draw', function(data) {
    seq++;

    if(data.type === 'line') {
      data.element.animate({
        opacity: {
          begin: seq * delays + 1000,
          dur: durations,
          from: 0,
          to: 1
        }
      });
    } else if(data.type === 'label' && data.axis === 'x') {
      data.element.animate({
        y: {
          begin: seq * delays,
          dur: durations,
          from: data.y + 100,
          to: data.y,
          easing: 'easeOutQuart'
        }
      });
    } else if(data.type === 'label' && data.axis === 'y') {
      data.element.animate({
        x: {
          begin: seq * delays,
          dur: durations,
          from: data.x - 100,
          to: data.x,
          easing: 'easeOutQuart'
        }
      });
    } else if(data.type === 'point') {
      data.element.animate({
        x1: {
          begin: seq * delays,
          dur: durations,
          from: data.x - 10,
          to: data.x,
          easing: 'easeOutQuart'
        },
        x2: {
          begin: seq * delays,
          dur: durations,
          from: data.x - 10,
          to: data.x,
          easing: 'easeOutQuart'
        },
        opacity: {
          begin: seq * delays,
          dur: durations,
          from: 0,
          to: 1,
          easing: 'easeOutQuart'
        }
      });
    } else if(data.type === 'grid') {
      var pos1Animation = {
        begin: seq * delays,
        dur: durations,
        from: data[data.axis.units.pos + '1'] - 30,
        to: data[data.axis.units.pos + '1'],
        easing: 'easeOutQuart'
      };

      var pos2Animation = {
        begin: seq * delays,
        dur: durations,
        from: data[data.axis.units.pos + '2'] - 100,
        to: data[data.axis.units.pos + '2'],
        easing: 'easeOutQuart'
      };

      var animations = {};
      animations[data.axis.units.pos + '1'] = pos1Animation;
      animations[data.axis.units.pos + '2'] = pos2Animation;
      animations['opacity'] = {
        begin: seq * delays,
        dur: durations,
        from: 0,
        to: 1,
        easing: 'easeOutQuart'
      };

      data.element.animate(animations);
    }
  }).on('created', function() {
    if(window.__exampleAnimateTimeout) {
      clearTimeout(window.__exampleAnimateTimeout);
      window.__exampleAnimateTimeout = null;
    }
  });
});