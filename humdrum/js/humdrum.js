/*jshint strict:true, undef:true, eqeqeq:true, laxbreak:true, -W055 */
/*globals $, console, document, Handlebars, localStorage */

var Humdrum = (function (hd) {
    "use strict";
    
    /**
     * Javascript class inheritance.
     *
     * This uses a technique of copying the prototype and properties of the base class
     * to the derive class.
     *
     * @example
     * Object.inherit([derive], base);
     */
    (function () {
        var getClassName = function(clazz) {
            var name;
            var result = /(this)\.inherit\(([\w\.]+)[,|\)]/.exec(clazz.toString());
            if (result === null) {
                result = /(function)\s+(\w+).*/g.exec(clazz.toString());
                //if (result == null) {
                    //throw new Error("cannot reference undeclared class");
                //}
            }
            name = result[2];
            return name;
        };

        var derive = function(clazz, base) {
            if (clazz.$base)
                return;

            // Derive class from from base classes.
            if (base) {
                base.prototype.$init = true;
                clazz.prototype = new base();
                delete base.prototype.$init;
                clazz.prototype.constructor = clazz;
                Object.defineProperty(clazz, '$base', {
                    get: function() {return base;}
                });
            }
            else {
                Object.defineProperty(clazz, '$base', {
                    get: function() {return Object;}
                });
            }
        };

        /**
         * inherit function attached to all objects
         *
         * @param {class} clazz     The derive class.
         * @param {class} base      The base class.
         *
         * @example
         * Object.inherit([derive], base);
         */
        if (!Object.hasOwnProperty('inherit')) {
            Object.defineProperty(Object.prototype, 'inherit', {
                value: function(clazz, base) {

                    // Derive new class from the base class.
                    derive(clazz, base);

                    // Set up the instance.
                    for (var property in clazz.prototype) {	
                        if (property !== '$init') {
                            Object.defineProperty(this, property, Object.getOwnPropertyDescriptor(clazz.prototype, property));
                        } else {
                            delete clazz.prototype[property];
                        }
                    }
                    this.$base = (base) ? clazz.prototype : {};
                    this.$class = getClassName(clazz);
                }
            });
        }
        
        /**
         * creates a class instance.
         *
         * @example
         * Myclass.create([arg1[, arg2[, ...]]]);
         */
        if (!Function.hasOwnProperty('create')) {
            Function.prototype.create = function() {
                function clazz() {}
                clazz.prototype = this.prototype;
                var obj = new clazz();
                this.apply(obj, Array.prototype.slice.call(arguments));
                return obj;
            };    
        }
    }());
    
    
	/**
	 * Creates a delegate.
     *
     * A delegate is a callback function when invoked its this variable is set to the
     * predefined scope object.
     *
     * NOTE: This class was written years before bind was natively supported by Javascript
     * functions.  However this class remains useful as bind doesn't support the ability
     * to inspect the scope object bound to the callback.
	 *
	 * @param {object}     scope       object used to set the callback's scope.
	 * @param {function}   callback    the callback function.
	 *
	 * @returns {function} Delegate invocation function.
	 *
	 * @example
	 * new hd.Delegate(this, function([arg1[, arg2[, ...]]]) {
	 *     ...
     * });
	 */
    hd.Delegate = function(scope, callback) {
        var noop = function() {};

        this.invoke = function () {
            if (scope && callback) {
                return (arguments) ? callback.apply(scope, arguments) : callback.apply(scope);
            } else {
                return noop;
            }
        };

        this.invoke.scope = {
            get scope() {
                return scope;
            }
        };

        this.invoke.callback = {
            get callback() {
                return callback;
            }
        };

        this.invoke.equals = function (delegate) {
            return this.scope === delegate.scope && this.callback === delegate.callback;
        };
        
        return this.invoke;
    };
    
    
    hd.Dispatcher = function() {
        this.inherit(hd.Dispatcher);

        var eventBus = new hd.EventBus(),
            cacheCommands = {},
            commands = null,
            messages = null;

        Object.defineProperty(this, 'commands', {
          get: function() {
              if (!commands) {
                  commands = Object.create(null);
                  Object.getOwnPropertyNames(cacheCommands).forEach(function(command) {
                      commands[command] = command;
                  });
              }
              return commands; 
          },
          enumerable: true,
          configurable: false
        });

        Object.defineProperty(this, 'messages', {
          get: function() {
              if (!messages) {
                  messages = Object.create(null);
                  eventBus.getMessages().forEach(function(message) {
                      messages[message] = message;
                  });
              }
              return messages;
          },
          enumerable: true,
          configurable: false
        });

        this.init = function(commands) {
            cacheCommands = commands;
        };

        /**
         * on(message, subscriber)
         * on(subscribers)
         *
         * binds a subscriber or collection of subscribers to the view.
         */    
        this.on = function (message, subscriber) {
            if (typeof message === 'string') {
                eventBus.subscribe(message, subscriber);
            } else {
                var self = this;
                var subscribers = message;
                Object.getOwnPropertyNames(subscribers).forEach(function(message) {
                    self.on(message, subscribers[message]);
                });
            }
        };

        /**
         * off(message, subscriber)
         * off(subscribers)
         *
         * unbinds a subscriber or collection of subscribers to the view.
         */    
        this.off = function (message, subscriber) {
            if (typeof message === 'string') {
                eventBus.unsubscribe(message, subscriber);
            } else {
                var self = this;
                var subscribers = message;
                Object.getOwnPropertyNames(subscribers).forEach(function(message) {
                    self.off(message, subscribers[message]);
                });
            }
        };

        /**
         * trigger(message, subscriber)
         *
         * unbinds a subscriber or collection of subscribers to the view.
         */    
        this.trigger = function () {
            eventBus.publish.apply(this, arguments);
        };

        /**
         * execute(command, ...)
         *
         * renders a view command.
         */    
        this.execute = function (command) {
            [].shift.apply(arguments);
            cacheCommands[command].apply(this, arguments);
        };
    };
    
    
    
    /**
     * An event bus is an object that dispatches notification of events to 
     * subscribers that are bound to a specific message.  A message is an 
     * event type.  When an event of a particualar type occurs the event message
     * is published to subscribers of that event type.
     *
     * @class
     *
     * @example
     * var eventBus = new EventBus([messages]);
     */
    hd.EventBus = function (messages) {
        var publishers = {};

        if (!!messages) {
            if (typeof messages === "object") {
                for (var message in messages) {
                    publishers[message] = new hd.Publisher(message);
                }
            } else if (messages.constructor === Array) {
                messages.forEach(function(message) {
                    publishers[message] = new hd.Publisher(message);
                });
            }
        }

        var subscribe = function (message, subscriber) {
            if (!publishers[message]) {
                publishers[message] = new hd.Publisher(message);
            }

            publishers[message].subscribe(subscriber);
        };

        var unsubscribe = function (message, subscriber) {
            if (!!publishers[message]) {
                if (!subscriber) {
                    publishers[message].clear();
                } else {
                    publishers[message].unsubscribe(subscriber);
                }
            }
        };

        var publish = function (message) {
            if (!!publishers[message]) {
                var args = [];
                for (var ii = 1; ii < arguments.length; ++ii) {
                    args.push(arguments[ii]);
                }
                publishers[message].publish.apply(this, args);
            }
        };

        var getPublishers = function () {
            var list = [];
            for (var message in publishers) {
                if (publishers.hasOwnProperty(message)) {
                    list.push(publishers[message]);
                }
            }
            return list;
        };

        var getMessages = function () {
            return Object.getOwnPropertyNames(publishers);
        };

        return {
            subscribe: subscribe,
            unsubscribe: unsubscribe,
            publish: publish,
            getPublishers: getPublishers,
            getMessages: getMessages
        };
    };
    

    /**
     * The map class is a collection that combines sequential access to 
     * an association.
     *
     * @class
     */
    hd.Map = function (json) {
        this.inherit(hd.Map);

        var entries = (!json) ? [] : JSON.parse(json),
            mapper = {};

        // set up the mapper.
        entries.forEach(function(item, index) {
            mapper[item.key] = {'entry': {'key': item.key, 'value': item.value}, 'index' : index};
        });

        /**
         * Gets the size of the map.
         *
         * @example
         * var count = map.size;
         */
        Object.defineProperty(this, 'size', {
            get: function() {
                return entries.length;
            },
            enumerable: true
        });

        /**
         * Gets the key-value pair at a particular index.
         *
         * @param {number} index	The sequence index.
         *
         * @example
         * map.at(0);
         */
        this.at = function (index) {
            return 	{ key: entries[index].key, value: entries[index].value };
        };

        /**
         * Clears the entries from the map.
         *
         * @example
         * map.clear();
         */
        this.clear = function () {
            entries = [];
            for (var prop in mapper){
                if (mapper.hasOwnProperty(prop)){
                    delete mapper[prop];
                }
            }
        };

        /**
         * Deletes entry from the map.
         *
         * @param {string} key     The key of the entry to remove from map.
         *
         * @example
         * map.delete("mystore");
         */
        this.delete = function (key) {
            if (this.has(key)) {
                var collection = [],
                    found = 0;
                for (var ii = 0; ii < entries.length; ++ii) {
                    if (entries[ii].key !== key) {
                        collection.push(entries[ii]);
                        mapper[entries[ii].key].index = (ii - found);
                    } else {
                        found = 1;
                    }
                }
                entries = collection;
                delete mapper[key];
            }
        };

        /**
         * Gets the collection of map entries.
         *
         * @example
         * map.entries;
         */
        Object.defineProperty(this, 'entries', {
            get: function() {
                return entries;
            },
            enumerable: true
        });

        /**
         * Executes a callback for each key/value pair in the map.
         *
         * @param {function}   callback        Callback to execute for each element.
         * @param {object}     thisArg         The scope of the callback.
         *
         * @example
         * map.forEach(function(value, key, index) {
         *    ...
         * });
         */
        this.forEach = function (callback, thisArg) {
            var scope = thisArg || this;

            for (var ii = 0; ii < entries.length; ++ii) {
                if (callback.call(scope, entries[ii].value, entries[ii].key, ii) === true)
                    break;
            }
        };

        /**
         * Gets the value associated with the specified key.
         *
         * @param {string} key     The key of the associated mapped value.
         *
         * @example
         * var value = map.key("mykey");
         */
        this.get = function (key) {
            return this.has(key) ? mapper[key].entry.value : undefined;
        };

        /**
         * Determines whether the specified key exists in the map.
         *
         * @param {string} key     The key of the associated mapped value.
         *
         * @returns {boolean}      Returns true if the key exists in the map; otherwise false.
         *
         * @example
         * map.has("mykey");
         */
        this.has = function (key) {
            return mapper.hasOwnProperty(key);
        };

        /**
         * Retuns a collection of the map keys.
         *
         * @example
         * map.keys();
         */
        this.keys = function () {
            var results = [];
            for (var ii = 0; ii < entries.length; ++ii) {
                results.push(entries[ii].keys);
            }
            return results;
        };

        /**
         * Assign a value referenced by a key.
         *
         * @param {string} key     The key of the associated mapped value.
         * @param {object} value   The value to associate with the key.
         *
         * @example
         * map.set(key, value);
         */
        this.set = function (key, value) {
            var info = this.has(key)
                ? mapper[key]
                : {entry: {'key': key, 'value': undefined}, 'index' : undefined};

            info.entry.value = value;
            var index = info.index;
            if (index !== undefined) {
                entries[index] = info.entry;
            } else {
                index = entries.length;
                entries.push(info.entry);
                info.index = index;
            }

            mapper[key] = info;
        };

        /**
         * Retuns a collection of the mapped values.
         *
         * @example
         * map.values();
         */
        this.values = function () {
            var results = [];
            for (var ii = 0; ii < entries.length; ++ii) {
                results.push(entries[ii].value);
            }
            return results;
        };

        /**
         * Converts map to JSON string.
         *
         * @example
         * map.toString();
         */
        this.toString = function () {
            return JSON.stringify(entries);
        };
    };
    
    
    /**
     * The base model class.
     *
     * @class
     */
    hd.Model = function() {
        this.inherit(hd.Model, hd.Dispatcher);
    };

    
	/**
	 * Publisher
     *
     * A delegate is a callback function when invoked its this variable is set to the
     * predefined scope object.
     *
     * NOTE: This class was written years before bind was natively supported by Javascript
     * functions.  However this class remains useful as bind doesn't support the ability
     * to inspect the scope object bound to the callback.
	 *
	 * @param {object}     scope       object used to set the callback's scope.
	 * @param {function}   callback    the callback function.
	 *
	 * @returns {function} Delegate invocation function.
	 *
	 * @example
	 * Delegate.create(this, function([arg1[, arg2[, ...]]]) {
	 *     ...
     * });
	 */
    hd.Publisher = function (message) {
        var subscribers = [],
            getDelegate = function (callback, scope) {
                return (scope === undefined) ? callback : new hd.Delegate(scope, callback);
            };

        // Establish class and set instance.
        this.inherit(hd.Publisher);

        Object.defineProperty(this, "message", {
            get: function () { return message; },
            enumerable: true
        }); 

        this.subscribe = function (subscriber) {
            var subscriberDelegate = getDelegate(subscriber);
            subscribers.push(subscriberDelegate);
        };

        this.unsubscribe = function (subscriber) {
            var subscriberDelegate = getDelegate(subscriber);
            if (subscriberDelegate !== null) {

                var count = subscribers.length;
                var newArray = [];
                for (var ii = 0; ii < count; ++ii) {
                    var delegate = subscribers[ii];
                    if (delegate.equals(subscriber) === false) {
                        newArray.push(subscriber);
                    }
                }
                subscribers = newArray;
            }
        };

        this.publish = function() {
            var count = subscribers.length;
            for (var ii = 0; ii < count; ++ii) {
                var subscriber = subscribers[ii];
                if (subscriber) {
                    subscriber.apply(this, arguments);
                }
            }
        };


        this.clear = function() {
            subscribers = [];
        };

        this.hasSubscribers = function() {
            return subscribers.length > 0;
        };
    };
    
    
    /**
     * Creates a storage object that wraps local storage.
     *
     * @param {string} name The name of our DB we want to use
     * @param {function} callback Our fake DB uses callbacks because in
     * real life you probably would be making AJAX calls
     */
    hd.Storage = function () {
        this.inherit(hd.Storage);

        var noop = function () {},
            storage = new hd.Map(),
            defaultFilter = function (query, data) {
                for (var q in query) {
                    if (query[q] !== data[q]) {
                        return false;
                    }
                }
                return true;
            },
            allFilter = function(query, data) {
                return true;
            };

        /**
         * Creates the storage.
         *
         * @param {string} name    The name of the storage.
         *
         * @example
         * storage.create("mystore");
         */
        this.create = function (name) {
            if (!storage.has(name)) {
                var store = new hd.Map(localStorage.getItem(name));
                storage.set(name, store);
            }
        };

        /**
         * Finds items based on a query given as a JS object
         *
         * @param {object} query The query to match against (i.e. {foo: 'bar'})
         * @param {function} callback	 The callback to fire when the query has
         * completed running
         *
         * @example
         * db.find({foo: 'bar', hello: 'world'}, function (data) {
         *	 // data will return any items that have foo: bar and
         *	 // hello: world in their properties
         * });
         */
        this.find = function (name, query, filter, callback) {
            var results = [],
                action = callback || filter,
                refine = (callback) ? filter : defaultFilter,
                store = storage.get(name);

            if (!store) {
                console.log("find: storage '" + name + "' not found.");
                return;
            }

            store.forEach(function(value) {
                if (refine(query, value)) {
                    results.push(value);
                }
            });

            action.call(this, results);
        };

        /**
         * Will retrieve all data from the collection
         *
         * @param {function} callback The callback to fire upon retrieving data
         */
        this.findAll = function (name, callback) {
            this.find(name, {}, allFilter, function(results) {
                var action = callback || noop;
                action.call(this, results);
            });
        };

        /**
         * Determines whether the storage name exists.
         *
         * @param {string} name    The name of the storage.
         *
         * @example
         * storage.has("mystore");
         */
        this.getItems = function (name) {
            return Array.from(storage.get(name).entries);
        };

        /**
         * Get the count of items in the storage.
         *
         * @param {string} name    The name of the storage.
         *
         * @example
         * storage.has("mystore");
         */
        this.getSize = function (name) {
            return storage.get(name).entries.length;
        };

        /**
         * Determines whether the storage name exists.
         *
         * @param {string} name    The name of the storage.
         *
         * @example
         * storage.has("mystore");
         */
        this.has = function (name) {
            return storage.has(name);
        };

        /**
         * Will save the given data to the DB. If no item exists it will create a new
         * item, otherwise it'll simply update an existing item's properties
         *
         * @param {object}     entity      The data to save back into the DB
         * @param {function}   callback    The callback to fire after saving
         */
        this.save = function (name, entity, callback) {

            // get the data store.
            this.create(name);
            var store = storage.get(name);

            // obtain the id.
            var id = entity.id;
            if (!id) {
                id = new Date().getTime();
                entity.id = id;
            }

            // update and save the item.
            store.set(id, entity);
            localStorage.setItem(name, store.toString());

            // call back.
            var action = callback || noop;
            action.call(this, entity);
        };

        /**
         * Will remove an item from the Store based on its ID
         *
         * @param {number} id The ID of the item you want to remove
         * @param {function} callback The callback to fire after saving
         */
        this.remove = function (name, id, callback) {
            var store = storage.get(name);

            if (!store || !store.has(id)) {
                return;
            }

            store.delete(id);
            localStorage.setItem(name, store.toString());

            // call back.
            var action = callback || noop;
            action();
        };

        /**
         * Will drop the store from the storage.
         *
         * @param {function} callback The callback to fire after dropping the data
         */
        this.drop = function (name, callback) {
            if (!storage.has(name)) {
                return;
            }

            storage.get(name).clear();
            storage.delete(name);
            localStorage.removeItem(name);

            // call back.
            var action = callback || noop;
            action();
        };

        /**
         * Will drop all storage and start fresh
         *
         * @param {function} callback The callback to fire after dropping the data
         */
        this.clear = function (callback) {

            for (var key in storage.keys()) {
                this.drop(key);
            }

            // call back.
            var action = callback || noop;
            action();
        };
    };
    
    
    /**
     * Will save the given data to the DB. If no item exists it will create a new
     * item, otherwise it'll simply update an existing item's properties
     *
     * @param {object}     entity      The data to save back into the DB
     * @param {function}   callback    The callback to fire after saving
     */
    hd.Subscriber = function (scope, callback) {
        var getDelegate = function (scope, callback) {
            return (callback === undefined) ?
                    (scope.hasOwnProperty("scope") ? scope : new hd.Delegate(document, scope))
                : hd.Delegate(scope, callback);
        };	

        return getDelegate(scope, callback);
    };    
    
    /**
     * The base template class.
     *
     * @class
     */
    hd.Template = function() {
        this.inherit(hd.Template);

        var templates = {};
        var names = null;

        /**
         * Retreives the template by name.
         *
         * @param {string} name    template name.
         */
        function getTemplate(name) {
            if (templates[name] === undefined) {

                // load undefined template.
                // ReSharper disable once PossiblyUnassignedProperty
                $.ajax({
                    url: "templates/" + name + ".txt",
                    success: function(data) {

                        // compile and cache the template.
                        // ReSharper disable once UndeclaredGlobalVariableUsing
                        templates[name] = Handlebars.compile(data);
                    },
                    async: false
                });
            }

            return templates[name];
        }

        /**
         * Initialize the template
         *
         * @param {object} source  Template source object.
         */
        this.init = function(source) {
            Object.getOwnPropertyNames(source).forEach(new hd.Subscriber(this, function(name) {
                templates[name] = Handlebars.compile(source[name]);
                Object.defineProperty(this, name, {
                    get: function() { return name; },
                    enumerable: true,
                    configurable: false
                });
            }));
        };

        /**
         * Create text using the named template.
         *
         * @param {string} name    Template name.
         * @param {object} data    Template data.
         */
        this.createTextFor = function(name, data) {
            if (!name) return;
            var template = getTemplate(name);
            return template(data);    
        };

        /**
         * Create element using the named template.
         *
         * @param {string} name    Template name.
         * @param {object} data    Template data.
         */
        this.createElementFor = function(name, data) {
            var html = this.createTextFor(name, data);    
            var d = document.createElement("div");
            d.innerHTML = html;
            return d.children[0];
        };
    };
    
    /**
     * The base view class.
     *
     * @class
     */
    hd.View = function() {
        this.inherit(hd.View, hd.Dispatcher);

        /**
         * ENTER_KEY
         *
         */    
        Object.defineProperty(this, 'ENTER_KEY', {
          get: function() { return 13; },
          enumerable: true,
          configurable: false
        });    

        /**
         * ESCAPE_KEY
         *
         */    
        Object.defineProperty(this, 'ESCAPE_KEY', {
          get: function() { return 27; },
          enumerable: true,
          configurable: false
        });    

        /**
         * render(command[, arg1[, arg2[, ...]]])
         *
         * renders a view command.
         */    
        this.render = function (command) {
            this.execute.apply(this, [].slice.apply(arguments));
        };
    };

    // Return the humdrum object.
    return hd;
    
}({}));
