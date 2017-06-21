$(".search").focus(function () {
  $(".header-search label").addClass("focus");
}).blur(function () {
    $(".header-search label").removeClass("focus")
  }
);
$(".main-lf-list .main-lf-item").click(function () {
  if ($(this).hasClass("active")) {
    return false;
  }
  if ($(this).next(".main-lf-sub-List").length > 0) {
    $(this).next(".main-lf-sub-List").show();
    return false;
  }
  $(".main-lf-sub-List").css({display: "none"});
  $(".main-lf-list .main-lf-item").removeClass("active");
  $(this).addClass("active");
});
$(".main-lf-sub-item").click(function () {
  $(this).parent().prev(".main-lf-item").addClass("active");
  $(".main-lf-sub-item").removeClass("sub-active");
  $(this).addClass("sub-active");
})

var email = false, submit = false, cardID = false, hasCardID = false;
$(".form .form-input").focus(function () {
  $(this).removeClass("prompt-color");
  $(this).parent().next(".prompt").hide();
}).blur(function () {
  if ($(this).hasClass("email")) {
    if ($(".email").val() != "") {
      if ($(".email").val().search(/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/) == -1) {
        $(".email").parent().next().find(".prompt-text").html("邮箱格式不正确");
        email = false;
        showPrompt($(this));
        return false;
      } else {
        email = true;
      }
    } else {
      $(".email").parent().next().find(".prompt-text").html("请填写电子邮箱");
      showPrompt($(this));
      return false;
    }
  }
  if ($(this).hasClass("cardID")) {
    hasCardID = true;
    if ($(".cardID").val() != "") {
      if (isCardID($(".cardID").val())) {
        cardID = true;
      } else {
        $(".cardID").parent().next().find(".prompt-text").html("身份证格式不正确");
        cardID = false;
        showPrompt($(this));
        return false;
      }
    } else {
      $(".cardID").parent().next().find(".prompt-text").html("请填写身份证号");
      showPrompt($(this));
      return false;
    }
  }
  if ($(this).val() == "") {
    showPrompt($(this))
  }
  function showPrompt(e) {
    e.addClass("prompt-color").parent().next().show();
  }
});
function isCardID(sId) {
  var aCity = {
    11: "北京",
    12: "天津",
    13: "河北",
    14: "山西",
    15: "内蒙古",
    21: "辽宁",
    22: "吉林",
    23: "黑龙江",
    31: "上海",
    32: "江苏",
    33: "浙江",
    34: "安徽",
    35: "福建",
    36: "江西",
    37: "山东",
    41: "河南",
    42: "湖北",
    43: "湖南",
    44: "广东",
    45: "广西",
    46: "海南",
    50: "重庆",
    51: "四川",
    52: "贵州",
    53: "云南",
    54: "西藏",
    61: "陕西",
    62: "甘肃",
    63: "青海",
    64: "宁夏",
    65: "新疆",
    71: "台湾",
    81: "香港",
    82: "澳门",
    91: "国外"
  }
  var iSum = 0;
  var info = "";
  if (!/^\d{17}(\d|x)$/i.test(sId)) return false;//"你输入的身份证长度或格式错误"
  sId = sId.replace(/x$/i, "a");
  if (aCity[parseInt(sId.substr(0, 2))] == null) return false;//"你的身份证地区非法"
  sBirthday = sId.substr(6, 4) + "-" + Number(sId.substr(10, 2)) + "-" + Number(sId.substr(12, 2));
  var d = new Date(sBirthday.replace(/-/g, "/"));
  if (sBirthday != (d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()))return false;//"身份证上的出生日期非法"
  for (var i = 17; i >= 0; i--) iSum += (Math.pow(2, i) % 11) * parseInt(sId.charAt(17 - i), 11);
  if (iSum % 11 != 1) return false;//"你输入的身份证号非法"
  return true;
}

$(".form input[type='file']").change(function () {
  $(".form .form-file").removeClass('prompt-color').parent().next(".prompt").hide();
});

$('.succeed-btns .bgc-gray').click(function () {
  if ($(".file-name").length != 0) {
    $('.file-name').text("未选择任何文件");
  }
  $('.form').show();
  $('.popup-succeed').hide();
});

$(".tabs .tab").click(function () {
  if ($(this).hasClass("active")) return false;
  $(this).addClass("active").siblings().removeClass("active");
  $(".platform .main-rt-content .tab-content").hide().eq($(this).index()).show();
});

$(".visits .tabs a").click(function () {
  if ($(this).hasClass("active")) return false;
  $(this).addClass("active").siblings().removeClass("active");
  $(".visits .wrap .tab-content").hide().eq($(this).index()).show();
});

function stop() {
  return false;
}
document.oncontextmenu = stop;
var omitformtags = ["input", "textarea", "select"];
omitformtags = omitformtags.join("|");
function disableselect(e) {
  if (omitformtags.indexOf(e.target.tagName.toLowerCase()) == -1)
    return false
}
function reEnable() {
  return true
}
if (typeof document.onselectstart != "undefined")
  document.onselectstart = new Function("return false");
else {
  document.onmousedown = disableselect;
  document.onmouseup = reEnable
}
function showWarning(target) {
  target.addClass("prompt-color").parent().next().show();
}
function submitFn() {
  submit = true;
  $.each($(".form .form-input"), function (s, v) {
    if ($(v).val() == "") {
      submit = false;
      return false;
    }
  });
  if (submit && email && (hasCardID ? cardID : true)) {
    subDoc();
    $("form").find(".form-input").val("");
    $('.form').hide();
    $('.popup-succeed').show();
    return false
  } else {
    $(".form-input").trigger("blur");
    if ($(".form input[type='file']").val() == "") {
      $(".form .form-file").addClass("prompt-color").parent().next().show();
    }
    return false;
  }
};