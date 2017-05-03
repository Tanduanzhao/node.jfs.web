$(function() {
    $(".search").focus(function(){
        $(".header-search label").addClass("focus");
    }).blur(function(){
          $(".header-search label").removeClass("focus")}
    )
    $(".main-lf-list .main-lf-item").click(function(){
        if($(this).hasClass("show-sub")){
            $(this).next(".main-lf-sub-List").hide();
            $(".main-lf-sub-item").removeClass("sub-active");
            $(this).removeClass("show-sub");
            return false;
        }
        $(".main-lf-sub-List").css({display:"none"});
        $(".main-lf-list .main-lf-item").removeClass("active");
        $(this).addClass("active");
        if($(this).next(".main-lf-sub-List").length>0){
            $(this).addClass("show-sub");
            $(this).next(".main-lf-sub-List").show();
        }
    })
    $(".main-lf-sub-item").click(function(){
        $(".main-lf-sub-item").removeClass("sub-active");
        $(this).addClass("sub-active");
    })

    

    


    $(".form input[type='file']").change(function(){
        $(".form .form-file").removeClass('prompt-color').parent().next().hide();
    });
    $('.contribute .btn-group .btn').click(function(){
        if($(".theme").val()!="" && $(".name").val()!="" && $(".contact").val() !="" && email && $(".file").val()!=""){
            $('.form').submit();
        }else{
            $("input").trigger("blur");
            if($(".form input[type='file']").val() == ""){
                $(".form .form-file").addClass("prompt-color").parent().next().show();
            }
            return false;
        }
    });

    $(".tabs .tab").click(function(){
        if($(this).hasClass("active")) return false;
        $(this).addClass("active").siblings().removeClass("active");
        $(".platform .main-rt-content .tab-content").hide().eq($(this).index()).show();
    });
})
function showWarning(target){
    target.addClass("prompt-color").parent().next().show();
}