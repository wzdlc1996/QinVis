// 确定使用的数据
var barData = []
for (var i in lifeBarData){
  barData.push(lifeBarData[i].life);
}
var barName = []
for (var i in lifeBarData){
  barName.push(lifeBarData[i].name);
}

var barWidth = $(".TimeLineVis").width();
var barHeight = $(".TimeLineVis").height();
var marg = 20;

var y = d3.scaleBand()
	.rangeRound([barHeight - marg*2, 0])
	.padding(0.1)
  .domain(barName);

var x = d3.scaleLinear()
  .domain([-259, -207])
	.rangeRound([0, barWidth - marg*2]);

var barG = d3.select(".TimeLineVis")
  .append("svg")
  .attr("width", barWidth-marg*2)
  .attr("height", barHeight)
  .append("g")
  .attr("transform", "translate(" + 50 + "," + 00 + ")");

barG.append("g")
  .attr("transform", "translate(" + 0 + "," + 260 + ")")
	.call(d3.axisBottom(x));

barG.append("g")
.call(d3.axisLeft(y));

barG.selectAll(".bar")
.data(lifeBarData)
.enter().append("rect")
.attr("class", "bar")
.attr("x", function (d) {
	return 0;
})
.attr("y", function (d) {
	return y(d.name) + y.bandwidth()/4;
})
.attr("height", y.bandwidth()/2)
.attr("width", function (d) {
	return x(d.life);
})
.attr("fill", colors(5));


d3.select(".TimeLineVis")
  .select("svg")
  .append("line")
  .attr("id", "linInd")
  .attr("x1", x(-259)+50)
  .attr("y1", 0)
  .attr("x2", x(-259)+50)
  .attr("y2", barHeight-marg)
  .attr("stroke", "green")
  .attr("stroke-width", "2px")
  .attr("stroke-dasharray", "2 2");
