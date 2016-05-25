import { Support } from './support.js';

export class TransitionSupport extends Support {
    static get propertyName() {
        return 'Transition';
    }

    static get propertyStart() {
        return 'TransitionStart';
    }

    static get propertyEnd() {
        return 'TransitionEnd';
    }
}

TransitionSupport.check();
