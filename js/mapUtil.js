// 定义绘制svg的大小
const width = $(".AllMap").width();
const height = $(".AllMap").height();

// 设置svg的宽高
const svg = d3
  .select(".AllMap")
  .append('svg')
  .attr('width', width)
  .attr('height', height);

// 设置投影函数，通过 `d3.geoMercator()` 墨卡托投影来创建一个投影方法用来将球体投影到平面上。
var projection = d3.geoMercator()
	.center([110, 35])
	.scale(700)
	.translate([width / 2, height / 2]);

// 创建地理路径生成器，使用当前设置的投影
var path = d3.geoPath()
	.projection(projection);

// 创建颜色比例尺
var colors = d3.scaleOrdinal(d3.schemeBlues[6]);

svg
  .selectAll('g')
  .data(mapData.features)
  .enter()
  .append('g')
  .append('path')
  .attr('d', path)
  .attr("atTime", function(d){
    return d.time;
  })
  .attr("class", "mapEles")
  .attr('stroke', '#000')
  .attr('stroke-width', 1)
  .attr('opacity', 0.4)
  .attr("fill", function(d,i){
    tim = getActiveTime();
    if(d.time > tim){
      return colors(2);
    }
    else{
      return "black";
    }
  })
  .on('mouseover', function() {
    d3.select(this).attr('opacity', 1);
  })
  .on('mouseout', function() {
    d3.select(this).attr('opacity', 0.4);
  });

var points = [];
for (var i = 0; i < subLens; i++){
  points.push(lifePathRaw[i].coord);
};

storyLocation = svg.selectAll("location")
	.data(points)
	.enter()
	.append('svg:g')
	.attr("transform", function(d, i){
    var coor = projection(d);
		return "translate(" + coor[0] + "," + coor[1] + ")";
  })
	.style("cursor", "pointer")

var idx = 0;

storyLocation.append("circle")
	.attr("r", 5) //半径
	.attr("stroke", function (d) {
		return d.color || 'green';
	})
	.attr("stroke-width", 1)
	.attr("class", "Points")
  .attr("id", function(){
    return "tlbPoint"+(idx++);
  })
	.style("fill", function (d) {
		return d.color || 'yellow';
	})
	.on("mouseover", function (d, i) {
		d3.select(this)
			.attr("r", "8");
	})
	.on("mouseout", function (d, i) {
		d3.select(this)
			.attr("r", "5");
	});

$("#tlbPoint0").addClass("active");
