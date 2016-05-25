/* jshint strict: true, undef: true, eqeqeq: true, laxbreak: true */
/* globals console, EventBus */

/**
 * The dispatch maintains an event bus and command cache
 * for the publishing of events and reception of commands.
 *
 * @class
 */
function Dispatcher() {
    "use strict";
    
	this.inherit(Dispatcher);

	var eventBus = new EventBus(),
		commandCache = {},
		commands = null,
		messages = null;

    /**
     * commands
     *
     * getter to access command definitions.
     */
	Object.defineProperty(this, 'commands', {
	  get: function() {
		  if (!commands) {
			  commands = Object.create(null);
			  Object.getOwnPropertyNames(commandCache).forEach(function(command) {
				  commands[command] = command;
			  });
		  }
		  return commands; 
	  },
	  enumerable: true,
	  configurable: false
	});

    /**
     * messages
     *
     * getter to access publishable messages.
     */
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

    /**
	 * init(commands)
     *
     * initializes the dispather.
     *
     * @param {object}      commands    Command object.
     */
	this.init = function(commands) {
		commandCache = commands;
	};

	/**
	 * on(message, subscriber)
	 * on(subscribers)
	 *
	 * attaches a subscriber or collection of subscribers to the view.
     *
     * @param {string}          message     event message.
     * @param {function|object} subscriber  subscriber delegate or subscribers object.
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
	 * detaches a subscriber or collection of subscribers from the view.
     *
     * @param {string}          message     event message.
     * @param {function|object} subscriber  subscriber delegate or subscribers object.
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
	 * trigger(message, [arg1[, arg2[, ...]]])
	 *
	 * triggers a message
     *
     * @param {string}      message     event message.
     * @param {Arguments}   arguments   message arguments.
	 */    
	this.trigger = function () {
		eventBus.publish.apply(this, arguments);
	};

	/**
	 * execute(command, [arg1[, arg2[, ...]]])
	 *
	 * renders a view command.
     *
     * @param {string}      command     command message.
     * @param {Arguments}   arguments   command arguments.
	 */    
	this.execute = function (command) {
		[].shift.apply(arguments);
		commandCache[command].apply(this, arguments);
	};
}
