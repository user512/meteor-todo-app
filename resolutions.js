

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

      Meteor.call("addTodo", title);

      event.target.title.value = "";

      return false;
    },
    'change .hide-finished': function(event) {
      Session.set('hideFinished', event.target.checked);
    }
  });

  Template.todo.events({
    'click .toggle-checked': function() {
      Meteor.call("updateTodo", this._id, !this.checked);
    },
    'click .delete': function() {
      Meteor.call("deleteTodo",this._id);
    }
  });

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}


Meteor.methods({
  addTodo: function(title){
    Todos.insert({
        title: title,
        createdAt: new Date()
    });
  },
  updateTodo: function(id, checked) {
    Todos.update(id, {$set: {checked: checked}});
  },
  deleteTodo: function(id){
    Todos.remove(id);
  }
});