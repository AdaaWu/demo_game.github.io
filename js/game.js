$(function(){
	var $table=$('#main .center .table');
	var $chip_i=$('#bottom .control span.chip-group i');
	var $item_info_tip=$('#main .center .table .item-info-tip');
	var $btn=$('.control-content .btn');
	var $my_money=$('#bottom .control .my-money .num ');
	var $select=$('.chip-seleced');
	var chipW=$select.width();
	var chipH=$select.height();
	var chipArr=new Array(Data.length);
	var dataArr= new Array();
	var storageArr=new Array();
	var nowTime=new Date();
	var tipTn=-3;
	var mask=false,mask1=false;
	var value,radioValue;
	for (var x=0;x < chipArr.length ;x++ )
	{
		chipArr[x]=new Array();
	}
	//取消右键菜单
	// $('body').bind("contextmenu",function(e){ 
    //       return false;   
    // });

	init();
	//初始化布局
	function init(){
		for (var i=0;i < Data.length ;i++ )
		{
			var oDiv=document.createElement('div');
				oDiv.setAttribute('data-name',Data[i].name);
				oDiv.style.cssText='width:'+Data[i].width+'px;height:'+Data[i].height+'px;left:'+Data[i].left+'px;top:'+Data[i].top+'px;';
				oDiv.className='itemLump item-'+Data[i].name;
			var oSpanP=document.createElement('span');
				oSpanP.className='tip';
			var oSpan=document.createElement('span');
				oSpan.className='text';
				oSpan.innerHTML='0.00';
				oSpanP.appendChild(oSpan);
				oDiv.appendChild(oSpanP);
				$table.append(oDiv);
		}
	}
	var $tip=$('#main .center .table .itemLump span.tip');
	var $itemLump=$('#main .center .table div.itemLump');
	//table背景定位
	$itemLump.each(function(i){
		$itemLump.eq(i).hover(function(){
			var sum=parseInt($(this).find('.text').html());
			$(this).css('backgroundPosition',Data[i].backgroundP);
			if(sum){
				$(this).find('.tip').addClass('hove-show');
			}
		},function(){
			$(this).css('backgroundPosition','10000px 10000px');
			$(this).find('.tip').removeClass('hove-show');
		});
	});
	/*************************************************************************************************************************/
	//投注
	$itemLump.mousedown(function(event, a){
		var $select=$('.chip-seleced');
		var index=$(this).index() - 9;
		var This=$(this);
		var text=parseInt($(this).find('.text').html());
		var chipMon=$select.attr('data-money');
		var x=$(this).offset().left + $(this).width()/2-chipW/2;
		var y=$(this).offset().top + $(this).height()/2-chipH/2;
		//左键投注
        if(event.which == 1 || a == 'left'){
			var json={};
			var chipL=$select.offset().left;
			var chipT=$select.offset().top;
			var chipBp=$select.css('backgroundPosition');
			var isMax=text + parseInt(chipMon);
			if(new Date() - nowTime > 300)
			{
				if(isMax <= 200){
					var oChip=document.createElement('i');
						oChip.className='chip chip-add';
						oChip.style.cssText='left:'+chipL+'px;top:'+chipT+'px;background-position:'+chipBp+';';
					$('body').append(oChip);
					$('body > i').animate({left:x+'px',top:y+'px'},200,'linear',function(){
						$(this).remove();
						positionChip(This,chipMon,index,chipBp);
					});
					json={
						'chipBp':chipBp,
						'chipMon':chipMon,
						'posL':x,
						'posT':y,
						'index':index,
						'parent':This,
						'marginT':-chipArr[index].length * 3
					}
					chipArr[index].length++;
					dataArr.push(json);
					showMoney(This,tipTn,chipMon);
					if(dataArr.length){
						$('.empty').removeClass('btn-disabled');
						$('.repeal').removeClass('btn-disabled');
						$('.continuation').removeClass('btn-disabled');
					}
				}else{
				   $('.warning').fadeIn();
				}
				nowTime = new Date();
			}
        }else if(event.which == 3 || a == 'right'){
		//右键撤销
           if(new Date() - nowTime > 300){
			   if(chipArr[index].length && dataArr.length){
					var chipData=$(this).find('i').eq(chipArr[index].length - 1).attr('data-money');
					var targetObj=$('#bottom .control span.chip-group i[data-money="'+chipData+'"]');
					var targetL=targetObj.offset().left;
					var targetT=targetObj.offset().top;
					var targetBp=targetObj.css('backgroundPosition');
					$(this).find('i').eq(chipArr[index].length -1).remove();
					var oChip=document.createElement('i');
					oChip.className='chip chip-add';
					oChip.style.cssText='left:'+x+'px;top:'+y+'px;background-position:'+targetBp+';';
					$('body').append(oChip);
					$('body > i').animate({'left':targetL+'px','top':targetT+'px'},200,'linear',function(){
						$(this).remove();
					});
					chipArr[index].length?chipArr[index].length--:chipArr[index].length=0;
					for (var p=dataArr.length - 1;p >= 0 ;p-- )
					{
						if(index === dataArr[p].index){
							dataArr.splice(p,1);
							break;
						}
					}
					showMoney(This,-tipTn,-chipData);
					if(!dataArr.length){
						$('.empty').addClass('btn-disabled');
						$('.repeal').addClass('btn-disabled');
						$('.continuation').addClass('btn-disabled');
					}
			   }else{

			   }
			   nowTime = new Date();
		   }
        }
    });
	//控制面板
	$btn.click(function(){
		if(!$(this).hasClass('btn-disabled')){
			var index=$(this).index();
			switch(index){
				case 0:
					empty();
					break;
				case 1:
					repeal();
					break;
				case 5:
					storage();
					break;
				case 6:
					continuation();
					break;
			}
		}
	});
	//清空投注
	function empty(){
		$('.empty').addClass('btn-disabled');
		$('.repeal').addClass('btn-disabled');
		$('.continuation').addClass('btn-disabled');
		$itemLump.each(function(){
			$(this).find('i').remove();
		});
		$tip.css('top','-35px'); 
		$tip.find('.text').html('0.00');
		$('#bottom .control .statics .money').html('0.00');
		for (var j=0;j<dataArr.length;j++ )
		{
			anim(dataArr[j]);
		}
		for (var x=0;x < chipArr.length ;x++ )
		{
			chipArr[x].length=0;
		}
		dataArr.length=0;
	};
	//撤销投注
	function repeal(){
		if(new Date() - nowTime > 300){
			if(dataArr.length){
				var lastObj=dataArr.pop();
					lastObj.parent.find('i').eq(chipArr[lastObj.index].length-1).remove();
				anim(lastObj);
				showMoney(lastObj.parent,-tipTn,-lastObj.chipMon)
				chipArr[lastObj.index].length?chipArr[lastObj.index].length--:chipArr[lastObj.index].length=0;
				if(!dataArr.length){
					$('.empty').addClass('btn-disabled');
					$('.repeal').addClass('btn-disabled');
					$('.continuation').addClass('btn-disabled');
				}
			}
			nowTime = new Date();
		}
	};
	//投注金额显示
	function showMoney(This,a,b){
		var newA=Number(a);
		var newB=Number(b);
		var sum=0;
		var tipT=parseInt(This.find('.tip').css('top'));
		This.find('.tip').css('top',+(tipT+a)+'px');
		var txt=parseInt(This.find('.text').html());
		This.find('.text').html(txt+newB+'.00');
		for (var i=0;i < dataArr.length ;i++ )
		{
			sum+=parseInt(dataArr[i].chipMon);
		}
		$('#bottom .control .statics .money').html(sum+'.00');
	};
	//撤销动画
	function anim(arr){
		var oChip=document.createElement('i');
				oChip.className='chip chip-add';
				oChip.setAttribute('data-money',arr.chipMon);
				oChip.style.cssText='left:'+arr.posL+'px;top:'+(arr.posT+arr.marginT)+'px;background-position:'+arr.chipBp+';';
			$('body').append(oChip);
			var targetObj=$('#bottom .control span.chip-group i[data-money="'+arr.chipMon+'"]');
			var targetL=targetObj.offset().left;
			var targetT=targetObj.offset().top;
			$('body > i').animate({'left':targetL+'px','top':targetT+'px'},200,'linear',function(){
				$(this).remove();
			});
	};
	//chip定位
	function positionChip(This,chipMon,index,chipBp){
		var oChip=document.createElement('i');
		oChip.className='chip chip-add';
		oChip.setAttribute('data-money',chipMon);
		oChip.style.cssText='left:50%;top:50%;margin-left:'+(-chipW/2)+'px;margin-top:'+(-chipH/2 - chipArr[index].length * 3)+'px;background-position:'+chipBp+';';
		This.append(oChip);
	}
	/************************************************************************************************************************/
	//点击开奖
	$('#bottom .control .btn-submit').click(function(){
		autoAnimate()
	});
	//开奖
	function autoAnimate(){
		var off=true;
		var resArr=[];
		var RegExp =/[1-6]/;
		var $mask=$('#main .center .table div.t-mask');
		var $glass=$('#main .center .table div.t-mask .glass');
		var money=parseInt($('#bottom .control .statics .money').html());
		if(dataArr.length){
			storageArr.length=0;
			for (var i=0;i < dataArr.length ;i++ )
			{
				storageArr.push(dataArr[i]);
			}
			
			$my_money.html(count.accSub(Number($my_money.html()),money));
			$btn.addClass('btn-disabled');
			$(this).addClass('btn-disabled');
			$mask.show().animate({
				top:0
			},500,function(){
				$(this).find('i').each(function(i){
					$(this).attr('class','dice dice-'+Math.ceil(Math.random()*6));
					$(this).animate({
						top:Math.max(Math.random()*160,50)+'px',
						left:Math.max(Math.random()*260,56)+'px',
						transform:'rotate('+Math.random()*360+'deg)'
					},100,function(){
						$(this).attr('class','dice dice-'+Math.ceil(Math.random()*6));
						$(this).animate({
							top:Math.max(Math.random()*160,50)+'px',
							left:Math.max(Math.random()*260,56)+'px',
							transform:'rotate('+Math.random()*360+'deg)'
						},100,function(){
							$(this).attr('class','dice dice-'+Math.ceil(Math.random()*6));
							$(this).animate({
								top:Math.max(Math.random()*160,50)+'px',
								left:Math.max(Math.random()*260,56)+'px',
								transform:'rotate('+Math.random()*360+'deg)'
							},100,function(){
								$(this).attr('class','dice dice-'+Math.ceil(Math.random()*6));
								$(this).animate({
									top:Math.max(Math.random()*160,50)+'px',
									left:Math.max(Math.random()*260,56)+'px',
									transform:'rotate('+Math.random()*360+'deg)'
								},100,function(){
									var This=this;
									resArr.push($(This).attr('class').match(RegExp)[0]);
									setTimeout(function(){
										$(This).animate({left:+(i*60+90)+'px',top:'115px'},500,function(){
											if(off){
												setTimeout(function(){
													$mask.animate({
														top:'-414px'
													},500,function(){
														$(this).hide();	
														/*******************/
														result(resArr);
														/*******************/
													});
												},800);
												off=false;
											}
										});
									},500);
								});
							});
						});
					});
				});
			});
		}
	}
	/***********************/
	//判断是否中奖
	function result(arr){
		var baozi=0,duizi=0;
		//hezhi
		var sum=parseInt(arr[0])+parseInt(arr[1])+parseInt(arr[2]);
		var newArr=[];
		//baozi
		if(arr[0] == arr[1] && arr[0] == arr[2]){
			newArr.push(16);
			baozi=arr[0]+arr[1]+arr[2];
		}
		//duizi
		if(arr[0] == arr[1]){
			duizi=arr[0]+arr[1];
		}else if(arr[0] == arr[2]){
			duizi=arr[0]+arr[2];
		}else if(arr[1] == arr[2]){
			duizi=arr[1]+arr[2];
		}
		var erma1=arr[0]<arr[1]?arr[0]+arr[1]:arr[1]+arr[0];
		var erma2=arr[1]<arr[2]?arr[1]+arr[2]:arr[2]+arr[1];
		var erma3=arr[0]<arr[2]?arr[0]+arr[2]:arr[2]+arr[0];
		//qita
		for (var j=0;j < Data.length  ;j++ )
		{
			if(Data[j].name == 'yima_'+arr[0] || Data[j].name == 'yima_'+arr[1] || Data[j].name == 'yima_'+arr[2] || Data[j].name == 'hezhi_'+sum || Data[j].name == 'erma_'+erma1 || Data[j].name == 'erma_'+erma2 || Data[j].name == 'erma_'+erma3 || Data[j].name =='baozi_'+baozi || Data[j].name =='duizi'+duizi)
			{
				newArr.push(j);
			}
		}
		
		//danshuang
		newArr.push(sum%2?3:2);
		//daxiao
		if(sum < 11){
			newArr.push(1);
		}else{
			newArr.push(0);
		}
		for (var i=0;i < newArr.length ;i++ )
		{
			$itemLump.eq(newArr[i]).css('backgroundPosition',Data[newArr[i]].backgroundP);
		}
		/*******************/
		resetTable(newArr);
		/*******************/
		setTimeout(function(){
			$itemLump.css('backgroundPosition','10000px 10000px');
		},1500);
		/*******************/
		saveNum(arr,sum);
		/**sum 餘額 **/
	};
	//历史号码存储
	function saveNum(arr,sum){
		var $ul=$('#bottom .history .content ul');
		var newArr=[];
		for (var i=0;i < arr.length ;i++ )
		{
			newArr.push('sdice sdice-'+arr[i]);
		}
		
		if(arr[0] == arr[1] && arr[2] == arr[0]){
			newArr.push('sign sign-baozi');
			newArr.push('sign sign-baozi');
		}else{
			sum<11?newArr.push('sign sign-small'):newArr.push('sign sign-big');
			sum%2?newArr.push('sign sign-odd'):newArr.push('sign sign-even');
		}
		var liLength=$ul.find('li').length;
		if(liLength > 47){
			console.log(1)
			$ul.find('li').eq(0).remove();
		}
		var oLi=document.createElement('li');
		for (var i=0;i < 5 ;i++ )
		{
			var oI=document.createElement('i');
				oI.className=newArr[i];
				
					if(i == 3){
						if(arr[0] == arr[1] && arr[2] == arr[0]){
							oI.innerHTML='豹';
						}else{
							oI.innerHTML=sum<11?'小':'大';
						}
					}else if(i == 4)
					{
						if(arr[0] == arr[1] && arr[2] == arr[0]){
							oI.innerHTML='豹';
						}else{
							oI.innerHTML=sum%2?'单':'双';
						}
					}
				
				oLi.appendChild(oI);
		}
		$ul.append(oLi);
	}
	//中奖后奖金分配、重置桌面
	function resetTable(arr){
		var tipMoney=0,sumMoney=0,jiangjin=0;
		var winW=$(window).width()/2;
		$itemLump.each(function(){
			$(this).find('i').remove();
		});
		$tip.css('top','-35px'); 
		$('#bottom .control .statics .money').html('0.00');
		for (var j=0;j<dataArr.length;j++ )
		{
			var oChip=document.createElement('i');
				oChip.setAttribute('data-money',dataArr[j].chipMon);
				oChip.style.cssText='left:'+dataArr[j].posL+'px;top:'+(dataArr[j].posT+dataArr[j].marginT)+'px;background-position:'+dataArr[j].chipBp+';';
				for (var i=0;i < arr.length; i++)
				{
					if(arr[i] == dataArr[j].index){
						oChip.className='chip chip-add ying';
						tipMoney=Number(dataArr[j].chipMon);
						jiangjin=count.accMul(tipMoney,Data[arr[i]].beishu);
						sumMoney+=count.accAdd(tipMoney,Number(jiangjin));
						mask1=true;
						break;
					}else{
						oChip.className='chip chip-add shu';
					}
				}
				
			$('body').append(oChip);
			var targetObj=$('#bottom .control span.chip-group i[data-money="'+dataArr[j].chipMon+'"]');
			var targetL=targetObj.offset().left;
			var targetT=targetObj.offset().top;
		}
			setTimeout(getBack,1500);
			function getBack(){
				$('body > i.ying').animate({'left':targetL+'px','top':targetT+'px'},200,'linear',function(){
					$(this).remove();
				});
				$('body > i.shu').animate({'left':winW+'px','top':'-50px'},200,'linear',function(){
					$(this).remove();
				});	
				$my_money.html(count.accAdd(Number($my_money.html()),sumMoney));
				if(mask){
					if(radioValue ==true){
						if(value){
							if(mask1){
								mask=false;
								$('.bet-many-tip').fadeOut();
								value=0;
								mask1=false;
							}else{
								storage();
								value--;
								autoAnimate();
							}
						}else{
							mask=false;
							$('.bet-many-tip').fadeOut();
						}
					}else{
						if(value){
							storage();
							value--;
							autoAnimate();
						}else{
							mask=false;
							$('.bet-many-tip').fadeOut();
						}
					}
					
					$('.bet-many-tip span').html(value);
				}
			}

		for (var x=0;x < chipArr.length ;x++ )
		{
			chipArr[x].length=0;
		}
		dataArr.length=0;
		$('#bottom .control .btn-submit').removeClass('btn-disabled');
		$('.storage').removeClass('btn-disabled');
		$tip.find('.text').html('0.00');
	};
	//追注
	function storage(){
		if(dataArr.length){
			empty();
		}
		for (var i=0;i < storageArr.length ;i++ )
		{
			dataArr.push(storageArr[i]);
			var targetObj=$('#bottom .control span.chip-group i[data-money="'+storageArr[i].chipMon+'"]');
			var targetL=targetObj.offset().left;
			var targetT=targetObj.offset().top;
			var oChip=document.createElement('i');
					oChip.className='chip chip-add';
					oChip.setAttribute('data-money',storageArr[i].chipMon);
					oChip.style.cssText='left:'+targetL+'px;top:'+targetT+'px;background-position:'+storageArr[i].chipBp+';';
				$('body').append(oChip);
			$('body > i').animate({'left':storageArr[i].posL+'px','top':+(storageArr[i].posT+storageArr[i].marginT)+'px'},200,'linear',function(){
				$(this).remove();
			});
		}
		for(var i=0;i < storageArr.length ;i++ )
		{
			chipArr[storageArr[i].index].length++;
			positionChip(storageArr[i].parent,storageArr[i].chipMon,storageArr[i].index,storageArr[i].chipBp)
			showMoney(storageArr[i].parent,tipTn,storageArr[i].chipMon);
		}
		$('.empty').removeClass('btn-disabled');
		$('.repeal').removeClass('btn-disabled');
		$('.continuation').removeClass('btn-disabled');
	};
	//连投
	function continuation(){
		$('.continuationChip').fadeIn();
		$(".continuation-Btn").unbind('click');
		$('.continuation-Btn').bind('click',function(){
			$('.continuationChip').fadeOut();
			value=$('#continuationChip-text').val();
			radioValue=$("input[name='J-game-win-stop']:checked").val();
			mask=true;
			value--;
			autoAnimate();
			$('.bet-many-tip').fadeIn();
			$('.bet-many-tip').find('span').html(value);
		});
	};
	$('.bet-many-tip .stop').click(function(){
		$('.bet-many-tip').fadeOut();
		mask=false;
		value=0;
	});
	$('.continuation-close').click(function(){
		$('.continuationChip').fadeOut();
	});
	//玩法说明
	$item_info_tip.hover(function(){
		$(this).find('.item-hide').show();
	},function(){
		$(this).find('.item-hide').hide();
	});
	//chip的选择
	 $chip_i.click(function(){
		$(this).addClass('chip-seleced').siblings().removeClass('chip-seleced');
	});
	//说明
	$('.explain a.close').click(function(){
		$('.explain').fadeOut();
	});
	//投注超限
	$('.warning a.close').click(function(){
		$('.warning').fadeOut();
	});
})