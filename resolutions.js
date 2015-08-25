Todos = new Mongo.Collection('todos');

if (Meteor.isClient) {
  Template.body.helpers({
    todos: function() {
      return Todos.find();
    }
  });
  Template.body.events({
    'submit .new-todo': function(event) {
      var title = event.target.title.value;

      Todos.insert({
        title: title,
        createdAt: new Date()
      });

      // event.target.title.value = "";

      return false;
    }
  });

  Template.todo.events({
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
