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

export default {
    name: 'link',
    display: 'dialog',
    add: function (core) {
        core.addModule([dialog, anchor]);

        const context = core.context;
        const contextLink = context.link = {
            focusElement: null, // @Override dialog // This element has focus when the dialog is opened.
            _linkAnchor: null,
            anchorCtx: null
        };

        /** link dialog */
        let link_dialog = this.setDialog(core);
        contextLink.modal = link_dialog;

        /** link controller */
        let link_controller = this.setController_LinkButton(core);
        contextLink.linkController = link_controller;

        link_dialog.querySelector('form').addEventListener('submit', this.submit.bind(core));
        link_controller.addEventListener('click', this.onClick_linkController.bind(core));

        /** append html */
        context.dialog.modal.appendChild(link_dialog);

        /** append controller */
        context.element.relative.appendChild(link_controller);

        /** link event */
        core.plugins.anchor.initEvent.call(core, 'link', link_dialog);
        contextLink.focusElement = context.anchor.caller.link.urlInput;

        /** empty memory */
        link_dialog = null, link_controller = null;
    },

    /** dialog */
    setDialog: function (core) {
        const lang = core.lang;
        const dialog = core.util.createElement('DIV');
        const icons = core.icons;

        dialog.className = 'se-dialog-content';
        dialog.style.display = 'none';
        let html = '' +
            '<form>' +
                '<div class="se-dialog-header">' +
                    '<button type="button" data-command="close" class="se-btn se-dialog-close" title="' + lang.dialogBox.close + '" aria-label="' + lang.dialogBox.close + '">' +
                        icons.cancel +
                    '</button>' +
                    '<span class="se-modal-title">' + lang.dialogBox.linkBox.title + '</span>' +
                '</div>' +
                core.context.anchor.forms.innerHTML +
                '<div class="se-dialog-footer">' +
                    '<button type="submit" class="se-btn-primary" title="' + lang.dialogBox.submitButton + '" aria-label="' + lang.dialogBox.submitButton + '"><span>' + lang.dialogBox.submitButton + '</span></button>' +
                '</div>' +
            '</form>';

        dialog.innerHTML = html;
        return dialog;
    },

    /** modify controller button */
    setController_LinkButton: function (core) {
        const lang = core.lang;
        const icons = core.icons;
        const link_btn = core.util.createElement('DIV');

        link_btn.className = 'se-controller se-controller-link';
        link_btn.innerHTML = '' +
            '<div class="se-arrow se-arrow-up"></div>' +
            '<div class="link-content"><span><a target="_blank" href=""></a>&nbsp;</span>' +
                '<div class="se-btn-group">' +
                    '<button type="button" data-command="update" tabindex="-1" class="se-btn se-tooltip">' +
                        icons.edit +
                        '<span class="se-tooltip-inner"><span class="se-tooltip-text">' + lang.controller.edit + '</span></span>' +
                    '</button>' +
                    '<button type="button" data-command="unlink" tabindex="-1" class="se-btn se-tooltip">' +
                        icons.unlink +
                        '<span class="se-tooltip-inner"><span class="se-tooltip-text">' + lang.controller.unlink + '</span></span>' +
                    '</button>' +
                    '<button type="button" data-command="delete" tabindex="-1" class="se-btn se-tooltip">' +
                        icons.delete +
                        '<span class="se-tooltip-inner"><span class="se-tooltip-text">' + lang.controller.remove + '</span></span>' +
                    '</button>' +
                '</div>' +
            '</div>';

        return link_btn;
    },

    /**
     * @Override dialog
     */
    open: function () {
        this.plugins.dialog.open.call(this, 'link', 'link' === this.currentControllerName);
    },

    submit: function (e) {
        this.showLoading();

        e.preventDefault();
        e.stopPropagation();

        try {
            const oA = this.plugins.anchor.createAnchor.call(this, this.context.anchor.caller.link, false);
            if (oA === null) return;

            if (!this.context.dialog.updateModal) {
                const selectedFormats = this.getSelectedElements();
                if (selectedFormats.length > 1) {
                    const oFormat = this.util.createElement(selectedFormats[0].nodeName);
                    oFormat.appendChild(oA);
                    if (!this.insertNode(oFormat, null, true)) return;
                } else {
                    if (!this.insertNode(oA, null, true)) return;
                }

                this.setRange(oA.childNodes[0], 0, oA.childNodes[0], oA.textContent.length);
            } else {
                // set range
                const textNode = this.context.link._linkAnchor.childNodes[0];
                this.setRange(textNode, 0, textNode, textNode.textContent.length);
            }
        } finally {
            this.plugins.dialog.close.call(this);
            this.closeLoading();
            // history stack
            this.history.push(false);
        }

        return false;
    },

    /**
     * @Override core
     */
    active: function (element) {
        if (!element) {
            if (this.controllerArray.indexOf(this.context.link.linkController) > -1) {
                this.controllersOff();
            }
        } else if (this.util.isAnchor(element) && element.getAttribute('data-image-link') === null) {
            if (this.controllerArray.indexOf(this.context.link.linkController) < 0) {
                this.plugins.link.call_controller.call(this, element);
            }
            return true;
        }

        return false;
    },

    /**
     * @Override dialog
     */
    on: function (update) {
        this.plugins.anchor.on.call(this, this.context.anchor.caller.link, update);
    },

    call_controller: function (selectionATag) {
        this.editLink = this.context.link._linkAnchor = this.context.anchor.caller.link.linkAnchor = selectionATag;
        const linkBtn = this.context.link.linkController;
        const link = linkBtn.querySelector('a');

        link.href = selectionATag.href;
        link.title = selectionATag.textContent;
        link.textContent = selectionATag.textContent;

        this.util.addClass(selectionATag, 'on');
        this.setControllerPosition(linkBtn, selectionATag, 'bottom', {left: 0, top: 0});
        this.controllersOn(linkBtn, selectionATag, 'link', this.util.removeClass.bind(this.util, this.context.link._linkAnchor, 'on'));
    },

    onClick_linkController: function (e) {
        e.stopPropagation();

        const command = e.target.getAttribute('data-command') || e.target.parentNode.getAttribute('data-command');
        if (!command) return;

        e.preventDefault();

        if (/update/.test(command)) {
            this.plugins.dialog.open.call(this, 'link', true);
        } else if (/unlink/.test(command)) {
            const sc = this.util.getChildElement(this.context.link._linkAnchor, function (current) { return current.childNodes.length === 0 || current.nodeType === 3; }, false);
            const ec = this.util.getChildElement(this.context.link._linkAnchor, function (current) { return current.childNodes.length === 0 || current.nodeType === 3; }, true);
            this.setRange(sc, 0, ec, ec.textContent.length);
            this.nodeChange(null, null, ['A'], false);
        } else {
            /** delete */
            this.util.removeItem(this.context.link._linkAnchor);
            this.context.anchor.caller.link.linkAnchor = null;
            this.focus();

            // history stack
            this.history.push(false);
        }

        this.controllersOff();
    },

    /**
     * @Override dialog
     */
    init: function () {
        this.context.link.linkController.style.display = 'none';
        this.plugins.anchor.init.call(this, this.context.anchor.caller.link);
    }
};
