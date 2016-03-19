/* jshint strict: true, undef: true, eqeqeq: true, laxbreak: true */
/* globals console, Todos */

/*global EventBus */

function View() {
	'use strict';
    
    this.inherit(View);
    
    var eventBus = new EventBus(),
        viewCommands = {},
        commands = null,
        messages = null;
    
    Object.defineProperty(this, 'commands', {
      get: function() {
          if (!commands) {
              commands = Object.create(null);
              Object.getOwnPropertyNames(viewCommands).forEach(function(command) {
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
    
    Object.defineProperty(this, 'ENTER_KEY', {
      get: function() { return 13; },
      enumerable: true,
      configurable: false
    });    
    
    Object.defineProperty(this, 'ESCAPE_KEY', {
      get: function() { return 27; },
      enumerable: true,
      configurable: false
    });    
    
    this.init = function(commands) {
        viewCommands = commands;
    };
    
    /**
     * bind(message, subscriber)
     * bind(subscribers)
     *
     * binds a subscriber or collection of subscribers to the view.
     */    
    this.bind = function (message, subscriber) {
        if (typeof message === 'string') {
            eventBus.subscribe(message, subscriber);
        } else {
            var self = this;
            var subscribers = message;
            Object.getOwnPropertyNames(subscribers).forEach(function(message) {
                self.bind(message, subscribers[message]);
            });
        }
    };
    
    this.publish = function () {
        eventBus.publish.apply(this, arguments);
    };
    

    /**
     * render(command, ...)
     *
     * renders a view command.
     */    
    this.render = function (command) {
        [].shift.apply(arguments);
        viewCommands[command].apply(this, arguments);
    };
}
