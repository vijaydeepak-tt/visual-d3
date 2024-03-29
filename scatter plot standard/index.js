const { select, csv, scaleLinear, extent, axisLeft, axisBottom } = d3;
// scaleLinear used for quantitative scales

const width = 1000;
const height = 600;
const margins = {
  top: 120,
  right: 20,
  bottom: 100,
  left: 150
};
const innerWidth = width - (margins.left + margins.right);
const innerHeight = height - (margins.top + margins.bottom);
const circleRadius = 10;
const title = "Cars Hourse power VS Weight";
const settings = {
  fillColor: 'red',
  fontFamily: 'sans-serif',
  title: {
    fontSize: '3em',
    fontFamily: 'sans-serif',
  },
  x: {
    axisValue: {
      fontSize: '1em',
      fontFamily: 'sans-serif',
    },
    axisLabel: {
      fontSize: '1em',
      fontFamily: 'sans-serif',
      fillColor: 'red',
      fontWeight: 'bold'
    },
    tick: {
      stroke: '#c7c7c7'
    }
  },
  y: {
    axisValue: {
      fontSize: '1em',
      fontFamily: 'sans-serif',
    },
    axisLabel: {
      fontSize: '1em',
      fontFamily: 'sans-serif',
      fillColor: 'red',
      fontWeight: 'bold'
    },
    tick: {
      stroke: '#c7c7c7'
    }
  },
  circle: {
    r: 10,
    style: {
      opacity: 0.3
    }
  }
};

const svg = select('#scatter-plot')
    .append('svg')
      .attr('width', width)
      .attr('height', height);

const render = data => {
  const xValue = d => d.horsepower;
  const xAxisLabel = 'Horsepower';
  const yValue = d => d.weight;
  const yAxisLabel = 'Weight';
  const g = svg.append('g')
     .attr('transform', `translate(${margins.left},${margins.top})`);
  
  // X-Axis scale declaration
  const xScale = scaleLinear()
     .domain(extent(data, xValue))
     .range([0, innerWidth])
     .nice();

  // Y-Axis scale declaration
  const yScale = scaleLinear()
  .domain(extent(data, yValue))
     .range([0, innerHeight])
     .nice();  

  // Y-Axis implementation
  const yAxis = axisLeft(yScale)
   .tickSize(-innerWidth)
   .tickPadding(10);

   const yAxisG = g.append('g')
   .call(yAxis)
   .attr('font-size', settings.y.axisValue.fontSize);

  yAxisG.select('.domain').remove();

  yAxisG.selectAll('.tick line')
   .attr('stroke', settings.y.tick.stroke);

  yAxisG.append('text')
   .text(yAxisLabel)
   .attr('fill', settings.y.axisLabel.fillColor)
   .attr('font-weight', settings.y.axisLabel.fontWeight)
   .attr('y', -90)
   .attr('x', -innerHeight/2)
   .attr('transform', `rotate(-90)`);

  // X-Axis implementation
  const xAxis = axisBottom(xScale)
   .tickSize(-innerHeight)
   .tickPadding(10);
  
  const xAxisG = g.append('g').call(xAxis)
   .attr('transform', `translate(0,${innerHeight})`)
   .attr('font-size', settings.x.axisValue.fontSize);
   
  xAxisG.select('.domain').remove();

  xAxisG.selectAll('.tick line')
     .attr('stroke', settings.x.tick.stroke);

  xAxisG.append('text')
     .text(xAxisLabel)
     .attr('fill', settings.x.axisLabel.fillColor)
     .attr('font-weight', settings.x.axisLabel.fontWeight)
     .attr('x', innerWidth/2)
     .attr('y', 60);
     

  // grouping circles
  const gCircle = g.append('g')
     .attr('fill', settings.fillColor);

  gCircle.selectAll('circle').data(data)
     .enter().append('circle')
     .attr('cy', d => yScale(yValue(d)))
     .attr('cx', d => xScale(xValue(d)))
     .attr('r', settings.circle.r)
     .attr('opacity', settings.circle.style.opacity);

  // title for the chart
  g.append('text')
   .attr('y', -10)
   .attr('font-size', settings.title.fontSize)
   .attr('font-family', settings.title.fontFamily)
   .text(title);
};

// data rendering
csv('/data/auto-mpg.csv').then(response => {
  response.forEach(res => {
    res.mpg = +res.mpg
    res.cylinders = +res.cylinders
    res.displacement = +res.displacement
    res.horsepower = +res.horsepower
    res.weight = +res.weight
    res.acceleration = +res.acceleration
    res.year = +res.year
  });
  render(response);
});