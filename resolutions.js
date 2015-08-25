Todos = new Mongo.Collection('todos');

if (Meteor.isClient) {
  Template.body.helpers({
    todos: function() {
      if (Session.get('hideFinished')) {
        return Todos.find({checked: {$ne: true}});
      } else {
        return Todos.find();
      }
    }
  });

  Template.body.events({
    'submit .new-todo': function(event) {
      var title = event.target.title.value;

      Todos.insert({
        title: title,
        createdAt: new Date()
      });

      event.target.title.value = "";

      return false;
    },
    'change .hide-finished': function(event) {
      Session.set('hideFinished', event.target.checked);
    }
  });

  Template.todo.events({
    'click .toggle-checked': function() {
      Todos.update(this._id, {$set: {checked: !this.checked}});
    },
    'click .delete': function() {
      Todos.remove(this._id);
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
