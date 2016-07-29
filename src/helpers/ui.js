import { AnimationSupport } from './animation-support.js';
import { TransitionSupport } from './transition-support.js';

export class UI {
    static animationEnd(element, callback, timeout) {
        timeout = timeout || 300;
        let canceled = false;
        if (AnimationSupport.supported) {
            let onEnd = function() {
                if (!canceled) {
                    callback.call(element);
                }
                element.removeEventListener(AnimationSupport.end, onEnd);
            };
            element.addEventListener(AnimationSupport.end, onEnd);
        } else {
            window.setTimeout(() => {
                if (!canceled) {
                    callback.call(element);
                }
            }, timeout);
        }
        return {
            cancel() {
                canceled = true;
            },
        };
    }

    static transitionEnd(element, callback, timeout) {
        timeout = timeout || 300;
        let canceled = false;
        if (TransitionSupport.supported) {
            let onEnd = function() {
                if (!canceled) {
                    callback.call(element);
                }
                element.removeEventListener(TransitionSupport.end, onEnd);
            };
            element.addEventListener(TransitionSupport.end, onEnd);
        } else {
            window.setTimeout(() => {
                if (!canceled) {
                    callback.call(element);
                }
            }, timeout);
        }
        return {
            cancel() {
                canceled = true;
            },
        };
    }
}
