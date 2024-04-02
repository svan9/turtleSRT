let swapper_click_timeout = void 0;

var currentDirection;


window.addEventListener("load", () => {
  currentDirection = getMeta("direction") ?? ({from: "trt", to: "ru"});
  
  $("#side-a").html(currentDirection.from == "trt" ? "turtle": "русский");
  $("#side-b").html(currentDirection.to == "trt" ? "turtle": "русский");
  
  addMeta("direction", currentDirection);
})

function swapDurection() {
  [currentDirection.to, currentDirection.from] = [currentDirection.from, currentDirection.to];
  addMeta("direction", currentDirection);
}

$(".info").on("click", function(ev) {
  let a = $("#content-a").val();
  let b = $("#content-b").val();
  
  setWords(a, b);

  fetchWords(a);
});

$(".swapper").on("click", function(ev) {
  clearTimeout(swapper_click_timeout);

  $(this).attr("pressed", "");

  swapper_click_timeout = setTimeout(() => {
    $(this).removeAttr("pressed");
  }, 300);
});

$(".nav-bar").on("click", ".swapper", function(ev) {
  let deltrg = ev.delegateTarget;

  let a = $(deltrg).children("#side-a")[0];
  let b = $(deltrg).children("#side-b")[0];

  if (!a || !b) { return; }

  [a.innerText, b.innerText] = [b.innerText, a.innerText];
  swapDurection();
});

let content_a_timout = void 0;

$("#content-a").on("input", function(ev) {
  clearTimeout(content_a_timout);

  $("#content-b").attr("wait", "");
  
  content_a_timout = setTimeout(() => {
    fetchWords(this.value);
    setTimeout(() => {
      $("#content-b").removeAttr("wait");
    }, 100);
  }, 400);
});

function fetchWords(word) {
  let data = {};
  data[currentDirection.from] = word;

  $.ajax({
    type: "post",
    url: "/api/translate",
    data: JSON.stringify(data), 
    contentType: "application/json",
    dataType: "json",
    success: function (data) {
      $("#content-b").val(data.message);
    }
  });
}

function setWords(left, right) {
  if (left == "" || right == "") return;
  
  let data = {
    [currentDirection.from]: left, 
    [currentDirection.to]: right, 
    byToken: currentDirection.from
  };
  
  $.ajax({
    type: "post",
    url: "/api/setword",
    data: JSON.stringify(data), 
    contentType: "application/json",
    dataType: "json",
    success: function (data) {
      // $("#content-b").val(data.message);
    }
  });
}
