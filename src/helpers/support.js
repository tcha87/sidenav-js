// https://gist.github.com/Integralist/3938408

export class Support {
    static get propertyName() {
        return;
    }

    static get propertyStart() {
        return;
    }

    static get propertyEnd() {
        return;
    }

    static check() {
        let supported = false;
        let prefixes = ['webkit', 'Moz', 'O', ''];
        let limit = prefixes.length;
        let doc = document.documentElement.style;
        let prefix;
        let start;
        let end;

        while (limit--) {
            // If the compliant browser check (in this case an empty string value)
            // then we need to check against different string
            // (propertyName and not prefix + PropertyName)
            if (!prefixes[limit]) {
                // If not undefined then we've found a successful match
                if (doc[this.propertyName] !== undefined) {
                    prefix = prefixes[limit].toLowerCase();
                    start = this.propertyStart.toLowerCase();
                    end = this.propertyEnd.toLowerCase();
                    supported = true;
                    break;
                }
            } else {
                // Other brower prefixes to be checked
                // If not undefined then we've found a successful match
                if (doc[`${prefixes[limit]}${this.propertyName}`] !== undefined) {
                    prefix = prefixes[limit];
                    switch (limit) {
                    case 0:
                        //  webkitPropertyStart && webkitPropertyEnd
                        start = prefix.toLowerCase() + this.propertyStart;
                        end = prefix.toLowerCase() + this.propertyEnd;
                        supported = true;
                        break;
                    case 1:
                        // propertystart && propertyend
                        start = this.propertyStart.toLowerCase();
                        end = this.propertyEnd.toLowerCase();
                        supported = true;
                        break;
                    case 2:
                        // opropertystart && opropertyend
                        start = prefix.toLowerCase() + this.propertyStart.toLowerCase();
                        end = prefix.toLowerCase() + this.propertyEnd.toLowerCase();
                        supported = true;
                        break;
                    default:
                        supported = false;
                        break;
                    }
                }
            }
        }
        this.supported = supported;
        this.prefix = prefix;
        this.start = start;
        this.end = end;
    }
}
