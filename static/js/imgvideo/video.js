SinaEditor.PluginManager.register("video",function(a,b){function d(a){var b="http://simg.sinajs.cn/blog7style/images/common/editor/insetvideo2.gif",d=c.create("img",{"se-holder":1,src:b,vid:a,width:482,height:388,contenteditable:!1,"user-select":"none"}),e=c.create("div",{"se-holder":1,"se-widget":"video",unselectable:"on",contenteditable:!1,"user-select":"none",style:{overflow:"hidden",textAlign:"center",marginBottom:"42px"}});e.appendChild(d);return e}function e(){var a=c.create("p",{innerHTML:SinaEditor.env.$webkit?'<br se-holder="1">':""});return a}var c=b.domUtil;b.registerCmd("insertVideo",{queryCommandState:function(a,c,d){var e=!1;b.domUtil.each(d,function(a,b){if("A"===b.nodeName.toUpperCase()){e=!0;return!1}});return e},exec:function(a,f){if(!f.vid)return;var g=d(f.vid),h=b.getRange(),i=c.getStart(h),j=c.parents(i,!0),k=j.pop(),l=b.body;if(h.collapsed&&h.startContainer==l&&0==h.startOffset||!k||k==l){l.appendChild(g);var m=e();c.insertNode(m,l,"beforeend");h.setStart(m,0)}else{h.setEndAfter(k);var n=h.extractContents(),o=n.firstChild;c.insertAfter(g,k);if(c.text(o))c.insertAfter(n,g);else{var m=e();c.insertAfter(m,g);o=m}h.setStart(o,0)}h.collapse(!0);h.select(!0)}})});
