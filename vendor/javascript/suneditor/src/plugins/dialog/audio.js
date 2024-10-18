/*
 * wysiwyg web editor
 *
 * suneditor.js
 * Copyright 2017 JiHong Lee.
 * MIT license.
 */
'use strict';

// import dialog from '../modules/dialog';
const dialog = {
    name: 'dialog',
    /**
     * @description Constructor
     * @param {Object} core Core object
     */
    add: function (core) {
        const context = core.context;
        context.dialog = {
            kind: '',
            updateModal: false,
            _closeSignal: false
        };

        /** dialog */
        let dialog_div = core.util.createElement('DIV');
        dialog_div.className = 'se-dialog sun-editor-common';

        let dialog_back = core.util.createElement('DIV');
        dialog_back.className = 'se-dialog-back';
        dialog_back.style.display = 'none';

        let dialog_area = core.util.createElement('DIV');
        dialog_area.className = 'se-dialog-inner';
        dialog_area.style.display = 'none';

        dialog_div.appendChild(dialog_back);
        dialog_div.appendChild(dialog_area);

        context.dialog.modalArea = dialog_div;
        context.dialog.back = dialog_back;
        context.dialog.modal = dialog_area;

        /** add event listeners */
        context.dialog.modal.addEventListener('mousedown', this._onMouseDown_dialog.bind(core));
        context.dialog.modal.addEventListener('click', this._onClick_dialog.bind(core));

        /** append html */
        context.element.relative.appendChild(dialog_div);

        /** empty memory */
        dialog_div = null, dialog_back = null, dialog_area = null;
    },

    /**
     * @description Event to control the behavior of closing the dialog
     * @param {MouseEvent} e Event object
     * @private
     */
    _onMouseDown_dialog: function (e) {
        if (/se-dialog-inner/.test(e.target.className)) {
            this.context.dialog._closeSignal = true;
        } else {
            this.context.dialog._closeSignal = false;
        }
    },

    /**
     * @description Event to close the window when the outside area of the dialog or close button is click
     * @param {MouseEvent} e Event object
     * @private
     */
    _onClick_dialog: function (e) {
        if (/close/.test(e.target.getAttribute('data-command')) || this.context.dialog._closeSignal) {
            this.plugins.dialog.close.call(this);
        }
    },

    /**
     * @description Open a Dialog plugin
     * @param {String} kind Dialog plugin name
     * @param {Boolean} update Whether it will open for update ('image' === this.currentControllerName)
     */
    open: function (kind, update)  {
        if (this.modalForm) return false;
        if (this.plugins.dialog._bindClose) {
            this._d.removeEventListener('keydown', this.plugins.dialog._bindClose);
            this.plugins.dialog._bindClose = null;
        }

        this.plugins.dialog._bindClose = function (e) {
            if (!/27/.test(e.keyCode)) return;
            this.plugins.dialog.close.call(this);
        }.bind(this);
        this._d.addEventListener('keydown', this.plugins.dialog._bindClose);

        this.context.dialog.updateModal = update;

        if (this.options.popupDisplay === 'full') {
            this.context.dialog.modalArea.style.position = 'fixed';
        } else {
            this.context.dialog.modalArea.style.position = 'absolute';
        }

        this.context.dialog.kind = kind;
        this.modalForm = this.context[kind].modal;
        const focusElement = this.context[kind].focusElement;

        if (typeof this.plugins[kind].on === 'function') this.plugins[kind].on.call(this, update);

        this.context.dialog.modalArea.style.display = 'block';
        this.context.dialog.back.style.display = 'block';
        this.context.dialog.modal.style.display = 'block';
        this.modalForm.style.display = 'block';

        if (focusElement) focusElement.focus();
    },

    _bindClose: null,

    /**
     * @description Close a Dialog plugin
     * The plugin's "init" method is called.
     */
    close: function () {
        if (this.plugins.dialog._bindClose) {
            this._d.removeEventListener('keydown', this.plugins.dialog._bindClose);
            this.plugins.dialog._bindClose = null;
        }

        const kind = this.context.dialog.kind;
        this.modalForm.style.display = 'none';
        this.context.dialog.back.style.display = 'none';
        this.context.dialog.modalArea.style.display = 'none';
        this.context.dialog.updateModal = false;
        if (typeof this.plugins[kind].init === 'function') this.plugins[kind].init.call(this);
        this.context.dialog.kind = '';
        this.modalForm = null;
        this.focus();
    }
};

// import component from '../modules/component';
const component = {
    name: 'component',
    /**
     * @description Create a container for the resizing component and insert the element.
     * @param {Element} cover Cover element (FIGURE)
     * @param {String} className Class name of container (fixed: se-component)
     * @returns {Element} Created container element
     */
    set_container: function (cover, className) {
        const container = this.util.createElement('DIV');
        container.className = 'se-component ' + className;
        container.appendChild(cover);

        return container;
    },

    /**
     * @description Cover the target element with a FIGURE element.
     * @param {Element} element Target element
     */
    set_cover: function (element) {
        const cover = this.util.createElement('FIGURE');
        cover.appendChild(element);

        return cover;
    },

    /**
     * @description Return HTML string of caption(FIGCAPTION) element
     * @returns {String}
     */
    create_caption: function () {
        const caption = this.util.createElement('FIGCAPTION');
        caption.innerHTML = '<div>' + this.lang.dialogBox.caption + '</div>';
        return caption;
    }
};

// import fileManager from '../modules/fileManager';
const fileManager = {
    name: 'fileManager',
    _xmlHttp: null,

    _checkMediaComponent: function (tag) {
        if (/IMG/i.test(tag)) {
            return !/FIGURE/i.test(tag.parentElement.nodeName) || !/FIGURE/i.test(tag.parentElement.parentElement.nodeName);
        }
        return true;
    },

    /**
     * @description Upload the file to the server.
     * @param {String} uploadUrl Upload server url
     * @param {Object|null} uploadHeader Request header
     * @param {FormData} formData FormData in body
     * @param {Function|null} callBack Success call back function
     * @param {Function|null} errorCallBack Error call back function
     * @example this.plugins.fileManager.upload.call(this, imageUploadUrl, this.options.imageUploadHeader, formData, this.plugins.image.callBack_imgUpload.bind(this, info), this.functions.onImageUploadError);
     */
    upload: function (uploadUrl, uploadHeader, formData, callBack, errorCallBack) {
        this.showLoading();
        const filePlugin = this.plugins.fileManager;
        const xmlHttp = filePlugin._xmlHttp = this.util.getXMLHttpRequest();

        xmlHttp.onreadystatechange = filePlugin._callBackUpload.bind(this, xmlHttp, callBack, errorCallBack);
        xmlHttp.open('post', uploadUrl, true);
        if(uploadHeader !== null && typeof uploadHeader === 'object' && this._w.Object.keys(uploadHeader).length > 0){
            for(let key in uploadHeader){
                xmlHttp.setRequestHeader(key, uploadHeader[key]);
            }
        }
        xmlHttp.send(formData);
    },

    _callBackUpload: function (xmlHttp, callBack, errorCallBack) {
        if (xmlHttp.readyState === 4) {
            if (xmlHttp.status === 200) {
                try {
                    callBack(xmlHttp);
                } catch (e) {
                    throw Error('[SUNEDITOR.fileManager.upload.callBack.fail] cause : "' + e.message + '"');
                } finally {
                    this.closeLoading();
                }
            } else { // exception
                this.closeLoading();
                const res = !xmlHttp.responseText ? xmlHttp : JSON.parse(xmlHttp.responseText);
                if (typeof errorCallBack !== 'function' || errorCallBack('', res, this)) {
                    const err = '[SUNEDITOR.fileManager.upload.serverException] status: ' + xmlHttp.status + ', response: ' + (res.errorMessage || xmlHttp.responseText);
                    this.functions.noticeOpen(err);
                    throw Error(err);
                }
            }
        }
    },

    /**
     * @description Checke the file's information and modify the tag that does not fit the format.
     * @param {String} pluginName Plugin name
     * @param {Array} tagNames Tag array to check
     * @param {Function|null} uploadEventHandler Event handler to process updated file info after checking (used in "setInfo")
     * @param {Function} modifyHandler A function to modify a tag that does not fit the format (Argument value: Tag element)
     * @param {Boolean} resizing True if the plugin is using a resizing module
     * @example
     * const modifyHandler = function (tag) {
     *      imagePlugin.onModifyMode.call(this, tag, null);
     *      imagePlugin.openModify.call(this, true);
     *      imagePlugin.update_image.call(this, true, false, true);
     *  }.bind(this);
     *  this.plugins.fileManager.checkInfo.call(this, 'image', ['img'], this.functions.onImageUpload, modifyHandler, true);
     */
    checkInfo: function (pluginName, tagNames, uploadEventHandler, modifyHandler, resizing) {
        let tags = [];
        for (let i = 0, len = tagNames.length; i < len; i++) {
            tags = tags.concat([].slice.call(this.context.element.wysiwyg.querySelectorAll(tagNames[i] + ':not([data-se-embed="true"])')));
        }

        const fileManagerPlugin = this.plugins.fileManager;
        const context = this.context[pluginName];
        const infoList = context._infoList;
        const setFileInfo = fileManagerPlugin.setInfo.bind(this);

        if (tags.length === infoList.length) {
            // reset
            if (this._componentsInfoReset) {
                for (let i = 0, len = tags.length; i < len; i++) {
                    setFileInfo(pluginName, tags[i], uploadEventHandler, null, resizing);
                }
                return ;
            } else {
                let infoUpdate = false;
                for (let i = 0, len = infoList.length, info; i < len; i++) {
                    info = infoList[i];
                    if (tags.filter(function (t) { return info.src === t.src && info.index.toString() === t.getAttribute('data-index'); }).length === 0) {
                        infoUpdate = true;
                        break;
                    }
                }
                // pass
                if (!infoUpdate) return;
            }
        }

        // check
        const _resize_plugin = resizing ? this.context.resizing._resize_plugin : '';
        if (resizing) this.context.resizing._resize_plugin = pluginName;
        const currentTags = [];
        const infoIndex = [];
        for (let i = 0, len = infoList.length; i < len; i++) {
            infoIndex[i] = infoList[i].index;
        }
        context.__updateTags = tags;

        while (tags.length > 0) {
            const tag = tags.shift();
            if (!this.util.getParentElement(tag, this.util.isMediaComponent) || !fileManagerPlugin._checkMediaComponent(tag)) {
                currentTags.push(context._infoIndex);
                modifyHandler(tag);
            } else if (!tag.getAttribute('data-index') || infoIndex.indexOf(tag.getAttribute('data-index') * 1) < 0) {
                currentTags.push(context._infoIndex);
                tag.removeAttribute('data-index');
                setFileInfo(pluginName, tag, uploadEventHandler, null, resizing);
            } else {
                currentTags.push(tag.getAttribute('data-index') * 1);
            }
        }

        for (let i = 0, dataIndex; i < infoList.length; i++) {
            dataIndex = infoList[i].index;
            if (currentTags.indexOf(dataIndex) > -1) continue;

            infoList.splice(i, 1);
            if (typeof uploadEventHandler === 'function') uploadEventHandler(null, dataIndex, 'delete', null, 0, this);
            i--;
        }

        if (resizing) this.context.resizing._resize_plugin = _resize_plugin;
    },

    /**
     * @description Create info object of file and add it to "_infoList" (this.context[pluginName]._infoList[])
     * @param {String} pluginName Plugin name
     * @param {Element} element
     * @param {Function|null} uploadEventHandler Event handler to process updated file info (created in setInfo)
     * @param {Object|null} file
     * @param {Boolean} resizing True if the plugin is using a resizing module
     * @example
     * uploadCallBack {.. file = { name: fileList[i].name, size: fileList[i].size };
     * this.plugins.fileManager.setInfo.call(this, 'image', oImg, this.functions.onImageUpload, file, true);
     */
    setInfo: function (pluginName, element, uploadEventHandler, file, resizing) {
        const _resize_plugin = resizing ? this.context.resizing._resize_plugin : '';
        if (resizing) this.context.resizing._resize_plugin = pluginName;

        const plguin = this.plugins[pluginName];
        const context = this.context[pluginName];
        const infoList = context._infoList;
        let dataIndex = element.getAttribute('data-index');
        let info = null;
        let state = '';

        if (!file) {
            file = {
                'name': element.getAttribute('data-file-name') || (typeof element.src === 'string' ? element.src.split('/').pop() : ''),
                'size': element.getAttribute('data-file-size') || 0
            };
        }

        // create
        if (!dataIndex || this._componentsInfoInit) {
            state = 'create';
            dataIndex = context._infoIndex++;

            element.setAttribute('data-index', dataIndex);
            element.setAttribute('data-file-name', file.name);
            element.setAttribute('data-file-size', file.size);

            info = {
                src: element.src,
                index: dataIndex * 1,
                name: file.name,
                size: file.size
            };

            infoList.push(info);
        } else { // update
            state = 'update';
            dataIndex *= 1;

            for (let i = 0, len = infoList.length; i < len; i++) {
                if (dataIndex === infoList[i].index) {
                    info = infoList[i];
                    break;
                }
            }

            if (!info) {
                dataIndex = context._infoIndex++;
                info = { index: dataIndex };
                infoList.push(info);
            }

            info.src = element.src;
            info.name = element.getAttribute("data-file-name");
            info.size = element.getAttribute("data-file-size") * 1;
        }

        // method bind
        info.element = element;
        info.delete = plguin.destroy.bind(this, element);
        info.select = function (element) {
            element.scrollIntoView(true);
            this._w.setTimeout(plguin.select.bind(this, element));
        }.bind(this, element);

        if (resizing) {
            if (!element.getAttribute('origin-size') && element.naturalWidth) {
                element.setAttribute('origin-size', element.naturalWidth + ',' + element.naturalHeight);
            }

            if (!element.getAttribute('data-origin')) {
                const container = this.util.getParentElement(element, this.util.isMediaComponent);
                const cover = this.util.getParentElement(element, 'FIGURE');

                const w = this.plugins.resizing._module_getSizeX.call(this, context, element, cover, container);
                const h = this.plugins.resizing._module_getSizeY.call(this, context, element, cover, container);
                element.setAttribute('data-origin', w + ',' + h);
                element.setAttribute('data-size', w + ',' + h);
            }

            if (!element.style.width) {
                const size = (element.getAttribute('data-size') || element.getAttribute('data-origin') || '').split(',');
                plguin.onModifyMode.call(this, element, null);
                plguin.applySize.call(this, size[0], size[1]);
            }

            this.context.resizing._resize_plugin = _resize_plugin;
        }

        if (typeof uploadEventHandler === 'function') uploadEventHandler(element, dataIndex, state, info, --context._uploadFileLength < 0 ? 0 : context._uploadFileLength, this);
    },

    /**
     * @description Delete info object at "_infoList"
     * @param {String} pluginName Plugin name
     * @param {Number} index index of info object (this.context[pluginName]._infoList[].index)
     * @param {Function|null} uploadEventHandler Event handler to process updated file info (created in setInfo)
     */
    deleteInfo: function (pluginName, index, uploadEventHandler) {
        if (index >= 0) {
            const infoList = this.context[pluginName]._infoList;

            for (let i = 0, len = infoList.length; i < len; i++) {
                if (index === infoList[i].index) {
                    infoList.splice(i, 1);
                    if (typeof uploadEventHandler === 'function') uploadEventHandler(null, index, 'delete', null, 0, this);
                    return;
                }
            }
        }
    },

    /**
     * @description Reset info object and "_infoList = []", "_infoIndex = 0"
     * @param {String} pluginName Plugin name
     * @param {Function|null} uploadEventHandler Event handler to process updated file info (created in setInfo)
     */
    resetInfo: function (pluginName, uploadEventHandler) {
        const context = this.context[pluginName];

        if (typeof uploadEventHandler === 'function') {
            const infoList = context._infoList;
            for (let i = 0, len = infoList.length; i < len; i++) {
                uploadEventHandler(null, infoList[i].index, 'delete', null, 0, this);
            }
        }

        context._infoList = [];
        context._infoIndex = 0;
    }
};

export default {
    name: 'audio',
    display: 'dialog',
    add: function (core) {
        core.addModule([dialog, component, fileManager]);

        const context = core.context;
        const contextAudio = context.audio = {
            _infoList: [], // @Override fileManager
            _infoIndex: 0, // @Override fileManager
            _uploadFileLength: 0, // @Override fileManager
            focusElement: null, // @Override dialog // This element has focus when the dialog is opened.
            targetSelect: null,
            _origin_w: core.options.audioWidth,
            _origin_h: core.options.audioHeight,
            _linkValue: '',
            // @require @Override component
            _element: null,
            _cover: null,
            _container: null,
        };

        /** dialog */
        let audio_dialog = this.setDialog(core);
        contextAudio.modal = audio_dialog;
        contextAudio.audioInputFile = audio_dialog.querySelector('._se_audio_files');
        contextAudio.audioUrlFile = audio_dialog.querySelector('.se-input-url');
        contextAudio.focusElement = contextAudio.audioInputFile || contextAudio.audioUrlFile;
        contextAudio.preview = audio_dialog.querySelector('.se-link-preview');

        /** controller */
        let audio_controller = this.setController(core);
        contextAudio.controller = audio_controller;

        /** add event listeners */
        audio_dialog.querySelector('form').addEventListener('submit', this.submit.bind(core));
        if (contextAudio.audioInputFile) audio_dialog.querySelector('.se-dialog-files-edge-button').addEventListener('click', this._removeSelectedFiles.bind(contextAudio.audioInputFile, contextAudio.audioUrlFile, contextAudio.preview));
        if (contextAudio.audioInputFile && contextAudio.audioUrlFile) contextAudio.audioInputFile.addEventListener('change', this._fileInputChange.bind(contextAudio));
        audio_controller.addEventListener('click', this.onClick_controller.bind(core));
        if (contextAudio.audioUrlFile) contextAudio.audioUrlFile.addEventListener('input', this._onLinkPreview.bind(contextAudio.preview, contextAudio, core.options.linkProtocol));

        /** append html */
        context.dialog.modal.appendChild(audio_dialog);

        /** append controller */
        context.element.relative.appendChild(audio_controller);

        /** empty memory */
        audio_dialog = null, audio_controller = null;
    },

    /** HTML - dialog */
    setDialog: function (core) {
        const option = core.options;
        const lang = core.lang;
        const dialog = core.util.createElement('DIV');

        dialog.className = 'se-dialog-content';
        dialog.style.display = 'none';
        let html = '' +
            '<form method="post" enctype="multipart/form-data">' +
                '<div class="se-dialog-header">' +
                    '<button type="button" data-command="close" class="se-btn se-dialog-close" title="' + lang.dialogBox.close + '" aria-label="' + lang.dialogBox.close + '">' +
                        core.icons.cancel +
                    '</button>' +
                    '<span class="se-modal-title">' + lang.dialogBox.audioBox.title + '</span>' +
                '</div>' +
                '<div class="se-dialog-body">';

                if (option.audioFileInput) {
                    html += '' +
                        '<div class="se-dialog-form">' +
                            '<label>' + lang.dialogBox.audioBox.file + '</label>' +
                            '<div class="se-dialog-form-files">' +
                                '<input class="se-input-form _se_audio_files" type="file" accept="' + option.audioAccept + '"' + (option.audioMultipleFile ? ' multiple="multiple"' : '') + '/>' +
                                '<button type="button" data-command="filesRemove" class="se-btn se-dialog-files-edge-button se-file-remove" title="' + lang.controller.remove + '" aria-label="' + lang.controller.remove + '">' + core.icons.cancel + '</button>' +
                            '</div>' +
                        '</div>';
                }
                 
                if (option.audioUrlInput) {
                    html += '' +
                        '<div class="se-dialog-form">' +
                            '<label>' + lang.dialogBox.audioBox.url + '</label>' +
                            '<input class="se-input-form se-input-url" type="text" />' +
                            '<pre class="se-link-preview"></pre>' +
                        '</div>';
                }
                    
                html += '' +
                '</div>' +
                '<div class="se-dialog-footer">' +
                    '<button type="submit" class="se-btn-primary" title="' + lang.dialogBox.submitButton + '" aria-label="' + lang.dialogBox.submitButton + '"><span>' + lang.dialogBox.submitButton + '</span></button>' +
                '</div>' +
            '</form>';

        dialog.innerHTML = html;

        return dialog;
    },

    /** HTML - controller */
    setController: function (core) {
        const lang = core.lang;
        const icons = core.icons;
        const link_btn = core.util.createElement('DIV');

        link_btn.className = 'se-controller se-controller-link';
        link_btn.innerHTML = '' +
            '<div class="se-arrow se-arrow-up"></div>' +
            '<div class="link-content">' +
                '<div class="se-btn-group">' +
                    '<button type="button" data-command="update" tabindex="-1" class="se-tooltip">' +
                        icons.edit +
                        '<span class="se-tooltip-inner"><span class="se-tooltip-text">' + lang.controller.edit + '</span></span>' +
                    '</button>' +
                    '<button type="button" data-command="delete" tabindex="-1" class="se-tooltip">' +
                        icons.delete +
                        '<span class="se-tooltip-inner"><span class="se-tooltip-text">' + lang.controller.remove + '</span></span>' +
                    '</button>' +
                '</div>' +
            '</div>';

        return link_btn;
    },

    // Disable url input when uploading files
    _fileInputChange: function () {
        if (!this.audioInputFile.value) {
            this.audioUrlFile.removeAttribute('disabled');
            this.preview.style.textDecoration = '';
        } else {
            this.audioUrlFile.setAttribute('disabled', true);
            this.preview.style.textDecoration = 'line-through';
        }
    },

    // Disable url input when uploading files
    _removeSelectedFiles: function (urlInput, preview) {
        this.value = '';
        if (urlInput) {
            urlInput.removeAttribute('disabled');
            preview.style.textDecoration = '';
        }
    },

    // create new audio tag
    _createAudioTag: function () {
        const oAudio = this.util.createElement('AUDIO');
        this.plugins.audio._setTagAttrs.call(this, oAudio);

        const w = this.context.audio._origin_w;
        const h = this.context.audio._origin_h;
        oAudio.setAttribute('origin-size', w + ',' + h);
        oAudio.style.cssText = (w ? ('width:' + w + '; ') : '') + (h ? ('height:' + h + ';') : '');

        return oAudio;
    },

    _setTagAttrs: function (element) {
        element.setAttribute('controls', true);

        const attrs = this.options.audioTagAttrs;
        if (!attrs) return;

        for (let key in attrs) {
            if (!this.util.hasOwn(attrs, key)) continue;
            element.setAttribute(key, attrs[key]);
        }
    },

    _onLinkPreview: function (context, protocol, e) {
        const value = e.target.value.trim();
        context._linkValue = this.textContent = !value ? '' : (protocol && value.indexOf('://') === -1 && value.indexOf('#') !== 0) ? protocol + value : value.indexOf('://') === -1 ? '/' + value : value;
    },

    /**
     * @Required @Override fileManager
     */
    fileTags: ['audio'],

    /**
     * @Override core, fileManager, resizing
     * @description It is called from core.selectComponent.
     * @param {Element} element Target element
     */
    select: function (element) {
        this.plugins.audio.onModifyMode.call(this, element);
    },

    /**
     * @Override fileManager, resizing 
     */
    destroy: function (element) {
        element = element || this.context.audio._element;
        const container = this.util.getParentElement(element, this.util.isComponent) || element;
        const dataIndex = element.getAttribute('data-index') * 1;
        
        if (typeof this.functions.onAudioDeleteBefore === 'function' && (this.functions.onAudioDeleteBefore(element, container, dataIndex, this) === false)) return;
        
        const focusEl = (container.previousElementSibling || container.nextElementSibling);
        const emptyDiv = container.parentNode;
        this.util.removeItem(container);
        this.plugins.audio.init.call(this);
        this.controllersOff();

        if (emptyDiv !== this.context.element.wysiwyg) this.util.removeItemAllParents(emptyDiv, function (current) { return current.childNodes.length === 0; }, null);

        // focus
        this.focusEdge(focusEl);

        // fileManager event
        this.plugins.fileManager.deleteInfo.call(this, 'audio', dataIndex, this.functions.onAudioUpload);

        // history stack
        this.history.push(false);
    },

    /**
     * @Override fileManager
     */
    checkFileInfo: function () {
        this.plugins.fileManager.checkInfo.call(this, 'audio', ['audio'], this.functions.onAudioUpload, this.plugins.audio.updateCover.bind(this), false);
    },

    /**
     * @Override fileManager
     */
    resetFileInfo: function () {
        this.plugins.fileManager.resetInfo.call(this, 'audio', this.functions.onAudioUpload);
    },

    /**
     * @Required @Override dialog
     */
    on: function (update) {
        const contextAudio = this.context.audio;

        if (!update) {
            this.plugins.audio.init.call(this);
            if (contextAudio.audioInputFile && this.options.audioMultipleFile) contextAudio.audioInputFile.setAttribute('multiple', 'multiple');
        } else if (contextAudio._element) {
            this.context.dialog.updateModal = true;
            contextAudio._linkValue = contextAudio.preview.textContent = contextAudio.audioUrlFile.value = contextAudio._element.src;
            if (contextAudio.audioInputFile && this.options.audioMultipleFile) contextAudio.audioInputFile.removeAttribute('multiple');
        } else {
            if (contextAudio.audioInputFile && this.options.audioMultipleFile) contextAudio.audioInputFile.removeAttribute('multiple');
        }
    },

    /**
     * @Required @Override dialog
     */
    open: function () {
        this.plugins.dialog.open.call(this, 'audio', 'audio' === this.currentControllerName);
    },

    submit: function (e) {
        const contextAudio = this.context.audio;

        e.preventDefault();
        e.stopPropagation();

        try {
            if (contextAudio.audioInputFile && contextAudio.audioInputFile.files.length > 0) {
                this.showLoading();
                this.plugins.audio.submitAction.call(this, contextAudio.audioInputFile.files);
            } else if (contextAudio.audioUrlFile && contextAudio._linkValue.length > 0) {
                this.showLoading();
                this.plugins.audio.setupUrl.call(this, contextAudio._linkValue);
            }
        } catch (error) {
            this.closeLoading();
            throw Error('[SUNEDITOR.audio.submit.fail] cause : "' + error.message + '"');
        } finally {
            this.plugins.dialog.close.call(this);
        }

        return false;
    },

    submitAction: function (fileList) {
        if (fileList.length === 0) return;

        let fileSize = 0;
        let files = [];
        for (let i = 0, len = fileList.length; i < len; i++) {
            if (/audio/i.test(fileList[i].type)) {
                files.push(fileList[i]);
                fileSize += fileList[i].size;
            }
        }

        const limitSize = this.options.audioUploadSizeLimit;
        if (limitSize > 0) {
            let infoSize = 0;
            const audiosInfo = this.context.audio._infoList;
            for (let i = 0, len = audiosInfo.length; i < len; i++) {
                infoSize += audiosInfo[i].size * 1;
            }

            if ((fileSize + infoSize) > limitSize) {
                this.closeLoading();
                const err = '[SUNEDITOR.audioUpload.fail] Size of uploadable total audios: ' + (limitSize/1000) + 'KB';
                if (typeof this.functions.onAudioUploadError !== 'function' || this.functions.onAudioUploadError(err, { 'limitSize': limitSize, 'currentSize': infoSize, 'uploadSize': fileSize }, this)) {
                    this.functions.noticeOpen(err);
                }
                return;
            }
        }

        const contextAudio = this.context.audio;
        contextAudio._uploadFileLength = files.length;

        const info = {
            isUpdate: this.context.dialog.updateModal,
            element: contextAudio._element
        };

        if (typeof this.functions.onAudioUploadBefore === 'function') {
            const result = this.functions.onAudioUploadBefore(files, info, this, function (data) {
                if (data && this._w.Array.isArray(data.result)) {
                    this.plugins.audio.register.call(this, info, data);
                } else {
                    this.plugins.audio.upload.call(this, info, data);
                }
            }.bind(this));

            if (typeof result === 'undefined') return;
            if (!result) {
                this.closeLoading();
                return;
            }
            if (typeof result === 'object' && result.length > 0) files = result;
        }

        this.plugins.audio.upload.call(this, info, files);
    },

    error: function (message, response) {
        this.closeLoading();
        if (typeof this.functions.onAudioUploadError !== 'function' || this.functions.onAudioUploadError(message, response, this)) {
            this.functions.noticeOpen(message);
            throw Error('[SUNEDITOR.plugin.audio.exception] response: ' + message);
        }
    },

    upload: function (info, files) {
        if (!files) {
            this.closeLoading();
            return;
        }
        if (typeof files === 'string') {
            this.plugins.audio.error.call(this, files, null);
            return;
        }

        const audioUploadUrl = this.options.audioUploadUrl;
        const filesLen = this.context.dialog.updateModal ? 1 : files.length;

        // create formData
        const formData = new FormData();
        for (let i = 0; i < filesLen; i++) {
            formData.append('file-' + i, files[i]);
        }

        // server upload
        this.plugins.fileManager.upload.call(this, audioUploadUrl, this.options.audioUploadHeader, formData, this.plugins.audio.callBack_upload.bind(this, info), this.functions.onAudioUploadError);
    },

    callBack_upload: function (info, xmlHttp) {
        if (typeof this.functions.audioUploadHandler === 'function') {
            this.functions.audioUploadHandler(xmlHttp, info, this);
        } else {
            const response = JSON.parse(xmlHttp.responseText);
            if (response.errorMessage) {
                this.plugins.audio.error.call(this, response.errorMessage, response);
            } else {
                this.plugins.audio.register.call(this, info, response);
            }
        }
    },

    register: function (info, response) {
        const fileList = response.result;

        for (let i = 0, len = fileList.length, file, oAudio; i < len; i++) {
            if (info.isUpdate) oAudio = info.element;
            else oAudio = this.plugins.audio._createAudioTag.call(this);

            file = { name: fileList[i].name, size: fileList[i].size };
            this.plugins.audio.create_audio.call(this, oAudio, fileList[i].url, file, info.isUpdate);
        }

        this.closeLoading();
    },

    setupUrl: function (src) {
        try {
            if (src.length === 0) return false;
            this.plugins.audio.create_audio.call(this, this.plugins.audio._createAudioTag.call(this), src, null, this.context.dialog.updateModal);
        } catch (error) {
            throw Error('[SUNEDITOR.audio.audio.fail] cause : "' + error.message + '"');
        } finally {
            this.closeLoading();
        }
    },

    create_audio: function (element, src, file, isUpdate) {
        const contextAudio = this.context.audio;
        
        // create new tag
        if (!isUpdate) {
            element.src = src;
            const cover = this.plugins.component.set_cover.call(this, element);
            const container = this.plugins.component.set_container.call(this, cover, '');
            if (!this.insertComponent(container, false, true, !this.options.mediaAutoSelect)) {
                this.focus();
                return;
            }
            if (!this.options.mediaAutoSelect) {
                const line = this.appendFormatTag(container, null);
                if (line) this.setRange(line, 0, line, 0);
            }
        } // update
        else {
            if (contextAudio._element) element = contextAudio._element;
            if (element && element.src !== src) {
                element.src = src;
                this.selectComponent(element, 'audio');
            } else {
                this.selectComponent(element, 'audio');
                return;
            }
        }

        this.plugins.fileManager.setInfo.call(this, 'audio', element, this.functions.onAudioUpload, file, false);
        if (isUpdate) this.history.push(false);
    },

    updateCover: function (element) {
        const contextAudio = this.context.audio;
        this.plugins.audio._setTagAttrs.call(this, element);
        
        // find component element
        let existElement = (this.util.isRangeFormatElement(element.parentNode) || this.util.isWysiwygDiv(element.parentNode)) ? 
            element : this.util.getFormatElement(element) || element;

        // clone element
        const prevElement = element;
        contextAudio._element = element = element.cloneNode(false);
        const cover = this.plugins.component.set_cover.call(this, element);
        const container = this.plugins.component.set_container.call(this, cover, 'se-audio-container');

        try {
            if (this.util.getParentElement(prevElement, this.util.isNotCheckingNode)) {
                prevElement.parentNode.replaceChild(container, prevElement);
            } else if (this.util.isListCell(existElement)) {
                const refer = this.util.getParentElement(prevElement, function (current) { return current.parentNode === existElement; });
                existElement.insertBefore(container, refer);
                this.util.removeItem(prevElement);
                this.util.removeEmptyNode(refer, null, true);
            } else if (this.util.isFormatElement(existElement)) {
                const refer = this.util.getParentElement(prevElement, function (current) { return current.parentNode === existElement; });
                existElement = this.util.splitElement(existElement, refer);
                existElement.parentNode.insertBefore(container, existElement);
                this.util.removeItem(prevElement);
                this.util.removeEmptyNode(existElement, null, true);
                if (existElement.children.length === 0) existElement.innerHTML = this.util.htmlRemoveWhiteSpace(existElement.innerHTML);
            } else {
                existElement.parentNode.replaceChild(container, existElement);
            }
        } catch (error) {
            console.warn('[SUNEDITOR.audio.error] Maybe the audio tag is nested.', error);
        }

        this.plugins.fileManager.setInfo.call(this, 'audio', element, this.functions.onAudioUpload, null, false);
        this.plugins.audio.init.call(this);
    },

    /**
     * @Required @Override fileManager, resizing
     */
    onModifyMode: function (selectionTag) {
        const contextAudio = this.context.audio;
        
        this.setControllerPosition(contextAudio.controller, selectionTag, 'bottom', {left: 0, top: 0});
        this.controllersOn(contextAudio.controller, selectionTag, this.plugins.audio.onControllerOff.bind(this, selectionTag), 'audio');

        this.util.addClass(selectionTag, 'active');
        contextAudio._element = selectionTag;
        contextAudio._cover = this.util.getParentElement(selectionTag, 'FIGURE');
        contextAudio._container = this.util.getParentElement(selectionTag, this.util.isComponent);
    },

    /**
     * @Required @Override fileManager, resizing
     */
    openModify: function (notOpen) {
        if (this.context.audio.audioUrlFile) {
            const contextAudio = this.context.audio;
            contextAudio._linkValue = contextAudio.preview.textContent = contextAudio.audioUrlFile.value = contextAudio._element.src;
        }
        if (!notOpen) this.plugins.dialog.open.call(this, 'audio', true);
    },

    onClick_controller: function (e) {
        e.stopPropagation();

        const command = e.target.getAttribute('data-command');
        if (!command) return;

        e.preventDefault();

        if (/update/.test(command)) {
            this.plugins.audio.openModify.call(this, false);
        }
        else { /** delete */
            this.plugins.audio.destroy.call(this, this.context.audio._element);
        }

        this.controllersOff();
    },

    onControllerOff: function (selectionTag) {
        this.util.removeClass(selectionTag, 'active');
        this.context.audio.controller.style.display = 'none';
    },

    /**
     * @Required @Override dialog
     */
    init: function () {
        if (this.context.dialog.updateModal) return;
        const contextAudio = this.context.audio;

        if (contextAudio.audioInputFile) contextAudio.audioInputFile.value = '';
        if (contextAudio.audioUrlFile) contextAudio._linkValue = contextAudio.preview.textContent = contextAudio.audioUrlFile.value = '';
        if (contextAudio.audioInputFile && contextAudio.audioUrlFile) {
            contextAudio.audioUrlFile.removeAttribute('disabled');
            contextAudio.preview.style.textDecoration = '';
        }

        contextAudio._element = null;
    }
};
