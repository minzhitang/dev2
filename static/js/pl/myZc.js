/*! app_index 04-12-2015 */
function trimStr(a){return a.replace(/(^\s*)|(\s*$)/g,"")}var doc=document,win=window,loginLayer=win.SINA_OUTLOGIN_LAYER,_=loginLayer.STK,urlHost="http://"+window.location.host,zcApp=function(){this.actID=_.E("actId").getAttribute("dataId"),this.userLogin=_.E("userLogin"),this.reportUrl=urlHost+"/activity/report/"+this.actID+"/?format=json",this.nameUrl=urlHost+"/apply/users/"+this.actID+"/?format=json",this.formUrl=urlHost+"/apply/submit/?format=json",this.settingUrl=urlHost+"/user/setting/?format=json",this.repUrl=urlHost+"/activity/activity_lists/",this.writeUrl=urlHost+"/report/submit?format=json",this.viewUrl=urlHost+"/report/confirm?format=json",this.step=1,this.number=0,this.scrollFlag=!0,this.currentIndex=1,this.currentPage=1,this.nextPage="",this.pageTotal=1,this.applyFlag=!1,this._init()};zcApp.prototype={_scriptOnload:doc.createElement("script").readyState?function(a,b){var c=a.onreadystatechange;a.onreadystatechange=function(){var d=a.readyState;("loaded"===d||"complete"===d)&&(a.onreadystatechange=null,c&&c(),b.call(this))}}:function(a,b){a.addEventListener("load",b,!1)},head:doc.getElementsByTagName("head")[0]||doc.documentElement,_getScript:function(a,b){var c=doc.createElement("script"),d=this.head;return c.src=a,c.async=!0,this._scriptOnload(c,function(){b&&b.call(c,""),d&&c.parentNode&&d.removeChild(c)}),d.insertBefore(c,d.firstChild),c},_fillData:function(a){return a},_getData:function(a,b,c){var d=this,e=new Date;d._dataCallbackName=c+e.getSeconds(),win[d._dataCallbackName]=function(a){b&&b(a)};var f=a+"&callback="+d._dataCallbackName;d._getScript(f)},_class:function(a,b,c){var d,e,f,g=[];if(null==b&&(b=doc.body),null==c&&(c="*"),b.getElementsByClassName)return b.getElementsByClassName(a);if(b.querySelectorAll)return b.querySelectorAll("."+a);for(d=b.getElementsByTagName(c),e=d.length,f=new RegExp("(^|\\s)"+a+"(\\s|$)"),i=0,j=0;i<e;i++)f.test(d[i].className)&&(g[j]=d[i],j++);return g},loginSuccess:function(){var a=this,b=a.userLogin,c=a._class("header",b,"a")[0],d=a._class("img2",b,"img")[0],e=a._class("login",b,"a")[0],f=a._class("name",b,"a")[0],g=_.E("isLogin").getAttribute("isLogin");console.log("loginin"),console.log(g),0==g?window.location.reload():loginLayer.getWeiboInfo({timeout:5e3,onSuccess:function(a){var g=a.data;b.className="headerRight loginin",c.href="http://weibo.com/"+g.profile_url,f.href="http://weibo.com/"+g.profile_url,f.innerHTML=g.name.substring(0,10),e.innerHTML="退出",d.setAttribute("src",g.profile_image_url)},onFailure:function(a){b.className="headerRight loginin",c.href="http://login.sina.com.cn/",f.href="http://login.sina.com.cn/",f.innerHTML="您好",e.innerHTML="退出"}})},logoutSuccess:function(){var a=this,b=a.userLogin,c=a._class("header",b,"a")[0],d=a._class("img2",b,"img")[0],e=a._class("login",b,"a")[0],f=a._class("name",b,"a")[0],g=_.E("isLogin").getAttribute("isLogin");console.log("loginout"),console.log(g),1==g?window.location.reload():(b.className="headerRight loginout",c.href="",f.href="",f.innerHTML="",e.innerHTML="登录",d.setAttribute("src",""))},_isLogin:function(){var a=this,b=a.userLogin,c=_.E("loginDiv"),d=a._class("headerLeft",c,"div")[0],e=a._class("login",b,"a")[0];window.isIpad=/(iPad|iPod)/i.test(navigator.userAgent),window.isIpad&&(d.className="headerLeft clearfix isPad"),_.addEvent(e,"click",function(){"登录"==e.innerHTML?loginLayer.show():loginLayer.logout()}),_.Ready(function(){loginLayer.isLogin(),loginLayer.set("sso",{entry:"tech"}).set("styles",{top:"50px",right:"0"}).register("login_success",function(){a.loginSuccess()}).register("logout_success",function(){a.logoutSuccess()}).init()})},_setClass:function(a,b,c){for(var d=0;c>d;d++)b[d].className="";a.className="selected"},_isScreen:function(){function a(){var a=document.body.offsetWidth||document.documentElement.offsetWidth;1280>a?(d.style.width="1180px",b.style.marginLeft="0px",c.style.marginLeft="0px"):(d.style.width="1340px",b.style.marginLeft="80px",c.style.marginLeft="80px")}var b=_.E("zcSlider1"),c=_.E("zcSlider2"),d=_.E("zcMainWrap");_.addEvent(win,"resize",function(){a()}),a()},_tabEvent:function(){function a(){var a=doc.body.scrollTop||doc.documentElement.scrollTop;a>g?(i&&d.applyFlag&&(i.style.display="block"),h.className="zcTabDiv zcFixedTab"):(i&&(i.style.display="none"),h.className="zcTabDiv"),a<=m[1]&&d._setClass(j[0],j,k);for(var b=1;k-1>b;b++)!function(b){return a>=m[b]&&a<m[b+1]?void d._setClass(j[b],j,k):void 0}(b);a>=m[k-1]&&d._setClass(j[k-1],j,k)}var b,c,d=this,e=_.E("zcTab"),f=_.E("report"),g=f.offsetTop,h=_.E("zcTabDiv"),i=_.E("zcApplyBtn"),j=e.getElementsByTagName("a"),k=j.length,l=[],m=[];for(b=0;k>b;b++){var n=j[b].getAttribute("zUrl");l.push(n)}for(c=0;k>c;c++){var o=g+_.E(l[c]).offsetTop-70;m.push(o)}_.addEvent(win,"scroll",function(){a()}),a(),_.addEvent(e,"click",function(a){var a=a||event,b=a.target||a.srcElement,c=b.tagName.toLowerCase();if("a"==c){var d=b.getAttribute("zUrl"),e=document.getElementById(d),f=e.offsetTop;doc.body.scrollTop=g+f-70,doc.documentElement.scrollTop=g+f-70}})},_tabEventPad:function(){var a,b,c=this,d=_.E("zcTab"),e=_.E("report"),f=e.offsetTop,g=(_.E("zcTabDiv"),_.E("zcApplyBtn"),d.getElementsByTagName("a")),h=g.length,i=[],j=[];for(a=0;h>a;a++){var k=g[a].getAttribute("zUrl");i.push(k)}for(b=0;h>b;b++){var l=f+_.E(i[b]).offsetTop-70;j.push(l)}_.addEvent(d,"click",function(a){var a=a||event,b=a.target||a.srcElement,d=b.tagName.toLowerCase();if("a"==d){var e=b.getAttribute("zUrl"),i=document.getElementById(e),j=i.offsetTop;doc.body.scrollTop=f+j-10,doc.documentElement.scrollTop=f+j-10,c._setClass(b,g,h)}})},_initCity:function(){var a=_.E("zprovince"),b=_.E("zcity"),c=a.getAttribute("dataPro"),d=b.getAttribute("dataCity"),e=[],f="";if(c){for(var g in cityData)f=cityData[g].text==c?'selected="selected"':"",a.options.add(new Option(cityData[g].text,cityData[g].text)),f&&(e=cityData[g].citys);a.value=c;for(var h=e.length,i=0;h>i;i++)b.options.add(new Option(e[i],e[i])),d&&(b.value=d)}else for(var g in cityData)a.options.add(new Option(cityData[g].text,cityData[g].text));new DivSelect("zprovince","zprovince_div"),new DivSelect("zcity","zcity_div")},_selectCity:function(){var a=this,b=_.E("zcity"),c=_.E("zAddress"),d=_.E("zprovince_div"),e=a._class("ds_title",d,"div")[0],f={};for(var g in cityData){var h=cityData[g];f[h.text]=h.citys}_.addEvent(d,"click",function(){var d,g=e.innerHTML,h=f[g],i=h.length,j=i>10?"320px":32*i+"px",k=_.E("zcity_div");if(b.innerHTML="",b.options.add(new Option("请选择","请选择")),"请选择"!==h[0]&&i>1)for(d=0;i>d;d++)b.options.add(new Option(h[d],h[d]));c.removeChild(k),new DivSelect("zcity","zcity_div");var k=_.E("zcity_div"),l=a._class("dsl_cont",k,"div")[0];l.style.height=j})},_initSelect:function(){var a=_.E("salary"),b=_.E("knowledge"),c=_.E("job"),d=_.E("zprovince");if(a&&new DivSelect("salary","salary_div"),b&&new DivSelect("knowledge","knowledge_div"),c&&new DivSelect("job","job_div"),d){this._initCity();var e=_.E("zcity_div"),f=this._class("dsl_cont",e,"div")[0],g=f.getElementsByTagName("p"),h=g.length,i=h>10?"320px":32*h+"px";f.style.height=i,this._selectCity()}},_selectTime:function(){var a=this,b=_.E("birthyear"),c=_.E("birthmonth"),d=_.E("birthday"),e=_.E("bday"),f=b.value,g=c.value,h=[31,28,31,30,31,30,31,31,30,31,30,31],i=_.E("birthyear_div"),j=_.E("birthmonth_div"),k=a._class("ds_title",j,"div")[0],l=a._class("selected",j,l)[0];_.addEvent(i,"click",function(){if(f!=b.value){var g=_.E("birthday_div");f=b.value,c.value=k.innerHTML="请选择",l&&(l.className=""),d.innerHTML="",d.options.add(new Option("请选择","请选择")),e.removeChild(g),new DivSelect("birthday","birthday_div");var g=_.E("birthday_div"),h=a._class("dsl_cont",g,"div")[0];h.style.height="32px"}}),_.addEvent(j,"click",function(){if(g!=c.value){var i=_.E("birthday_div"),j="32px";if(f=b.value,g=c.value,"请选择"!=g){d.innerHTML="",d.options.add(new Option("请选择","请选择"));var k=h[g-1];f%4==0&&2==g&&(k=29);for(var l=1;k+1>l;l++)d.options.add(new Option(l,l));j="320px"}else j="32px";e.removeChild(i),new DivSelect("birthday","birthday_div");var i=_.E("birthday_div"),m=a._class("dsl_cont",i,"div")[0];m.style.height=j}})},_initBirth:function(){var a=_.E("birthyear"),b=_.E("birthmonth"),c=_.E("birthday"),d=[31,28,31,30,31,30,31,31,30,31,30,31],e=(new Date).getFullYear();if(a){for(var f=parseInt(a.getAttribute("dataYear")),g=parseInt(b.getAttribute("dataMonth")),h=parseInt(c.getAttribute("dataDay")),i=e;i>e-110;i--)a.options.add(new Option(i,i));for(var j=1;13>j;j++)b.options.add(new Option(j,j));if(f?a.value=f:a.value=e,f&&g&&13>g){b.value=g;var k=d[g-1];f%4==0&&2==g&&(k=29);for(var i=1;k+1>i;i++)c.options.add(new Option(i,i));h&&(c.value=h)}new DivSelect("birthyear","birthyear_div"),new DivSelect("birthmonth","birthmonth_div"),new DivSelect("birthday","birthday_div");var l=_.E("birthday_div"),m=this._class("dsl_cont",l,"div")[0];m.style.height="320px",this._selectTime()}},_initRadio:function(){var a=this,b=doc.getElementById("zsex"),c=doc.getElementById("zmarriage");if(b){var d=b.getElementsByTagName("a"),e=d.length;_.addEvent(b,"click",function(c){var c=c||event,f=c.target||c.srcElement,g=f.tagName.toLowerCase();if("a"==g){var h="男"==f.innerHTML?1:2;b.setAttribute("zsex",h),a._setClass(f,d,e)}})}if(c){var f=c.getElementsByTagName("a"),g=f.length;_.addEvent(c,"click",function(b){var b=b||event,d=b.target||b.srcElement,e=d.tagName.toLowerCase();if("a"==e){var h="";h="已婚"==d.innerHTML?1:"未婚"==d.innerHTML?2:3,c.setAttribute("zmarriage",h),a._setClass(d,f,g)}})}},submitData:function(){function a(a,b){a.style.borderColor="red",a.style.color="red",a.value=b,_.addEvent(a,"focus",function(){a.style.borderColor="#e8e8e8",a.value==b&&(a.value=""),a.style.color="#666"})}function b(a){a.style.borderColor="red",_.addEvent(a,"click",function(){a.style.borderColor="#e8e8e8"})}function c(){var a=A.getAttribute("isUserCenter");j&&(e.name=j.value),k&&(e.tel=k.value),y&&!a&&(e.reason=y.value),z&&"1"==a&&(e.description=z.value),l&&(e.address={province:l.value,city:m.value,detail:n.value}),o&&(e.birth=o.value+"-"+p.value+"-"+q.value),r&&(e.identify=r.value),s&&(e.wechat=s.value),t&&(e.gender=t.getAttribute("zsex")),u&&(e.marital=u.getAttribute("zmarriage")),v&&(e.income=v.value),w&&(e.edu=w.value),x&&(e.job=x.value),a?(_.addEvent(E,"click",function(){D.style.display="none",location.href=location.href}),$.ajax({type:"post",url:d.settingUrl,data:e,dataType:"json",success:function(a){a&&0==a.result.status.code?(D&&(D.style.display="block"),setTimeout(function(){D.style.display="none",location.href=location.href},3e3)):alert(a.result.status.msg)}})):d.applyFlag?$.ajax({type:"post",url:d.formUrl,data:e,dataType:"json",success:function(a){if("0"==a.result.status.code){window.zcUrl=a.result.data.url,g.style.display="none",B.style.display="block";var b=_.E("shareBtn"),c=encodeURIComponent(b.getAttribute("dataUrl")),d=encodeURIComponent(b.getAttribute("dataCon")),e=encodeURIComponent(b.getAttribute("dataPic")),f="http://service.weibo.com/share/share.php?url="+c+"&title="+d+"&pic="+e;b.setAttribute("href",f)}else alert(a.result.status.msg)}}):(g.style.display="none",C.style.display="block")}var d=this,e={},f=_.E("zcLoginForm"),g=_.E("zcForm"),h=_.E("zcClose"),i=_.E("zcCancel"),j=_.E("dataName"),k=_.E("dataTel"),l=_.E("zprovince"),m=_.E("zcity"),n=_.E("dataDetail"),o=_.E("birthyear"),p=_.E("birthmonth"),q=_.E("birthday"),r=_.E("dataIdNum"),s=_.E("dataMicroNum"),t=_.E("zsex"),u=_.E("zmarriage"),v=_.E("salary"),w=_.E("knowledge"),x=_.E("job"),y=_.E("reason"),z=_.E("description"),A=_.E("zcSubmit"),i=_.E("zcCancel"),B=_.E("zcSuccess"),C=_.E("zcFail"),D=_.E("userTip"),E=_.E("tipClose");_.addEvent(h,"click",function(){f.style.display="none",window.zcUrl&&(window.zcUrl="",window.location.href=window.zcUrl)}),_.addEvent(i,"click",function(){f.style.display="none",window.zcUrl&&(window.zcUrl="",window.location.href=window.zcUrl)});var F=/[\u4e00-\u9fa50-9a-zA-Z\-\_]/;_.addEvent(j,"keyup",function(){var b=trimStr(j.value),c=b.length;if(c>0){var d=b.charAt(b.length-1);F.test(d)||(a(j,'请输入正确字符，支持中英文、数字、"_"或减号'),j.blur())}}),_.addEvent(j,"keydown",function(){var b=trimStr(j.value),c=b.length;if(c>0){var d=b.charAt(b.length-1);F.test(d)||(a(j,'请输入正确字符，支持中英文、数字、"_"或减号'),j.blur())}}),_.addEvent(A,"click",function(){var f=_.E("zprovince_div"),g=d._class("ds_cont",f,"div")[0],h=_.E("zcity_div"),i=d._class("ds_cont",h,"div")[0],t=_.E("birthyear_div"),u=d._class("ds_cont",t,"div")[0],v=_.E("birthmonth_div"),w=d._class("ds_cont",v,"div")[0],x=_.E("birthday_div"),z=d._class("ds_cont",x,"div")[0],B=A.getAttribute("isUserCenter"),C=/^\d{11}$/,D=/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i;e={},B?c():(e.activity_id=d.actID,!j||""!=trimStr(j.value)&&"请填写姓名"!=j.value?!k||""!=trimStr(k.value)&&"请填写手机"!=k.value?!k||11==k.value.length&&C.test(k.value)?!n||""!=trimStr(n.value)&&"请填写详细地址"!=n.value?!r||""!=trimStr(r.value)&&"请填写身份证号"!=r.value?r&&!D.test(r.value)?a(r,"请输入正确的身份证号"):!s||""!=trimStr(s.value)&&"请填写微信号"!=s.value?!y||""!=trimStr(y.value)&&"请填写申请理由"!=y.value?l&&"请选择"==l.value?b(g):m&&"请选择"==m.value?b(i):o&&"请选择"==o.value?b(u):p&&"请选择"==p.value?b(w):q&&"请选择"==q.value?b(z):c():a(y,"请填写申请理由"):a(s,"请填写微信号"):a(r,"请填写身份证号"):a(n,"请填写详细地址"):a(k,"请输入有效的联系方式"):a(k,"请填写手机"):a(j,"请填写姓名"))})},_initForm:function(){this._initSelect(),this._initRadio(),this._initBirth(),this.submitData();var a=this,b=_.E("zcLoginForm"),c=_.E("applyPro"),d=_.E("zcApplyBtn"),e=_.E("isLogin").getAttribute("isLogin");a.applyFlag=!0,_.addEvent(c,"click",function(){"0"==e?loginLayer.show():a.applyFlag&&(b.style.display="block")}),_.addEvent(d,"click",function(){"0"==e?loginLayer.show():a.applyFlag&&(b.style.display="block")})},_timeCount:function(){function a(a){return 10>a?"0"+a:a}function b(){l-=1;var b=parseInt(l/3600/24),d=parseInt(l/3600%24),e=parseInt(l/60%60),f=parseInt(l%60);h-g>=0&&k?c.innerHTML="距申请开始：<span>"+a(b)+"</span>天<span>"+a(d)+"</span>小时<span>"+a(e)+"</span>分钟<span>"+a(f)+"</span>秒":c.innerHTML="距申请结束：<span>"+a(b)+"</span>天<span>"+a(d)+"</span>小时<span>"+a(e)+"</span>分钟<span>"+a(f)+"</span>秒"}var c=_.E("faceTime"),d=_.E("applyPro"),e=_.E("zcApplyBtn"),f=this;if(c)var g=(c.getElementsByTagName("span"),parseInt(c.getAttribute("timenow"))),h=parseInt(c.getAttribute("apply_stime")),i=parseInt(c.getAttribute("apply_etime")),j=c.getAttribute("publish_user_time"),k=!0,l=h-g>0?h-g:i-g;var m=setInterval(function(){d?1>l?h-g>=0&&k?(k=!1,d.className="faceBtn",d.innerHTML="免费申请",e.style.display="block",l=i-g,f._initForm()):(clearInterval(m),d.className="faceBtn unApply",d.innerHTML="申请已结束",c.innerHTML="成功名单公布时间："+j,f.applyFlag=!1,e.style.display="none"):b():clearInterval(m)},1e3)},_timeCount2:function(){function a(a){return 10>a?"0"+a:a}function b(){j-=1;var b=parseInt(j/3600/24),d=parseInt(j/3600%24),g=parseInt(j/60%60),h=parseInt(j%60);f-e>=0&&i?c.innerHTML="距申请开始：<span>"+a(b)+"</span>天<span>"+a(d)+"</span>小时<span>"+a(g)+"</span>分钟<span>"+a(h)+"</span>秒":c.innerHTML="距申请结束：<span>"+a(b)+"</span>天<span>"+a(d)+"</span>小时<span>"+a(g)+"</span>分钟<span>"+a(h)+"</span>秒"}var c=_.E("faceTime"),d=this;if(c)var e=(c.getElementsByTagName("span"),parseInt(c.getAttribute("timenow"))),f=parseInt(c.getAttribute("apply_stime")),g=parseInt(c.getAttribute("apply_etime")),h=c.getAttribute("publish_user_time"),i=!0,j=f-e>0?f-e:g-e;var k=setInterval(function(){1>g-e?1>j?f-e>=0&&i?(i=!1,j=g-e):(clearInterval(k),c.innerHTML="成功名单公布时间："+h,d.applyFlag=!1):b():clearInterval(k)},1e3)},_scrollToTop:function(){function a(){var a=doc.documentElement.scrollTop||doc.body.scrollTop;a>300?b.style.display="block":b.style.display="none"}var b=_.E("zcTop");_.addEvent(win,"scroll",function(){a()}),_.addEvent(b,"click",function(){doc.documentElement.scrollTop=0,doc.body.scrollTop=0}),a()},getLength:function(a,b,c){var d=trimStr(a.value),e=d.replace(/[^\x00-\xff]/gi,"**"),f=parseInt(e.length/2),g=c-f>0?c-f:f-c;0>c-f?(window.zcLength=!1,b.style.color="#ff8745"):(window.zcLength=!0,b.style.color="#ccc"),b.innerHTML=c-f>0?"可输入<em>"+g+"</em>个字":"已超出<em>"+g+"</em>个字"},getDatas:function(a,b,c){var d=this,a=a;d._getData(a,function(a){b(a,d)},c)},renderReport:function(a,b){function c(a){return 10>a?"0"+a:a}var a=a.result.data.list,d="",e=a.length,f=_.E("zcRMain"),g=b;if(a&&e>0)for(var h=0;e>h;h++){var i="0"==a[h].essence?"":'<span class="s">精</span>',j=a[h].imgs,k=0,l=new Date(1e3*parseInt(a[h].create_time)),m=l.getFullYear()+"-"+c(l.getMonth()+1)+"-"+c(l.getDate()),n="#"==a[h].weibo.profile_url?'href="javascript:;" class="noa zcRML" ':'href="'+a[h].weibo.profile_url+'" target="_blank" class="zcRML"';if(d+='<div class="zcRMB clearfix"><a '+n+">",d+='<img src="'+a[h].weibo.profile_image_url+'" alt="" class="photo"><span>'+a[h].weibo.screen_name+"</span></a>",d+='<div class="zcRMR select"><div class="rt clearfix">'+i,d+='<p><a href="'+a[h].url+'" target="_blank" title="'+a[h].title+'">'+a[h].title+"</a></p>",d+="<em>"+m+"</em></div>",d+='<p class="zan good">'+a[h].merit+'</p><p class="zan bad">'+a[h].defect+"</p>",j&&(k=j.length),1>k)d+="</div></div>";else{d+='<div class="photo"><a href="'+a[h].url+'" target="_blank" class="clearfix">';for(var o=0;k>o;o++)d+='<img height="120" alt="" src="'+a[h].imgs[o]+'">';d+="</a></div></div></div>"}}f.innerHTML=d,window.isIpad||g._tabEvent()},getReport:function(a,b){var c=a.result.data.pageCount,d=_.E("report").offsetTop,e=b;if(e.renderReport(a,e),c&&c>1){var f=(new PageTool({pageTotal:c,pageBoxDiv:"zcPageDiv1",pagePrevDiv:"page_prev1",pageNextDiv:"page_next1",pageBtnClass:"page_num btn",pageBoxWrapDiv:"page_box_wrap1",onIndexChanged:function(a){var b=e.reportUrl+"&page="+a;e.getDatas(b,e.renderReport,"zcReport"),doc.documentElement.scrollTop=d,doc.body.scrollTop=d}}),_.E("zcPageDiv1"));f.style.display="block"}},renderNames:function(a,b){var a=a.result.data.list,c="",d=a.length,e=_.E("nameList"),f=b;if(a&&d>0)for(var g=0;d>g;g++){var h=("0"==a[g].essence?"":'<span class="s">精</span>',"#"==a[g].profile_url?'href="javascript:;" class="noa" ':'href="'+a[g].profile_url+'" target="_blank"');c+="<a "+h+' title="'+a[g].screen_name+'">',c+='<img src="'+a[g].profile_image_url+'" alt="" class="photo">',c+="<span>"+a[g].screen_name+"</span></a>"}e.innerHTML=c,window.isIpad||f._tabEvent()},getNames:function(a,b){var c=a.result.data.pageCount,d=b;if(d.renderNames(a,d),c&&c>1){var e=(new PageTool({pageTotal:c,pageBoxDiv:"zcPageDiv2",pagePrevDiv:"page_prev2",pageNextDiv:"page_next2",pageBtnClass:"page_num btn",pageBoxWrapDiv:"page_box_wrap2",onIndexChanged:function(a){var b=d.nameUrl+"&page="+a;d.getDatas(b,d.renderNames,"zcNames")}}),_.E("zcPageDiv2"));e.style.display="block"}},_render:function(){var a=this,b=a.reportUrl+"&page=1",c=a.nameUrl+"&page=1";this.getDatas(b,a.getReport,"zcReport"),this.getDatas(c,a.getNames,"zcNames")},_scrollToComment:function(){var a=_.E("zcComment"),b=_.E("zcComment2"),c="kj:"+b.getAttribute("dataId")+":0",d="http://comment5.news.sina.com.cn/cmnt/count?format=json&newslist="+c,e=_.E("SI_FormList1"),f=this;f.getDatas(d,function(a){if(a){var a=a.result.count,d=a[c].show;b.innerHTML=d}},"zcComment"),_.addEvent(a,"click",function(){var a=e.offsetTop;doc.documentElement.scrollTop=a+106,doc.body.scrollTop=a+106}),_.addEvent(b,"click",function(){var a=e.offsetTop;doc.documentElement.scrollTop=a+106,doc.body.scrollTop=a+106})},_renderRep:function(a,b){var c=b;c.nextPage=a.result.data.issue;var a=a.result.data.list,d='<div class="zcItem clearfix">',e=a.length,f=_.E("zcSlider"),g=_.E("zcLoading"),h=parseInt(c.number),i=_.E("zcPageDiv1"),j=_.E("page_box_wrap1"),k=["<span>申请中</span>",'<span class="unstart">即将开始</span>','<span class="trying">试用中</span>','<span class="ending">已结束</span>'],l=['<p class="zcNoMsg">暂无众测产品，感谢您的关注。</p>','<p class="zcNoMsg">暂无申请中的众测，您可以查看其他状态下的内容。 </p>','<p class="zcNoMsg">暂无即将开始的众测，您可以查看其他状态下的内容。</p>','<p class="zcNoMsg">暂无试用中的众测，您可以查看其他状态下的内容。</p>','<p class="zcNoMsg">暂无已结束的众测，您可以查看其他状态下的内容。</p>'];if(a&&e>0){for(var m=0;e>m;m++){var n=parseInt(a[m].state_img)-1>3?3:parseInt(a[m].state_img)-1,o=k[n],p=a[m].price>0?"￥"+a[m].price:"待定";d+='<div class="zcCard"><a href="'+a[m].url+'" target="_blank" class="zcImg">',d+='<img src="'+a[m].product_intro+'" alt="'+a[m].title+'免费试用,评测">'+o+"</a>",d+='<div class="detail"><p class="title"><a href="'+a[m].url+'" title="'+a[m].title+'" target="_blank">'+a[m].title+"</a></p>",d+='<p class="num clearfix"><span class="price">官方报价：<em>'+p+"</em></span>",d+='<span class="fen">数量：'+a[m].num+a[m].unit+"</span></p></div>",d+='<div class="people">已有<span>'+a[m].apply_users+"</span>人申请</div></div>"}12>e?(""!=j.innerHTML&&(i.style.display="block"),c.scrollFlag=!1):c.scrollFlag=!0}else c.scrollFlag&&1==c.step&&(c.scrollFlag=!1,d+=l[h]),""!=j.innerHTML&&(i.style.display="block");d+="</div>",f.innerHTML+=d,g.style.display="none"},_renderStep:function(){this.scrollFlag=!1,this.step++;var a=this.repUrl+this.number+"/?page="+this.currentPage+"&issue="+this.nextPage+"&format=json",b=this;b.getDatas(a,b._renderRep,"zcReps")},getRep:function(a,b){var c=b,d=_.E("sumTab"),e=_.E("page_box_wrap1"),f=d.getElementsByTagName("span"),g=f.length,h=_.E("zcSlider"),i=a.result.data.count;if(i)for(var j=0;g>j;j++)f[j].innerHTML=i[j];c.pageTotal!=a.result.data.pageTotal&&""!=e.innerHTML&&""==e.innerHTML,c.pageTotal=a.result.data.pageTotal,1==c.step&&(h.innerHTML=""),c._renderRep(a,c)},_initRep:function(){var a=this,b=_.E("sumTab"),c=_.E("zcSlider"),d=_.E("zcPageDiv1"),e=_.E("page_box_wrap1"),f=_.E("zcLoading"),g=b.getElementsByTagName("a"),h=g.length,i=a.repUrl+a.number+"/?page=1&format=json";this.getDatas(i,a.getRep,"zcReps"),_.addEvent(b,"click",function(b){var b=b||event,f=b.target||b.srcElement,j=f.tagName.toLowerCase();("a"==j||"span"==j)&&("span"==j&&(f=f.parentNode),a._setClass(f,g,h),a.step=1,a.currentIndex=1,a.currentPage=1,a.nextPage="",a.scrollFlag=!0,c.innerHTML="",e.innerHTML="",d.style.display="none",a.number=f.getAttribute("datanum"),i=a.repUrl+a.number+"/?page=1&format=json",a.getDatas(i,a.getRep,"zcReps"))}),_.addEvent(win,"scroll",function(){var b=doc.body.scrollTop||doc.documentElement.scrollTop,g=doc.body.scrollHeight||doc.documentElement.scrollHeight;if("CSS1Compat"==document.compatMode)var h=document.documentElement.clientHeight;else var h=document.body.clientHeight;window.isIpad=/(iPad|iPod)/i.test(navigator.userAgent);var i=/(iPad|iPod)/i.test(navigator.userAgent)?380:160;if(b+h>g-i&&a.step<3&&a.scrollFlag)f&&(f.style.display="block"),a._renderStep();else if(b+h>g-i-100&&a.step>=3&&a.scrollFlag)if(""!=e.innerHTML)d.style.display="block";else if(a.pageTotal&&a.pageTotal>1){new PageTool({pageTotal:a.pageTotal,pageNow:a.currentIndex,pageBoxDiv:"zcPageDiv1",pagePrevDiv:"page_prev1",pageNextDiv:"page_next1",pageBtnClass:"page_num btn",pageBoxWrapDiv:"page_box_wrap1",onIndexChanged:function(b){a.scrollFlag=!1,d.style.display="none",c.innerHTML="",doc.body.scrollTop=0,doc.documentElement.scrollTop=0,a.currentIndex=b,a.currentPage=3*(b-1)+1,a.nextPage="",a.step=1;var e=a.repUrl+a.number+"/?page="+a.currentPage+"&issue="+a.nextPage+"&format=json";a.getDatas(e,a.getRep,"zcReps")}})}})},subForm:function(){function a(a){k={activity_id:c.actID,title:h.value,merit:i.value,defect:j.value,content:editor.getContent(null,!0)},$.ajax({type:"post",url:c.writeUrl,data:k,dataType:"json",success:function(b){if(0==b.result.status.code){var c=b.result.data.url;1==a?(d.style.display="block",_.addEvent(e,"click",function(){window.location.href=c,d.style.display="none"})):window.location.href=c}else alert(b.result.status.msg)}})}function b(a,b){a.style.borderColor="red",a.style.color="red",a.innerHTML="",a.value=b,_.addEvent(a,"focus",function(){a.style.borderColor="#e8e8e8",a.value==b&&(a.innerHTML="",a.value=""),a.style.color="#666"})}var c=this,d=_.E("reportTip"),e=_.E("reportC"),f=_.E("formView"),g=_.E("formSub"),h=_.E("formTitle"),i=_.E("formGood"),j=_.E("formBad"),k=(_.E("editor"),{});_.addEvent(f,"click",function(){if("noClick"!=f.className)if(""==trimStr(h.value)||"请输入标题（必填）"==h.value)h.value="请输入标题（必填）",h.style.color="red",_.addEvent(h,"focus",function(){h.style.borderColor="#e8e8e8","请输入标题（必填）"==h.value&&(h.value=""),h.style.color="#666"});else if(""==trimStr(i.value)||"请填写产品的满意点"==i.value)b(i,"请填写产品的满意点");else if(""==trimStr(j.value)||"请填写产品的不满意点"==j.value)b(j,"请填写产品的不满意点");else{if(!window.zcLength)return;a(0)}}),_.addEvent(g,"click",function(){if("noClick"!=g.className)if(""==trimStr(h.value)||"请输入标题（必填）"==h.value)h.value="请输入标题（必填）",h.style.color="red",_.addEvent(h,"focus",function(){h.style.borderColor="#e8e8e8","请输入标题（必填）"==h.value&&(h.value=""),h.style.color="#666"});else if(""==trimStr(i.value)||"请填写产品的满意点"==i.value)b(i,"请填写产品的满意点");else if(""==trimStr(j.value)||"请填写产品的不满意点"==j.value)b(j,"请填写产品的不满意点");else{if(!window.zcLength)return;a(1)}})},viewForm:function(){var a=this,b=_.E("reportTip"),c=_.E("reportC"),d=_.E("formView");_.addEvent(d,"click",function(){"noClick"!=d.className&&$.ajax({type:"post",url:a.viewUrl,dataType:"json",data:{activity_id:a.actID,state:1},success:function(a){if(0==a.result.status.code){var d=a.result.data.url;b.style.display="block",_.addEvent(c,"click",function(){window.location.href=d,b.style.display="none"})}else alert(a.result.status.msg)}})})},_init:function(){this._isLogin()}};var zcIndex=new zcApp;