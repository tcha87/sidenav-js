import { AnimationSupport } from './animation-support.js';
import { TransitionSupport } from './transition-support.js';

export class UI {
    static animationEnd(element, callback, timeout) {
        timeout = timeout || 300;
        if (AnimationSupport.supported) {
            let onEnd = function() {
                callback.call(element);
                element.removeEventListener(AnimationSupport.end, onEnd);
            };
            element.addEventListener(AnimationSupport.end, onEnd);
        } else {
            window.setTimeout(callback, timeout);
        }
    }

    static transitionEnd(element, callback, timeout) {
        timeout = timeout || 300;
        if (TransitionSupport.supported) {
            let onEnd = function() {
                callback.call(element);
                element.removeEventListener(TransitionSupport.end, onEnd);
            };
            element.addEventListener(TransitionSupport.end, onEnd);
        } else {
            window.setTimeout(callback, timeout);
        }
    }
}
