/*js代码(www.jsdaima.com)是IT资源下载与IT技能学习平台。我们拒绝滥竽充数，只提供精品IT资源！*/

var cal;
var isFocus=false; //是否为焦点
function SelectDate(obj){
    var date=new Date();
    var by=date.getFullYear()-10; //最小值 → 10 年前
    var ey=date.getFullYear()+10; //最大值 → 10 年后
    cal=(cal==null)?new Calendar(by, ey):cal;
    cal.show(obj);
}

String.prototype.toDate=function(style){
	var y=this.substring(style.indexOf('y'),style.lastIndexOf('y')+1);//年
	var m=this.substring(style.indexOf('M'),style.lastIndexOf('M')+1);//月
	var d=this.substring(style.indexOf('d'),style.lastIndexOf('d')+1);//日
	if(isNaN(y)) y=new Date().getFullYear();
	if(isNaN(m)) m=new Date().getMonth();
	if(isNaN(d)) d=new Date().getDate();
	var dt ;
	eval("dt=new Date('"+y+"', '"+(m-1)+"', '"+d+"')");
	return dt;
}

Date.prototype.format=function(style){
	var o={
		'M+':this.getMonth()+1, //month
		'd+':this.getDate(),      //day
		'h+':this.getHours(),     //hour
		'm+':this.getMinutes(),   //minute
		's+':this.getSeconds(),   //second
		'w+':''.charAt(this.getDay()),   //week
		'q+':Math.floor((this.getMonth()+3) / 3), //quarter
		'S':this.getMilliseconds() //millisecond
	}
	if(/(y+)/.test(style)){
		style=style.replace(RegExp.$1,
		(this.getFullYear()+'').substr(4-RegExp.$1.length));
	}
	for(var k in o){
		if(new RegExp('('+ k +')').test(style)){
		  style=style.replace(RegExp.$1,
			RegExp.$1.length==1?o[k] :
			('00'+o[k]).substr((''+o[k]).length));
		}
	}
	return style;
};

/*
* 日历类
* @param   beginYear 1990
* @param   endYear   2010
* @param   dateFormatStyle 'yyyy-MM-dd';
*/
function Calendar(beginYear, endYear){
	this.beginYear=1990;
	this.endYear=2010;
	this.dateFormatStyle='yyyy-MM-dd';
	
	if(beginYear!=null && endYear!=null){
		this.beginYear=beginYear;
		this.endYear=endYear;
	}
	
	this.dateControl=null;
	this.panel=this.getElementById('calendarPanel');
	this.container=this.getElementById('ContainerPanel');
	this.form=null;
	
	this.date=new Date();
	this.year=this.date.getFullYear();
	this.month=this.date.getMonth();
	
	
	this.colors={
		'cur_word'     :'#FFFFFF', //当日日期文字颜色
		'cur_bg'       :'#83A6F4', //当日日期单元格背影色
		'sel_bg'       :'#FFCCCC', //已被选择的日期单元格背影色
		'sun_word'     :'#FF0000', //星期天文字颜色
		'sat_word'     :'#0000FF', //星期六文字颜色
		'td_word_light':'#333333', //单元格文字颜色
		'td_word_dark' :'#CCCCCC', //单元格文字暗色
		'td_bg_out'    :'#EFEFEF', //单元格背影色
		'td_bg_over'   :'#FFCC00', //单元格背影色
		'tr_word'      :'#FFFFFF', //日历头文字颜色
		'tr_bg'        :'#666666', //日历头背影色
		'input_border' :'#CCCCCC', //input控件的边框颜色
		'input_bg'     :'#EFEFEF'  //input控件的背影色
	}
	
	this.draw();
	this.bindYear();
	this.bindMonth();
	this.changeSelect();
	this.bindData();
}

Calendar.prototype.draw=function(){
	calendar=this;
	
	var mvAry=[];
	mvAry[mvAry.length]=' <div name="calendarForm" style="margin:0px;">';
	mvAry[mvAry.length]='    <table width="100%" border="0" cellpadding="0" cellspacing="1">';
	mvAry[mvAry.length]='      <tr>';
	mvAry[mvAry.length]='        <th align="left" width="1%"><input style="border:1px solid '+calendar.colors["input_border"]+'; background:'+calendar.colors["input_bg"]+'; width:16px; height:20px; line-height:20px;" name="prevMonth" type="button" id="prevMonth" value="&lt;" /></th>';
	mvAry[mvAry.length]='        <th align="center" width="98%" nowrap><select name="calendarYear" id="calendarYear" style="font-size:12px;"></select><select name="calendarMonth" id="calendarMonth" style="font-size:12px;"></select></th>';
	mvAry[mvAry.length]='        <th align="right" width="1%"><input style="border:1px solid '+calendar.colors["input_border"]+'; background:'+calendar.colors["input_bg"]+'; width:16px; height:20px; line-height:20px;" name="nextMonth" type="button" id="nextMonth" value="&gt;" /></th>';
	mvAry[mvAry.length]='      </tr>';
	mvAry[mvAry.length]='    </table>';
	mvAry[mvAry.length]='    <table id="calendarTable" width="100%" style="border:0px solid #ccc; background-color:#fff" border="0" cellpadding="3" cellspacing="1">';
	mvAry[mvAry.length]='      <tr>';
	for(var i=0; i<7; i++){
		mvAry[mvAry.length]='      <th style="font-weight:normal; background-color:'+calendar.colors["tr_bg"]+'; color:'+calendar.colors["tr_word"]+';">'+eval('Ly200JsLang._date._weeks._'+i)+'</th>';
	}
	mvAry[mvAry.length]='      </tr>';
	for(var i=0; i<6;i++){
		mvAry[mvAry.length]='    <tr align="center">';
		for(var j=0; j<7; j++){
			if(j==0){
				mvAry[mvAry.length]=' <td style="cursor:default;color:'+calendar.colors["sun_word"]+';"></td>';
			}else if(j==6){
				mvAry[mvAry.length]=' <td style="cursor:default;color:'+calendar.colors["sat_word"]+';"></td>';
			}else{
				mvAry[mvAry.length]=' <td style="cursor:default;"></td>';
			}
		}
		mvAry[mvAry.length]='    </tr>';
	}
	mvAry[mvAry.length]='      <tr style="background-color:'+calendar.colors["input_bg"]+';">';
	mvAry[mvAry.length]='        <th colspan="2"><input name="calendarClear" type="button" id="calendarClear" value="'+Ly200JsLang._date._clear+'" style="border:1px solid '+calendar.colors["input_border"]+'; background:'+calendar.colors["input_bg"]+'; width:100%; height:20px; line-height:20px; font-size:12px;"/></th>';
	mvAry[mvAry.length]='        <th colspan="3"><input name="calendarToday" type="button" id="calendarToday" value="'+Ly200JsLang._date._today+'" style="border:1px solid '+calendar.colors["input_border"]+'; background:'+calendar.colors["input_bg"]+'; width:100%; height:20px; line-height:20px; font-size:12px;"/></th>';
	mvAry[mvAry.length]='        <th colspan="2"><input name="calendarClose" type="button" id="calendarClose" value="'+Ly200JsLang._date._close+'" style="border:1px solid '+calendar.colors["input_border"]+'; background:'+calendar.colors["input_bg"]+'; width:100%; height:20px; line-height:20px; font-size:12px;"/></th>';
	mvAry[mvAry.length]='      </tr>';
	mvAry[mvAry.length]='    </table>';
	mvAry[mvAry.length]=' </div>';
	this.panel.innerHTML=mvAry.join('');
	
	var obj=this.getElementById('prevMonth');
	obj.onclick=function (){calendar.goPrevMonth(calendar);}
	obj.onblur=function (){calendar.onblur();}
	this.prevMonth= obj;
	
	obj=this.getElementById('nextMonth');
	obj.onclick=function (){calendar.goNextMonth(calendar);}
	obj.onblur=function (){calendar.onblur();}
	this.nextMonth= obj;
	
	
	obj=this.getElementById('calendarClear');
	obj.onclick=function (){calendar.dateControl.value='';calendar.hide();}
	this.calendarClear=obj;
	
	obj=this.getElementById('calendarClose');
	obj.onclick=function (){calendar.hide();}
	this.calendarClose=obj;
	
	obj=this.getElementById('calendarYear');
	obj.onchange=function (){calendar.update(calendar);}
	obj.onblur=function (){calendar.onblur();}
	this.calendarYear=obj;
	
	obj=this.getElementById('calendarMonth');
	with(obj)
	{
		onchange=function (){calendar.update(calendar);}
		onblur=function (){calendar.onblur();}
	}this.calendarMonth=obj;
	
	obj=this.getElementById('calendarToday');
	obj.onclick=function (){
		var today=new Date();
		calendar.date=today;
		calendar.year=today.getFullYear();
		calendar.month=today.getMonth();
		calendar.changeSelect();
		calendar.bindData();
		calendar.dateControl.value=today.format(calendar.dateFormatStyle);
		calendar.hide();
	}
	this.calendarToday=obj;
}

//年份下拉框绑定数据
Calendar.prototype.bindYear=function(){
	var cy=this.calendarYear;
	cy.length=0;
	for(var i=this.beginYear; i <= this.endYear; i++){
		cy.options[cy.length]=new Option(i, i);
	}
}

//月份下拉框绑定数据
Calendar.prototype.bindMonth=function(){
	var cm=this.calendarMonth;
	cm.length=0;
	for(var i=0; i<12; i++){
		cm.options[cm.length]=new Option(eval('Ly200JsLang._date._months._'+i), i);
	}
}

//向前一月
Calendar.prototype.goPrevMonth=function(e){
	if(this.year==this.beginYear && this.month==0){return;}
	this.month--;
	if(this.month==-1){
		this.year--;
		this.month=11;
	}
	this.date=new Date(this.year, this.month, 1);
	this.changeSelect();
	this.bindData();
}

//向后一月
Calendar.prototype.goNextMonth=function(e){
	if(this.year==this.endYear && this.month==11){return;}
	this.month++;
	if(this.month==12){
		this.year++;
		this.month=0;
	}
	this.date=new Date(this.year, this.month, 1);
	this.changeSelect();
	this.bindData();
}

//改变SELECT选中状态
Calendar.prototype.changeSelect=function(){
	var cy=this.calendarYear;
	var cm=this.calendarMonth;
	for(var i= 0; i<cy.length; i++){
		if(cy.options[i].value==this.date.getFullYear()){
		  cy[i].selected=true;
		  break;
		}
	}
	for(var i= 0; i<cm.length; i++){
		if(cm.options[i].value==this.date.getMonth()){
		  cm[i].selected=true;
		  break;
		}
	}
}

//更新年、月
Calendar.prototype.update=function (e){
	this.year=e.calendarYear.options[e.calendarYear.selectedIndex].value;
	this.month=e.calendarMonth.options[e.calendarMonth.selectedIndex].value;
	this.date=new Date(this.year, this.month, 1);
	this.changeSelect();
	this.bindData();
}

//绑定数据到月视图
Calendar.prototype.bindData=function (){
	var calendar=this;
	var dateArray=this.getMonthViewArray(this.date.getFullYear(), this.date.getMonth());
	var tds=this.getElementById('calendarTable').getElementsByTagName('td');
	for(var i=0; i<tds.length; i++){
	tds[i].style.backgroundColor=calendar.colors['td_bg_out'];
		tds[i].onclick=function(){return;}
		tds[i].onmouseover=function(){return;}
		tds[i].onmouseout=function(){return;}
		if(i > dateArray.length-1) break;
		tds[i].innerHTML=dateArray[i];
		if(dateArray[i]!='&nbsp;'){
			tds[i].onclick=function(){
			if(calendar.dateControl!=null){
				calendar.dateControl.value=new Date(calendar.date.getFullYear(),
					calendar.date.getMonth(),
					this.innerHTML).format(calendar.dateFormatStyle);
			}
			calendar.hide();
			}
			tds[i].onmouseover=function(){
				this.style.backgroundColor=calendar.colors['td_bg_over'];
			}
			tds[i].onmouseout=function(){
				this.style.backgroundColor=calendar.colors['td_bg_out'];
			}
			if(new Date().format(calendar.dateFormatStyle)==
				new Date(calendar.date.getFullYear(),
					calendar.date.getMonth(),
					dateArray[i]).format(calendar.dateFormatStyle)) {
					tds[i].style.backgroundColor=calendar.colors['cur_bg'];
					tds[i].onmouseover=function(){
						this.style.backgroundColor=calendar.colors['td_bg_over'];
					}
				tds[i].onmouseout=function(){
					this.style.backgroundColor=calendar.colors['cur_bg'];
				}
			}//end if
			 
			//设置已被选择的日期单元格背影色
			if(calendar.dateControl!=null && calendar.dateControl.value==new Date(calendar.date.getFullYear(),
				calendar.date.getMonth(),
				dateArray[i]).format(calendar.dateFormatStyle)) {
				tds[i].style.backgroundColor=calendar.colors['sel_bg'];
				tds[i].onmouseover=function(){
					this.style.backgroundColor=calendar.colors['td_bg_over'];
				}
				tds[i].onmouseout=function(){
					this.style.backgroundColor=calendar.colors['sel_bg'];
				}
			}
		}
	}
}

//根据年、月得到月视图数据(数组形式)
Calendar.prototype.getMonthViewArray=function (y, m) {
	var mvArray=[];
	var dayOfFirstDay=new Date(y, m, 1).getDay();
	var daysOfMonth=new Date(y, m+1, 0).getDate();
	for(var i=0; i<42; i++) {
		mvArray[i]='&nbsp;';
	}
	for(var i=0; i<daysOfMonth; i++){
		mvArray[i+dayOfFirstDay]=i+1;
	}
	return mvArray;
}

//扩展 document.getElementById(id) 多浏览器兼容性 from meizz tree source
Calendar.prototype.getElementById=function(id){
	if(typeof(id)!='string' || id=='') return null;
	if(document.getElementById) return document.getElementById(id);
	if(document.all) return document.all(id);
	try{return eval(id);}catch(e){return null;}
}

//扩展 object.getElementsByTagName(tagName)
Calendar.prototype.getElementsByTagName=function(object, tagName){
	if(document.getElementsByTagName) return document.getElementsByTagName(tagName);
	if(document.all) return document.all.tags(tagName);
}

//取得HTML控件绝对位置
Calendar.prototype.getAbsPoint=function (e){
	var x=e.offsetLeft;
	var y=e.offsetTop;
	while(e=e.offsetParent){
		x+=e.offsetLeft;
		y+=e.offsetTop;
	}
	return {'x':x, 'y':y};
}

//显示日历
Calendar.prototype.show=function (dateObj, popControl) {
	if(dateObj==null){
		throw new Error('arguments[0] is necessary')
	}
	this.dateControl=dateObj;
	
	this.date=(dateObj.value.length > 0)?new Date(dateObj.value.toDate(this.dateFormatStyle)):new Date() ;//若为空则显示当前月份
	this.year=this.date.getFullYear();
	this.month=this.date.getMonth();
	this.changeSelect();
	this.bindData();
	if(popControl==null){
		popControl=dateObj;
	}
	var xy=this.getAbsPoint(popControl);
	this.panel.style.left=xy.x-25+'px';
	this.panel.style.top=(xy.y+dateObj.offsetHeight)+'px';
	
	this.panel.style.display='';
	this.container.style.display='';
	
	dateObj.onblur=function(){calendar.onblur();}
	this.container.onmouseover=function(){isFocus=true;}
	this.container.onmouseout=function(){isFocus=false;}
}

//隐藏日历
Calendar.prototype.hide=function() {
	this.panel.style.display='none';
	this.container.style.display='none';
	isFocus=false;
}

//焦点转移时隐藏日历
Calendar.prototype.onblur=function() {
    if(!isFocus){this.hide();}
}
document.write('<div id="ContainerPanel" style="display:none;"><div id="calendarPanel" style="position:absolute; display:none; z-index:9999;');
document.write('background:#fff; border:1px solid #ccc; width:175px; font-size:12px; margin-left:25px;"></div>');
if(document.all)
{
	document.write('<iframe style="position:absolute;z-index:2000;width:expression(this.previousSibling.offsetWidth);');
	document.write('height:expression(this.previousSibling.offsetHeight);');
	document.write('left:expression(this.previousSibling.offsetLeft);top:expression(this.previousSibling.offsetTop);');
	document.write('display:expression(this.previousSibling.style.display);" scrolling="no" frameborder="no"></iframe>');
}
document.write('</div>');