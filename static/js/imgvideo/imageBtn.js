/**
 * 注册图片上传UI插件
 * @author Qiangyee
 * @date 2014-08-04
 */
SinaEditor.PluginManager.register('imageBtn', function(options, currentEditor) {
    var SE = SinaEditor,
        DOMUtil = SE.DOMUtil,
        VK = SE.VK,
        Util = SE.Util,
        env = SE.env,
        ToolBar = SE.ui.ToolBar,
        Layer = SE.ui.Layer,
        uploadHolder = SE.uploadHolder,
        isBelowIe8 = env.$msie && env.version < 8;
    //console.log(currentEditor.exec);
    var $dom = new DOMUtil();
    var domUtil = currentEditor.domUtil;
    var uploadBtn, uploadImages = [];
    var currentParagraph; // hover的当前段落
    var defaultBase64URL = "http://simg.sinajs.cn/blog7style/images/blog_editor/bne_img.gif";
    // 图片居中各节点样式
    var ALIGN_CENTER_CSS = {
        wrapper: { // font-size:17px;line-height:28px;margin-bottom:30px;
            "font-size": "17px",
            "line-height": "28px",
            "padding-top": "5px",
            "_user-select": "none"
        },
        imgParent: { //width:670px; overflow:hidden; text-align:center; padding-bottom:26px;
            // "width": "100%",
            "overflow": "hidden",
            "text-align": "center",
            "padding": "0 0 34px",
            ".user-select": "none"
        },
        img: { //max-width:670px;
            "max-width": "100%",
            ".user-select": "none"
        },
        span: {
            "color": "#999",
            "display": "block",
            "padding": "5px 7px 0",
            "font-size": "14px",
            "line-height": "20px",
            "text-align": "center",
            "outline": "none",
            ".user-select": "none"
        }

    };

    // 图片居左各节点样式
    var ALIGN_LEFT_CSS = Util.merge({
        wrapper: {
            "float": "left",
            "margin-top": "6px",
            "padding": "0 24px 24px 0",
            "width": "323px"
        },
        imgParent: {
            "width": "323px"
        },
        img: {
            "max-width": "323px"
        }
    }, ALIGN_CENTER_CSS, true, true);

    // 图片居右各节点样式
    var ALIGN_RIGHT_CSS = Util.merge({
        wrapper: {
            "float": "right",
            "margin-top": "6px;",
            "padding": "0 0 24px 24px",
            "width": "323px"
        },
        imgParent: {
            "width": "323px"
        },
        img: {
            "max-width": "323px"
        }
    }, ALIGN_CENTER_CSS, true, true);

    var IMG_TIPS = '填写图片摘要（选填）';


    function findPic(name) {
        var returnObj;
        domUtil.each(uploadImages, function(i, pic) {
            if (name === pic.name) {
                returnObj = pic;
                return false;
            }
        });
        return returnObj;
    };

    /**
     * 查找图片结构对应的节点
     * @param el 起始dom节点
     * @param name se-img属性名称
     * @returns {*}
     */
    function findImageNode(el, name) {
        var seImg;
        if (3 === el.nodeType) {
            el = el.parentNode;
        }

        var returnValue, pn;
        while (el) {
            seImg = domUtil.attr(el, 'se-img');
            if (seImg == name) {
                returnValue = el;
            }
            pn = el.parentNode
            if (pn == currentEditor.body) {
                break;
            } else {
                el = el.parentNode;
            }

        }

        if (!returnValue && el && (el !== currentEditor.body) && domUtil.contains(editor.body, el)) {
            returnValue = domUtil.$('*[se-img="' + name + '"]', el)[0];
        }
        return returnValue;
    }

    // 初始化图片上传浮层
    function createUploadBtn() {
        try {

            var wrapperCSSText = [
                'position:absolute;', 'overflow:hidden;', 'display:block;', 'top:-300px;', 'cursor:pointer;',
                'margin-bottom:30px;', '_width:47px;_height:41px;'
            ].join('');
            var id = 'se-image-upload-btn';
            var inputCSSText = 'z-index:20;font-size:100px;left:0px;top:0px;position:absolute;opacity:0;filter:alpha(opacity=0);width:35px;height:28px;';
            var hoverBtnHtml = ['<div id="#{panel}" style="', wrapperCSSText, '">', '<i id="se-image-upload-btn" class="icon i21_img" style="_positon:absolute;_left:0px;_top:0px;"></i>', '<div id="uploadimgflash" style="position:absolute;top:0px;left:0px;z-index:30;"></div>'
                //        , '<input style="', inputCSSText, '" name="pic1" type="file" multiple accept="image/*" id="J_line_input">'
                , '</div>'
            ].join('');

            var hoverBtn = new Layer({
                html: hoverBtnHtml
            });

            hoverBtn.isIn = function() {
                return $dom.attr(this.getNode('panel'), 'hoverIn');
            }
            $dom.hover(hoverBtn.node, function(e) {
                $dom.attr(this, 'hoverIn', '1');
                $dom.setStyle($dom.$('#' + id), {
                    backgroundPosition: '-370px -250px'
                });
                //      $dom.setStyle(currentParagraph, {
                //        borderTop: '2px dashed #ccc'
                //      });
            }, function(e) {
                $dom.removeAttr(this, 'hoverIn');
                $dom.setStyle($dom.$('#' + id), {
                    backgroundPosition: '-320px -250px'
                });
                //      $dom.setStyle(currentParagraph, {
                //        borderTop: ''
                //      });
                hideHoverLayer();
            });
            return hoverBtn;
        } catch (e) {
            console.error(e.stack);
        }
    }

    // 创建hover图片删除button
    function createDeleteBtn() {
        return domUtil.create('a', {
            'se-img': 'delete',
            href: "javascript:;",
            className: "icon i23_imghover",
            innerHTML: "&nbsp;",
            style: {
                position: "absolute",
                display: 'none',
                top: '-1000px'
            }
        });
    }

    // 创建图片包裹节点
    function createImg(url, filename) {

        var extraAttr = 'contenteditable="false" '

        var html = ['<div se-img="img-parent" ', extraAttr, '>', '<a se-img="link" ', extraAttr,
            'href="about:blank;" target="_blank">', '<img ', extraAttr, 'se-img="img" src="', url, '">', '</a>',
            '<span se-img="span" contenteditable="true">', IMG_TIPS, '</span>', '</div>'
        ].join('');

        var wrapper = domUtil.create('div', {
            //className: 'BNE_txtA clearfix cont_txt',
            innerHTML: html,
            "se-img": "wrapper",
            contenteditable: "false"
        });
        var img = domUtil.$('img', wrapper)[0];
        // 防止xss只能这样了
        domUtil.attr(img, 'se-name', filename);
        var span = domUtil.$('span', wrapper)[0];
        var link = domUtil.$('a', wrapper);
        return {
            wrapper: wrapper,
            imgParent: wrapper.children[0],
            img: img,
            span: span
        };
    }

    // 创建图片排版toolbar
    function createToolbar() {
        var ids = {
            left: 'tb_imagealign_left',
            center: 'tb_imagealign_center',
            right: 'tb_imagealign_right'
        };
        var alignHtml = ['<a id="', ids.left,
            '" class="color1_a" action="left" href="javascript:void(0);"><i class="icon i15_l_img"></i></a>', '<a id="',
            ids.center,
            '" class="color1_a" action="center" href="javascript:void(0);"><i class="icon i16_c_img"></i></a>',
            '<a id="', ids.right,
            '" class="color1_a" action="right" href="javascript:void(0);"><i class="icon i17_r_img"></i></a>',
            '<i class="arrow-down"></i>'
        ].join('');

        var opts = {
            id: 'image_align_toolbar',
            tpl: alignHtml,
            cls: 'BNE_editor_color BNE_editor_color2',
            name: 'imageToolBar',
            groupSpace: '|',
            pos: [100, 200], // top left
            buttons: [{
                type: 'group',
                name: 'imageAlign',
                activeCls: 'hovered',
                buttons: [{
                    id: ids.left,
                    name: 'alignLeft',
                    tooltip: '居左'
                }, {
                    id: ids.center,
                    name: 'alignCenter',
                    tooltip: '居中'
                }, {
                    id: ids.right,
                    name: 'alignRight',
                    tooltip: '居右'
                }]
            }]
        };
        var toolbar = new ToolBar(opts, currentEditor);
        return toolbar;
    }

    // 渲染图片
    function renderImage(pic, img) {
        var images = !img ? domUtil.$('img[se-name="' + pic.name + '"]', domUtil.body) : (Util.isArray(img) ? img : [img]);
        if (0 == images.length) {
            return;
        }

        //var url = getImgStaticPath(pic.pid, "mw690");
        //var linkUrl = "http://album.sina.com.cn/pic/" + pic.pid;
        var url = linkUrl = pic.url;
        domUtil.each(images, function(i, img) {
            var link = findImageNode(img, 'link');
            link.href = linkUrl;
            var tempImage = new Image();
            var errorCount = 0;
            tempImage.onload = function() {
                img.src = url;
                var css = {
                    width: '',
                    height: ''
                };
                domUtil.setStyle(img, css);
                domUtil.removeAttr(img, 'se-name');
                if (env.$ie6) {
                    var maxWidth = parseInt(domUtil.getStyle(img, 'max-width'));
                    (maxWidth < tempImage.width) && (img.width = maxWidth);
                    domUtil.attr(img, 'original-width', img.width);
                }
                var deleteBtn = findImageNode(img, 'delete');
                if (deleteBtn) {
                    resetDeleteBtnPos(img, deleteBtn);

                }
            }
            tempImage.onerror = function() {
                tempImage.src = url + '?' + errorCount;
                errorCount++;
                if (0 < errorCount) {
                    tempImage.onerror = null;
                    domUtil.attr(img, 'se-name', 'load-error');
                    domUtil.remove(findImageNode(img, 'wrapper'));
                }
            }
            tempImage.src = url;
        });
    }

    // flash上传结束回调
    window.uploadFinish = function(fileName, url) {
        /*if (result.code === "A00006") {
            domUtil.each(result.data.pics, function(p, pic) {
                uploadImages.push({
                    name: pic.name,
                    pid: pic.pid
                });
                renderImage(pic);
            });
        }*/
        var pic = {}
        pic.name = fileName;
        pic.url = url;
        uploadImages.push({
            name: pic.name,
            url: pic.url
        });
        renderImage(pic);
    }

    // 绑定上传图片按钮事件
    //function bindClick(layer) {
    var codeMsgMap = {};

    /*$dom.on(layer.node, 'click', function(e) {
        uploadHolder.installTip();
    });*/

    window.selectFile = function(filesname) {

        //data:image/gif;base64,R0lGODlhAQABAJEAAAAAAP///////wAAACH5BAEHAAIALAAAAAABAAEAAAICVAEAOw==";

        var frag = domUtil.createFragment();
        //      imageLoadedCount = 0;
        //
        //      uploadImagesCount = 0;
        //v7sendLog('16_01_11');
        domUtil.each(filesname, function(i, filename) {
            var nodes = createImg(defaultBase64URL, filename);

            domUtil.each(nodes, function(p, el) {
                domUtil.setCSSText(el, ALIGN_CENTER_CSS[p]);
            });
            domUtil.setStyle(nodes.img, {
                //width: '670px',
                //height: '200px'
            });
            frag.appendChild(nodes.wrapper);
            currentEditor.exec('insertImg', nodes.wrapper);
        });
       // currentEditor.exec('insertImg', frag);

    }

    window.btnClick = function() {
        insertParagraph = currentParagraph;
    }

    function showError(imgs, name, msg) {
        domUtil.each(imgs, function(i, img) {
            domUtil.text(img.nextSibling, msg);
        });
    }

    // 上传出错处理
    function uploadError(code, name, msg) {
        name = name || '';
        //            console.log('uploadError:', code, name, msg)
        if (code == "A00650") {
            // 上传图片数量超限
            /*uploadHolder.alert("每次最多可以上传20张图片，稍后继续上传！", {
                width: 570
            });*/
        } else {
            var imgs = domUtil.$('img[se-name="' + name + '"]', currentEditor.body);
            //      domUtil.removeAttr(imgs, 'se-name');
            if (imgs.length) {
                domUtil.remove(findImageNode(imgs[0], 'wrapper'));
            }
            codeMsgMap[code] = msg;
        }

    }

    function allFinish(total, finishFiles, cancelFiles, errorFiles) {

        //            console.log('allFinish');
        var msg = [],
            hasOutOfLimit = false;
        domUtil.each(errorFiles, function(i, errorInfo) {
            //uploadError(errorInfo.code, errorInfo.name);
            if ('A06004' === errorInfo.code) {
                hasOutOfLimit = true;
            } else if (errorInfo.name) {
                msg.push(errorInfo.name + ':' + codeMsgMap[errorInfo.code]);
                domUtil.each(domUtil.$('img[se-name="' + errorInfo.name + ']'), function(i, img) {
                    var pn;
                    if (img.src === defaultBase64URL) {
                        pn = findImageNode(img, 'wrapper');
                        domUtil.remove(pn);
                    }
                });
            }

        });

        //            console.log(0 !== msg.length || hasOutOfLimit, msg, hasOutOfLimit)
        if (0 !== msg.length || hasOutOfLimit) {
            var msgTxt = '请选择不超过' + (scope.$is_photo_vip ? '10' : '5') + 'M 且格式为 jpg、gif、png的图片';
            if (!scope.$is_photo_vip) {
                msg.unshift('<a target="_blank" href="http://control.blog.sina.com.cn/blog_rebuild/profile/controllers/points_redeem.php?type=3" style="color:red">150积分开通大图上传</a>');
            }
            /*uploadHolder.alert(msgTxt, {
                width: 550,
                subText: msg.join('<br/>')
            });*/
        }
        //            console.log('allFinish2');
        //      uploadImagesCount = finishFiles.length;
    }

    function imageInfo(name, width, height) {
        var imgs = domUtil.$('img[se-name="' + name + '"]');
        // console.log(name, width, height, imgs);
        width = parseInt(width, 10);
        height = parseInt(height, 10);
        if (width > 670) {
            var ratio = height / width;
            width = 670;
            height = parseInt(ratio * width, 10);
        }
        domUtil.setStyle(imgs, {
            width: width + 'px',
            height: height + 'px'
        })
    }

    //
    /*uploadHolder.setUp('uploadimgflash', {
        click: btnClick,
        error: uploadError,
        selectFile: selectFile,
        uploadFinish: uploadFinish,
        allFinish: allFinish,
        imageInfo: imageInfo
    });*/

    //var input = $dom.$('input[name="pic1"]', $("#editorTool"))[0];
    //console.log(input);
    //var insertParagraph;
    /*if (!input) {
        return;
    }

    function onInputChange(e) {
        var target = e.target,
            files = target.files,
            frag = domUtil.createFragment();

        domUtil.each(files, function(i, file) {
            // html5新特性
            var url = URL.createObjectURL(file);
            var nodes = createImg(url, file.name);

            domUtil.each(nodes, function(p, el) {
                domUtil.setCSSText(el, ALIGN_CENTER_CSS[p]);
            });
            frag.appendChild(nodes.wrapper);
        });
        currentEditor.exec('insertImg', frag, insertParagraph);
    }*/

    //$dom.on(input, 'change', onInputChange);

    //$dom.on(input, 'click', btnClick);

    //}

    // 获取开始节点
    function getStart(rng) {
        var start = rng.startContainer;
        return 1 === start.nodeType ? start.childNodes.item(rng.startOffset) : start;
    }

    /**
     * 获取插入图片结构的所有节点
     * @param {HTMLElement|Range} obj
     * @returns {{wrapper: Node, img: Image, imgParent: Node, span: Node}}
     */
    function getNodes(obj) {
        var img;
        if (obj.startContainer) {
            img = getStart(obj);
        } else {
            img = obj;
        }

        if ('IMG' !== img.nodeName.toUpperCase()) {
            return;
        }
        var imgParent = findImageNode(img, 'img-parent'); //img.parentNode;
        var wrapper = imgParent.parentNode;
        var span = domUtil.$('span', wrapper)[0];

        return {
            wrapper: wrapper,
            img: img,
            imgParent: imgParent,
            span: span
        }
    }

    /**
     * 判断rng的开始节点是否为图片节点，或obj是否为图片
     * @param {HTMLElement|Range} obj
     * @returns {boolean}
     */
    function isImage(obj) {
        var el;
        if (obj.startContainer) {
            el = getStart(obj);
        } else {
            el = obj;
        }

        var isImg = el && 'IMG' == el.nodeName.toUpperCase();
        if (isImg) {
            domUtil.attr(el, 'se-holder') && (isImg = false);
        }
        return isImg && domUtil.attr(el, 'se-img');
    }

    function isInEditor() {
        return domUtil.attr(currentEditor.body, 'hoverIn');
    }

    var lastTimer;

    function hideHoverLayer() {
        if (lastTimer) {
            clearTimeout(lastTimer);
        }
        lastTimer = setTimeout(function() {
            if (uploadBtn.isIn() || isInEditor()) {
                return;
            }
            uploadBtn.setPos(-10000, -10000);
        }, 2000);
    }

    // 新建一行
    function newLine(el) {
        var wrapper = findImageNode(el, 'wrapper');
        var newParag = domUtil.create('p', {
            innerHTML: SinaEditor.env.$webkit ? '<br se-holder="1"/>' : ''
        });
        return domUtil.insertAfter(newParag, wrapper);

    }

    // 将图注设置为空
    function resetSpanText(span, rng) {
        domUtil.text(span, '');
        rng.setStart(span, 0);
        rng.collapse(true);
        rng.select();
    }

    /**
     * 重置删除按钮位置
     * @param target
     * @param deleteBtn
     */
    function resetDeleteBtnPos(target, deleteBtn) {
        if (!deleteBtn) {
            return;
        }
        var imgParent = findImageNode(target, 'img-parent');
        domUtil.setStyle(imgParent, {
            position: 'relative'
        });
        var border = 0,
            left = 0;

        if (SinaEditor.env.$msie) {
            border = parseInt(domUtil.getStyle(target, 'border'), 10);
            if (target.getBoundingClientRect) {
                left = target.getBoundingClientRect().left - imgParent.getBoundingClientRect().left;
            } else {
                left = target.offsetLeft;
            }

            isNaN(border) && (border = 0);
        } else {
            left = target.offsetLeft;
        }
        var width = target.offsetWidth;
        domUtil.setStyle(deleteBtn, {
            left: (left + parseInt(width, 10) + border - deleteBtn.offsetWidth) + 'px'
        });
    }
    window.upload_img = function(tk) {
            $('#editorImg').uploadify({
                "auto": true,
                'fileObjName': 'img',
                "buttonText": "插入图片",
                'swf': '/js/uploadify/uploadify.swf',
                'fileSizeLimit': 5 * 1024 + 'KB', //3M
                'uploader': window.zcHost+'/api/report/upload/?format=json',
                "formData": {
                    'id': window.actId,
                    'uid': window.sinaresult.uid, //用户uid
                    'token': tk
                },
                'onUploadSuccess': function(file, data, response) {
                    var result = eval('(' + data + ')');
                    if (result.result.status.code == 0) {
                        var names = [];
                        names.push(file.name);   
                        selectFile(names);
                        uploadFinish(file.name, result.result.data.url);
                    } else {
                        alert(result.result.status.msg);
                    }
                },
                'onSelectError': function(file) {
                    //文件入队失败处理
                    //...
                    //console.log(file);
                    //console.log("00")
                    //alert("上传图片失败");
                },
                'onUploadError': function(file, errorCode, errorMsg, errorString) {
                    //console.log(file, errorCode, errorMsg, errorString);
                    //console.log("11");
                    alert("上传图片失败");
                    return;
                }
            });
        }
        // 初始化按钮事件
    function init() {
        //var linkBtn = new Button({id:'link', name:'linkBtn'});
        var offsetLeft, imgToolbar, toolbarWith, toolbarHeight, isInputting;

        /**
         * 设置图片排版toolbar位置
         * @param target
         */
        function setImageToolbarPos(target) {
            // console.log(target);
            var offset = domUtil.getPos(target);
            if (!toolbarWith) {
                var rect = imgToolbar.getRect();
                toolbarWith = rect.width / 2 + 10;
                toolbarHeight = rect.height + 10;
            }
            domUtil.each(domUtil.$('img[se-img="img"]'), function(i, img) {
                domUtil.setStyle(img, {
                    border: '',
                    'box-sizing': ''
                });
            });
            domUtil.setStyle(target, {
                border: '2px solid #0f0f0f',
                'box-sizing': 'border-box'
            });
            imgToolbar.show(offset.left + target.offsetWidth / 2 - toolbarWith, offset.top - toolbarHeight);
            imgToolbar.setTarget(target);
            // deleteBtn
            currentEditor.fire('toolbar.imageToolBar.show', target);
            var deleteBtn = findImageNode(target, 'delete');
            if (deleteBtn) {
                resetDeleteBtnPos(target, deleteBtn);
            }
        }
        $.ajax({
                url: window.zcHost+"/api/report/token/"+window.actId,
                type: 'get',
                dataType: 'jsonp',
                success: function(data) {
                    //console.log(window.sinaresult.uid);
                    if (window.sinaresult.uid) {
                        if (data.result.status.code == 0) {
                            var tk = data.result.data.img_token;
                            //var isClick = $("#editorImg").data("click");
                            //if(isClick) upload_img(tk);
                            upload_img(tk);
                            /*$("#editorImg").bind("click",function(){
                                $('#file_upload').uploadify();
                            })*/
                        } else {
                            var msg = data.result.status.msg;
                            alert(msg);
                        }
                    } else {
                        alert("请先登录，再进行后续操作！");
                    }

                }
            });
        currentEditor.on('toolbar.paragraphenter', function(e, target, toolbar) {
            // console.log('paragraphenter', target);
            //      if (!toolbar.isHidden) {
            //        return;
            //      }
            var wrapper = findImageNode(target, 'wrapper');
                /*if (wrapper) {
                    var style = domUtil.getStyle(wrapper, 'float');
                    if ('right' == style) {
                        uploadBtn && uploadBtn.setPos(-1000, -1000);
                        return;
                    }
                }*/
            var offset = domUtil.getPos(target);
            //currentParagraph = target;
            //console.log(target);
            /*if (!uploadBtn) {
                // console.log('paragraphenter --- create hover');
                //uploadBtn = createUploadBtn();
                bindClick(uploadBtn);

            }*/
            //console.log(offset);
            //console.log(target);
            // console.log('图片上传show');
            // hoverLayer.show();
            //offset.left = offset.left - offsetLeft;
            //uploadBtn.setPos(offset.left, offset.top - 15);
        });

        currentEditor.on('toolbar.paragraphleave', function(e, target, toolbar) {

            /*if (!uploadBtn) {
                return;
            }
            hideHoverLayer();*/
            //console.log(editor.getContent());
        });

        // 上传图片点击事件处理，显示图片排版toolbar
        domUtil.on(currentEditor.body, 'click', function(e) {
            var target = e.target;

            if (!isImage(target)) {
                return;
            }
            if (!imgToolbar) {
                imgToolbar = createToolbar();
            }
            setImageToolbarPos(target);
        }, false, 'img[se-img="img"]');

        // 处理非webkit浏览器出现图片编辑框的问题BLOGBUG-14373
        domUtil.on(currentEditor.body, 'mousedown', function(e) {
            e = domUtil.fixEvent(e);
            var target = e.target;
            var wrapper = findImageNode(target, 'wrapper');
            var span = findImageNode(wrapper, 'span');
            var deleteBtn = findImageNode(wrapper, 'delete');
            if (target == span || domUtil.contains(deleteBtn, target)) {
                return;
            }
            //      e.preventDefault();
            var rng = currentEditor.getRange();
            rng.setStart(span, 0);
            rng.collapse(true);
            rng.select(true);
        }, false, 'div[se-img="wrapper"]');

        //domUtil.hover(editor.body, function(e){}, function(){});
        // 显示删除按钮，并对删除按钮做处理
        domUtil.hover(currentEditor.body, function(e) {
            e = domUtil.fixEvent(e);
            var target = e.target;
            if ('IMG' !== target.nodeName.toUpperCase()) {
                target = domUtil.$('img', e.target)[0];
            }
            if (!target) {
                return;
            }

            var deleteBtn = findImageNode(target, 'delete');
            if (!deleteBtn) {
                deleteBtn = createDeleteBtn();

                //            console.log('delteBtn');
                var lastDeleteFunc = Util.bind(function() {
                    var imgDom = findImageNode(this, 'wrapper');
                    domUtil.remove(imgDom);
                    deleteBtn = null;
                    lastDeleteFunc = null;
                    currentEditor.fire('saveUndo');
                    //v7sendLog('16_01_12');
                }, target);

                deleteBtn.onclick = lastDeleteFunc;
            }
            domUtil.setStyle(deleteBtn, {
                top: '0px',
                display: 'block',
                zIndex: 20,
                cursor: 'pointer'
            });
            domUtil.insertAfter(deleteBtn, findImageNode(target, 'link'));
            resetDeleteBtnPos(target, deleteBtn);
        }, function(e) {
            e = domUtil.fixEvent(e);
            var target = e.target;
            if ('IMG' !== target.nodeName.toUpperCase()) {
                target = domUtil.$('img', e.target)[0];
            }
            var wrapperDom = findImageNode(target, 'wrapper');
            var deleteBtns = domUtil.$('a[se-img="delete"]', wrapperDom);
            domUtil.each(deleteBtns, function(i, btn) {
                btn.onclick = null
                domUtil.remove(btn);
            });

            wrapperDom.style.position = '';

        }, 'div[se-img="wrapper"]');

        // 监听图注输入框
        domUtil.on(currentEditor.body, 'click', function(e) {
            e = domUtil.fixEvent(e);
            var span = e.target;
            if (IMG_TIPS === domUtil.text(span)) {
                var rng = currentEditor.getRange();
                resetSpanText(span, rng);
            }
            //v7sendLog('16_01_13')
        }, false, 'span[se-img="span"]');

        // 监听图注输入框
        domUtil.on(currentEditor.body, 'keyup', function(e) {
            e = domUtil.fixEvent(e);
            var span = e.target;

            if (!isInputting) {
                var index = domUtil.text(span).indexOf(IMG_TIPS);
                if (-1 !== index) {
                    span.childNodes[0].deleteData(index, IMG_TIPS.length)
                }
            }
        }, false, 'span[se-img="span"]');

        currentEditor.on('compositionstart', function(e, evt) {
            isInputting = true;
        });
        currentEditor.on('compositionend', function() {
            isInputting = false;
        });

        domUtil.on(currentEditor.doc.body, 'click', function(e) {
            e = domUtil.fixEvent(e);
            var target = e.target,
                seImg = domUtil.attr(target, 'se-img'),
                rng, start;
            // 有时候span的click事件不会触发，因此在这里检查一遍
            if (seImg == 'img-parent') {
                rng = currentEditor.getRange();
                start = rng.startContainer;
                if (IMG_TIPS == start.nodeValue) {
                    resetSpanText(start.parentNode, rng);
                    return;
                }
            }
            if ('span' !== seImg) {
                var spanArr = domUtil.$('span[se-img="span"]', currentEditor.body);
                domUtil.each(spanArr, function(i, span) {
                    if (!Util.trim(domUtil.text(span))) {
                        domUtil.text(span, IMG_TIPS);
                    }
                });
            }
        });

        domUtil.hover(currentEditor.body, function() {
            domUtil.attr(this, 'hoverIn', '1');
        }, function() {
            domUtil.removeAttr(this, 'hoverIn');
        });

        // 执行图片排版操作
        currentEditor.on('toolbar.alignCenter.click', function(e, toolbar) {
            var image = toolbar.getTarget();
            var nodes = getNodes(image);
            currentEditor.exec('imageAlign', ALIGN_CENTER_CSS, nodes);
            setImageToolbarPos(image);
            //v7sendLog('16_01_15');
        });
        currentEditor.on('toolbar.alignLeft.click', function(e, toolbar) {
            var image = toolbar.getTarget();
            var nodes = getNodes(image);
            currentEditor.exec('imageAlign', ALIGN_LEFT_CSS, nodes);
            setImageToolbarPos(image);
            //v7sendLog('16_01_14');
        });
        currentEditor.on('toolbar.alignRight.click', function(e, toolbar) {
            var image = toolbar.getTarget();
            var nodes = getNodes(image);
            currentEditor.exec('imageAlign', ALIGN_RIGHT_CSS, nodes);
            setImageToolbarPos(image);
            //v7sendLog('16_01_16');
        });

        // 查询图片状态并设置图片状态
        currentEditor.on('toolbar.imageToolBar.show', function(e, img) {
            var align = currentEditor.queryCommandState('imageAlign', img);
            if (!align) {
                return;
            }
            var btn = imgToolbar.getButton('imageAlign');
            if (btn) {
                btn.active(align);
            }

        });

        // 处理图片排版toolbar隐藏事件，移除删除图片按钮，重置图片边框
        domUtil.on(currentEditor.body, 'click', function(evt) {
            if (imgToolbar && !imgToolbar.isHidden && !isImage(evt.target)) {
                imgToolbar && imgToolbar.hide();
                domUtil.each(domUtil.$('img[se-img="img"]'), function(i, img) {
                    domUtil.setStyle(img, {
                        border: '',
                        'box-sizing': ''
                    });
                });
                //                var deleteBtns = domUtil.$('#se-img-delete');
                //                if (!deleteBtns.length) {
                //                    return;
                //                }
                //                domUtil.each(deleteBtns, function (i, btn) {
                //                    var imageParent = findImageNode(btn, 'img-parent');
                //                    if (lastDeleteFunc && btn == deleteBtn) {
                //                        domUtil.off(deleteBtn, 'click', lastDeleteFunc);
                //                        lastDeleteFunc = null;
                //                        deleteBtn = null;
                //                    }
                //                    domUtil.remove(btn);
                //                    imageParent.style.position = '';
                //                });
            }
        });

        // 阻止图片拖拽
        domUtil.on(currentEditor.body, 'dragstart', function(e) {
            e.preventDefault();
            return false;
        }, false, 'img');

        currentEditor.on('beforeenter', function(e, evt) {
            var target = domUtil.fixEvent(evt).target,
                wrapper, newPrag, rng = currentEditor.getRange(),
                start = domUtil.getStart(rng),
                returnValue = true;

            // console.log('target:', target);
            if (domUtil.attr(target, 'se-img')) {
                returnValue = false;
                wrapper = findImageNode(target, 'wrapper');
                newPrag = domUtil.create('p', {
                    innerHTML: SinaEditor.env.$webkit ? '<br se-holder="1"/>' : ''
                });
                domUtil.insertAfter(newPrag, wrapper);

                rng.setStart(newPrag, 0);
                rng.collapse(true);

                rng.select(true);
                //throw  new Error("222");

            } else {

                if (start == currentEditor.body) {
                    return;
                }
                domUtil.each(domUtil.parents(start), function(i, el) {
                    if (domUtil.attr(el, 'se-img')) {
                        evt.preventDefault();
                        returnValue = false;
                        return false;
                    }
                });
                if (!rng.collapsed) {
                    return returnValue;
                }

                if (returnValue) {
                    var end = domUtil.getEnd(rng);
                    domUtil.each(domUtil.parents(end), function(i, el) {
                        if (domUtil.attr(el, 'se-img')) {
                            evt.preventDefault();
                            returnValue = false;
                            return false;
                        }

                    });
                } else {
                    var startContainer = rng.startContainer,
                        resetStart;
                    if ((3 == startContainer.nodeType && 0 < rng.startOffset && rng.startOffset == startContainer.nodeValue.length) || (rng.endOffset == startContainer.childNodes.length)) {
                        resetStart = newLine(start);
                        rng.setStart(resetStart, 0);
                        rng.collapse(true);
                        rng.select(true);
                        //rng.scrollToCursor(30);
                    }

                }
            }
            if (false === returnValue) {
                evt.preventDefault();
            }

            return returnValue;
        });

        currentEditor.on('beforedelete', function(e, evt) {
            var target, offset = -1,
                wrapper, walker, resetStart, end, next, prev;
            var rng = currentEditor.getRange();
            var start = domUtil.getStart(rng);
            if (3 == start.nodeType) {
                start = start.parentNode;
                offset = rng.startOffset;
            }

            var findNode = function(start, dir, nodeType) {
                nodeType = nodeType || 3
                walker = domUtil.treeWalker(start, currentEditor.body, function(node) {
                    if (nodeType !== node.nodeType) {
                        return false;
                    }
                });
                return walker[dir]();
            }

            // 是否在一段的最后
            var isAtLastPragh = function(rng) {
                if (!rng.collapsed) {
                    return false;
                }
                var start = rng.startContainer;
                var offset = rng.startOffset;
                if (!domUtil.contains(currentEditor.body, start)) {
                    return false;
                }
                if (1 == start.nodeType && start === currentEditor.body) {
                    return offset === start.childNodes.length;
                } else if (3 === start.nodeType) {
                    if (offset !== start.nodeValue.length) {
                        return false;
                    } else {
                        start = start.parentNode;
                    }
                }

                var isBody;
                while (start && start !== currentEditor.body) {
                    isBody = start.parentNode == currentEditor.body;
                    if (isBody) {
                        return true;
                    } else if (!isBody && start.nextSibling) {
                        return false;
                    } else {
                        start = start.parentNode;
                    }
                }
                return false;
            }

            if (offset == 0 && VK.BACKSPACE == evt.keyCode) {
                prev = findNode(start, 'prev', 1);
                if (prev) {
                    wrapper = findImageNode(prev, 'wrapper')
                }
            } else if (VK.DELETE == evt.keyCode) {
                // 判断光标是否在一段的结尾
                if (isAtLastPragh(rng)) {
                    next = findNode(start, 'next', 1);
                    if (next) {
                        wrapper = findImageNode(next, 'wrapper')
                    }
                } else {
                    return;
                }
            } else {
                wrapper = findImageNode(start, 'wrapper');
            }

            if (rng.collapsed && !wrapper) {
                return;
            }
            if (!wrapper) {
                end = domUtil.getEnd(rng);
                if (3 == end.nodeType) {
                    end = end.parentNode;
                }
                wrapper = findImageNode(end, 'wrapper');
            }
            if (!wrapper) {
                return;
            }

            target = end || start;

            if (rng.collapsed && findImageNode(target, 'span')) {
                if (!domUtil.text(target) || !offset) {
                    return false;
                }
                return;
            }

            if (rng.collapsed) {
                currentEditor.fire('saveUndo');

                if (resetStart = wrapper.previousSibling) {
                    start = findNode(resetStart, 'prev');
                    if (start && 3 == start.nodeType) {
                        offset = start.nodeValue.length;
                        resetStart = start;
                    } else {
                        offset = start.childNodes.length;
                    }

                } else if (resetStart = wrapper.nextSibling) {
                    start = findNode(resetStart, 'next');
                    if (start && 3 == start.nodeType) {
                        resetStart = start;
                    }
                    offset = 0;
                } else {
                    resetStart = domUtil.create('p', {
                        innerHTML: SinaEditor.env.$webkit ? '<br se-holder="1">' : ''
                    });
                    offset = 0;
                    currentEditor.body.appendChild(resetStart);
                }
                rng.setStart(resetStart, offset);
                rng.collapse(true);
                domUtil.remove(wrapper);
                rng.select(true);
                currentEditor.fire('saveUndo');
                return false;
            } else if (end) {
                rng.setEndAfter(wrapper);
            } else {
                rng.setStartBefore(wrapper);
            }
        });

        currentEditor.on('afterCommand', function(e, cmdName) {
            if ('todo' === cmdName) {
                imgToolbar && imgToolbar.setPos(-10000, -10000);
                var images = domUtil.$('img'),
                    imageName, pic;
                domUtil.each(images, function(i, image) {
                    imageName = domUtil.attr(image, 'se-name');
                    if (imageName) {
                        pic = findPic(imageName);
                        pic && renderImage(pic, image);
                    }

                });
                //                var deleteBtns = domUtil.$('a[name="se-img-delete"]');
                //                domUtil.each(deleteBtns, function (i, btn) {
                //                    domUtil.remove(btn);
                //                });
                //                deleteBtn = null;
            }
        });

        // 先过滤图片
        currentEditor.on('beforeGetContent', function(e, content) {
            var html = content.html;
            var tmpDiv = domUtil.create('div');
            tmpDiv.innerHTML = html;
            // 没有图注的情况删除图注
            domUtil.each(domUtil.$('span[se-img="span"]', tmpDiv), function(i, span) {
                var wrapper = findImageNode(span, 'wrapper');
                var textContent = Util.trim(domUtil.text(span));
                if (IMG_TIPS === textContent) {
                    domUtil.remove(span);
                    domUtil.setStyle(wrapper, {
                        marginBottom: ''
                    });
                }
            });
            // 去掉图片的border
            domUtil.each(domUtil.$('img[se-img="img"]', tmpDiv), function(i, img) {
                if (domUtil.getStyle(img, 'border')) {
                    domUtil.setStyle(img, {
                        border: ''
                    });
                }
            });
            // 过滤自定义属性
            html = tmpDiv.innerHTML;
            tmpDiv = null;

            var holderRegxs = [/(<[^<>]+)([ ](?:se-holder)=[^<>\s]+){1,}([^<>]*>)/ig,
                    /(<[^<>]+)([ ](?:contenteditable)=[^<>\s]+){1,}([^<>]*>)/ig,
                    /(<[^<>]+)([ ](?:se-name)=[^<>\s]+){1,}([^<>]*>)/ig,
                    /(<[^<>]+)([ ](?:se-img)=[^<>\s]+){1,}([^<>]*>)/ig
                ],
                regx;
            var spanRegx = /(<span[^<>]+se-img="span"[^<>]+>([^<>]*)<\/span>)/ig;

            html = html.replace(spanRegx, function(match, spanHtml, text, index) {
                if (IMG_TIPS == text) {
                    return '';
                }
                return spanHtml;
            });
            for (var i = 0, len = holderRegxs.length; i < len; i++) {
                regx = holderRegxs[i];
                html = html.replace(regx, function(match, $1, $2, $3) {
                    return $1 + $3;
                });
            }

            content.html = html;
        });
    }

    // 编辑器准备好后初始化编辑器内容图片
    currentEditor.on('tmpAfterSetContent', function() {
        var imgs = domUtil.$('img');
        domUtil.each(imgs, function(i, img) {
            try {
                var link = img.parentNode;
                var imgParent = link.parentNode;
                var wrapper = imgParent.parentNode;
                var annotation = link.nextSibling;
                while (annotation) {
                    if ('span' == annotation.nodeName.toLowerCase()) {
                        break;
                    } else {
                        annotation = annotation.nextSibling;
                    }
                }
                if (link && ('A' == link.nodeName.toUpperCase()) && imgParent != currentEditor.body && domUtil.contains(currentEditor.body, imgParent)) {
                    domUtil.attr(img, 'se-img', 'img')
                        .attr(link, 'se-img', 'link')
                        .attr(imgParent, 'se-img', 'img-parent')
                        .attr(imgParent, 'unselectable', 'on')
                        .attr(wrapper, 'se-img', 'wrapper')
                        .attr(wrapper, 'contentEditable', 'false');
                    if (!annotation) {
                        annotation = domUtil.create('span', {
                            style: ALIGN_CENTER_CSS.span,
                            innerHTML: IMG_TIPS,
                            unselectable: 'off'
                        });
                    }
                    domUtil.attr(annotation, 'se-img', 'span').attr(annotation, 'contenteditable', 'true');
                    domUtil.insertAfter(annotation, link);
                }
            } catch (e) {
                // 不是正常的图片结构
            }

        });
    });

    currentEditor.on('toolbar.beforeshow', function(e, toolbar, rng) {
        if (rng.collapsed) {
            return;
        }
        var start = domUtil.getStart(rng),
            end = domUtil.getEnd(rng);

        var span = findImageNode(start, 'span');
        if (!span) {
            span = findImageNode(end, 'span');
        }
        if (!span) {
            return;
        } else {
            return false;
        }

    });

    domUtil.on(currentEditor.body, 'click', function(e) {
        e = domUtil.fixEvent(e);
        e.preventDefault();
        return false;
    }, false, 'a');

    if (isBelowIe8) {
        //    domUtil.on(editor.body, 'click mouseover mouseout', function (e) {
        //      e = domUtil.fixEvent(e);
        //      e.preventDefault();
        //      return false;
        //    }, false, 'img');
    }

    init();
});