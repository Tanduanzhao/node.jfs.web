$(function() {
    $(".search").focus(function(){
        $(".header-search label").addClass("focus");
    }).blur(function(){
          $(".header-search label").removeClass("focus")}
    );
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
    });
    $(".main-lf-sub-item").click(function(){
        $(".main-lf-sub-item").removeClass("sub-active");
        $(this).addClass("sub-active");
    })

    var email=false,submit=false;
    $(".form .form-input").focus(function(){
        $(this).removeClass("prompt-color");
        $(this).parent().next().hide();
    }).blur(function(){
        if($(this).hasClass("email")){
            if($(".email").val()!=""){
                if($(".email").val().search(/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/)==-1){
                    $(".email").parent().next().find(".prompt-text").html("邮箱格式不正确");
                    email=false;
                    showPrompt($(this));
                    return false;
                }else{
                    email=true;
                }
            }else{
                $(".email").parent().next().find(".prompt-text").html("请填写电子邮箱");
                showPrompt($(this));
                return false;
            }
        }
        if($(this).val() == ""){
            showPrompt($(this))
        }
        function showPrompt(e){
            e.addClass("prompt-color").parent().next().show();
        }
    });
    $(".form input[type='file']").change(function(){
        $(".form .form-file").removeClass('prompt-color').parent().next().hide();
    });
    $('.form .btn-group .btn').click(function(){
        submit=true;
        $.each($(".form .form-input"), function (s,v) {
            if($(v).val()==""){
                submit = false;
                return false;
            }
        });
        if(submit && email){
            subDoc();
            $("form").find(".form-input").val("");
            $('.form').hide();
            $('.popup-succeed').show();
            return false
        }else{
            $(".form-input").trigger("blur");
            if($(".form input[type='file']").val() == ""){
                $(".form .form-file").addClass("prompt-color").parent().next().show();
            }
            return false;
        }
    });
    $('.succeed-btns .bgc-gray').click(function(){
        $('.form').show();
        $('.popup-succeed').hide();
    });

    $(".tabs .tab").click(function(){
        if($(this).hasClass("active")) return false;
        $(this).addClass("active").siblings().removeClass("active");
        $(".platform .main-rt-content .tab-content").hide().eq($(this).index()).show();
    });

    $(".visits .tabs a").click(function(){
        if($(this).hasClass("active")) return false;
        $(this).addClass("active").siblings().removeClass("active");
        $(".visits .wrap .tab-content").hide().eq($(this).index()).show();
    });
})
function showWarning(target){
    target.addClass("prompt-color").parent().next().show();
}