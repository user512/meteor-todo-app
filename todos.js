

Todos = new Mongo.Collection('todos');

if (Meteor.isClient) {
  Meteor.subscribe("todos");  // This is to subscribe the server side data

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
      event.preventDefault();
      var title = event.target.title.value;
      if (title[0].value !== null){
        Meteor.call("addTodo", title);
      }
      event.target.title.value = "";
      // return false;   //Can use preventDefault() or return false to prevent submit
    },
    'change .hide-finished': function(event) {
      Session.set('hideFinished', event.target.checked);
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
  Meteor.publish("todos", function(){
    return Todos.find({  //This is Mongo DB query
      $or: [
        { private: {$ne: true} },  //$ne means not equal in MongoDB
        { owner: this.userId } // user can use their own task
      ]
    });
  });
}


Meteor.methods({
  addTodo: function(title){
    Todos.insert(
    {
        title: title,
        createdAt: new Date(),
        owner: Meteor.userId()
    }
    );
  },

  updateTodo: function(id, checked) {
    Todos.update(id, {$set: {checked: checked}});
  },

  deleteTodo: function(id){
    Todos.remove(id);
  },

  setPrivate: function(id, private){
    var task = Todos.findOne(id);

    if (task.owner !== Meteor.userId()){
      throw new Meteor.Error('not-authorized');
    }
    Todos.update(id, {$set: {private: private}});
  }
});