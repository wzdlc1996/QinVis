var CONNECT_PATH_COLOR = 'red'
var TOOLTIP_PATH_COLOR = 'red'
var isConnectPath = true

const tooltip = d3.select('body')
  .append('div')
  .attr('class', 'tooltip')
  .style('display', 'none')

// 取消所有的激活样式
function clearTimeItemActive() {
  d3.selectAll('.time-axis-item')
    .classed('active', false)
}

// 获取所有的故事
function getStoriesMap() {
  let storiesMap = []
  lzxStories.forEach(function (period) {
    storiesMap = storiesMap.concat(period.stories)
  })
  return d3.map(storiesMap, function (d) {
    return d.key
  })
}

// 隐藏toolTip
function clearToolTip() {
  d3.selectAll('g.toolTip')
    .attr('data-show', false)
    .style('display', 'none')
    .selectAll('.connect-path')
    .remove()
}

// 获取故事的坐标点
function getStoryPosition(storyId) {
  return getPosition(d3.select(`#${storyId}`).select('.time-axis-date span'))
}

function getPosition(dNode) {
  return dNode.node()
    .getBoundingClientRect()
}

function scrollStories(storyId) {
  const endNode = d3.select(`#${storyId}`).node()
  d3.select('.lzx-stories').property('scrollTop', endNode.offsetTop)
}

function activeStory(storyId) {
  d3.select(`#${storyId}`)
    .classed('time-axis-item active', true)
}

function stopPropagation() {
  window.event ? window.event.cancelBubble = true : d3.event.stopPropagation();
}

function clearConnectPath() {
  d3.select('.china-map-svg')
    .selectAll('path.connect-path')
    .remove()
}

function onClickLocation(location, e) {
  stopPropagation()
  clearTimeItemActive()
  clearConnectPath()
  clearToolTip()

  tooltip.style('display', 'none')

  const start = getPosition(d3.select(`.${location.locationKey}`))

  // 只有一个story 直接连接
  if (location.stories.length === 1) {
    const storyId = location.stories[0]
    isConnectPath = false
    scrollStories(storyId)
    activeStory(storyId)

    const end = getStoryPosition(storyId)
    d3.select(this)
      .append('path')
      .attr('class', 'connect-path')
      .attr("d", function () {
        const dPath = `M 0 0 L ${end.x - start.x} ${end.y - start.y} Z`
        tooltip.html(getStoryByStoryId(storyId))
        tooltip.style('left', `${d3.event.pageX + 20}px`)
          .style('top', `${d3.event.pageY + 20}px`)
          .style('display', 'block')
        return dPath
      })
      .attr("stroke", CONNECT_PATH_COLOR)
      .attr("stroke-width", 1);
    return
  } else {
    const storiesMap = getStoriesMap()
    d3.select(this)
      .select('g.toolTip')
      .attr('data-show', true)
      .style('display', 'block')
  }
}

function onClickStory(story) {
  clearTimeItemActive()
  clearConnectPath()
  clearToolTip()

  tooltip.style('display', 'none')

  const start = getPosition(d3.select(this).select('.time-axis-date span'))

  const connectPath = d3.select('.china-map-svg').select('g.connect-path-from-story')

  connectPath.selectAll('path')
    .remove()

  connectPath
    .selectAll('path')
    .data(story.locationKey)
    .enter()
    .append('svg:path')
    .attr("d", function (endP) {
      const end = getPosition(d3.select(`.china-map-svg .${endP}`))
      const dPath = `M ${start.x - 15} ${start.y - 15} L ${end.x - 15} ${end.y - 15} Z`
      tooltip.html(story.period)
      tooltip.style('left', `${end.x + 10}px`)
        .style('top', `${end.y + 10}px`)
        .style('display', 'block')
      return dPath
    })
    .attr("stroke", CONNECT_PATH_COLOR)
    .attr("stroke-width", 1);
}

function getStoryByStoryId(storyId) {
  const map = d3.map(lzxStories, function (s) {
    return s.key
  })

  console.log('storyId.substr(0, storyId.length - 1)', storyId.substr(0, storyId.length - 1))

  return map.get(storyId.substr(0, storyId.length - 1)).period
}




