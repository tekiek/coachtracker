/*
        EventManager is an instance of EventManagerBase, it's for handling non-DOM events.

        Callbacks are passed any data the firing funtion wishes to pass along.

        Target is passed only in cases where there is a relevant DOM element to pass.

        For example:

        var ObjectOne = function() {
                EventManager.observe('superposter.save_done', function( data, target ) {
                        // stuff with data

                        if (target) {
                                // stuff with target, maybe
                        }
                } );
        }

        var Superposter = function() {
                this.save_ok = function() {
        
                        EventManager.fire('superposter.save_done', data )
                }
        }

**/

function EventManagerBase() {
        this.EVENTS = {};
}


EventManagerBase.prototype = {

        constructor: EventManagerBase,

        /* Observe an event */
        observe: function (ev, fn) {

                if (!this.EVENTS[ev]) this.EVENTS[ev] = {
                        listeners: [],
                        one_time_listeners: []
                };
                if (this.EVENTS[ev].listeners.indexOf(fn) == -1) this.EVENTS[ev].listeners.push(fn);
        },

        /* Observe an event only once, then stop observing */
        observe_once: function (ev, fn) {

                if (!this.EVENTS[ev]) this.EVENTS[ev] = {
                        listeners: [],
                        one_time_listeners: []
                };
                if (this.EVENTS[ev].one_time_listeners.indexOf(fn) == -1) this.EVENTS[ev].one_time_listeners.push(fn);
        },

        stop_observing: function (ev, fn) {
                if (this.EVENTS[ev]) {
                        var i = this.EVENTS[ev].listeners.indexOf(fn);
                        if (i > -1) this.EVENTS[ev].listeners.splice(i, 1);
                        else return false;
                        return true;
                }
                else return false;
        },

        fire: function (ev, data, target) {

                // carried over from edit_post.fire_event 
                window[ev] = true;

                if (typeof data == 'undefined') data = {};
                if (this.EVENTS[ev]) {
                        var listeners = this.EVENTS[ev].listeners;

                        // fire perenial listeners
                        for (var i = 0; i < listeners.length; i++)
                                this._single_fire( listeners[i], data, target );

                        // fire one time listeners and then remove the listener
                        for (var handler; handler = this.EVENTS[ev].one_time_listeners.pop();)
                                this._single_fire( handler, data, target );
                }
        },

        _single_fire: function(handler, data, target) {
                try {
                        handler(data, target);
                }
                catch (err) {
                        console.dir(err);
                }
        }
};

var EventManager = new EventManagerBase();