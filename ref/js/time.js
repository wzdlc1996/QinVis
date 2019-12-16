d3.select('.time-axis')
  .selectAll('.time-axis-period')
  .data(window.lzxStories)
  .enter()
  .append('div')
  .attr('class', 'time-axis-period')
  .each(function (item) {
    d3.select(this)
      .append('li')
      .attr('class', 'time-axis-period-title')
      .html(function () {
        return item.period
      })

    const story = d3.select(this)
      .selectAll('.time-axis-item')
      .data(item.stories)
      .enter()
      .append('li')
      .attr('class', 'time-axis-item')
      .attr('id', function (story) {
        story.period = item.period
        return story.key
      })
      .on('click', onClickStory)

    story.append('div')
      .attr('class', 'time-axis-date')
      .html(function (s) {
        return s.time
      })
      .append('span')

    story.append('div')
      .attr('class', 'time-axis-location')
      .html(function (s) {
        return s.location
      })

    story.append('p')
      .attr('class', 'time-axis-achievement')
      .html(function (s) {
        return s.detail
      })
  })

d3.select('.lzx-stories')
  .on('scroll', function () {
    d3.select('.china-map-svg')
      .selectAll('.connect-path-from-story path')
      .remove();

    if (!isConnectPath) {
      isConnectPath = true
      return
    }

    d3.select('.china-map-svg')
      .selectAll('path.connect-path')
      .remove();

    clearTimeItemActive();

  });

d3.select('svg.china-map-svg')
  .append('svg:g')
  .attr('class', 'connect-path-from-story');
