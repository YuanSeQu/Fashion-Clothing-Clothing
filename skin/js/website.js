/*js代码(www.jsdaima.com)是IT资源下载与IT技能学习平台。我们拒绝滥竽充数，只提供精品IT资源！*/
$(window).load(function(){
	var winw = $(window).width();
	var winh = $(window).height();
	
	/*PC端打开效果*/
	if(winw>=980){
		new WOW().init({});
	}

	//头部
	if(winw>980){
		var HeaderHeight = $('#header').outerHeight();
		$('#head').height(HeaderHeight);
	}else{
		var PhoneHeaderHeight = $('#phone_header').outerHeight();
		$('#head').height(PhoneHeaderHeight);
		$('#phone_header').find('.nav').css('top',PhoneHeaderHeight);
		$('#phone_header').find('.nav').height(winh-PhoneHeaderHeight);
	}

	/*广告图*/
	$('#banner .nts').eq(0).addClass('on');
	
	/*底部*/
	if(winw>540){
		var FooterLeftHeight = $('#footer .left').outerHeight();
		$('#footer .right').height(FooterLeftHeight);
	}else{
		$('#footer .right').css('height','auto');
	}
})

$(window).resize(function(){
	var winw = $(window).width();
	var winh = $(window).height();
	
	/*PC端打开效果*/
	if(winw>=980){
		new WOW().init({});
	}

	//头部
	if(winw>980){
		var HeaderHeight = $('#header').outerHeight();
		$('#head').height(HeaderHeight);
	}else{
		var PhoneHeaderHeight = $('#phone_header').outerHeight();
		$('#head').height(PhoneHeaderHeight);
		$('#phone_header').find('.nav').css('top',PhoneHeaderHeight);
		$('#phone_header').find('.nav').height(winh-PhoneHeaderHeight);
	}
	
	/*底部*/
	if(winw>540){
		var FooterLeftHeight = $('#footer .left').outerHeight();
		$('#footer .right').height(FooterLeftHeight);
	}else{
		$('#footer .right').css('height','auto');
	}
})

function Recruitment_List(obj){//人才招聘
	if(obj.parents('.list').hasClass('on')){
		obj.parents('.list').removeClass('on').find('.bot').stop(true,true).slideUp();
	}else{
		obj.parents('.list').addClass('on').find('.bot').stop(true,true).slideDown();
		obj.parents('.list').siblings('.list').removeClass('on').find('.bot').stop(true,true).slideUp();
	}
}

/*手机版js*/
function HeaderNavSH(){//导航显示、隐藏
	if($('#phone_header .target').hasClass('on')){
		$('#phone_header .target').removeClass('on');
		$('#phone_header .nav').stop(true,true).slideUp();
	}else{
		$('#phone_header .target').addClass('on');
		$('#phone_header .nav').stop(true,true).slideDown();
	}
}

function PhoneHeaderNavTwo(obj){//二级导航
	if(obj.parents('.list').hasClass('on')){
		obj.parents('.list').removeClass('on');
		obj.siblings('.two').stop(true,true).slideUp();
	}else{
		obj.parents('.list').addClass('on');
		obj.siblings('.two').stop(true,true).slideDown();
	}
}