/*
 * wysiwyg web editor
 *
 * suneditor.js
 * Copyright 2017 JiHong Lee.
 * MIT license.
 */
'use strict';

// import fileBrowser from '../modules/fileBrowser';
// import('../modules/fileBrowser').then((module) => {
//     const fileBrowser = module.default;
// });

const fileBrowser = {
    name: 'fileBrowser',
    _xmlHttp: null,
    _loading: null,

    /**
     * @description Constructor
     * @param {Object} core Core object
     */
    add: function (core) {
        const context = core.context;
        context.fileBrowser = {
            _closeSignal: false,
            area: null,
            header: null,
            tagArea: null,
            body: null,
            list: null,
            tagElements: null,
            items: [],
            selectedTags: [],
            selectorHandler: null,
            contextPlugin: '',
            columnSize: 4
        };

        /** fileBrowser */
        let browser_div = core.util.createElement('DIV');
        browser_div.className = 'se-file-browser sun-editor-common';

        let back = core.util.createElement('DIV');
        back.className = 'se-file-browser-back';

        let content = core.util.createElement('DIV');
        content.className = 'se-file-browser-inner';
        content.innerHTML = this.set_browser(core);

        browser_div.appendChild(back);
        browser_div.appendChild(content);
        this._loading = browser_div.querySelector('.se-loading-box');

        context.fileBrowser.area = browser_div;
        context.fileBrowser.header = content.querySelector('.se-file-browser-header');
        context.fileBrowser.titleArea = content.querySelector('.se-file-browser-title');
        context.fileBrowser.tagArea = content.querySelector('.se-file-browser-tags');
        context.fileBrowser.body = content.querySelector('.se-file-browser-body');
        context.fileBrowser.list = content.querySelector('.se-file-browser-list');

        /** add event listeners */
        context.fileBrowser.tagArea.addEventListener('click', this.onClickTag.bind(core));
        context.fileBrowser.list.addEventListener('click', this.onClickFile.bind(core));
        content.addEventListener('mousedown', this._onMouseDown_browser.bind(core));
        content.addEventListener('click', this._onClick_browser.bind(core));

        /** append html */
        context.element.relative.appendChild(browser_div);

        /** empty memory */
        browser_div = null, back = null, content = null;
    },

    set_browser: function (core) {
        const lang = core.lang;

        return '<div class="se-file-browser-content">' +
                '<div class="se-file-browser-header">' +
                    '<button type="button" data-command="close" class="se-btn se-file-browser-close" class="close" title="' + lang.dialogBox.close + '" aria-label="' + lang.dialogBox.close + '">' +
                    core.icons.cancel +
                    '</button>' +
                    '<span class="se-file-browser-title"></span>' +
                    '<div class="se-file-browser-tags"></div>' +
                '</div>' +
                '<div class="se-file-browser-body">' +
                    '<div class="se-loading-box sun-editor-common"><div class="se-loading-effect"></div></div>' +
                    '<div class="se-file-browser-list"></div>' +
                '</div>' +
            '</div>';
    },

    /**
     * @description Event to control the behavior of closing the browser
     * @param {MouseEvent} e Event object
     * @private
     */
    _onMouseDown_browser: function (e) {
        if (/se-file-browser-inner/.test(e.target.className)) {
            this.context.fileBrowser._closeSignal = true;
        } else {
            this.context.fileBrowser._closeSignal = false;
        }
    },

    /**
     * @description Event to close the window when the outside area of the browser or close button is click
     * @param {MouseEvent} e Event object
     * @private
     */
    _onClick_browser: function (e) {
        e.stopPropagation();

        if (/close/.test(e.target.getAttribute('data-command')) || this.context.fileBrowser._closeSignal) {
            this.plugins.fileBrowser.close.call(this);
        }
    },

    /**
     * @description Open a file browser plugin
     * @param {String} pluginName Plugin name using the file browser
     * @param {Function|null} selectorHandler When the function comes as an argument value, it substitutes "context.selectorHandler".
     */
    open: function (pluginName, selectorHandler)  {
        if (this.plugins.fileBrowser._bindClose) {
            this._d.removeEventListener('keydown', this.plugins.fileBrowser._bindClose);
            this.plugins.fileBrowser._bindClose = null;
        }

        this.plugins.fileBrowser._bindClose = function (e) {
            if (!/27/.test(e.keyCode)) return;
            this.plugins.fileBrowser.close.call(this);
        }.bind(this);
        this._d.addEventListener('keydown', this.plugins.fileBrowser._bindClose);

        const fileBrowserContext = this.context.fileBrowser;
        fileBrowserContext.contextPlugin = pluginName;
        fileBrowserContext.selectorHandler = selectorHandler;

        const pluginContext = this.context[pluginName];
        const listClassName = pluginContext.listClass;
        if (!this.util.hasClass(fileBrowserContext.list, listClassName)) {
            fileBrowserContext.list.className = 'se-file-browser-list ' + listClassName;
        }

        if (this.options.popupDisplay === 'full') {
            fileBrowserContext.area.style.position = 'fixed';
        } else {
            fileBrowserContext.area.style.position = 'absolute';
        }

        fileBrowserContext.titleArea.textContent = pluginContext.title;
        fileBrowserContext.area.style.display = 'block';

        this.plugins.fileBrowser._drawFileList.call(this, this.context[pluginName].url, this.context[pluginName].header);
    },

    _bindClose: null,

    /**
     * @description Close a fileBrowser plugin
     * The plugin's "init" method is called.
     */
    close: function () {
        const fileBrowserPlugin = this.plugins.fileBrowser;

        if (fileBrowserPlugin._xmlHttp) {
            fileBrowserPlugin._xmlHttp.abort();
        }

        if (fileBrowserPlugin._bindClose) {
            this._d.removeEventListener('keydown', fileBrowserPlugin._bindClose);
            fileBrowserPlugin._bindClose = null;
        }

        const fileBrowserContext = this.context.fileBrowser;
        fileBrowserContext.area.style.display = 'none';
        fileBrowserContext.selectorHandler = null;
        fileBrowserContext.selectedTags = [];
        fileBrowserContext.items = [];
        fileBrowserContext.list.innerHTML = fileBrowserContext.tagArea.innerHTML = fileBrowserContext.titleArea.textContent = '';

        if (typeof this.plugins[fileBrowserContext.contextPlugin].init === 'function') this.plugins[fileBrowserContext.contextPlugin].init.call(this);
        fileBrowserContext.contextPlugin = '';
    },

    /**
     * @description Show file browser loading box
     */
    showBrowserLoading: function () {
        this._loading.style.display = 'block';
    },

    /**
     * @description Close file browser loading box
     */
    closeBrowserLoading: function () {
        this._loading.style.display = 'none';
    },

    _drawFileList: function (url, browserHeader) {
        const fileBrowserPlugin = this.plugins.fileBrowser;

        const xmlHttp = fileBrowserPlugin._xmlHttp = this.util.getXMLHttpRequest();
        xmlHttp.onreadystatechange = fileBrowserPlugin._callBackGet.bind(this, xmlHttp);
        xmlHttp.open('get', url, true);
        if(browserHeader !== null && typeof browserHeader === 'object' && this._w.Object.keys(browserHeader).length > 0){
            for(let key in browserHeader){
                xmlHttp.setRequestHeader(key, browserHeader[key]);
            }
        }
        xmlHttp.send(null);

        this.plugins.fileBrowser.showBrowserLoading();
    },

    _callBackGet: function (xmlHttp) {
        if (xmlHttp.readyState === 4) {
            this.plugins.fileBrowser._xmlHttp = null;
            if (xmlHttp.status === 200) {
                try {
                    const res = JSON.parse(xmlHttp.responseText);
                    if (res.result.length > 0) {
                        this.plugins.fileBrowser._drawListItem.call(this, res.result, true);
                    } else if (res.nullMessage) {
                        this.context.fileBrowser.list.innerHTML = res.nullMessage;
                    }
                } catch (e) {
                    throw Error('[SUNEDITOR.fileBrowser.drawList.fail] cause : "' + e.message + '"');
                } finally {
                    this.plugins.fileBrowser.closeBrowserLoading();
                    this.context.fileBrowser.body.style.maxHeight = (this._w.innerHeight - this.context.fileBrowser.header.offsetHeight - 50) + 'px';
                }
            } else { // exception
                this.plugins.fileBrowser.closeBrowserLoading();
                if (xmlHttp.status !== 0) {
                    const res = !xmlHttp.responseText ? xmlHttp : JSON.parse(xmlHttp.responseText);
                    const err = '[SUNEDITOR.fileBrowser.get.serverException] status: ' + xmlHttp.status + ', response: ' + (res.errorMessage || xmlHttp.responseText);
                    throw Error(err);
                }
            }
        }
    },

    _drawListItem: function (items, update) {
        const fileBrowserContext = this.context.fileBrowser;
        const pluginContext = this.context[fileBrowserContext.contextPlugin];

        const _tags = [];
        const len = items.length;
        const columnSize = pluginContext.columnSize || fileBrowserContext.columnSize;
        const splitSize = columnSize <= 1 ? 1 : (Math.round(len/columnSize) || 1);
        const drawItemHandler = pluginContext.itemTemplateHandler;

        let tagsHTML = '';
        let listHTML = '<div class="se-file-item-column">';
        let columns = 1;
        for (let i = 0, item, tags; i < len; i++) {
            item = items[i];
            tags = !item.tag ? [] : typeof item.tag === 'string' ? item.tag.split(',') : item.tag;
            tags = item.tag = tags.map(function (v) { return v.trim(); });
            listHTML += drawItemHandler(item);

            if ((i + 1) % splitSize === 0 && columns < columnSize && (i + 1) < len) {
                columns++;
                listHTML += '</div><div class="se-file-item-column">';
            }

            if (update && tags.length > 0) {
                for (let t = 0, tLen = tags.length, tag; t < tLen; t++) {
                    tag = tags[t];
                    if (tag && _tags.indexOf(tag) === -1) {
                        _tags.push(tag);
                        tagsHTML += '<a title="' + tag + '" aria-label="' + tag + '">' + tag + '</a>';
                    }
                }
            }
        }
        listHTML += '</div>';

        fileBrowserContext.list.innerHTML = listHTML;

        if (update) {
            fileBrowserContext.items = items;
            fileBrowserContext.tagArea.innerHTML = tagsHTML;
            fileBrowserContext.tagElements = fileBrowserContext.tagArea.querySelectorAll('A');
        }
    },

    onClickTag: function (e) {
        const target = e.target;
        if (!this.util.isAnchor(target)) return;

        const tagName = target.textContent;
        const fileBrowserPlugin = this.plugins.fileBrowser;
        const fileBrowserContext = this.context.fileBrowser;

        const selectTag = fileBrowserContext.tagArea.querySelector('a[title="' + tagName + '"]');
        const selectedTags = fileBrowserContext.selectedTags;
        const sTagIndex = selectedTags.indexOf(tagName);

        if (sTagIndex > -1){
            selectedTags.splice(sTagIndex, 1);
            this.util.removeClass(selectTag, 'on');
        } else {
            selectedTags.push(tagName);
            this.util.addClass(selectTag, 'on');
        }

        fileBrowserPlugin._drawListItem.call(this,
            selectedTags.length === 0 ?
            fileBrowserContext.items :
            fileBrowserContext.items.filter(function (item) {
                return item.tag.some(function (tag) {
                    return selectedTags.indexOf(tag) > -1;
                });
            }), false);
    },

    onClickFile: function (e) {
        e.preventDefault();
        e.stopPropagation();

        const fileBrowserContext = this.context.fileBrowser;
        const listEl = fileBrowserContext.list;
        let target = e.target;
        let command = null;

        if (target === listEl) return;

        while (listEl !== target.parentNode) {
            command = target.getAttribute('data-command');
            if (command) break;
            target = target.parentNode;
        }

        if (!command) return;

        const handler = (fileBrowserContext.selectorHandler || this.context[fileBrowserContext.contextPlugin].selectorHandler);
        handler(target, target.parentNode.querySelector('.__se__img_name').textContent);
        this.plugins.fileBrowser.close.call(this);
    }
};

export default {
    name: 'imageGallery',
    /**
     * @description Constructor
     * @param {Object} core Core object 
     */
    add: function (core) {
        core.addModule([fileBrowser]);

        const context = core.context;
        context.imageGallery = {
            title: core.lang.toolbar.imageGallery, // @Required @Override fileBrowser - File browser window title.
            url: core.options.imageGalleryUrl, // @Required @Override fileBrowser - File server url.
            header: core.options.imageGalleryHeader, // @Required @Override fileBrowser - File server http header.
            listClass: 'se-image-list', // @Required @Override fileBrowser - Class name of list div.
            itemTemplateHandler: this.drawItems, // @Required @Override fileBrowser - Function that defines the HTML of an file item.
            selectorHandler: this.setImage.bind(core), // @Required @Override fileBrowser - Function that action when item click.
            columnSize: 4 // @Option @Override fileBrowser - Number of "div.se-file-item-column" to be created (default: 4)
        };
    },
    
    /**
     * @Required @Override fileBrowser
     * @description Open a file browser.
     * @param {Function|null} selectorHandler When the function comes as an argument value, it substitutes "context.selectorHandler".
     */
    open: function (selectorHandler) {
        this.plugins.fileBrowser.open.call(this, 'imageGallery', selectorHandler);
    },

    /**
     * @Required @Override fileBrowser
     * @description Define the HTML of the item to be put in "div.se-file-item-column".
     * Format: [
     *      { src: "image src", name: "name(@option)", alt: "image alt(@option)", tag: "tag name(@option)" }
     * ]
     * @param {Object} item Item of the response data's array
     */
    drawItems: function (item) {
        const srcName = item.src.split('/').pop();
        return  '<div class="se-file-item-img"><img src="' + (item.thumbnail || item.src) + '" alt="' + (item.alt || srcName) + '" data-command="pick" data-value="' + (item.src || item.thumbnail) + '">' +
                    '<div class="se-file-img-name se-file-name-back"></div>' +
                    '<div class="se-file-img-name __se__img_name">' + (item.name || srcName) + '</div>' +
                '</div>';
    },

    setImage: function (target, fileName) {
        this.callPlugin('image', function () {
            const file = {name: fileName, size: 0};
            this.plugins.image.create_image.call(this, target.getAttribute('data-value'), null, this.context.image._origin_w, this.context.image._origin_h, 'none', file, target.alt);
        }.bind(this), null);
    }
};
