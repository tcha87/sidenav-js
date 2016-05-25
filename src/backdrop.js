import Gestures from 'chialab/gestures';
import { register, DNABaseComponent } from 'dna/components';
import { UI } from './helpers/ui.js';
import css from './backdrop.css';

let current;

export class BackDropComponent extends DNABaseComponent {
    static get css() {
        return css;
    }

    get dropClass() {
        return 'back-drop';
    }

    get dropHiddenClass() {
        return `${this.dropClass}--hide`;
    }

    createdCallback() {
        this.classList.add(this.dropClass);
    }

    show() {
        if (current !== this) {
            if (current) {
                current.hide();
            }
            if (document.body.firstElementChild) {
                document.body.insertBefore(this, document.body.firstElementChild);
            } else {
                document.body.appendChild(this);
            }
            current = this;
        }
    }

    hide() {
        UI.animationEnd(this, () => {
            this.parentNode.removeChild(this);
            this.classList.remove(this.dropHiddenClass);
        });
        this.classList.add(this.dropHiddenClass);
        if (current === this) {
            current = undefined;
        }
    }

    onTap(callback) {
        if (callback) {
            Gestures.addEventListener(this, 'tap', callback);
        } else {
            Gestures.removeEventListener(this, 'tap');
        }
    }
}

export const BackDrop = register('back-drop', {
    prototype: BackDropComponent,
});
