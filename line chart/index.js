const { select, csv, scaleLinear, extent, axisLeft, axisBottom, scaleTime, line, curveBasis } = d3;
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
const title = "Temperature in San francisco";
const settings = {
  fillColor: 'none',
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
      fillColor: 'steelblue',
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
      fillColor: 'steelblue',
      fontWeight: 'bold'
    },
    tick: {
      stroke: '#c7c7c7'
    }
  },
  line: {
    style: {
      stroke: 'steelblue',
      strokeWidth: 3,
      opacity: 1,
      strokeLinejoin: 'round'
    }
  }
};

const svg = select('#line-chart')
    .append('svg')
      .attr('width', width)
      .attr('height', height);

const render = data => {
  const xValue = d => d.timestamp;
  const xAxisLabel = 'Time';
  const yValue = d => d.temperature;
  const yAxisLabel = 'Temperature';
  const g = svg.append('g')
     .attr('transform', `translate(${margins.left},${margins.top})`);
  
  // X-Axis scale declaration
  const xScale = scaleTime()
     .domain(extent(data, xValue))
     .range([0, innerWidth])
     .nice();

  // Y-Axis scale declaration
  const yScale = scaleLinear()
  .domain(extent(data, yValue))
     .range([innerHeight, 0])
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
     
  // line generator
  const lineGenerator = line()
  .x(d => xScale(xValue(d)))
  .y(d => yScale(yValue(d)))
  .curve(curveBasis);

  // building path for line
  const gLine = g.append('g')
  
  gLine.append('path')
  .attr('stroke', settings.line.style.stroke)
  .attr('stroke-width', settings.line.style.strokeWidth)
  .attr('stroke-linejoin', settings.line.style.strokeLinejoin)
  .attr('fill', settings.fillColor)
  .attr('d', lineGenerator(data));

  // title for the chart
  g.append('text')
   .attr('y', -10)
   .attr('font-size', settings.title.fontSize)
   .attr('font-family', settings.title.fontFamily)
   .text(title);
};

// data rendering
csv('/data/temperature-in-san-francisco.csv').then(response => {
  response.forEach(res => {
    res.temperature = +res.temperature;
    res.timestamp = new Date(res.timestamp);
  });
  render(response);
});