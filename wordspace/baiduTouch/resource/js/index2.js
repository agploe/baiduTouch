/**
 * Created by Administrator on 2016/3/13.
 * 该js主要往Swiper进行对齐
 */
function Swiper(container, params) {

    const towards = {up: 1, right: 2, down: 3, left: 4};
    var now = 0,last = 0;
    var pageNum = $(container).children('.page').length;//计算页面存在多少P
    var isAnimating = false;//是否正在执行动画判断标识
    var isDisableAutoplay = false; //是否停止自动播放

    var screen_scale = window.innerHeight / 500;
    var enlarge_top = 250 * (1 - screen_scale);//放大后超出页面上面的部分

    $('.wrap').css('-webkit-transform', 'scale(' + screen_scale + ',' + screen_scale + ') translate(0px,-' + enlarge_top + 'px)');

    //默认参数配置
    var default_config = {
        initialPage:0,//设定初始化时page的索引。
        direction:'horizontal',
        speed:600,
        autoplay:false,
        autoplaySpeed:3000,//自动播放的时间间隔
        autoplayDisableOnInteraction:true,//用户操作swiper之后，是否禁止autoplay。默认为true：停止。
        autoplayStopOnLast:false,//如果设置为true，当切换到最后一个slide时停止自动切换
        effect:'slide',//切换效果
        pagination:null,//分页器
        paginationType:'bullets',//分页类型
        loop:false,

    };

    /** 根据params传入的值，进行修改配置 **/
    for(var item in params){
        default_config[item] = params[item];
    }

    /** 方法调用 start：**/

    initPage(default_config.initialPage);//初始化该页面，执行动画
    pageAutoPlay(default_config.autoplay);//页面自动播放功能调用


    /** 方法调用 end**/
    touch.on(container, 'touchstart', function (event) {
        event.preventDefault();
    });


    if(default_config.direction === 'horizontal'){ //水平方向

        touch.on(container, 'swipeleft', function (ev) {
            if (isAnimating) return;
            pageMoveOnPlus(towards.left);
            if(default_config.autoplayDisableOnInteraction){isDisableAutoplay = true;}
        });

        touch.on(container, 'swiperight', function (ev) {
            if (isAnimating) return;
            pageMoveOnMinus(towards.down);
            if(default_config.autoplayDisableOnInteraction){isDisableAutoplay = true;}
        });
    }else{  //vertical 垂直方向
        touch.on(container, 'swipeup', function (ev) {
            if (isAnimating) return;
            pageMoveOnPlus(towards.up);
            if(default_config.autoplayDisableOnInteraction){isDisableAutoplay = true;}
        });

        touch.on(container, 'swipedown', function (ev) {
            if (isAnimating) return;
            pageMoveOnMinus(towards.down);
            if(default_config.autoplayDisableOnInteraction){isDisableAutoplay = true;}
        });
    }




    //正方向移动页面：up/left
    function pageMoveOnPlus(tw){
        if (pageNum > 1) {
            if(now >= pageNum - 1){
                if(default_config.loop){
                    last = now;
                    now = 0;
                    pageMove(tw);
                }
            }else{
                last = now;
                now = last + 1;
                pageMove(tw);
            }
        }
    }
    //负方向移动页面：down/right
    function pageMoveOnMinus(tw){
        if (pageNum > 1) {
            if (now <= 0) {
                if(default_config.loop){
                    last = now;
                    now = pageNum - 1;
                    pageMove(tw);
                }
            } else {
                last = now;
                now = last - 1;
                pageMove(tw);
            }
        }
    }

    /**
     * 页面自动播放
     * @param isAutoPlay
     */
    function pageAutoPlay(isAutoPlay){
        if(isAutoPlay){
            var interval = setInterval(function(){
                if(isDisableAutoplay){clearInterval(interval);return;}
                if(default_config.direction === 'horizontal'){
                    pageMoveOnPlus(towards.left);
                }else{
                    pageMoveOnPlus(towards.up);
                }
                if(default_config.autoplayStopOnLast && now == pageNum - 1){
                    clearInterval(interval);return;
                }
            },default_config.autoplaySpeed);

        }
    }
    /**
     * 页面移动
     * @param tw  方向
     */
    function pageMove(tw) {
        var nowPage = $(container + ' .page')[now];
        //console.log('nowPage:' + nowPage);
        var lastPage = $(container + ' .page')[last];
        //console.log('lastPage:' + lastPage);

        switch (tw) {
            case towards.up:
                outClass = 'pt-page-moveToTop';
                inClass = 'pt-page-moveFromBottom';
                break;
            case towards.right:
                outClass = 'pt-page-moveToRight';
                inClass = 'pt-page-moveFromLeft';
                break;
            case towards.down:
                outClass = 'pt-page-moveToBottom';
                inClass = 'pt-page-moveFromTop';
                break;
            case towards.left:
                outClass = 'pt-page-moveToLeft';
                inClass = 'pt-page-moveFromRight';
                break;
        }
        isAnimating = true;//正在进行动画
        $(nowPage).removeClass("hide");

        $(lastPage).addClass(outClass);
        $(nowPage).addClass(inClass);

        setTimeout(function () {
            $(lastPage).removeClass('page-current');
            $(lastPage).removeClass(outClass);
            $(lastPage).addClass("hide");
            $(lastPage).find("img").addClass("hide");

            $(nowPage).addClass('page-current');
            $(nowPage).removeClass(inClass);
            $(nowPage).find("img").removeClass("hide");

            isAnimating = false;
        }, default_config.speed);

    }

    /**
     * 初始化页
     * @param initialPage
     */
    function initPage(initialPage){
        var firstPage = $(container + ' .page')[initialPage];
        now = initialPage;
        $(firstPage).removeClass('hide');
        $(firstPage).addClass('page-current');
        $(firstPage).find("img").removeClass("hide");
    }

    /**
     * 页面切换效果
     */
    function pageMoveEffect(ef){

    }
}