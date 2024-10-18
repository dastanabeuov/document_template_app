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

import anchor from '../modules/_anchor';

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

// import resizing from '../modules/resizing';
const resizing = {
    name: 'resizing',
    /**
     * @description Constructor
     * Require context properties when resizing module
        inputX: Element,
        inputY: Element,
        _container: null,
        _cover: null,
        _element: null,
        _element_w: 1,
        _element_h: 1,
        _element_l: 0,
        _element_t: 0,
        _defaultSizeX: 'auto',
        _defaultSizeY: 'auto',
        _origin_w: core.options.imageWidth === 'auto' ? '' : core.options.imageWidth,
        _origin_h: core.options.imageHeight === 'auto' ? '' : core.options.imageHeight,
        _proportionChecked: true,
        // -- select function --
        _resizing: core.options.imageResizing,
        _resizeDotHide: !core.options.imageHeightShow,
        _rotation: core.options.imageRotation,
        _onlyPercentage: core.options.imageSizeOnlyPercentage,
        _ratio: false,
        _ratioX: 1,
        _ratioY: 1
        _captionShow: true,
        // -- when used caption (_captionShow: true) --
        _caption: null,
        _captionChecked: false,
        captionCheckEl: null,
     * @param {Object} core Core object
     */
    add: function (core) {
        const icons = core.icons;
        const context = core.context;
        context.resizing = {
            _resizeClientX: 0,
            _resizeClientY: 0,
            _resize_plugin: '',
            _resize_w: 0,
            _resize_h: 0,
            _origin_w: 0,
            _origin_h: 0,
            _rotateVertical: false,
            _resize_direction: '',
            _move_path: null,
            _isChange: false,
            alignIcons: {
                basic: icons.align_justify,
                left: icons.align_left,
                right: icons.align_right,
                center: icons.align_center
            }
        };

        /** resize controller, button */
        let resize_div_container = this.setController_resize(core);
        context.resizing.resizeContainer = resize_div_container;

        context.resizing.resizeDiv = resize_div_container.querySelector('.se-modal-resize');
        context.resizing.resizeDot = resize_div_container.querySelector('.se-resize-dot');
        context.resizing.resizeDisplay = resize_div_container.querySelector('.se-resize-display');

        let resize_button = this.setController_button(core);
        context.resizing.resizeButton = resize_button;

        let resize_handles = context.resizing.resizeHandles = context.resizing.resizeDot.querySelectorAll('span');
        context.resizing.resizeButtonGroup = resize_button.querySelector('._se_resizing_btn_group');
        context.resizing.rotationButtons = resize_button.querySelectorAll('._se_resizing_btn_group ._se_rotation');
        context.resizing.percentageButtons = resize_button.querySelectorAll('._se_resizing_btn_group ._se_percentage');

        context.resizing.alignMenu = resize_button.querySelector('.se-resizing-align-list');
        context.resizing.alignMenuList = context.resizing.alignMenu.querySelectorAll('button');

        context.resizing.alignButton = resize_button.querySelector('._se_resizing_align_button');
        context.resizing.autoSizeButton = resize_button.querySelector('._se_resizing_btn_group ._se_auto_size');
        context.resizing.captionButton = resize_button.querySelector('._se_resizing_caption_button');

        /** add event listeners */
        resize_div_container.addEventListener('mousedown', function (e) { e.preventDefault(); });
        resize_handles[0].addEventListener('mousedown', this.onMouseDown_resize_handle.bind(core));
        resize_handles[1].addEventListener('mousedown', this.onMouseDown_resize_handle.bind(core));
        resize_handles[2].addEventListener('mousedown', this.onMouseDown_resize_handle.bind(core));
        resize_handles[3].addEventListener('mousedown', this.onMouseDown_resize_handle.bind(core));
        resize_handles[4].addEventListener('mousedown', this.onMouseDown_resize_handle.bind(core));
        resize_handles[5].addEventListener('mousedown', this.onMouseDown_resize_handle.bind(core));
        resize_handles[6].addEventListener('mousedown', this.onMouseDown_resize_handle.bind(core));
        resize_handles[7].addEventListener('mousedown', this.onMouseDown_resize_handle.bind(core));
        resize_button.addEventListener('click', this.onClick_resizeButton.bind(core));

        /** append html */
        context.element.relative.appendChild(resize_div_container);
        context.element.relative.appendChild(resize_button);

        /** empty memory */
        resize_div_container = null, resize_button = null, resize_handles = null;
    },

    /** resize controller, button (image, iframe, video) */
    setController_resize: function (core) {
        const resize_container = core.util.createElement('DIV');

        resize_container.className = 'se-controller se-resizing-container';
        resize_container.style.display = 'none';
        resize_container.innerHTML = '' +
            '<div class="se-modal-resize"></div>' +
            '<div class="se-resize-dot">' +
            '<span class="tl"></span>' +
            '<span class="tr"></span>' +
            '<span class="bl"></span>' +
            '<span class="br"></span>' +
            '<span class="lw"></span>' +
            '<span class="th"></span>' +
            '<span class="rw"></span>' +
            '<span class="bh"></span>' +
            '<div class="se-resize-display"></div>' +
            '</div>';

        return resize_container;
    },

    setController_button: function (core) {
        const lang = core.lang;
        const icons = core.icons;
        const resize_button = core.util.createElement("DIV");

        resize_button.className = "se-controller se-controller-resizing";
        resize_button.innerHTML = '' +
            '<div class="se-arrow se-arrow-up"></div>' +
            '<div class="se-btn-group _se_resizing_btn_group">' +
            '<button type="button" data-command="percent" data-value="1" class="se-tooltip _se_percentage">' +
            '<span>100%</span>' +
            '<span class="se-tooltip-inner"><span class="se-tooltip-text">' + lang.controller.resize100 + '</span></span>' +
            '</button>' +
            '<button type="button" data-command="percent" data-value="0.75" class="se-tooltip _se_percentage">' +
            '<span>75%</span>' +
            '<span class="se-tooltip-inner"><span class="se-tooltip-text">' + lang.controller.resize75 + '</span></span>' +
            '</button>' +
            '<button type="button" data-command="percent" data-value="0.5" class="se-tooltip _se_percentage">' +
            '<span>50%</span>' +
            '<span class="se-tooltip-inner"><span class="se-tooltip-text">' + lang.controller.resize50 + '</span></span>' +
            '</button>' +
            '<button type="button" data-command="auto" class="se-btn se-tooltip _se_auto_size">' +
            icons.auto_size +
            '<span class="se-tooltip-inner"><span class="se-tooltip-text">' + lang.controller.autoSize + '</span></span>' +
            '</button>' +
            '<button type="button" data-command="rotate" data-value="-90" class="se-btn se-tooltip _se_rotation">' +
            icons.rotate_left +
            '<span class="se-tooltip-inner"><span class="se-tooltip-text">' + lang.controller.rotateLeft + '</span></span>' +
            '</button>' +
            '<button type="button" data-command="rotate" data-value="90" class="se-btn se-tooltip _se_rotation">' +
            icons.rotate_right +
            '<span class="se-tooltip-inner"><span class="se-tooltip-text">' + lang.controller.rotateRight + '</span></span>' +
            '</button>' +
            '</div>' +
            '<div class="se-btn-group" style="padding-top: 0;">' +
            '<button type="button" data-command="mirror" data-value="h" class="se-btn se-tooltip">' +
            icons.mirror_horizontal +
            '<span class="se-tooltip-inner"><span class="se-tooltip-text">' + lang.controller.mirrorHorizontal + '</span></span>' +
            '</button>' +
            '<button type="button" data-command="mirror" data-value="v" class="se-btn se-tooltip">' +
            icons.mirror_vertical +
            '<span class="se-tooltip-inner"><span class="se-tooltip-text">' + lang.controller.mirrorVertical + '</span></span>' +
            '</button>' +
            '<button type="button" data-command="onalign" class="se-btn se-tooltip _se_resizing_align_button">' +
            icons.align_justify +
            '<span class="se-tooltip-inner"><span class="se-tooltip-text">' + lang.toolbar.align + '</span></span>' +
            '</button>' +
            '<div class="se-btn-group-sub sun-editor-common se-list-layer se-resizing-align-list">' +
            '<div class="se-list-inner">' +
            '<ul class="se-list-basic">' +
            '<li><button type="button" class="se-btn-list se-tooltip" data-command="align" data-value="basic">' +
            icons.align_justify +
            '<span class="se-tooltip-inner"><span class="se-tooltip-text">' + lang.dialogBox.basic + '</span></span>' +
            '</button></li>' +
            '<li><button type="button" class="se-btn-list se-tooltip" data-command="align" data-value="left">' +
            icons.align_left +
            '<span class="se-tooltip-inner"><span class="se-tooltip-text">' + lang.dialogBox.left + '</span></span>' +
            '</button></li>' +
            '<li><button type="button" class="se-btn-list se-tooltip" data-command="align" data-value="center">' +
            icons.align_center +
            '<span class="se-tooltip-inner"><span class="se-tooltip-text">' + lang.dialogBox.center + '</span></span>' +
            '</button></li>' +
            '<li><button type="button" class="se-btn-list se-tooltip" data-command="align" data-value="right">' +
            icons.align_right +
            '<span class="se-tooltip-inner"><span class="se-tooltip-text">' + lang.dialogBox.right + '</span></span>' +
            '</button></li>' +
            '</ul>' +
            '</div>' +
            '</div>' +
            '<button type="button" data-command="caption" class="se-btn se-tooltip _se_resizing_caption_button">' +
            icons.caption +
            '<span class="se-tooltip-inner"><span class="se-tooltip-text">' + lang.dialogBox.caption + '</span></span>' +
            '</button>' +
            '<button type="button" data-command="revert" class="se-btn se-tooltip">' +
            icons.revert +
            '<span class="se-tooltip-inner"><span class="se-tooltip-text">' + lang.dialogBox.revertButton + '</span></span>' +
            '</button>' +
            '<button type="button" data-command="update" class="se-btn se-tooltip">' +
            icons.modify +
            '<span class="se-tooltip-inner"><span class="se-tooltip-text">' + lang.controller.edit + '</span></span>' +
            '</button>' +
            '<button type="button" data-command="delete" class="se-btn se-tooltip">' +
            icons.delete +
            '<span class="se-tooltip-inner"><span class="se-tooltip-text">' + lang.controller.remove + '</span></span>' +
            '</button>' +
            '</div>';

        return resize_button;
    },

    /**
     * @description Gets the width size
     * @param {Object} contextPlugin context object of plugin (core.context[plugin])
     * @param {Element} element Target element
     * @param {Element} cover Cover element (FIGURE)
     * @param {Element} container Container element (DIV.se-component)
     * @returns {String}
     */
    _module_getSizeX: function (contextPlugin, element, cover, container) {
        if (!element) element = contextPlugin._element;
        if (!cover) cover = contextPlugin._cover;
        if (!container) container = contextPlugin._container;

        if (!element) return '';

        return !/%$/.test(element.style.width) ? element.style.width : ((container && this.util.getNumber(container.style.width, 2)) || 100) + '%';
    },

    /**
     * @description Gets the height size
     * @param {Object} contextPlugin context object of plugin (core.context[plugin])
     * @param {Element} element Target element
     * @param {Element} cover Cover element (FIGURE)
     * @param {Element} container Container element (DIV.se-component)
     * @returns {String}
     */
    _module_getSizeY: function (contextPlugin, element, cover, container) {
        if (!element) element = contextPlugin._element;
        if (!cover) cover = contextPlugin._cover;
        if (!container) container = contextPlugin._container;

        if (!container || !cover) return (element && element.style.height) || '';

        return this.util.getNumber(cover.style.paddingBottom, 0) > 0 && !this.context.resizing._rotateVertical ? cover.style.height : (!/%$/.test(element.style.height) || !/%$/.test(element.style.width) ? element.style.height : ((container && this.util.getNumber(container.style.height, 2)) || 100) + '%');
    },

    /**
     * @description Called at the "openModify" to put the size of the current target into the size input element.
     * @param {Object} contextPlugin context object of plugin (core.context[plugin])
     * @param {Object} pluginObj Plugin object
     */
    _module_setModifyInputSize: function (contextPlugin, pluginObj) {
        const percentageRotation = contextPlugin._onlyPercentage && this.context.resizing._rotateVertical;
        contextPlugin.proportion.checked = contextPlugin._proportionChecked = contextPlugin._element.getAttribute('data-proportion') !== 'false';

        let x = percentageRotation ? '' : this.plugins.resizing._module_getSizeX.call(this, contextPlugin);
        if (x === contextPlugin._defaultSizeX) x = '';
        if (contextPlugin._onlyPercentage) x = this.util.getNumber(x, 2);
        contextPlugin.inputX.value = x;
        pluginObj.setInputSize.call(this, 'x');

        if (!contextPlugin._onlyPercentage) {
            let y = percentageRotation ? '' : this.plugins.resizing._module_getSizeY.call(this, contextPlugin);
            if (y === contextPlugin._defaultSizeY) y = '';
            if (contextPlugin._onlyPercentage) y = this.util.getNumber(y, 2);
            contextPlugin.inputY.value = y;
        }

        contextPlugin.inputX.disabled = percentageRotation ? true : false;
        contextPlugin.inputY.disabled = percentageRotation ? true : false;
        contextPlugin.proportion.disabled = percentageRotation ? true : false;

        pluginObj.setRatio.call(this);
    },

    /**
     * @description It is called in "setInputSize" (input tag keyupEvent),
     * checks the value entered in the input tag,
     * calculates the ratio, and sets the calculated value in the input tag of the opposite size.
     * @param {Object} contextPlugin context object of plugin (core.context[plugin])
     * @param {String} xy 'x': width, 'y': height
     */
    _module_setInputSize: function (contextPlugin, xy) {
        if (contextPlugin._onlyPercentage) {
            if (xy === 'x' && contextPlugin.inputX.value > 100) contextPlugin.inputX.value = 100;
            return;
        }

        if (contextPlugin.proportion.checked && contextPlugin._ratio && /\d/.test(contextPlugin.inputX.value) && /\d/.test(contextPlugin.inputY.value)) {
            const xUnit = contextPlugin.inputX.value.replace(/\d+|\./g, '') || contextPlugin.sizeUnit;
            const yUnit = contextPlugin.inputY.value.replace(/\d+|\./g, '') || contextPlugin.sizeUnit;

            if (xUnit !== yUnit) return;

            const dec = xUnit === '%' ? 2 : 0;

            if (xy === 'x') {
                contextPlugin.inputY.value = this.util.getNumber(contextPlugin._ratioY * this.util.getNumber(contextPlugin.inputX.value, dec), dec) + yUnit;
            } else {
                contextPlugin.inputX.value = this.util.getNumber(contextPlugin._ratioX * this.util.getNumber(contextPlugin.inputY.value, dec), dec) + xUnit;
            }
        }
    },

    /**
     * @description It is called in "setRatio" (input and proportionCheck tags changeEvent),
     * checks the value of the input tag, calculates the ratio, and resets it in the input tag.
     * @param {Object} contextPlugin context object of plugin (core.context[plugin])
     */
    _module_setRatio: function (contextPlugin) {
        const xValue = contextPlugin.inputX.value;
        const yValue = contextPlugin.inputY.value;

        if (contextPlugin.proportion.checked && /\d+/.test(xValue) && /\d+/.test(yValue)) {
            const xUnit = xValue.replace(/\d+|\./g, '') || contextPlugin.sizeUnit;
            const yUnit = yValue.replace(/\d+|\./g, '') || contextPlugin.sizeUnit;

            if (xUnit !== yUnit) {
                contextPlugin._ratio = false;
            } else if (!contextPlugin._ratio) {
                const x = this.util.getNumber(xValue, 0);
                const y = this.util.getNumber(yValue, 0);

                contextPlugin._ratio = true;
                contextPlugin._ratioX = x / y;
                contextPlugin._ratioY = y / x;
            }
        } else {
            contextPlugin._ratio = false;
        }
    },

    /**
     * @description Revert size of element to origin size (plugin._origin_w, plugin._origin_h)
     * @param {Object} contextPlugin context object of plugin (core.context[plugin])
     */
    _module_sizeRevert: function (contextPlugin) {
        if (contextPlugin._onlyPercentage) {
            contextPlugin.inputX.value = contextPlugin._origin_w > 100 ? 100 : contextPlugin._origin_w;
        } else {
            contextPlugin.inputX.value = contextPlugin._origin_w;
            contextPlugin.inputY.value = contextPlugin._origin_h;
        }
    },

    /**
     * @description Save the size data (element.setAttribute("data-size"))
     * Used at the "setSize" method
     * @param {Object} contextPlugin context object of plugin (core.context[plugin])
     */
    _module_saveCurrentSize: function (contextPlugin) {
        const x = this.plugins.resizing._module_getSizeX.call(this, contextPlugin);
        const y = this.plugins.resizing._module_getSizeY.call(this, contextPlugin);
        // add too width, height attribute
        contextPlugin._element.setAttribute('width', x.replace('px', ''));
        contextPlugin._element.setAttribute('height', y.replace('px', ''));
        contextPlugin._element.setAttribute('data-size', x + ',' + y);
        if (!!contextPlugin._videoRatio) contextPlugin._videoRatio = y;
    },

    /**
     * @description Call the resizing module
     * @param {Element} targetElement Resizing target element
     * @param {string} plugin Plugin name
     * @returns {Object} Size of resizing div {w, h, t, l}
     */
    call_controller_resize: function (targetElement, plugin) {
        const contextResizing = this.context.resizing;
        const contextPlugin = this.context[plugin];
        contextResizing._resize_plugin = plugin;

        const resizeContainer = contextResizing.resizeContainer;
        const resizeDiv = contextResizing.resizeDiv;
        const offset = this.util.getOffset(targetElement, this.context.element.wysiwygFrame);

        const isVertical = contextResizing._rotateVertical = /^(90|270)$/.test(Math.abs(targetElement.getAttribute('data-rotate')).toString());

        const w = isVertical ? targetElement.offsetHeight : targetElement.offsetWidth;
        const h = isVertical ? targetElement.offsetWidth : targetElement.offsetHeight;
        const t = offset.top;
        const l = offset.left - this.context.element.wysiwygFrame.scrollLeft;

        resizeContainer.style.top = t + 'px';
        resizeContainer.style.left = l + 'px';
        resizeContainer.style.width = w + 'px';
        resizeContainer.style.height = h + 'px';

        resizeDiv.style.top = '0px';
        resizeDiv.style.left = '0px';
        resizeDiv.style.width =  w + 'px';
        resizeDiv.style.height =  h + 'px';

        let align = targetElement.getAttribute('data-align') || 'basic';
        align = align === 'none' ? 'basic' : align;

        // text
        const container = this.util.getParentElement(targetElement, this.util.isComponent);
        const cover = this.util.getParentElement(targetElement, 'FIGURE');
        const displayX = this.plugins.resizing._module_getSizeX.call(this, contextPlugin, targetElement, cover, container) || 'auto';
        const displayY = contextPlugin._onlyPercentage && plugin === 'image' ? '' : ', ' + (this.plugins.resizing._module_getSizeY.call(this, contextPlugin, targetElement, cover, container) || 'auto');
        this.util.changeTxt(contextResizing.resizeDisplay, this.lang.dialogBox[align] + ' (' + displayX + displayY + ')');

        // resizing display
        contextResizing.resizeButtonGroup.style.display = contextPlugin._resizing ? '' : 'none';
        const resizeDotShow = contextPlugin._resizing && !contextPlugin._resizeDotHide && !contextPlugin._onlyPercentage ? 'flex' : 'none';
        const resizeHandles = contextResizing.resizeHandles;
        for (let i = 0, len = resizeHandles.length; i < len; i++) {
            resizeHandles[i].style.display = resizeDotShow;
        }

        if (contextPlugin._resizing) {
            const rotations = contextResizing.rotationButtons;
            rotations[0].style.display = rotations[1].style.display = contextPlugin._rotation ? '' : 'none';
        }

        // align icon
        if (contextPlugin._alignHide) {
            contextResizing.alignButton.style.display = 'none';
        } else {
            contextResizing.alignButton.style.display = '';
            const alignList = contextResizing.alignMenuList;
            this.util.changeElement(contextResizing.alignButton.firstElementChild, contextResizing.alignIcons[align]);
            for (let i = 0, len = alignList.length; i < len; i++) {
                if (alignList[i].getAttribute('data-value') === align) this.util.addClass(alignList[i], 'on');
                else this.util.removeClass(alignList[i], 'on');
            }
        }

        // percentage active
        const pButtons = contextResizing.percentageButtons;
        const value = /%$/.test(targetElement.style.width) && /%$/.test(container.style.width) ? (this.util.getNumber(container.style.width, 0) / 100) + '' : '' ;
        for (let i = 0, len = pButtons.length; i < len; i++) {
            if (pButtons[i].getAttribute('data-value') === value) {
                this.util.addClass(pButtons[i], 'active');
            } else {
                this.util.removeClass(pButtons[i], 'active');
            }
        }

        // caption display, active
        if (!contextPlugin._captionShow) {
            contextResizing.captionButton.style.display = 'none';
        } else {
            contextResizing.captionButton.style.display = '';
            if (this.util.getChildElement(targetElement.parentNode, 'figcaption')) {
                this.util.addClass(contextResizing.captionButton, 'active');
                contextPlugin._captionChecked = true;
            } else {
                this.util.removeClass(contextResizing.captionButton, 'active');
                contextPlugin._captionChecked = false;
            }
        }

        resizeContainer.style.display = 'block';

        const addOffset = {left: 0, top: 50};
        if (this.options.iframe) {
            addOffset.left -= this.context.element.wysiwygFrame.parentElement.offsetLeft;
            addOffset.top -= this.context.element.wysiwygFrame.parentElement.offsetTop;
        }

        this.setControllerPosition(contextResizing.resizeButton, resizeContainer, 'bottom', addOffset);
        const onControlsOff = function () {
            this.util.setDisabledButtons.call(this.util, false, this.resizingDisabledButtons);
            this.history._resetCachingButton();
        };
        this.controllersOn(resizeContainer, contextResizing.resizeButton, onControlsOff.bind(this), targetElement, plugin);
        this.util.setDisabledButtons(true, this.resizingDisabledButtons);

        contextResizing._resize_w = w;
        contextResizing._resize_h = h;

        const originSize = (targetElement.getAttribute('origin-size') || '').split(',');
        contextResizing._origin_w = originSize[0] || targetElement.naturalWidth;
        contextResizing._origin_h = originSize[1] || targetElement.naturalHeight;

        return {
            w: w,
            h: h,
            t: t,
            l: l
        };
    },

    _closeAlignMenu: null,

    /**
     * @description Open align submenu of module
     */
    openAlignMenu: function () {
        const alignButton = this.context.resizing.alignButton;
        this.util.addClass(alignButton, 'on');
        this.context.resizing.alignMenu.style.top = (alignButton.offsetTop + alignButton.offsetHeight) + 'px';
        this.context.resizing.alignMenu.style.left = (alignButton.offsetLeft - alignButton.offsetWidth / 2) + 'px';
        this.context.resizing.alignMenu.style.display = 'block';

        this.plugins.resizing._closeAlignMenu = function () {
            this.util.removeClass(this.context.resizing.alignButton, 'on');
            this.context.resizing.alignMenu.style.display = 'none';
            this.removeDocEvent('click', this.plugins.resizing._closeAlignMenu);
            this.plugins.resizing._closeAlignMenu = null;
        }.bind(this);

        this.addDocEvent('click', this.plugins.resizing._closeAlignMenu);
    },

    /**
     * @description Click event of resizing toolbar
     * Performs the action of the clicked toolbar button.
     * @param {MouseEvent} e Event object
     */
    onClick_resizeButton: function (e) {
        e.stopPropagation();

        const target = e.target;
        const command = target.getAttribute('data-command') || target.parentNode.getAttribute('data-command');

        if (!command) return;

        const value = target.getAttribute('data-value') || target.parentNode.getAttribute('data-value');

        const pluginName = this.context.resizing._resize_plugin;
        const currentContext = this.context[pluginName];
        const contextEl = currentContext._element;
        const currentModule = this.plugins[pluginName];

        e.preventDefault();

        if (typeof this.plugins.resizing._closeAlignMenu === 'function') {
            this.plugins.resizing._closeAlignMenu();
            if (command === 'onalign') return;
        }

        switch (command) {
            case 'auto':
                this.plugins.resizing.resetTransform.call(this, contextEl);
                currentModule.setAutoSize.call(this);
                this.selectComponent(contextEl, pluginName);
                break;
            case 'percent':
                let percentY = this.plugins.resizing._module_getSizeY.call(this, currentContext);
                if (this.context.resizing._rotateVertical) {
                    const percentage = contextEl.getAttribute('data-percentage');
                    if (percentage) percentY = percentage.split(',')[1];
                }

                this.plugins.resizing.resetTransform.call(this, contextEl);
                currentModule.setPercentSize.call(this, (value * 100), (this.util.getNumber(percentY, 0) === null || !/%$/.test(percentY)) ? '' : percentY);
                this.selectComponent(contextEl, pluginName);
                break;
            case 'mirror':
                const r = contextEl.getAttribute('data-rotate') || '0';
                let x = contextEl.getAttribute('data-rotateX') || '';
                let y = contextEl.getAttribute('data-rotateY') || '';

                if ((value === 'h' && !this.context.resizing._rotateVertical) || (value === 'v' && this.context.resizing._rotateVertical)) {
                    y = y ? '' : '180';
                } else {
                    x = x ? '' : '180';
                }

                contextEl.setAttribute('data-rotateX', x);
                contextEl.setAttribute('data-rotateY', y);

                this.plugins.resizing._setTransForm(contextEl, r, x, y);
                break;
            case 'rotate':
                const contextResizing = this.context.resizing;
                const slope = (contextEl.getAttribute('data-rotate') * 1) + (value * 1);
                const deg = this._w.Math.abs(slope) >= 360 ? 0 : slope;

                contextEl.setAttribute('data-rotate', deg);
                contextResizing._rotateVertical = /^(90|270)$/.test(this._w.Math.abs(deg).toString());
                this.plugins.resizing.setTransformSize.call(this, contextEl, null, null);

                this.selectComponent(contextEl, pluginName);
                break;
            case 'onalign':
                this.plugins.resizing.openAlignMenu.call(this);
                return;
            case 'align':
                const alignValue = value === 'basic' ? 'none' : value;
                currentModule.setAlign.call(this, alignValue, null, null, null);
                this.selectComponent(contextEl, pluginName);
                break;
            case 'caption':
                const caption = !currentContext._captionChecked;
                currentModule.openModify.call(this, true);
                currentContext._captionChecked = currentContext.captionCheckEl.checked = caption;

                currentModule.update_image.call(this, false, false, false);

                if (caption) {
                    const captionText = this.util.getChildElement(currentContext._caption, function (current) {
                        return current.nodeType === 3;
                    });

                    if (!captionText) {
                        currentContext._caption.focus();
                    } else {
                        this.setRange(captionText, 0, captionText, captionText.textContent.length);
                    }

                    this.controllersOff();
                } else {
                    this.selectComponent(contextEl, pluginName);
                    currentModule.openModify.call(this, true);
                }

                break;
            case 'revert':
                currentModule.setOriginSize.call(this);
                this.selectComponent(contextEl, pluginName);
                break;
            case 'update':
                currentModule.openModify.call(this);
                this.controllersOff();
                break;
            case 'delete':
                currentModule.destroy.call(this);
                break;
        }

        // history stack
        this.history.push(false);
    },

    /**
     * @description Initialize the transform style (rotation) of the element.
     * @param {Element} element Target element
     */
    resetTransform: function (element) {
        const size = (element.getAttribute('data-size') || element.getAttribute('data-origin') || '').split(',');
        this.context.resizing._rotateVertical = false;

        element.style.maxWidth = '';
        element.style.transform = '';
        element.style.transformOrigin = '';
        element.setAttribute('data-rotate', '');
        element.setAttribute('data-rotateX', '');
        element.setAttribute('data-rotateY', '');

        this.plugins[this.context.resizing._resize_plugin].setSize.call(this, size[0] ? size[0] : 'auto', size[1] ? size[1] : '', true);
    },

    /**
     * @description Set the transform style (rotation) of the element.
     * @param {Element} element Target element
     * @param {Number|null} width Element's width size
     * @param {Number|null} height Element's height size
     */
    setTransformSize: function (element, width, height) {
        let percentage = element.getAttribute('data-percentage');
        const isVertical = this.context.resizing._rotateVertical;
        const deg = element.getAttribute('data-rotate') * 1;
        let transOrigin = '';

        if (percentage && !isVertical) {
            percentage = percentage.split(',');
            if (percentage[0] === 'auto' && percentage[1] === 'auto') {
                this.plugins[this.context.resizing._resize_plugin].setAutoSize.call(this);
            } else {
                this.plugins[this.context.resizing._resize_plugin].setPercentSize.call(this, percentage[0], percentage[1]);
            }
        } else {
            const cover = this.util.getParentElement(element, 'FIGURE');

            const offsetW = width || element.offsetWidth;
            const offsetH = height || element.offsetHeight;
            const w = (isVertical ? offsetH : offsetW) + 'px';
            const h = (isVertical ? offsetW : offsetH) + 'px';

            this.plugins[this.context.resizing._resize_plugin].cancelPercentAttr.call(this);
            this.plugins[this.context.resizing._resize_plugin].setSize.call(this, offsetW + 'px', offsetH + 'px', true);

            cover.style.width = w;
            cover.style.height = (!!this.context[this.context.resizing._resize_plugin]._caption ? '' : h);

            if (isVertical) {
                let transW = (offsetW / 2) + 'px ' + (offsetW / 2) + 'px 0';
                let transH = (offsetH / 2) + 'px ' + (offsetH / 2) + 'px 0';
                transOrigin = deg === 90 || deg === -270 ? transH : transW;
            }
        }

        element.style.transformOrigin = transOrigin;
        this.plugins.resizing._setTransForm(element, deg.toString(), element.getAttribute('data-rotateX') || '', element.getAttribute('data-rotateY') || '');

        if (isVertical) element.style.maxWidth = 'none';
        else element.style.maxWidth = '';

        this.plugins.resizing.setCaptionPosition.call(this, element);
    },

    _setTransForm: function (element, r, x, y) {
        let width = (element.offsetWidth - element.offsetHeight) * (/-/.test(r) ? 1 : -1);
        let translate = '';

        if (/[1-9]/.test(r) && (x || y)) {
            translate = x ? 'Y' : 'X';

            switch (r) {
                case '90':
                    translate = x && y ? 'X' : y ? translate : '';
                    break;
                case '270':
                    width *= -1;
                    translate = x && y ? 'Y' : x ? translate : '';
                    break;
                case '-90':
                    translate = x && y ? 'Y' : x ? translate : '';
                    break;
                case '-270':
                    width *= -1;
                    translate = x && y ? 'X' : y ? translate : '';
                    break;
                default:
                    translate = '';
            }
        }

        if (r % 180 === 0) {
            element.style.maxWidth = '';
        }

        element.style.transform = 'rotate(' + r + 'deg)' + (x ? ' rotateX(' + x + 'deg)' : '') + (y ? ' rotateY(' + y + 'deg)' : '') + (translate ? ' translate' + translate + '(' + width + 'px)' : '');
    },

    /**
     * @description The position of the caption is set automatically.
     * @param {Element} element Target element (not caption element)
     */
    setCaptionPosition: function (element) {
        const figcaption = this.util.getChildElement(this.util.getParentElement(element, 'FIGURE'), 'FIGCAPTION');
        if (figcaption) {
            figcaption.style.marginTop = (this.context.resizing._rotateVertical ? element.offsetWidth - element.offsetHeight : 0) + 'px';
        }
    },

    /**
     * @description Mouse down event of resize handles
     * @param {MouseEvent} e Event object
     */
    onMouseDown_resize_handle: function (e) {
        e.stopPropagation();
        e.preventDefault();

        const contextResizing = this.context.resizing;
        const direction = contextResizing._resize_direction = e.target.classList[0];

        contextResizing._resizeClientX = e.clientX;
        contextResizing._resizeClientY = e.clientY;
        this.context.element.resizeBackground.style.display = 'block';
        contextResizing.resizeButton.style.display = 'none';
        contextResizing.resizeDiv.style.float = /l/.test(direction) ? 'right' : /r/.test(direction) ? 'left' : 'none';

        const closureFunc_bind = function closureFunc(e) {
            if (e.type === 'keydown' && e.keyCode !== 27) return;

            const change = contextResizing._isChange;
            contextResizing._isChange = false;

            this.removeDocEvent('mousemove', resizing_element_bind);
            this.removeDocEvent('mouseup', closureFunc_bind);
            this.removeDocEvent('keydown', closureFunc_bind);

            if (e.type === 'keydown') {
                this.controllersOff();
                this.context.element.resizeBackground.style.display = 'none';
                this.plugins[this.context.resizing._resize_plugin].init.call(this);
            } else {
                // element resize
                this.plugins.resizing.cancel_controller_resize.call(this, direction);
                // history stack
                if (change) this.history.push(false);
            }
        }.bind(this);

        const resizing_element_bind = this.plugins.resizing.resizing_element.bind(this, contextResizing, direction, this.context[contextResizing._resize_plugin]);
        this.addDocEvent('mousemove', resizing_element_bind);
        this.addDocEvent('mouseup', closureFunc_bind);
        this.addDocEvent('keydown', closureFunc_bind);
    },

    /**
     * @description Mouse move event after call "onMouseDown_resize_handle" of resize handles
     * The size of the module's "div" is adjusted according to the mouse move event.
     * @param {Object} contextResizing "core.context.resizing" object (binding argument)
     * @param {String} direction Direction ("tl", "tr", "bl", "br", "lw", "th", "rw", "bh") (binding argument)
     * @param {Object} plugin "core.context[currentPlugin]" object (binding argument)
     * @param {MouseEvent} e Event object
     */
    resizing_element: function (contextResizing, direction, plugin, e) {
        const clientX = e.clientX;
        const clientY = e.clientY;

        let resultW = plugin._element_w;
        let resultH = plugin._element_h;

        const w = plugin._element_w + (/r/.test(direction) ? clientX - contextResizing._resizeClientX : contextResizing._resizeClientX - clientX);
        const h = plugin._element_h + (/b/.test(direction) ? clientY - contextResizing._resizeClientY : contextResizing._resizeClientY - clientY);
        const wh = ((plugin._element_h / plugin._element_w) * w);

        if (/t/.test(direction)) contextResizing.resizeDiv.style.top = (plugin._element_h - (/h/.test(direction) ? h : wh)) + 'px';
        if (/l/.test(direction)) contextResizing.resizeDiv.style.left = (plugin._element_w - w) + 'px';

        if (/r|l/.test(direction)) {
            contextResizing.resizeDiv.style.width = w + 'px';
            resultW = w;
        }

        if (/^(t|b)[^h]$/.test(direction)) {
            contextResizing.resizeDiv.style.height = wh + 'px';
            resultH = wh;
        }
        else if (/^(t|b)h$/.test(direction)) {
            contextResizing.resizeDiv.style.height = h + 'px';
            resultH = h;
        }

        contextResizing._resize_w = resultW;
        contextResizing._resize_h = resultH;
        this.util.changeTxt(contextResizing.resizeDisplay, this._w.Math.round(resultW) + ' x ' + this._w.Math.round(resultH));
        contextResizing._isChange = true;
    },

    /**
     * @description Resize the element to the size of the "div" adjusted in the "resizing_element" method.
     * Called at the mouse-up event registered in "onMouseDown_resize_handle".
     * @param {String} direction Direction ("tl", "tr", "bl", "br", "lw", "th", "rw", "bh")
     */
    cancel_controller_resize: function (direction) {
        const isVertical = this.context.resizing._rotateVertical;
        this.controllersOff();
        this.context.element.resizeBackground.style.display = 'none';

        let w = this._w.Math.round(isVertical ? this.context.resizing._resize_h : this.context.resizing._resize_w);
        let h = this._w.Math.round(isVertical ? this.context.resizing._resize_w : this.context.resizing._resize_h);

        if (!isVertical && !/%$/.test(w)) {
            const padding = 16;
            const limit = this.context.element.wysiwygFrame.clientWidth - (padding * 2) - 2;

            if (this.util.getNumber(w, 0) > limit) {
                h = this._w.Math.round((h / w) * limit);
                w = limit;
            }
        }

        const pluginName = this.context.resizing._resize_plugin;
        this.plugins[pluginName].setSize.call(this, w, h, false, direction);
        if (isVertical) this.plugins.resizing.setTransformSize.call(this, this.context[this.context.resizing._resize_plugin]._element, w, h);

        this.selectComponent(this.context[pluginName]._element, pluginName);
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
    name: 'image',
    display: 'dialog',
    add: function (core) {
        core.addModule([dialog, anchor, component, resizing, fileManager]);

        const options = core.options;
        const context = core.context;
        const contextImage = context.image = {
            _infoList: [], // @Override fileManager
            _infoIndex: 0, // @Override fileManager
            _uploadFileLength: 0, // @Override fileManager
            focusElement: null, // @Override dialog // This element has focus when the dialog is opened.
            sizeUnit: options._imageSizeUnit,
            _linkElement: '',
            _altText: '',
            _align: 'none',
            _floatClassRegExp: '__se__float\\-[a-z]+',
            _v_src: {_linkValue: ''},
            svgDefaultSize: '30%',
            base64RenderIndex: 0,
            // @require @Override component
            _element: null,
            _cover: null,
            _container: null,
            // @Override resizing properties
            inputX: null,
            inputY: null,
            _element_w: 1,
            _element_h: 1,
            _element_l: 0,
            _element_t: 0,
            _defaultSizeX: 'auto',
            _defaultSizeY: 'auto',
            _origin_w: options.imageWidth === 'auto' ? '' : options.imageWidth,
            _origin_h: options.imageHeight === 'auto' ? '' : options.imageHeight,
            _proportionChecked: true,
            _resizing: options.imageResizing,
            _resizeDotHide: !options.imageHeightShow,
            _rotation: options.imageRotation,
            _alignHide: !options.imageAlignShow,
            _onlyPercentage: options.imageSizeOnlyPercentage,
            _ratio: false,
            _ratioX: 1,
            _ratioY: 1,
            _captionShow: true,
            _captionChecked: false,
            _caption: null,
            captionCheckEl: null
        };

        /** image dialog */
        let image_dialog = this.setDialog(core);
        contextImage.modal = image_dialog;
        contextImage.imgInputFile = image_dialog.querySelector('._se_image_file');
        contextImage.imgUrlFile = image_dialog.querySelector('._se_image_url');
        contextImage.focusElement = contextImage.imgInputFile || contextImage.imgUrlFile;
        contextImage.altText = image_dialog.querySelector('._se_image_alt');
        contextImage.captionCheckEl = image_dialog.querySelector('._se_image_check_caption');
        contextImage.previewSrc = image_dialog.querySelector('._se_tab_content_image .se-link-preview');

        /** add event listeners */
        image_dialog.querySelector('.se-dialog-tabs').addEventListener('click', this.openTab.bind(core));
        image_dialog.querySelector('form').addEventListener('submit', this.submit.bind(core));
        if (contextImage.imgInputFile) image_dialog.querySelector('.se-file-remove').addEventListener('click', this._removeSelectedFiles.bind(contextImage.imgInputFile, contextImage.imgUrlFile, contextImage.previewSrc));
        if (contextImage.imgUrlFile) contextImage.imgUrlFile.addEventListener('input', this._onLinkPreview.bind(contextImage.previewSrc, contextImage._v_src, options.linkProtocol));
        if (contextImage.imgInputFile && contextImage.imgUrlFile) contextImage.imgInputFile.addEventListener('change', this._fileInputChange.bind(contextImage));

        const imageGalleryButton = image_dialog.querySelector('.__se__gallery');
        if (imageGalleryButton) imageGalleryButton.addEventListener('click', this._openGallery.bind(core));

        contextImage.proportion = {};
        contextImage.inputX = {};
        contextImage.inputY = {};
        if (options.imageResizing) {
            contextImage.proportion = image_dialog.querySelector('._se_image_check_proportion');
            contextImage.inputX = image_dialog.querySelector('._se_image_size_x');
            contextImage.inputY = image_dialog.querySelector('._se_image_size_y');
            contextImage.inputX.value = options.imageWidth;
            contextImage.inputY.value = options.imageHeight;

            contextImage.inputX.addEventListener('keyup', this.setInputSize.bind(core, 'x'));
            contextImage.inputY.addEventListener('keyup', this.setInputSize.bind(core, 'y'));

            contextImage.inputX.addEventListener('change', this.setRatio.bind(core));
            contextImage.inputY.addEventListener('change', this.setRatio.bind(core));
            contextImage.proportion.addEventListener('change', this.setRatio.bind(core));

            image_dialog.querySelector('.se-dialog-btn-revert').addEventListener('click', this.sizeRevert.bind(core));
        }

        /** append html */
        context.dialog.modal.appendChild(image_dialog);

        /** link event */
        core.plugins.anchor.initEvent.call(core, 'image', image_dialog.querySelector('._se_tab_content_url'));
        contextImage.anchorCtx = core.context.anchor.caller.image;

        /** empty memory */
        image_dialog = null;
    },

    /** dialog */
    setDialog: function (core) {
        const option = core.options;
        const lang = core.lang;
        const dialog = core.util.createElement('DIV');

        dialog.className = 'se-dialog-content se-dialog-image';
        dialog.style.display = 'none';

        let html = '' +
            '<div class="se-dialog-header">' +
                '<button type="button" data-command="close" class="se-btn se-dialog-close" class="close" title="' + lang.dialogBox.close + '" aria-label="' + lang.dialogBox.close + '">' +
                    core.icons.cancel +
                '</button>' +
                '<span class="se-modal-title">' + lang.dialogBox.imageBox.title + '</span>' +
            '</div>' +
            '<div class="se-dialog-tabs">' +
                '<button type="button" class="_se_tab_link active" data-tab-link="image">' + lang.toolbar.image + '</button>' +
                '<button type="button" class="_se_tab_link" data-tab-link="url">' + lang.toolbar.link + '</button>' +
            '</div>' +
            '<form method="post" enctype="multipart/form-data">' +
                '<div class="_se_tab_content _se_tab_content_image">' +
                    '<div class="se-dialog-body"><div style="border-bottom: 1px dashed #ccc;">';
                    
                    if (option.imageFileInput) {
                        html += '' +
                            '<div class="se-dialog-form">' +
                                '<label>' + lang.dialogBox.imageBox.file + '</label>' +
                                '<div class="se-dialog-form-files">' +
                                    '<input class="se-input-form _se_image_file" type="file" accept="' + option.imageAccept + '"' + (option.imageMultipleFile ? ' multiple="multiple"' : '') + '/>' +
                                    '<button type="button" class="se-btn se-dialog-files-edge-button se-file-remove" title="' + lang.controller.remove + '" aria-label="' + lang.controller.remove + '">' + core.icons.cancel + '</button>' +
                                '</div>' +
                            '</div>' ;
                    }

                    if (option.imageUrlInput) {
                        html += '' +
                            '<div class="se-dialog-form">' +
                                '<label>' + lang.dialogBox.imageBox.url + '</label>' +
                                '<div class="se-dialog-form-files">' +
                                    '<input class="se-input-form se-input-url _se_image_url" type="text" />' +
                                    ((option.imageGalleryUrl && core.plugins.imageGallery) ? '<button type="button" class="se-btn se-dialog-files-edge-button __se__gallery" title="' + lang.toolbar.imageGallery + '" aria-label="' + lang.toolbar.imageGallery + '">' + core.icons.image_gallery + '</button>' : '') +
                                '</div>' +
                                '<pre class="se-link-preview"></pre>' +
                            '</div>';
                    }

                    html += '</div>' +
                        '<div class="se-dialog-form">' +
                            '<label>' + lang.dialogBox.imageBox.altText + '</label><input class="se-input-form _se_image_alt" type="text" />' +
                        '</div>';

            if (option.imageResizing) {
                const onlyPercentage = option.imageSizeOnlyPercentage;
                const onlyPercentDisplay = onlyPercentage ? ' style="display: none !important;"' : '';
                const heightDisplay = !option.imageHeightShow ? ' style="display: none !important;"' : '';
                html += '<div class="se-dialog-form">';
                        if (onlyPercentage || !option.imageHeightShow) {
                            html += '' +
                            '<div class="se-dialog-size-text">' +
                                '<label class="size-w">' + lang.dialogBox.size + '</label>' +
                            '</div>';
                        } else {
                            html += '' +
                            '<div class="se-dialog-size-text">' +
                                '<label class="size-w">' + lang.dialogBox.width + '</label>' +
                                '<label class="se-dialog-size-x">&nbsp;</label>' +
                                '<label class="size-h">' + lang.dialogBox.height + '</label>' +
                            '</div>';
                        }
                        html += '' +
                            '<input class="se-input-control _se_image_size_x" placeholder="auto"' + (onlyPercentage ? ' type="number" min="1"' : 'type="text"') + (onlyPercentage ? ' max="100"' : '') + ' />' +
                            '<label class="se-dialog-size-x"' + heightDisplay + '>' + (onlyPercentage ? '%' : 'x') + '</label>' +
                            '<input type="text" class="se-input-control _se_image_size_y" placeholder="auto"' + onlyPercentDisplay + (onlyPercentage ? ' max="100"' : '') + heightDisplay + '/>' +
                            '<label' + onlyPercentDisplay + heightDisplay + '><input type="checkbox" class="se-dialog-btn-check _se_image_check_proportion" checked/>&nbsp;' + lang.dialogBox.proportion + '</label>' +
                            '<button type="button" title="' + lang.dialogBox.revertButton + '" aria-label="' + lang.dialogBox.revertButton + '" class="se-btn se-dialog-btn-revert" style="float: right;">' + core.icons.revert + '</button>' +
                        '</div>' ;
            }

            html += '' +
                        '<div class="se-dialog-form se-dialog-form-footer">' +
                            '<label><input type="checkbox" class="se-dialog-btn-check _se_image_check_caption" />&nbsp;' + lang.dialogBox.caption + '</label>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="_se_tab_content _se_tab_content_url" style="display: none">' +
                    core.context.anchor.forms.innerHTML +
                '</div>' +
                '<div class="se-dialog-footer">' +
                    '<div' + (option.imageAlignShow ? '' : ' style="display: none"') + '>' +
                        '<label><input type="radio" name="suneditor_image_radio" class="se-dialog-btn-radio" value="none" checked>' + lang.dialogBox.basic + '</label>' +
                        '<label><input type="radio" name="suneditor_image_radio" class="se-dialog-btn-radio" value="left">' + lang.dialogBox.left + '</label>' +
                        '<label><input type="radio" name="suneditor_image_radio" class="se-dialog-btn-radio" value="center">' + lang.dialogBox.center + '</label>' +
                        '<label><input type="radio" name="suneditor_image_radio" class="se-dialog-btn-radio" value="right">' + lang.dialogBox.right + '</label>' +
                    '</div>' +
                    '<button type="submit" class="se-btn-primary" title="' + lang.dialogBox.submitButton + '" aria-label="' + lang.dialogBox.submitButton + '"><span>' + lang.dialogBox.submitButton + '</span></button>' +
                '</div>' +
            '</form>';

        dialog.innerHTML = html;

        return dialog;
    },

    _fileInputChange: function () {
        if (!this.imgInputFile.value) {
            this.imgUrlFile.removeAttribute('disabled');
            this.previewSrc.style.textDecoration = '';
        } else {
            this.imgUrlFile.setAttribute('disabled', true);
            this.previewSrc.style.textDecoration = 'line-through';
        }
    },

    _removeSelectedFiles: function (urlInput, previewSrc) {
        this.value = '';
        if (urlInput) {
            urlInput.removeAttribute('disabled');
            previewSrc.style.textDecoration = '';
        }
    },

    _openGallery: function () {
        this.callPlugin('imageGallery', this.plugins.imageGallery.open.bind(this, this.plugins.image._setUrlInput.bind(this.context.image)), null);
    },

    _setUrlInput: function (target) {
        this.altText.value = target.alt;
        this._v_src._linkValue = this.previewSrc.textContent = this.imgUrlFile.value = target.getAttribute('data-value') || target.src;
        this.imgUrlFile.focus();
    },

    _onLinkPreview: function (context, protocol, e) {
        const value = e.target.value.trim();
        context._linkValue = this.textContent = !value ? '' : (protocol && value.indexOf('://') === -1 && value.indexOf('#') !== 0) ? protocol + value : value.indexOf('://') === -1 ? '/' + value : value;
    },

    /**
     * @Override @Required fileManager
     */
    fileTags: ['img'],

    /**
     * @Override core, fileManager, resizing
     * @description It is called from core.selectComponent.
     * @param {Element} element Target element
     */
    select: function (element) {
        this.plugins.image.onModifyMode.call(this, element, this.plugins.resizing.call_controller_resize.call(this, element, 'image'));
    },

    /**
     * @Override fileManager, resizing
     */
    destroy: function (element) {
        const imageEl = element || this.context.image._element;
        const imageContainer = this.util.getParentElement(imageEl, this.util.isMediaComponent) || imageEl;
        const dataIndex = imageEl.getAttribute('data-index') * 1;

        // event
        if (typeof this.functions.onImageDeleteBefore === 'function' && (this.functions.onImageDeleteBefore(imageEl, imageContainer, dataIndex, this) === false)) return;

        let focusEl = (imageContainer.previousElementSibling || imageContainer.nextElementSibling);

        const emptyDiv = imageContainer.parentNode;
        this.util.removeItem(imageContainer);
        this.plugins.image.init.call(this);
        this.controllersOff();

        if (emptyDiv !== this.context.element.wysiwyg) this.util.removeItemAllParents(emptyDiv, function (current) { return current.childNodes.length === 0; }, null);

        // focus
        this.focusEdge(focusEl);

        // event
        this.plugins.fileManager.deleteInfo.call(this, 'image', dataIndex, this.functions.onImageUpload);

        // history stack
        this.history.push(false);
    },

    /**
     * @Required @Override dialog
     */
    on: function (update) {
        const contextImage = this.context.image;

        if (!update) {
            contextImage.inputX.value = contextImage._origin_w = this.options.imageWidth === contextImage._defaultSizeX ? '' : this.options.imageWidth;
            contextImage.inputY.value = contextImage._origin_h = this.options.imageHeight === contextImage._defaultSizeY ? '' : this.options.imageHeight;
            if (contextImage.imgInputFile && this.options.imageMultipleFile) contextImage.imgInputFile.setAttribute('multiple', 'multiple');
        } else {
            if (contextImage.imgInputFile && this.options.imageMultipleFile) contextImage.imgInputFile.removeAttribute('multiple');
        }
        this.plugins.anchor.on.call(this, contextImage.anchorCtx, update);
    },

    /**
     * @Required @Override dialog
     */
    open: function () {
        this.plugins.dialog.open.call(this, 'image', 'image' === this.currentControllerName);
    },

    openTab: function (e) {
        const modal = this.context.image.modal;
        const targetElement = (e === 'init' ? modal.querySelector('._se_tab_link') : e.target);

        if (!/^BUTTON$/i.test(targetElement.tagName)) {
            return false;
        }

        // Declare all variables
        const tabName = targetElement.getAttribute('data-tab-link');
        const contentClassName = '_se_tab_content';
        let i, tabContent, tabLinks;

        // Get all elements with class="tabcontent" and hide them
        tabContent = modal.getElementsByClassName(contentClassName);
        for (i = 0; i < tabContent.length; i++) {
            tabContent[i].style.display = 'none';
        }

        // Get all elements with class="tablinks" and remove the class "active"
        tabLinks = modal.getElementsByClassName('_se_tab_link');
        for (i = 0; i < tabLinks.length; i++) {
            this.util.removeClass(tabLinks[i], 'active');
        }

        // Show the current tab, and add an "active" class to the button that opened the tab
        modal.querySelector('.' + contentClassName + '_' + tabName).style.display = 'block';
        this.util.addClass(targetElement, 'active');

        // focus
        if (tabName === 'image' && this.context.image.focusElement) {
            this.context.image.focusElement.focus();
        } else if (tabName === 'url') {
            this.context.anchor.caller.image.urlInput.focus();
        }

        return false;
    },

    submit: function (e) {
        const contextImage = this.context.image;
        const imagePlugin = this.plugins.image;

        e.preventDefault();
        e.stopPropagation();

        contextImage._altText = contextImage.altText.value;
        contextImage._align = contextImage.modal.querySelector('input[name="suneditor_image_radio"]:checked').value;
        contextImage._captionChecked = contextImage.captionCheckEl.checked;
        if (contextImage._resizing) contextImage._proportionChecked = contextImage.proportion.checked;

        try {
            if (this.context.dialog.updateModal) {
                imagePlugin.update_image.call(this, false, true, false);
            }

            if (contextImage.imgInputFile && contextImage.imgInputFile.files.length > 0) {
                this.showLoading();
                imagePlugin.submitAction.call(this, this.context.image.imgInputFile.files);
            } else if (contextImage.imgUrlFile && contextImage._v_src._linkValue.length > 0) {
                this.showLoading();
                imagePlugin.onRender_imgUrl.call(this, contextImage._v_src._linkValue);
            }
        } catch (error) {
            this.closeLoading();
            throw Error('[SUNEDITOR.image.submit.fail] cause : "' + error.message + '"');
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
            if (/image/i.test(fileList[i].type)) {
                files.push(fileList[i]);
                fileSize += fileList[i].size;
            }
        }

        const limitSize = this.options.imageUploadSizeLimit;
        if (limitSize > 0) {
            let infoSize = 0;
            const imagesInfo = this.context.image._infoList;
            for (let i = 0, len = imagesInfo.length; i < len; i++) {
                infoSize += imagesInfo[i].size * 1;
            }

            if ((fileSize + infoSize) > limitSize) {
                this.closeLoading();
                const err = '[SUNEDITOR.imageUpload.fail] Size of uploadable total images: ' + (limitSize/1000) + 'KB';
                if (typeof this.functions.onImageUploadError !== 'function' || this.functions.onImageUploadError(err, { 'limitSize': limitSize, 'currentSize': infoSize, 'uploadSize': fileSize }, this)) {
                    this.functions.noticeOpen(err);
                }
                return;
            }
        }

        const contextImage = this.context.image;
        contextImage._uploadFileLength = files.length;

        const anchor = this.plugins.anchor.createAnchor.call(this, contextImage.anchorCtx, true);
        const info = {
            anchor: anchor,
            inputWidth: contextImage.inputX.value,
            inputHeight: contextImage.inputY.value,
            align: contextImage._align,
            isUpdate: this.context.dialog.updateModal,
            alt: contextImage._altText,
            element: contextImage._element
        };

        if (typeof this.functions.onImageUploadBefore === 'function') {
            const result = this.functions.onImageUploadBefore(files, info, this, function (data) {
                if (data && this._w.Array.isArray(data.result)) {
                    this.plugins.image.register.call(this, info, data);
                } else {
                    this.plugins.image.upload.call(this, info, data);
                }
            }.bind(this));

            if (typeof result === 'undefined') return;
            if (!result) {
                this.closeLoading();
                return;
            }
            if (this._w.Array.isArray(result) && result.length > 0) files = result;
        }

        this.plugins.image.upload.call(this, info, files);
    },

    error: function (message, response) {
        this.closeLoading();
        if (typeof this.functions.onImageUploadError !== 'function' || this.functions.onImageUploadError(message, response, this)) {
            this.functions.noticeOpen(message);
            throw Error('[SUNEDITOR.plugin.image.error] response: ' + message);
        }
    },

    upload: function (info, files) {
        if (!files) {
            this.closeLoading();
            return;
        }
        if (typeof files === 'string') {
            this.plugins.image.error.call(this, files, null);
            return;
        }

        const imageUploadUrl = this.options.imageUploadUrl;
        const filesLen = this.context.dialog.updateModal ? 1 : files.length;

        // server upload
        if (typeof imageUploadUrl === 'string' && imageUploadUrl.length > 0) {
            const formData = new FormData();
            for (let i = 0; i < filesLen; i++) {
                formData.append('file-' + i, files[i]);
            }
            this.plugins.fileManager.upload.call(this, imageUploadUrl, this.options.imageUploadHeader, formData, this.plugins.image.callBack_imgUpload.bind(this, info), this.functions.onImageUploadError);
        } else { // base64
            this.plugins.image.setup_reader.call(this, files, info.anchor, info.inputWidth, info.inputHeight, info.align, info.alt, filesLen, info.isUpdate);
        }
    },

    callBack_imgUpload: function (info, xmlHttp) {
        if (typeof this.functions.imageUploadHandler === 'function') {
            this.functions.imageUploadHandler(xmlHttp, info, this);
        } else {
            const response = JSON.parse(xmlHttp.responseText);
            if (response.errorMessage) {
                this.plugins.image.error.call(this, response.errorMessage, response);
            } else {
                this.plugins.image.register.call(this, info, response);
            }
        }
    },

    register: function (info, response) {
        const fileList = response.result;

        for (let i = 0, len = fileList.length, file; i < len; i++) {
            file = { name: fileList[i].name, size: fileList[i].size };
            if (info.isUpdate) {
                this.plugins.image.update_src.call(this, fileList[i].url, info.element, file);
                break;
            } else {
                this.plugins.image.create_image.call(this, fileList[i].url, info.anchor, info.inputWidth, info.inputHeight, info.align, file, info.alt);
            }
        }

        this.closeLoading();
    },

    setup_reader: function (files, anchor, width, height, align, alt, filesLen, isUpdate) {
        try {
            if (filesLen === 0) {
                this.closeLoading();
                console.warn('[SUNEDITOR.image.base64.fail] cause : No applicable files');
                return;
            }

            this.context.image.base64RenderIndex = filesLen;
            const wFileReader = this._w.FileReader;
            const filesStack = [filesLen];
            this.context.image.inputX.value = width;
            this.context.image.inputY.value = height;

            for (let i = 0, reader, file; i < filesLen; i++) {
                reader = new wFileReader();
                file = files[i];

                reader.onload = function (reader, update, updateElement, file, index) {
                    filesStack[index] = { result: reader.result, file: file };

                    if (--this.context.image.base64RenderIndex === 0) {
                        this.plugins.image.onRender_imgBase64.call(this, update, filesStack, updateElement, anchor, width, height, align, alt);
                        this.closeLoading();
                    }
                }.bind(this, reader, isUpdate, this.context.image._element, file, i);

                reader.readAsDataURL(file);
            }
        } catch (e) {
            this.closeLoading();
            throw Error('[SUNEDITOR.image.setup_reader.fail] cause : "' + e.message + '"');
        }
    },

    onRender_imgBase64: function (update, filesStack, updateElement, anchor, width, height, align, alt) {
        const updateMethod = this.plugins.image.update_src;
        const createMethod = this.plugins.image.create_image;

        for (let i = 0, len = filesStack.length; i < len; i++) {
            if (update) {
                this.context.image._element.setAttribute('data-file-name', filesStack[i].file.name);
                this.context.image._element.setAttribute('data-file-size', filesStack[i].file.size);
                updateMethod.call(this, filesStack[i].result, updateElement, filesStack[i].file);
            } else {
                createMethod.call(this, filesStack[i].result, anchor, width, height, align, filesStack[i].file, alt);
            }
        }
    },

    onRender_imgUrl: function (url) {
        if (!url) url = this.context.image._v_src._linkValue;
        if (!url) return false;
        const contextImage = this.context.image;

        try {
            const file = {name: url.split('/').pop(), size: 0};
            if (this.context.dialog.updateModal) this.plugins.image.update_src.call(this, url, contextImage._element, file);
            else this.plugins.image.create_image.call(this, url, this.plugins.anchor.createAnchor.call(this, contextImage.anchorCtx, true), contextImage.inputX.value, contextImage.inputY.value, contextImage._align, file, contextImage._altText);
        } catch (e) {
            throw Error('[SUNEDITOR.image.URLRendering.fail] cause : "' + e.message + '"');
        } finally {
            this.closeLoading();
        }
    },

    onRender_link: function (imgTag, anchor) {
        if (anchor) {
            anchor.setAttribute('data-image-link', 'image');
            imgTag.setAttribute('data-image-link', anchor.href);
            anchor.appendChild(imgTag);
            return anchor;
        }

        return imgTag;
    },

    /**
     * @Override resizing
     * @param {String} xy 'x': width, 'y': height
     * @param {KeyboardEvent} e Event object
     */
    setInputSize: function (xy, e) {
        if (e && e.keyCode === 32) {
            e.preventDefault();
            return;
        }

        this.plugins.resizing._module_setInputSize.call(this, this.context.image, xy);
    },

    /**
     * @Override resizing
     */
    setRatio: function () {
        this.plugins.resizing._module_setRatio.call(this, this.context.image);
    },

    /**
     * @Override fileManager
     */
    checkFileInfo: function () {
        const imagePlugin = this.plugins.image;
        const contextImage = this.context.image;

        const modifyHandler = function (tag) {
            imagePlugin.onModifyMode.call(this, tag, null);
            imagePlugin.openModify.call(this, true);
            // get size
            contextImage.inputX.value = contextImage._origin_w;
            contextImage.inputY.value = contextImage._origin_h;
            // get align
            const format = this.util.getFormatElement(tag);
            if (format) contextImage._align = format.style.textAlign || format.style.float;
            // link
            if (this.util.isAnchor(tag.parentNode) && !contextImage.anchorCtx.linkValue) contextImage.anchorCtx.linkValue = ' ';

            imagePlugin.update_image.call(this, true, false, true);
            imagePlugin.init.call(this);
        }.bind(this);

        this.plugins.fileManager.checkInfo.call(this, 'image', ['img'], this.functions.onImageUpload, modifyHandler, true);
    },

    /**
     * @Override fileManager
     */
    resetFileInfo: function () {
        this.plugins.fileManager.resetInfo.call(this, 'image', this.functions.onImageUpload);
    },

    create_image: function (src, anchor, width, height, align, file, alt) {
        const imagePlugin = this.plugins.image;
        const contextImage = this.context.image;
        this.context.resizing._resize_plugin = 'image';

        let oImg = this.util.createElement('IMG');
        oImg.src = src;
        oImg.alt = alt;
        oImg.setAttribute('data-rotate', '0');
        anchor = imagePlugin.onRender_link.call(this, oImg, anchor ?  anchor.cloneNode(false) : null);

        if (contextImage._resizing) {
            oImg.setAttribute('data-proportion', contextImage._proportionChecked);
        }

        const cover = this.plugins.component.set_cover.call(this, anchor);
        const container = this.plugins.component.set_container.call(this, cover, 'se-image-container');

        // caption
        if (contextImage._captionChecked) {
            contextImage._caption = this.plugins.component.create_caption.call(this);
            cover.appendChild(contextImage._caption);
        }

        contextImage._element = oImg;
        contextImage._cover = cover;
        contextImage._container = container;

        // set size
        imagePlugin.applySize.call(this, width, height);

        // align
        imagePlugin.setAlign.call(this, align, oImg, cover, container);

        oImg.onload = imagePlugin._image_create_onload.bind(this, oImg, contextImage.svgDefaultSize, container);
        if (this.insertComponent(container, true, true, true)) this.plugins.fileManager.setInfo.call(this, 'image', oImg, this.functions.onImageUpload, file, true);
        this.context.resizing._resize_plugin = '';
    },

    _image_create_onload: function (oImg, svgDefaultSize, container) {
        // svg exception handling
        if (oImg.offsetWidth === 0) this.plugins.image.applySize.call(this, svgDefaultSize, '');
        if (this.options.mediaAutoSelect) {
            this.selectComponent(oImg, 'image');
        } else {
            const line = this.appendFormatTag(container, null);
            if (line) this.setRange(line, 0, line, 0);
        }
    },

    update_image: function (init, openController, notHistoryPush) {
        const contextImage = this.context.image;
        let imageEl = contextImage._element;
        let cover = contextImage._cover;
        let container = contextImage._container;
        let isNewContainer = false;

        if (cover === null) {
            isNewContainer = true;
            imageEl = contextImage._element.cloneNode(true);
            cover = this.plugins.component.set_cover.call(this, imageEl);
        }

        if (container === null) {
            cover = cover.cloneNode(true);
            imageEl = cover.querySelector('img');
            isNewContainer = true;
            container = this.plugins.component.set_container.call(this, cover, 'se-image-container');
        } else if (isNewContainer) {
            container.innerHTML = '';
            container.appendChild(cover);
            contextImage._cover = cover;
            contextImage._element = imageEl;
            isNewContainer = false;
        }

        // check size
        let changeSize;
        const x = this.util.isNumber(contextImage.inputX.value) ? contextImage.inputX.value + contextImage.sizeUnit : contextImage.inputX.value;
        const y = this.util.isNumber(contextImage.inputY.value) ? contextImage.inputY.value + contextImage.sizeUnit : contextImage.inputY.value;
        if (/%$/.test(imageEl.style.width)) {
            changeSize = x !== container.style.width || y !== container.style.height;
        } else {
            changeSize = x !== imageEl.style.width || y !== imageEl.style.height;
        }

        // alt
        imageEl.alt = contextImage._altText;

        // caption
        let modifiedCaption = false;
        if (contextImage._captionChecked) {
            if (!contextImage._caption) {
                contextImage._caption = this.plugins.component.create_caption.call(this);
                cover.appendChild(contextImage._caption);
                modifiedCaption = true;
            }
        } else {
            if (contextImage._caption) {
                this.util.removeItem(contextImage._caption);
                contextImage._caption = null;
                modifiedCaption = true;
            }
        }

        // link
        let isNewAnchor = null;
        const anchor = this.plugins.anchor.createAnchor.call(this, contextImage.anchorCtx, true);
        if (anchor) {
            if (contextImage._linkElement !== anchor || (isNewContainer && !container.contains(anchor))) {
                contextImage._linkElement = anchor.cloneNode(false);
                cover.insertBefore(this.plugins.image.onRender_link.call(this, imageEl, contextImage._linkElement), contextImage._caption);
                isNewAnchor = contextImage._element;
            } else {
                contextImage._linkElement.setAttribute('data-image-link', 'image');
            }
        } else if (contextImage._linkElement !== null) {
            const imageElement = imageEl;
            imageElement.setAttribute('data-image-link', '');
            if (cover.contains(contextImage._linkElement)) {
                const newEl = imageElement.cloneNode(true);
                cover.removeChild(contextImage._linkElement);
                cover.insertBefore(newEl, contextImage._caption);
                contextImage._element = imageEl = newEl;
            }
        }

        let existElement = null;
        if (isNewContainer) {
            existElement = (this.util.isRangeFormatElement(contextImage._element.parentNode) || this.util.isWysiwygDiv(contextImage._element.parentNode)) ? 
                contextImage._element :
                this.util.isAnchor(contextImage._element.parentNode) ? contextImage._element.parentNode : this.util.getFormatElement(contextImage._element) || contextImage._element;

            if (this.util.getParentElement(contextImage._element, this.util.isNotCheckingNode)) {
                existElement = isNewAnchor ? anchor : contextImage._element;
                existElement.parentNode.replaceChild(container, existElement);
            } else if (this.util.isListCell(existElement)) {
                const refer = this.util.getParentElement(contextImage._element, function (current) { return current.parentNode === existElement; });
                existElement.insertBefore(container, refer);
                this.util.removeItem(contextImage._element);
                this.util.removeEmptyNode(refer, null, true);
            } else if (this.util.isFormatElement(existElement)) {
                const refer = this.util.getParentElement(contextImage._element, function (current) { return current.parentNode === existElement; });
                existElement = this.util.splitElement(existElement, refer);
                existElement.parentNode.insertBefore(container, existElement);
                this.util.removeItem(contextImage._element);
                this.util.removeEmptyNode(existElement, null, true);
                if (existElement.children.length === 0) existElement.innerHTML = this.util.htmlRemoveWhiteSpace(existElement.innerHTML);
            } else {
                if (this.util.isFormatElement(existElement.parentNode)) {
                    const formats = existElement.parentNode;
                    formats.parentNode.insertBefore(container, existElement.previousSibling ? formats.nextElementSibling : formats);
                    if (contextImage.__updateTags.map(function (current) { return existElement.contains(current); }).length === 0) this.util.removeItem(existElement);
                } else {
                    existElement = this.util.isFigures(existElement.parentNode) ? existElement.parentNode : existElement;
                    existElement.parentNode.replaceChild(container, existElement);
                }
            }

            imageEl = container.querySelector('img');

            contextImage._element = imageEl;
            contextImage._cover = cover;
            contextImage._container = container;
        }

        if (isNewAnchor) {
            if (!isNewContainer) {
                this.util.removeItem(anchor);
            } else {
                this.util.removeItem(isNewAnchor);
                if (this.util.getListChildren(anchor, function (current) { return /IMG/i.test(current.tagName); }).length === 0) {
                    this.util.removeItem(anchor);
                }
            }
        }

        // transform
        if (modifiedCaption || (!contextImage._onlyPercentage && changeSize)) {
            if (!init && (/\d+/.test(imageEl.style.height) || (this.context.resizing._rotateVertical && contextImage._captionChecked))) {
                if (/%$/.test(contextImage.inputX.value) || /%$/.test(contextImage.inputY.value)) {
                    this.plugins.resizing.resetTransform.call(this, imageEl);
                } else {
                    this.plugins.resizing.setTransformSize.call(this, imageEl, this.util.getNumber(contextImage.inputX.value, 0), this.util.getNumber(contextImage.inputY.value, 0));
                }
            }
        }

        // size
        if (contextImage._resizing) {
            imageEl.setAttribute('data-proportion', contextImage._proportionChecked);
            if (changeSize) {
                this.plugins.image.applySize.call(this);
            }
        }

        // align
        this.plugins.image.setAlign.call(this, null, imageEl, null, null);

        // set imagesInfo
        if (init) {
            this.plugins.fileManager.setInfo.call(this, 'image', imageEl, this.functions.onImageUpload, null, true);
        }

        if (openController) {
            this.selectComponent(imageEl, 'image');
        }

        // history stack
        if (!notHistoryPush) this.history.push(false);
    },

    update_src: function (src, element, file) {
        element.src = src;
        this._w.setTimeout(this.plugins.fileManager.setInfo.bind(this, 'image', element, this.functions.onImageUpload, file, true));
        this.selectComponent(element, 'image');
    },

    /**
     * @Required @Override fileManager, resizing
     */
    onModifyMode: function (element, size) {
        if (!element) return;

        const contextImage = this.context.image;
        contextImage._linkElement = contextImage.anchorCtx.linkAnchor = this.util.isAnchor(element.parentNode) ? element.parentNode : null;
        contextImage._element = element;
        contextImage._cover = this.util.getParentElement(element, 'FIGURE');
        contextImage._container = this.util.getParentElement(element, this.util.isMediaComponent);
        contextImage._caption = this.util.getChildElement(contextImage._cover, 'FIGCAPTION');
        contextImage._align =  element.getAttribute('data-align') || element.style.float || 'none';
        element.style.float = '';
        this.plugins.anchor.setCtx(contextImage._linkElement, contextImage.anchorCtx);

        if (size) {
            contextImage._element_w = size.w;
            contextImage._element_h = size.h;
            contextImage._element_t = size.t;
            contextImage._element_l = size.l;
        }

        let userSize = contextImage._element.getAttribute('data-size') || contextImage._element.getAttribute('data-origin');
        let w, h;
        if (userSize) {
            userSize = userSize.split(',');
            w = userSize[0];
            h = userSize[1];
        } else if (size) {
            w = size.w;
            h = size.h;
        }

        contextImage._origin_w = w || element.style.width || element.width || '';
        contextImage._origin_h = h || element.style.height || element.height || '';
    },

    /**
     * @Required @Override fileManager, resizing
     */
    openModify: function (notOpen) {
        const contextImage = this.context.image;
        if (contextImage.imgUrlFile) {
            contextImage._v_src._linkValue = contextImage.previewSrc.textContent = contextImage.imgUrlFile.value = contextImage._element.src;
        }
        contextImage._altText = contextImage.altText.value = contextImage._element.alt;
        (contextImage.modal.querySelector('input[name="suneditor_image_radio"][value="' + contextImage._align + '"]') || contextImage.modal.querySelector('input[name="suneditor_image_radio"][value="none"]')).checked = true;
        contextImage._align = contextImage.modal.querySelector('input[name="suneditor_image_radio"]:checked').value;
        contextImage._captionChecked = contextImage.captionCheckEl.checked = !!contextImage._caption;

        if (contextImage._resizing) {
            this.plugins.resizing._module_setModifyInputSize.call(this, contextImage, this.plugins.image);
        }

        if (!notOpen) this.plugins.dialog.open.call(this, 'image', true);
    },

    /**
     * @Override fileManager
     */
    applySize: function (w, h) {
        const contextImage = this.context.image;

        if (!w) w = contextImage.inputX.value || this.options.imageWidth;
        if (!h) h = contextImage.inputY.value || this.options.imageHeight;

        if ((contextImage._onlyPercentage && !!w) || /%$/.test(w)) {
            this.plugins.image.setPercentSize.call(this, w, h);
            return true;
        } else if ((!w || w === 'auto') && (!h || h === 'auto')) {
            this.plugins.image.setAutoSize.call(this);
        } else {
            this.plugins.image.setSize.call(this, w, h, false);
        }

        return false;
    },

    /**
     * @Override resizing
     */
    sizeRevert: function () {
        this.plugins.resizing._module_sizeRevert.call(this, this.context.image);
    },

    /**
     * @Override resizing
     */
    setSize: function (w, h, notResetPercentage, direction) {
        const contextImage = this.context.image;
        const onlyW = /^(rw|lw)$/.test(direction) && /\d+/.test(contextImage._element.style.height);
        const onlyH = /^(th|bh)$/.test(direction) && /\d+/.test(contextImage._element.style.width);

        if (!onlyH) {
            contextImage._element.style.width = this.util.isNumber(w) ? w + contextImage.sizeUnit : w;
            this.plugins.image.cancelPercentAttr.call(this);
        }
        if (!onlyW) {
            contextImage._element.style.height = this.util.isNumber(h) ? h + contextImage.sizeUnit : /%$/.test(h) ? '' : h;
        }

        if (contextImage._align === 'center') this.plugins.image.setAlign.call(this, null, null, null, null);
        if (!notResetPercentage) contextImage._element.removeAttribute('data-percentage');

        // save current size
        this.plugins.resizing._module_saveCurrentSize.call(this, contextImage);
    },

    /**
     * @Override resizing
     */
    setAutoSize: function () {
        const contextImage = this.context.image;

        if (contextImage._caption) contextImage._caption.style.marginTop = '';
        this.plugins.resizing.resetTransform.call(this, contextImage._element);
        this.plugins.image.cancelPercentAttr.call(this);

        contextImage._element.style.maxWidth = '';
        contextImage._element.style.width = '';
        contextImage._element.style.height = '';
        contextImage._cover.style.width = '';
        contextImage._cover.style.height = '';

        this.plugins.image.setAlign.call(this, null, null, null, null);
        contextImage._element.setAttribute('data-percentage', 'auto,auto');

        // save current size
        this.plugins.resizing._module_saveCurrentSize.call(this, contextImage);
    },

    /**
     * @Override resizing
     */
    setOriginSize: function () {
        const contextImage = this.context.image;
        contextImage._element.removeAttribute('data-percentage');

        this.plugins.resizing.resetTransform.call(this, contextImage._element);
        this.plugins.image.cancelPercentAttr.call(this);

        const originSize = (contextImage._element.getAttribute('data-origin') || '').split(',');
        const w = originSize[0];
        const h = originSize[1];

        if (originSize) {
            if (contextImage._onlyPercentage || (/%$/.test(w) && (/%$/.test(h) || !/\d/.test(h)))) {
                this.plugins.image.setPercentSize.call(this, w, h);
            } else {
                this.plugins.image.setSize.call(this, w, h);
            }

            // save current size
            this.plugins.resizing._module_saveCurrentSize.call(this, contextImage);
        }
    },

    /**
     * @Override resizing
     */
    setPercentSize: function (w, h) {
        const contextImage = this.context.image;
        h = !!h && !/%$/.test(h) && !this.util.getNumber(h, 0) ? this.util.isNumber(h) ? h + '%' : h : this.util.isNumber(h) ? h + contextImage.sizeUnit : (h || '');
        const heightPercentage = /%$/.test(h);

        contextImage._container.style.width = this.util.isNumber(w) ? w + '%' : w;
        contextImage._container.style.height = '';
        contextImage._cover.style.width = '100%';
        contextImage._cover.style.height = !heightPercentage ? '' : h;
        contextImage._element.style.width = '100%';
        contextImage._element.style.height = heightPercentage ? '' : h;
        contextImage._element.style.maxWidth = '';

        if (contextImage._align === 'center') this.plugins.image.setAlign.call(this, null, null, null, null);

        contextImage._element.setAttribute('data-percentage', w + ',' + h);
        this.plugins.resizing.setCaptionPosition.call(this, contextImage._element);

        // save current size
        this.plugins.resizing._module_saveCurrentSize.call(this, contextImage);
    },

    /**
     * @Override resizing
     */
    cancelPercentAttr: function () {
        const contextImage = this.context.image;

        contextImage._cover.style.width = '';
        contextImage._cover.style.height = '';
        contextImage._container.style.width = '';
        contextImage._container.style.height = '';

        this.util.removeClass(contextImage._container, this.context.image._floatClassRegExp);
        this.util.addClass(contextImage._container, '__se__float-' + contextImage._align);

        if (contextImage._align === 'center') this.plugins.image.setAlign.call(this, null, null, null, null);
    },

    /**
     * @Override resizing
     */
    setAlign: function (align, element, cover, container) {
        const contextImage = this.context.image;

        if (!align) align = contextImage._align;
        if (!element) element = contextImage._element;
        if (!cover) cover = contextImage._cover;
        if (!container) container = contextImage._container;

        if (/%$/.test(element.style.width) && align === 'center') {
            container.style.minWidth = '100%';
            cover.style.width = container.style.width;
        } else {
            container.style.minWidth = '';
            cover.style.width = this.context.resizing._rotateVertical ? (element.style.height || element.offsetHeight) : ((!element.style.width || element.style.width === 'auto') ? '' : element.style.width || '100%');
        }

        if (!this.util.hasClass(container, '__se__float-' + align)) {
            this.util.removeClass(container, contextImage._floatClassRegExp);
            this.util.addClass(container, '__se__float-' + align);
        }

        element.setAttribute('data-align', align);
    },

    /**
     * @Override dialog
     */
    init: function () {
        const contextImage = this.context.image;
        if (contextImage.imgInputFile) contextImage.imgInputFile.value = '';
        if (contextImage.imgUrlFile) contextImage._v_src._linkValue = contextImage.previewSrc.textContent = contextImage.imgUrlFile.value = '';
        if (contextImage.imgInputFile && contextImage.imgUrlFile) {
            contextImage.imgUrlFile.removeAttribute('disabled');
            contextImage.previewSrc.style.textDecoration = '';
        }

        contextImage.altText.value = '';
        contextImage.modal.querySelector('input[name="suneditor_image_radio"][value="none"]').checked = true;
        contextImage.captionCheckEl.checked = false;
        contextImage._element = null;
        this.plugins.image.openTab.call(this, 'init');

        if (contextImage._resizing) {
            contextImage.inputX.value = this.options.imageWidth === contextImage._defaultSizeX ? '' : this.options.imageWidth;
            contextImage.inputY.value = this.options.imageHeight === contextImage._defaultSizeY ? '' : this.options.imageHeight;
            contextImage.proportion.checked = true;
            contextImage._ratio = false;
            contextImage._ratioX = 1;
            contextImage._ratioY = 1;
        }

        this.plugins.anchor.init.call(this, contextImage.anchorCtx);
    }
};
