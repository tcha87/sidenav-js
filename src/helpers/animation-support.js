import { Support } from './support.js';

export class AnimationSupport extends Support {
    static get propertyName() {
        return 'Animation';
    }

    static get propertyStart() {
        return 'AnimationStart';
    }

    static get propertyEnd() {
        return 'AnimationEnd';
    }
}

AnimationSupport.check();
