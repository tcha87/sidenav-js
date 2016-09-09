import Gestures from 'chialab/gestures/index.js';
import { register, BaseComponent } from 'dna/components';
import { TransitionSupport } from './helpers/transition-support.js';
import { UI } from './helpers/ui.js';
import { BackDrop } from './backdrop.js';
import css from './sidenav.css';

let sidenavs = [];

function scrollParent(node, until = document.body) {
    while (node && node !== until) {
        if (node.scrollHeight > node.offsetHeight) {
            let style = window.getComputedStyle(node);
            let overflow = style.overflow;
            let overflowY = style['overflow-y'];
            if (
                overflow === 'auto' ||
                overflow === 'scroll' ||
                overflowY === 'auto' ||
                overflowY === 'scroll'
            ) {
                return node;
            }
        }
        node = node.parentNode;
    }
    return null;
}

function _onDragStop(lastEvent) {
    if (this.swiping) {
        this.swiping = false;
        let options = this.options;
        if (this.__saveStyle) {
            this.setAttribute('style', this.__saveStyle);
        } else {
            this.removeAttribute('style');
        }
        delete this.__saveStyle;
        this.classList.remove(options.swipeClass);
        if ((lastEvent.ddx >= 0 && options.position === 'left') ||
            (lastEvent.ddx <= 0 && options.position === 'right')) {
            this.show();
        } else {
            this.hide(true);
        }
    }
}

function _onDrag(ev, lastEvent) {
    let options = this.options;
    if (this.swiping ||
        options.open ||
        (
            ev.dx > 0 && options.position === 'left' &&
            ev.x <= options.swipeSensibility) ||
        (
            ev.dx < 0 && options.position === 'right' &&
            window.innerWidth - ev.x <= options.swipeSensibility)) {
        if (!this.swiping) {
            this.style.display = 'block';
            this.__saveStyle = this.getAttribute('style');
            this.classList.add(options.swipeClass);
            if (!options.open) {
                this.classList.remove(options.hiddenClass);
                this.BACK_DROP.show();
            }
            this.swiping = true;
        }
        let x;
        if (!options.open) {
            if (options.position === 'left') {
                x = Math.min(-Math.max(this.offsetWidth - ev.dx, -this.offsetWidth), 0);
            } else {
                x = Math.max(Math.min(this.offsetWidth + ev.dx, this.offsetWidth), 0);
            }
        } else {
            if (options.position === 'left') {
                x = Math.max(Math.min(ev.dx, 0), -this.offsetWidth);
            } else {
                x = Math.min(Math.max(ev.dx, 0), this.offsetWidth);
            }
        }
        this.style.webkitTransform = this.style.transform = `translate3d(${x}px, 0, 0)`;
        if ((options.position === 'left' && x <= -this.offsetWidth) ||
            (options.position === 'right' && x >= this.offsetWidth)) {
            _onDragStop.call(this, ev, lastEvent);
        }
    } else {
        this.swiping = false;
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

export class SideNavComponent extends BaseComponent {
    static get css() {
        return css;
    }

    static add(obj) {
        sidenavs.push(obj);
    }

    listen() {
        if (!this.listening) {
            this.listening = true;
            let wait;
            let waitTimeout;
            let lastEvent;
            let scrollPanel;
            let onScroll = function(ev) {
                ev.target.removeEventListener('scroll', onScroll);
                clearTimeout(waitTimeout);
            };
            Gestures.addEventListener(document, 'track', (ev) => {
                if (this.options.swipe) {
                    if (ev.state === 'start') {
                        scrollPanel = scrollParent(ev.target, this.parentNode);
                        if (scrollPanel) {
                            scrollPanel.addEventListener('scroll', onScroll);
                        }
                        wait = this.options.open;
                        if (wait) {
                            waitTimeout = setTimeout(() => {
                                if (scrollPanel) {
                                    scrollPanel.removeEventListener('scroll', onScroll);
                                }
                                wait = false;
                            }, 100);
                        }
                    } else if (ev.state === 'track') {
                        if (!wait) {
                            _onDrag.call(this, ev, lastEvent);
                        }
                        lastEvent = ev;
                    } else if (ev.state === 'end') {
                        if (!wait) {
                            _onDragStop.call(this, lastEvent);
                        }
                        clearTimeout(waitTimeout);
                        lastEvent = undefined;
                    }
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
        super.createdCallback();
        this.listen();
        this.BACK_DROP = new BackDrop();
        this.BACK_DROP.onTap(() => {
            this.hide();
        });
        this.options = this.defaultOptions;
        SideNavComponent.add(this);
    }

    show(force) {
        if (this.__hidingAnimation) {
            this.__hidingAnimation.cancel();
            delete this.__hidingAnimation;
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
            this.BACK_DROP.show();
            if (!force) {
                this.trigger('open');
            }
        }
    }

    hide(force) {
        let options = this.options;
        let wasOpen = options.open;
        if (options.open || force) {
            options.open = false;
            if (this.useTransitionSupport && TransitionSupport.supported) {
                this.__hidingAnimation = UI.transitionEnd(this, () => {
                    this.style.display = 'none';
                });
            } else {
                this.style.display = 'none';
            }
            if (options.hiddenClass) {
                this.classList.add(options.hiddenClass);
            }
            this.BACK_DROP.hide();
            if (!force || wasOpen) {
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
