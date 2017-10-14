/*!
 * NBstrap v2.2.0
 * Copyright 2017-2018 NBuilder, Inc.
 * Licensed under MIT
 */
var nbuilderWindowHeight = 0; //窗体高度

var nbuilderWindowObject; //窗体对象
var nbuilderWindowMaxState = false; //大小对象
var nbuilderWindowBoderShadowState = false;
var nbuilderMousewheel = 'normal';
/*
 * 名称：页面 ready 事件
 * 输入：
 * 输出：
 * 描述：
 */

$(window).ready(function() {

	nbuilderWindowHeight = $(window).outerHeight(true);

	if($(".nb-window").hasClass("nb-boder-shadow")) {
		nbuilderWindowBoderShadowState = true;
	}

	nbuilder_resize();

	var gui;

	try {
		gui = require('nw.gui');
		console.log("NBuilder");
	} catch(e) {
		console.log("WEB");
	}

	if(gui) {
		nbuilderWindowObject = nw.Window.get();　　
		//关闭窗体事件
		$(".nb-win-close").click(function() {
			nbuilderWindowObject.close();
		});

		//最大化窗体事件
		$(".nb-win-max").click(function() {
			if(nbuilderWindowMaxState == false) {
				nbuilderWindowObject.maximize();

			} else {
				nbuilderWindowObject.restore()

			}
		});

		//最小化窗体事件
		$(".nb-win-min").click(function() {
			nbuilderWindowObject.minimize();

		});
	} else {
		nbuilderWindowObject = null;　　
	}

	if(nbuilderWindowObject != null) {
		nbuilderWindowObject.on('maximize', function() {

			if(nbuilderWindowBoderShadowState == true) {
				$(".nb-window").removeClass("nb-boder-shadow");
				nbuilder_resize();
			}

			nbuilderWindowMaxState = true;

		});

		nbuilderWindowObject.on('restore', function() {

			if(nbuilderWindowBoderShadowState == true) {
				$(".nb-window").addClass("nb-boder-shadow");
				nbuilder_resize();
			}

			nbuilderWindowMaxState = false;
		});
	}

});

/*
 * 名称：页面 resize 事件
 * 输入：
 * 输出：
 * 描述：
 */
$(window).resize(function() {
	nbuilderWindowHeight = $(window).outerHeight(true);
	nbuilder_resize();
});

/*
 * 名称：刷新 标题栏 内容高度
 * 输入：
 * 输出：
 * 描述：
 */
function nbuilder_resize() {
	bodyOuterHeight = $(document.body).outerHeight(true) - $(document.body).height();
	$(".nb-window").height(nbuilderWindowHeight - bodyOuterHeight); //设置最大框架高度
}

document.onmousewheel = function(e) {

	if(e.wheelDelta == -120) {

		nbuilderMousewheel = 'down';

	}
	if(e.wheelDelta == 120) {

		nbuilderMousewheel = 'up';

	}

};

$(".nb-layout").scroll(function() {
	var divHeight = $(this).height();
	var nScrollHeight = $(this)[0].scrollHeight;
	var nScrollTop = $(this)[0].scrollTop;

	if(nScrollTop <= 0 && nbuilderMousewheel == 'up') {

		if(nbLayoutScroll && typeof(nbLayoutScroll) == "function") {
			nbLayoutScroll($(this), "top");
		}

		nbuilderMousewheel = 'normal';
	}


	if( Math.ceil(nScrollTop + divHeight) >= nScrollHeight && nbuilderMousewheel == 'down') {

		if(nbLayoutScroll && typeof(nbLayoutScroll) == "function") {
			nbLayoutScroll($(this), "bottom");
		}

		nbuilderMousewheel = 'normal';
	}
});

var xflag = false;
var yflag = false;

var prevNode;
var nextNode;
var thisNode;

var pointStartX;
var pointStartY;

$(".nb-drag-ew").mousedown(function(e) {
	pointStartX = e.pageX;

	prevNode = $(this).prev(".nb-layout");
	nextNode = $(this).next(".nb-layout");
	thisNode = $(this);
	parentNode = $(this).parent();

	prevWidth = prevNode.width();
	nextWidth = nextNode.width();
	thisWidth = thisNode.width();
	parentWidth = parentNode.width();

	xflag = true;
});

$(".nb-drag-ns").mousedown(function(e) {

	pointStartY = e.pageY;

	prevNode = $(this).prev(".nb-layout");
	nextNode = $(this).next(".nb-layout");
	thisNode = $(this);
	parentNode = $(this).parent();

	prevHeight = prevNode.height();
	nextHeight = nextNode.height();
	thisHeight = thisNode.height();
	parentHeight = parentNode.height();

	yflag = true;
});

$(document).mousemove(function(e) {

	if(xflag) {

		var pointNowX = e.pageX;
		var Xdistance = pointNowX - pointStartX;

		var parentLeft = parentNode.offset().left;
		var parentRight = parentLeft + parentWidth;

		var thisLeft = thisNode.offset().left;
		var thisRight = thisLeft + thisWidth;

		var prevSetPercent = (prevWidth + Xdistance) / parentWidth;
		var nextSetPercent = (nextWidth - Xdistance + thisWidth) / parentWidth;

		if(prevNode.width() >= parentWidth - thisWidth && Xdistance > 0) {
			prevNode.css('width', 'calc(100% - ' + thisWidth + 'px)');
			nextNode.css('width', 'calc(0%)');
			return;

		}

		if(prevSetPercent < 0) {
			prevNode.css('width', 'calc(0%)');
			nextNode.css('width', 'calc(100% - ' + thisWidth + 'px)');
			return;
		} else {
			prevNode.css('width', 'calc(' + prevSetPercent * 100 + '%)');
			nextNode.css('width', 'calc(' + nextSetPercent * 100 + '% - ' + thisWidth + 'px)');
		}

	}

	if(yflag) {
		var pointNowY = e.pageY;

		var Ydistance = pointNowY - pointStartY;

		var parentTop = parentNode.offset().top;
		var parentBottom = parentTop + parentHeight;

		var prevSetPercent = (prevHeight + Ydistance) / parentHeight;
		var nextSetPercent = (nextHeight - Ydistance + thisHeight) / parentHeight;

		if(prevNode.height() >= parentHeight - thisHeight && Ydistance > 0) {
			prevNode.css('height', 'calc(100% - ' + thisHeight + 'px)');
			nextNode.css('height', 'calc(0%)');
			return;

		}

		if(prevSetPercent < 0) {
			prevNode.css('height', 'calc(0%)');
			nextNode.css('height', 'calc(100% - ' + thisHeight + 'px)');
		} else {
			prevNode.css('height', 'calc(' + prevSetPercent * 100 + '%)');
			nextNode.css('height', 'calc(' + nextSetPercent * 100 + '% - ' + thisHeight + 'px)');
		}

	}

});

$(document).mouseup(function() {
	xflag = false;
	yflag = false;
});