var mapEles = $(".mapEles");

$(function(){
  $(".QinStory").scroll(
    function(){
      var wst = $(window).scrollTop();
      var j = 0;
      var cont = true;
      for (var i=0; i<subLens; i++){
        if (cont && $("#tlbCont"+i).offset().top > wst){
          j = i;
          cont = false;
        }
        $("#tlbCont"+i).removeClass("active");
        $("#tlbPoint"+i).removeClass("active");
      }
      $("#tlbCont"+j).addClass("active");
      $("#tlbPoint"+j).addClass("active");
      var tim = getActiveTime();
      for (var id = 0; id < mapEles.length; id++){
        var blk = mapEles[id];
        if(parseInt(blk.attributes.atTime.value) < tim){
          blk.attributes.fill.value = "black";
        }
        else{
          blk.attributes.fill.value = colors(2);
        }
      };
      d3.select("#linInd")
        .attr("x1", x(tim)+50)
        .attr("x2", x(tim)+50)
    })
})
