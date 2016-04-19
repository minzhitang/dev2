/**
 * 注册图片插件
 * @author Qiangyee
 * @date 2014-08-04
 */
SinaEditor.PluginManager.register('image', function (options, editor) {
    var domUtil = editor.domUtil, env = SinaEditor.env;

    /**
     * 查找图片结构对应的节点
     * @param el 起始dom节点
     * @param name se-img属性名称
     * @returns {*}
     */
    function findImageNode(el, name) {
        var seImg;
        while (el && (el !== editor.body)) {
            seImg = domUtil.attr(el, 'se-img');
            if (seImg == name) {
                return el;
            }
            el = el.parentNode;
        }
    }
    function createNewParagraph() {
        var paragraph = domUtil.create('p', {
            innerHTML: SinaEditor.env.$webkit ? '<br se-holder="1">' : ''
        });
        return paragraph;
    }
    // 插入图片插件
    editor.registerCmd('insertImg', {
        exec: function (cmd, frag) {
            //domUtil.insertBefore(frag, target);
            var rng = editor.getRange();
            var start = domUtil.getStart(rng);//.startContainer;
            var parents = domUtil.parents(start, true);
            var wrapper = parents.pop();
            var editorBody = editor.body;
            /*if ((rng.collapsed && rng.startContainer == editorBody && 0 == rng.startOffset ) || (!wrapper || wrapper == editorBody)) 
            domUtil.insertBefore(frag, editorBody);
            else
            domUtil.insertBefore(frag, wrapper);*/
            if ((rng.collapsed && rng.startContainer == editorBody && 0 == rng.startOffset ) || (!wrapper || wrapper == editorBody)) {
                //console.log(editorBody);
                if(editorBody) editorBody.appendChild(frag);
                var paragraph = createNewParagraph();
                domUtil.insertNode(paragraph, editorBody, 'beforeend');
                rng.setStart(paragraph, 0);
                //domUtil.insertBefore(frag, editorBody);
            } else {
                // 剪切当前的range
                rng.setEndAfter(wrapper);
                var lastFrag = rng.extractContents();
                var lastFragFirstChild = lastFrag.firstChild;

                // 插入节点，然后插入剩余的dom节点
                domUtil.insertAfter(frag, wrapper);

                if (domUtil.text(lastFragFirstChild)) {
                    domUtil.insertAfter(lastFrag, frag);
                } else {
                    var paragraph = createNewParagraph();
                    domUtil.insertAfter(paragraph, frag);
                    lastFragFirstChild = paragraph;
                }
                rng.setStart(lastFragFirstChild, 0);
            }
            rng.collapse(true);
            rng.select(true);
        }
    });
    // 图片排版命令
    editor.registerCmd('imageAlign', {
        queryCommandState: function (cmd, item) {
            var state = '';
            if ('IMG' === item.nodeName.toUpperCase()) {
                var floatStyle = editor.domUtil.getStyle(findImageNode(item, 'wrapper'), 'float');
                if (!floatStyle || 'none' == floatStyle.toLowerCase()) {
                    floatStyle = 'Center'
                }
                state = 'align' + floatStyle.replace(/^([a-z])/, function ($1) {
                    return $1.toUpperCase()
                });

            }
            return state;
        },
        exec: function (cmd, style, nodes) {
            domUtil.each(nodes, function (p, el) {
                domUtil.setCSSText(el, style[p]);
            });
            if (env.$ie6) {
                var img = nodes.img;
                var oWidth = domUtil.attr(img, 'original-width');
                var width = domUtil.getStyle(img, 'max-width');
                if (oWidth > width) {
                    img.width = parseInt(width);
                }
            }
        }
    })
});
