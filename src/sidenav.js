import Gestures from 'chialab/gestures';
import { register, DNABaseComponent } from 'dna/components';
import { TransitionSupport } from './helpers/transition-support.js';
import { UI } from './helpers/ui.js';
import { BackDrop } from './backdrop.js';
import css from './sidenav.css';

let current;
let lastEvent;
let sidenavs = [];

const BACK_DROP = new BackDrop();
BACK_DROP.onTap(() => {
    if (current) {
        current.hide();
    }
});

function _onDragStop(sidenav) {
    if (sidenav.swiping) {
        sidenav.swiping = false;
        let options = sidenav.options;
        let element = sidenav;
        if (sidenav.__saveStyle) {
            element.setAttribute('style', sidenav.__saveStyle);
        } else {
            element.removeAttribute('style');
        }
        delete sidenav.__saveStyle;
        element.classList.remove(options.swipeClass);
        if ((lastEvent.ddx >= 0 && options.position === 'left') ||
            (lastEvent.ddx <= 0 && options.position === 'right')) {
            sidenav.show();
        } else {
            if (!current) {
                BACK_DROP.hide();
            }
            sidenav.hide(true);
        }
    }
}

function _onDrag(sidenav, ev) {
    let options = sidenav.options;
    let element = sidenav;
    if (sidenav.swiping ||
        options.open ||
        (
            ev.dx > 0 && options.position === 'left' &&
            ev.x <= options.swipeSensibility) ||
        (
            ev.dx < 0 && options.position === 'right' &&
            window.innerWidth - ev.x <= options.swipeSensibility)) {
        if (!sidenav.swiping) {
            element.style.display = 'block';
            sidenav.__saveStyle = sidenav.getAttribute('style');
            sidenav.classList.add(options.swipeClass);
            if (!options.open) {
                sidenav.classList.remove(options.hiddenClass);
                BACK_DROP.show();
            }
            sidenav.swiping = true;
        }
        let x;
        if (!options.open) {
            if (options.position === 'left') {
                x = Math.min(-Math.max(element.offsetWidth - ev.dx, -element.offsetWidth), 0);
            } else {
                x = Math.max(Math.min(element.offsetWidth + ev.dx, element.offsetWidth), 0);
            }
        } else {
            if (options.position === 'left') {
                x = Math.max(Math.min(ev.dx, 0), -element.offsetWidth);
            } else {
                x = Math.min(Math.max(ev.dx, 0), element.offsetWidth);
            }
        }
        element.style.webkitTransform = element.style.transform = `translate3d(${x}px, 0, 0)`;
        if ((options.position === 'left' && x <= -element.offsetWidth) ||
            (options.position === 'right' && x >= element.offsetWidth)) {
            _onDragStop(sidenav, ev);
        }
    } else {
        sidenav.swiping = false;
    }
}

function _mergeOptions(defaults, options) {
    options = options || {};
    for (let k in defaults) {
        if (options[k] === undefined) {
            options[k] = defaults[k];
        }
    }
    options.positionClass = `${options.class}--${options.position}`;
    options.hiddenClass = `${options.class}--hide`;
    options.transitionClass = `${options.class}--transition`;
    options.swipeClass = `${options.class}--swiping`;
    return options;
}

export class SideNavComponent extends DNABaseComponent {
    static get css() {
        return css;
    }

    static add(obj) {
        if (!this.listening && obj.options.swipe) {
            this.listen();
        }
        sidenavs.push(obj);
    }

    static listen() {
        if (!this.listening) {
            this.listening = true;
            Gestures.addEventListener(document, 'track', (ev) => {
                let _sidenavs = current ? [current] : sidenavs;
                for (let k = 0, len = _sidenavs.length; k < len; k++) {
                    let sn = _sidenavs[k];
                    if (sn.options.swipe) {
                        if (ev.state === 'track') {
                            lastEvent = ev;
                            _onDrag(sn, ev);
                        } else if (ev.state === 'end') {
                            _onDragStop(sn, ev);
                        }
                    }
                }
                if (ev.state === 'end') {
                    lastEvent = undefined;
                }
            });
        }
    }

    get defaultOptions() {
        return {
            class: 'sidenav',
            position: 'left',
            swipe: true,
            swipeSensibility: 50,
        };
    }

    get options() {
        return this.__options || {};
    }

    set options(options) {
        let _old = this.options;
        let _options = _mergeOptions(this.defaultOptions, options);
        this.__options = _options;
        if (_options.class !== _old.class) {
            if (_old.class) {
                this.classList.remove(_old.class);
            }
            this.classList.add(_options.class);
        }
        if (_options.positionClass !== _old.positionClass) {
            if (_old.positionClass) {
                this.classList.remove(_old.positionClass);
            }
            this.classList.add(_options.positionClass);
        }
        this.useTransitionSupport = false;
        if (_options.open) {
            this.show(true);
        } else {
            this.hide(true);
        }
        this.useTransitionSupport = true;
        if (_options.transitionClass !== _old.transitionClass) {
            if (_old.transitionClass) {
                this.classList.remove(_old.transitionClass);
            }
            this.classList.add(_options.transitionClass);
        }
    }

    createdCallback() {
        this.options = this.defaultOptions;
        SideNavComponent.add(this);
    }

    show(force) {
        if (current && current !== this) {
            current.hide();
        }
        let options = this.options;
        if (!options.open || force) {
            options.open = true;
            this.style.display = 'block';
            if (this.offsetWidth) {
                // force redraw
            }
            if (options.hiddenClass) {
                this.classList.remove(options.hiddenClass);
            }
            BACK_DROP.show();
            current = this;
            if (!force) {
                this.trigger('open');
            }
        }
    }

    hide(force) {
        let options = this.options;
        if (options.open || force) {
            options.open = false;
            if (this.useTransitionSupport && TransitionSupport.supported) {
                UI.transitionEnd(this, () => {
                    this.style.display = 'none';
                });
            } else {
                this.style.display = 'none';
            }
            if (options.hiddenClass) {
                this.classList.add(options.hiddenClass);
            }
            if (current === this) {
                current = undefined;
                BACK_DROP.hide();
            }
            if (!force) {
                this.trigger('close');
            }
        }
    }

    toggle() {
        if (this.options.open) {
            this.hide();
        } else {
            this.show();
        }
    }
}

export const SideNav = register('side-nav', {
    prototype: SideNavComponent,
});


export const create = function(...args) {
    return new SideNav(...args);
};
