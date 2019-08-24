window.onload=function ()
{
    var SCALE=20;  //速度比例基数
    var oImg=document.getElementById('img1');  //图片容器
    var oTxt=document.getElementById('box').getElementsByTagName('span')[0];  //进度条数值
    var oBar=document.getElementById('bar');  //进度条长度
    var aImg=[];  //图片存放数组
    var iImgCount=51;  //51张图片
    var iLoaded=0;  //当前导入的图片序列
    var iNow=0;
    var i=0;
    //加载所有资源
    for(i=0;i<iImgCount;i++)
    {
        (function (i){  //闭包传递
            var oNewImg=new Image();  //创建判断图片容器
            oNewImg.onload=function ()  //图片加载完毕后执行，没加载完之前显示进度条
            {
                oTxt.innerHTML=oBar.style.width=Math.ceil(100*iLoaded/iImgCount)+'%';  //控制span内容和进度条长度
                oNewImg.onload=null;  //关闭事件

                var oImg=document.createElement('img');  //创建图片标签
                oImg.src=this.src;  //设置src
                oImg.style.display='none';  //默认照片都是隐藏的
                document.body.appendChild(oImg);  //加载图片到页面
                aImg[i]=oImg;  //将img obj推入数组 ，未加载的图片数组位置为空

                if(++iLoaded==iImgCount)onLoad();  //如果图片加载完后，则执行onload事件，iLoad先++后判断
            };
            oNewImg.src='img/'+i+'.png';  //依次设置图片src
        })(i);
    }

    //效果
    function onLoad()
    {
        for(i=0;i<iImgCount;i++)if(!aImg[i])alert('资源加载失败，请刷新重试');  //判断是否全部照片都在数组中，若有一个位置为空则失败
        var lastImg=null;
        document.getElementById('box').style.display=document.getElementById('bg').style.display='none';  //加载背景和加载框消失
        document.body.removeChild(oImg);  //移出页面默认初始图片
        var body=document.body;  //页面主体
        oImg=null;
        var timer=null;  //惯性运动计时器
        var num=iNow;
        var speed=0;  //惯性运动速度

        aImg[0].style.display='block';  //数组第一张图片为显示
        lastImg=aImg[0];  //暂存

        //鼠标按下事件
        document.onmousedown=function (ev)
        {
            var oEvent=ev||event;
            var startX=oEvent.clientX;  //鼠标x坐标
            var lastX=startX;  //记录鼠标当前位置

            if(body.setCapture)
            {
                body.onmousemove=onMove;
                body.onmouseup=onUp;

                body.setCapture();  //全部的鼠标事件重新定向到这个元素
            }
            else
            {
                document.onmousemove=onMove;
                document.onmouseup=onUp;
            }

            //鼠标移动事件
            function onMove(ev)
            {
                //鼠标移动切换图片设置
                var oEvent=ev||event;
                var i=(oEvent.clientX-startX)/SCALE;  //设置要切换到图片的位置

                num=(iNow+i+Math.abs(Math.floor(i/iImgCount))*iImgCount)%iImgCount;  //防止超过77张

                if(lastImg!=aImg[parseInt(num)])  //上一张图片和这一张不一样
                {
                    lastImg.style.display='none';  //上一张消失
                    aImg[parseInt(num)].style.display='block';  //下一张显示
                    lastImg=aImg[parseInt(num)];  //更新
                }


                //松开惯性运动设置
                speed=(oEvent.clientX-lastX)/SCALE;  //获取速度
                lastX=oEvent.clientX;  //更新

                return false;
            }

            //鼠标抬起事件
            function onUp()
            {
                this.onmousemove=null;
                this.onmouseup=null;

                if(body.releaseCapture)body.releaseCapture();  //解锁

                iNow=num;  //当前照片为num

                startMove();  //开始惯性运动
            }

            //清除计时器
            stopMove();

            return false;  //结束事件
        };

        //运动事件
        function startMove()
        {
            timer=setInterval(function (){
                iNow=(iNow+speed+iImgCount)%iImgCount;  //当前图片位置
                lastImg.style.display='none';  //上一张图片为none
                aImg[parseInt(iNow)].style.display='block'; //下一张图片显示
                lastImg=aImg[parseInt(iNow)];  //更新上一张图片

                speed*=0.9;  //摩擦力

                if(Math.abs(speed)<=0.8)  //速度小于0.8时停止计时器
                {
                    clearInterval(timer);
                    speed=0;
                }
            }, 30);
        }

        //清除计时器
        function stopMove()
        {
            clearInterval(timer);
        }
    }
};
