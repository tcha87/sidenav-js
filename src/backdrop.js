import Gestures from 'chialab/gestures/index.js';
import { register, DNABaseComponent } from 'dna/components';
import { UI } from './helpers/ui.js';
import css from './backdrop.css';

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
        super.createdCallback();
        this.classList.add(this.dropClass);
    }

    show() {
        if (this.__hidingAnimation) {
            this.__hidingAnimation.cancel();
            delete this.__hidingAnimation;
        }
        let body = document.body;
        if (!this.parentNode) {
            if (body.firstElementChild) {
                body.insertBefore(this, body.firstElementChild);
            } else {
                body.appendChild(this);
            }
        }
        this.classList.remove(this.dropHiddenClass);
    }

    hide() {
        this.__hidingAnimation = UI.animationEnd(this, () => {
            if (this.parentNode) {
                this.parentNode.removeChild(this);
            }
        });
        this.classList.add(this.dropHiddenClass);
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
