'use strict';

/**
 * A Class that represents the Project Viewer main view
 */
class MainElement extends HTMLElement {

    createdCallback () {
        this.setAttribute('tabindex', '-1');

        atom.config.observe('project-viewer2.autohide', (value) => {
            if (value) {
                this.classList.add('autohide');
            } else {
                this.classList.remove('autohide');
            }
        });
    }

    attachedCallback () {
        this.addEventListener('click', () => {
            this.setFocus();
        });

        this.appendElement(
            this.model.handler
        );
        this.appendElement(
            this.model.topic
        );
        this.appendElement(
            this.model.groupsPool
        );
        this.appendElement(
            this.model.statusInfo
        );
    }

    detachedCallback () {}

    initialize (model) {
        if (!model) {
            return;
        }

        this.model = model;

        this.appendElement(
            this.model.loader
        );

        return this;
    }

    serialize () {
        return this.model;
    }

    setFocus () {
        this.focus();
        this.upDisposable = atom.commands.add(this, {
            'core:move-up': this.moveUp.bind(this)
        });
        this.downDisposable = atom.commands.add(this, {
            'core:move-down': this.moveDown.bind(this)
        });
    }

    toggleFocus () {
        if (document.activeElement === this) {
            atom.workspace.getActivePane().activate();
            this.downDisposable && this.downDisposable.dispose();
            this.upDisposable && this.upDisposable.dispose();
            return;
        } else {
            this.setFocus();
        }
    }

    moveUp (evt) {
        let selected,
            previous;

        evt.stopPropagation();
        selected = evt.target.querySelector('li.selected');

        if (selected === null) {
            evt.target.querySelector('li').classList.add('selected');
            return;
        }

        previous = evt.target.querySelector('li.selected').previousSibling;

        if (previous !== null) {
            previous.classList.add('selected');
            selected.classList.remove('selected');
        }
    }

    moveDown (evt) {
        let selected,
            next;

        evt.stopPropagation();
        selected = evt.target.querySelector('li.selected');

        if (selected === null) {
            evt.target.querySelector('li').classList.add('selected');
            return;
        }

        next = evt.target.querySelector('li.selected').nextSibling;

        if (next !== null) {
            next.classList.add('selected');
            selected.classList.remove('selected');
        }
    }

    appendElement (elementModel) {
        this.appendChild(
            atom.views.getView(elementModel)
        );
    }

}

module.exports = document.registerElement(
    'project-viewer',
    {
        prototype: MainElement.prototype
    }
);