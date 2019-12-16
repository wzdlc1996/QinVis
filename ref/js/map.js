// 定义绘制svg的大小
const width = 550
const height = 420

// 设置svg的宽高
const svg = d3.select(".china-map").append("svg")
	.attr("class", "china-map-svg")
	.attr("width", '100%')
	.attr("height", '100%')
	.append("g")
	.attr("width", width)
	.attr("height", height)
	.attr("transform", "translate(0,0)")
// window.svg = svg

// 设置投影函数，通过 `d3.geoMercator()` 墨卡托投影来创建一个投影方法用来将球体投影到平面上。
const projection = d3.geoMercator()
	.center([104, 38])
	.scale(500)
	.translate([width / 2, height / 2])

// 创建地理路径生成器，使用当前设置的投影
const path = d3.geoPath()
	.projection(projection)

// 创建颜色比例尺
const colors = d3.scaleOrdinal(d3.schemeBlues[6])

// 地图数据
let dataArray = window.chinaMapData.features;

// 绘制地图路径
svg.selectAll("path")
	.data(dataArray)
	.enter()
	.append("path")
	.attr("text", function (d, i) {
		return d.properties.name;
	})
	.style("font-size", "10px")
	.attr("fill", function (d, i) {
		return colors(i)
	})
	.text(function (d) {
		return d.properties.name;
	})
	.attr("d", path)
	.attr("stroke", "#666")
	.attr("stroke-width", 1)
	.on("mouseover", function (d, i) {
		d3.select(this)
			.attr("stroke", "#000")
			.attr("stroke-width", 1)
	})
	.on("mouseout", function (d, i) {
		d3.select(this)
			.attr("stroke", "#666")
			.attr("stroke-width", 1)
	});

// 设置故事story location
const storyLocation = svg.selectAll("location")
	.data(window.locations)
	.enter()
	.append('svg:g')
	.attr("transform", function (d, i) {
		//计算标注点的位置
		var coor = projection([d.log, d.lat]); //经纬度的投影
		return "translate(" + coor[0] + "," + coor[1] + ")";
	})
	.style("cursor", "pointer")
	.on('click', onClickLocation)

storyLocation.append("circle")
	.attr("r", 5) //半径
	.attr("stroke", function (d) {
		return d.color || 'yellow'
	})
	.attr("stroke-width", 1)
	.attr("class", function (d) {
		return d.locationKey
	})
	.style("fill", function (d) {
		return d.color || 'yellow'
	})
	.on("mouseover", function (d, i) {
		d3.select(this)
			.attr("r", "8")
	})
	.on("mouseout", function (d, i) {
		d3.select(this)
			.attr("r", "5")
	});

storyLocation.append("text")
	.text(function (d) {
		return d.name;
	})
	.attr("fill", function (d, i) {
		return "black";
	})
	.attr("dy", function (d, i) {
		return -10;
	})
	.attr("text-anchor", "middle")
	.attr("font-family", "sans-setif")
	.attr("font-size", "14px")
	.attr("font-weight", "bold")
	.on("mouseover", function (d, i) {
		d3.select(this)
			.attr("font-size", "20px")
	})
	.on("mouseout", function (d, i) {
		d3.select(this)
			.attr("font-size", "14px")
	});

storyLocation.append("g")
	.attr('class', 'toolTip')
	.style('display', 'none')
	.each(function (item, index) {
		d3.select(this)
			.selectAll('path')
			.data(item.stories)
			.enter()
			.append("path")
			.attr("d", function (item, index) {
				return `m 0 0 l 100 ${30 * index - 30}`
			})
			.attr("stroke", TOOLTIP_PATH_COLOR)
			.attr("stroke-width", 1);

		d3.select(this)
			.selectAll('text')
			.data(item.stories)
			.enter()
			.append("text")
			.text(function (item, index) {
				const storiesMap = getStoriesMap()
				return `${index + 1}. ${storiesMap.get(item).time}`;
			})
			.attr("fill", function (d, i) {
				return "black";
			})
			.attr("dy", function (d, i) {
				return 30 * i - 25;
			})
			.attr("dx", function (d, i) {
				return 100;
			})
			.attr("font-family", "sans-setif")
			.attr("font-size", "14px")
			.attr("font-weight", "bold")
			.on("click", function (story, i) {
				stopPropagation()
				const textWidth = getPosition(d3.select(this)).width

				d3.select(`[data-show=true]`)
					.selectAll('.connect-path')
					.remove()

				isConnectPath = false
				scrollStories(story)
				activeStory(story)

				const start = getPosition(d3.select(`.${item.locationKey}`))
				const end = getStoryPosition(story)

				d3.select(`[data-show=true]`)
					.append('path')
					.attr('class', 'connect-path')
					.attr("d", function () {
						tooltip.html(getStoryByStoryId(story))
						tooltip.style('left', `${d3.event.pageX + 20}px`)
							.style('top', `${d3.event.pageY + 20}px`)
							.style('display', 'block')
						const dPath = `m ${180 + textWidth - 70} ${30 * i - 30} L ${end.x - start.x} ${end.y - start.y} Z`
						return dPath
					})
					.attr("stroke", CONNECT_PATH_COLOR)
					.attr("stroke-width", 1);
			})
	})
