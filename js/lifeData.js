var lifePathRaw = [];
for (var mInd in lifePath) {
  cls = lifePath[mInd];
  clsNm = cls.title;
  for (var ind in cls.sub){
    var obj = cls.sub[ind];
    lifePathRaw.push(obj);
  }
};

var subLens = 0;

d3.select(".TimeLine")
  .selectAll(".TimeLineBlock")
  .data(lifePath)
  .enter()
  .append("div")
  .attr("class", "TimeLineBlock")
  .each(
    function (item) {
      d3.select(this)
        .append('div')
        .attr('class', 'TimeLineBlockTitle')
        .html(function () {
          return item.title;
        });
      story = d3.select(this)
        .selectAll('.TimeLineBlockCont')
        .data(item.sub)
        .enter()
        .append('div')
        .attr('class', 'TimeLineBlockCont')
        .attr('id', function (s) {
          s.mainTitle = item.title;
          return "tlbCont"+(subLens++);
        })

      story.append("div")
        .attr("class", "TimeLineBlockTime")
        .html(
          function(s){
            return s.time;
          }
        )
        .append("span")

      story.append('p')
        .attr('class', 'TimeLineBlockDet')
        .html(function (s) {
          return s.detail;
        })
    }
  )

d3.select(".TimeLine")
  .append("div")
  .attr("style", "height:900px;")

$("#tlbCont0").addClass("active");

function getActiveIndex(){
  for (var i=0; i < subLens; i++){
    if ($("#tlbCont"+i).attr("class") == "TimeLineBlockCont active"){
      break;
    }
  }
  return i;
}

function getActiveTime(){
  var x = getActiveIndex();
  var t = lifePathRaw[x].time;
  return -parseInt(t.match(/[0-9]+/));
}
