var iconv = require('iconv-lite');
var connectionId;

var serialRevStringState = true;
var serialRevEnterState = false;

/*
 * 名称：二进制数组转字符串
 * 输入：
 * 输出：
 * 描述：
 */
function convertArrayBufferToString(buf) {
	//转换为Uint8 
	var bufView = new Uint8Array(buf);
	var encodedString = String.fromCharCode.apply(null, bufView);
	var str = iconv.decode(encodedString, 'gbk');

	return str;
}

/*
 * 名称：字符串转二进制数组
 * 输入：
 * 输出：
 * 描述：
 */
var convertStringToArrayBuffer = function(str) {
	var buf = new ArrayBuffer(str.length);
	var bufView = new Uint8Array(buf);
	for(var i = 0; i < str.length; i++) {
		bufView[i] = str.charCodeAt(i);
	}
	return buf;
};

function toHex(num) { //将一个数字转化成16进制字符串形式
	return num < 16 ? "0x0" + num.toString(16).toUpperCase() : "0x" + num.toString(16).toUpperCase();
}

/*
 * 名称：接收数据
 * 输入：
 * 输出：info.data 为二进制数组  receiceString 为转换为字符串后的值
 * 描述：
 */
var onReceiveCallback = function(info) {
	receiceString = convertArrayBufferToString(info.data);

	if(serialRevStringState == true) {
		$("#consoletext").val($("#consoletext").val() + receiceString);
	} else {

		var bufView = new Uint8Array(info.data);
		for(var i = 0; i < bufView.length; i++) {
			console.log(toHex(bufView[i]));

			$("#consoletext").val($("#consoletext").val() + toHex(bufView[i]) + " ");
		}
	}

	if(serialRevEnterState == true) {
		$("#consoletext").val($("#consoletext").val() + "\r\n");
	}

	var scrollTop = $("#consoletext")[0].scrollHeight;
	$("#consoletext").scrollTop(scrollTop);
};

/*
 * 名称：选定COM口被打开
 * 输入：
 * 输出：
 * 描述：
 */
var onConnect = function(connectionInfo) {
	connectionId = connectionInfo.connectionId;

	$("#openSerial").hide();
	$("#closeSerial").show();
};

/*
 * 名称：选定COM口被关闭
 * 输入：
 * 输出：
 * 描述：
 */
var onClose = function() {

	$("#openSerial").show();
	$("#closeSerial").hide();
};

/*
 * 名称：打开指定COM口
 * 输入：
 * 输出：
 * 描述：
 */
var openCom = function() {

	var serialPort = $("#serialPortsList").val();
	var serialBand = parseInt($("#serialBandsList").val());
	chrome.serial.connect(serialPort, {
		bitrate: serialBand
	}, onConnect);
}

/*
 * 名称：关闭指定COM口
 * 输入：
 * 输出：
 * 描述：
 */
var closeCom = function() {
	chrome.serial.disconnect(connectionId, onClose);

}

/*
 * 名称：列举所有COM口
 * 输入：
 * 输出：
 * 描述：
 */
var onGetDevices = function(ports) {
	$("#serialPortsList").empty();
	for(var i = 0; i < ports.length; i++) {
		$("#serialPortsList").append('<option value="' + ports[i].path + '">' + ports[i].path + '</option>');
	}
}

var listCom = function() {

	chrome.serial.getDevices(onGetDevices);
}

/*
 * 名称：发送数据
 * 输入：
 * 输出：
 * 描述：
 */
var sendData = function() {

	var buffer = new ArrayBuffer(1);
	var dataView = new DataView(buffer);
	dataView.setInt8(0, 0xaa);

	//此处为发送字符串 上边注释为发送二进制 请自行选择
	//var sendtext = document.getElementById("sendtext");
	//sendtextvalue = sendtext.value;
	//var buffer = convertStringToArrayBuffer(sendtextvalue);

	chrome.serial.send(connectionId, buffer, function() {});
}

/*
 * 名称：发送数据
 * 输入：
 * 输出：
 * 描述：
 */
var sendDataString = function() {

	//var buffer = new ArrayBuffer(1);
	//var dataView = new DataView(buffer);

	//dataView.setInt8(0, 0x00);

	//此处为发送字符串 上边注释为发送二进制 请自行选择
	var sendtext = $("#sendText").val();
	var buffer = convertStringToArrayBuffer(sendtext);

	chrome.serial.send(connectionId, buffer, function() {});
}

/*
 * 名称：窗体完成加载事件
 * 输入：
 * 输出：
 * 描述：
 */
$(window).ready(function() {
	listCom();
    chrome.serial.onReceive.addListener(onReceiveCallback);
})

/*
 * 名称：刷新按钮事件
 * 输入：
 * 输出：
 * 描述：
 */
$("#renovateSerial").click(function() {
	listCom();
});

/*
 * 名称：打开按钮事件
 * 输入：
 * 输出：
 * 描述：
 */
$("#openSerial").click(function() {
	openCom();
});

/*
 * 名称：关闭按钮事件
 * 输入：
 * 输出：
 * 描述：
 */
$("#closeSerial").click(function() {
	closeCom();
});

/*
 * 名称：发送按钮事件
 * 输入：
 * 输出：
 * 描述：
 */
$("#sendSerial").click(function() {
	sendDataString();
});

/*
 * 名称：清除发送区按钮事件
 * 输入：
 * 输出：
 * 描述：
 */
$("#clearSerial").click(function() {
	$("#sendText").val("");
});

/*
 * 名称：清除接收区按钮事件
 * 输入：
 * 输出：
 * 描述：
 */
$("#clearRec").click(function() {
	$("#consoletext").val("");
});


$("#serialPortsList").change(function(){
	closeCom();
})

$("#serialBandsList").change(function(){
	closeCom();
})

$().on('switch-change', function(e, data) {
	var $el = $(data.el),
		value = data.value;
	console.log(e, $el, value);
});

$("#hexString").on('switchChange.bootstrapSwitch', function(event, state) {

	if(state == false) {
		serialRevStringState = false;
	} else {
		serialRevStringState = true;
	}
});

$("#enterSwitch").on('switchChange.bootstrapSwitch', function(event, state) {

	if(state == false) {
		serialRevEnterState = false;
	} else {
		serialRevEnterState = true;
	}
});


/*
 * 名称：赛灵开源社区连接
 * 输入：
 * 输出：
 * 描述：
 */
$("#CelerStar").click(function() {
	nw.Shell.openExternal('https://www.celerstar.com/');
});
