(function (scope) {
    // https://gist.github.com/Integralist/3938408
    var Animation = (function(){
        /*
            webkitAnimationName => Safari/Chrome
            MozAnimationName => Mozilla Firefox
            OAnimationName => Opera
            animationName => compliant browsers (inc. IE10)
         */
        var supported = false;
        var prefixes = ['webkit', 'Moz', 'O', ''];
        var limit = prefixes.length;
        var doc = document.documentElement.style;
        var prefix, start, end;

        while (limit--) {
            // If the compliant browser check (in this case an empty string value) then we need to check against different string (animationName and not prefix + AnimationName)
            if (!prefixes[limit]) {
                // If not undefined then we've found a successful match
                if (doc['animationName'] !== undefined) {
                    prefix = prefixes[limit];
                    start = 'animationstart';
                    end = 'animationend';
                    supported = true;
                    break;
                }
            }
            // Other brower prefixes to be checked
            else {
                // If not undefined then we've found a successful match
                if (doc[prefixes[limit] + 'AnimationName'] !== undefined) {
                    prefix = prefixes[limit];

                    switch (limit) {
                        case 0:
                            //  webkitAnimationStart && webkitAnimationEnd
                            start = prefix.toLowerCase() + 'AnimationStart';
                            end = prefix.toLowerCase() + 'AnimationEnd';
                            supported = true;
                            break;

                        case 1:
                            // animationstart && animationend
                            start = 'animationstart';
                            end = 'animationend';
                            supported = true;
                            break;

                        case 2:
                            // oanimationstart && oanimationend
                            start = prefix.toLowerCase() + 'animationstart';
                            end = prefix.toLowerCase() + 'animationend';
                            supported = true;
                            break;
                    }

                    break;
                }
            }
        }

        return {
            supported: supported,
            prefix: prefix,
            start: start,
            end: end
        };
    })();

    var Transition = (function(){
        /*
            webkitTransition => Safari/Chrome
            MozTransition => Mozilla Firefox
            OTransition => Opera
            transition => compliant browsers (inc. IE10)
         */
        var supported = false;
        var prefixes = ['webkit', 'Moz', 'O', ''];
        var limit = prefixes.length;
        var doc = document.documentElement.style;
        var prefix, start, end;

        while (limit--) {
            // If the compliant browser check (in this case an empty string value) then we need to check against different string (animationName and not prefix + AnimationName)
            if (!prefixes[limit]) {
                // If not undefined then we've found a successful match
                if (doc['transition'] !== undefined) {
                    prefix = prefixes[limit];
                    start = 'transitionstart';
                    end = 'transitionend';
                    supported = true;
                    break;
                }
            }
            // Other brower prefixes to be checked
            else {
                // If not undefined then we've found a successful match
                if (doc[prefixes[limit] + 'Transition'] !== undefined) {
                    prefix = prefixes[limit];

                    switch (limit) {
                        case 0:
                            //  webkitTransitionStart && webkitTransitionEnd
                            start = prefix.toLowerCase() + 'TransitionStart';
                            end = prefix.toLowerCase() + 'TransitionEnd';
                            supported = true;
                            break;

                        case 1:
                            // animationstart && animationend
                            start = 'transitionstart';
                            end = 'transitionend';
                            supported = true;
                            break;

                        case 2:
                            // otransitionstart && otransitionend
                            start = prefix.toLowerCase() + 'transitionstart';
                            end = prefix.toLowerCase() + 'transitionend';
                            supported = true;
                            break;
                    }

                    break;
                }
            }
        }

        return {
            supported: supported,
            prefix: prefix,
            start: start,
            end: end
        };
    })();

    function _animationEnd(element, callback, timeout) {
        timeout = timeout || 300;
        if (Animation.supported) {
            function onEnd() {
                callback.call(element);
                element.removeEventListener(Animation.end, onEnd);
            }
            element.addEventListener(Animation.end, onEnd);
        } else {
            window.setTimeout(callback, timeout);
        }
    }

    function _transitionEnd(element, callback, timeout) {
        timeout = timeout || 300;
        if (Transition.supported) {
            function onEnd() {
                callback.call(element);
                element.removeEventListener(Transition.end, onEnd);
            }
            element.addEventListener(Transition.end, onEnd);
        } else {
            window.setTimeout(callback, timeout);
        }
    }

    function BackDrop () {
        var drop = document.createElement('div');
            drop.classList.add(BackDrop.dropClass);

        this.element = drop;
    }

    BackDrop.dropClass = 'back-drop';

    BackDrop.dropHiddenClass = BackDrop.dropClass + '--hide';

    BackDrop.prototype.show = function () {
        if (BackDrop.current !== this) {
            if (BackDrop.current) {
                BackDrop.current.hide();
            }
            var drop = this.element;

            if (document.body.firstElementChild) {
                document.body.insertBefore(drop, document.body.firstElementChild);
            } else {
                document.body.appendChild(drop);
            }
            BackDrop.current = this;
        }
    }

    BackDrop.prototype.onTap = function (callback) {
        if (callback) {
            scope.Gestures.addEventListener(this.element, 'tap', callback);
        } else {
            scope.Gestures.removeEventListener(this.element, 'tap');
        }
    }

    BackDrop.prototype.hide = function () {
        var that = this,
            drop = that.element;
        _animationEnd(drop, function () {
            drop.parentNode.removeChild(drop);
            drop.classList.remove(BackDrop.dropHiddenClass);
        });
        drop.classList.add(BackDrop.dropHiddenClass);
        if (BackDrop.current === this) {
            BackDrop.current = undefined;
        }
    }

    function _onDrag(sidenav, ev) {
        var options = sidenav.options, element = sidenav.element;
        if (sidenav.swiping || options.open
                || (ev.dx > 0 && options.position == 'left' && ev.x <= options.swipeSensibility)
                || (ev.dx < 0 && options.position == 'right' && window.innerWidth - ev.x <= options.swipeSensibility)) {
            if (!sidenav.swiping) {
                element.style.display = 'block';
                sidenav.__saveStyle = sidenav.element.getAttribute('style');
                sidenav.element.classList.add(options.swipeClass);
                if (!options.open) {
                    sidenav.element.classList.remove(options.hiddenClass);
                    SideNav.backDrop.show();
                }
                sidenav.swiping = true;
            }
            var x;
            if (!options.open) {
                if (options.position == 'left') {
                    x = Math.min( -Math.max(element.offsetWidth - ev.dx, -element.offsetWidth), 0);
                } else {
                    x = Math.max(Math.min(element.offsetWidth + ev.dx, element.offsetWidth), 0);
                }
            } else {
                if (options.position == 'left') {
                    x = Math.max(Math.min(ev.dx, 0), -element.offsetWidth);
                } else {
                    x = Math.min(Math.max(ev.dx, 0), element.offsetWidth);
                }
            }
            element.style.webkitTransform = element.style.transform = 'translate3d(' + x + 'px, 0, 0)';
            if ((options.position == 'left' && x <= -element.offsetWidth) || (options.position == 'right' && x >= element.offsetWidth)) {
                _onDragStop(sidenav, ev);
            }
        } else {
            sidenav.swiping = false;
        }
    }

    function _onDragStop(sidenav, ev) {
        if (sidenav.swiping) {
            sidenav.swiping = false;
            var options = sidenav.options, element = sidenav.element;
            if (sidenav.__saveStyle) {
                element.setAttribute('style', sidenav.__saveStyle);
            } else {
                element.removeAttribute('style');
            }
            delete sidenav.__saveStyle;
            element.classList.remove(options.swipeClass);
            if (SideNav.lastEvent.ddx >= 0 && options.position == 'left' || SideNav.lastEvent.ddx <= 0 && options.position == 'right') {
                sidenav.show();
            } else {
                if (!SideNav.current) {
                    SideNav.backDrop.hide();
                }
                sidenav.hide(true);
            }
        }
    }

    var defaults = {
        'class': 'sidenav',
        'position': 'left',
        'swipe': true,
        'swipeSensibility': 50,
    }

    function _options(options) {
        options = options || {};
        for (var k in defaults) {
            if (options[k] === undefined) {
                options[k] = defaults[k];
            }
        }
        options.positionClass = options['class'] + '--' + options['position'];
        options.hiddenClass = options['class'] + '--hide';
        options.transitionClass = options['class'] + '--transition';
        options.swipeClass = options['class'] + '--swiping';
        return options;
    }

    function SideNav(element, options) {
        var that = this;
        options = _options(options);
        if (element instanceof HTMLElement) {
            options.element = element;
        }
        that.options = options;
        that.element = options.element;
        that.element.isSideNav = true;
        that.element.classList.add(options['class']);
        that.element.classList.add(options['positionClass']);
        if (options.open) {
            that.show(true);
        } else {
            that.hide(true);
        }
        that.useTransition = true;
        that.element.classList.add(options['transitionClass']);
        SideNav.add(that);
    }

    SideNav.backDrop = new BackDrop();
    SideNav.backDrop.onTap(function () {
        if (SideNav.current) {
            SideNav.current.hide();
        }
    });

    SideNav.add = function(obj) {
        SideNav.sidenavs = SideNav.sidenavs || [];
        if (!SideNav.listening && obj.options.swipe) {
            SideNav.listen();
        }
        SideNav.sidenavs.push(obj);
    }

    SideNav.listen = function () {
        if (!this.listening) {
            this.listening = true;
            scope.Gestures.addEventListener(document, 'track', function (ev) {
                var sidenavs = SideNav.current ? [SideNav.current] : SideNav.sidenavs;
                for (var k = 0, len = sidenavs.length; k < len; k++) {
                    var sn = sidenavs[k];
                    if (sn.options.swipe) {
                        if (ev.state == 'track') {
                            SideNav.lastEvent = ev;
                            _onDrag(sn, ev);
                        } else if (ev.state == 'end') {
                            _onDragStop(sn, ev);
                        }
                    }
                }
                if (ev.state == 'end') {
                    delete SideNav.lastEvent;
                }
            });
        }
    }

    SideNav.prototype.show = function SideNavShow(force) {
        if (SideNav.current && SideNav.current !== this) {
            SideNav.current.hide();
        }
        var that = this, options = this.options, element = this.element;
        if (!options.open || force) {
            options.open = true;
            element.style.display = 'block';
            element.offsetWidth; //force redraw
            element.classList.remove(options.hiddenClass);
            SideNav.backDrop.show();
            SideNav.current = that;
            if (!force) {
                var event = document.createEvent('Event');
                    event.initEvent('open', true, false);
                element.dispatchEvent(event);
            }
        }
    }

    SideNav.prototype.hide = function SideNavHide(force) {
        var that = this, options = this.options, element = this.element;
        if (options.open || force) {
            options.open = false;
            if (that.useTransition && Transition.supported) {
                _transitionEnd(element, function () {
                    element.style.display = 'none';
                });
            } else {
                element.style.display = 'none';
            }
            element.classList.add(options.hiddenClass);
            if (SideNav.current === that) {
                SideNav.current = undefined;
                SideNav.backDrop.hide();
            }
            if (!force) {
                var event = document.createEvent('Event');
                    event.initEvent('close', true, false);
                element.dispatchEvent(event);
            }
        }
    }

    SideNav.prototype.toggle = function SideNavToggle() {
        if (this.options.open) {
            this.hide();
        } else {
            this.show();
        }
    }

    // export
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = SideNav;
    } else {
        scope.SideNav = SideNav;
    }

})(this);
