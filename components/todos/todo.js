if (Meteor.isClient) {
  Template.todo.helpers({
    isOwner: function(){
      return this.owner === Meteor.userId();
    }
  });

  Template.todo.events({
    'click .toggle-checked': function() {
      Meteor.call("updateTodo", this._id, !this.checked);
    },
    'click .delete': function() {
      Meteor.call("deleteTodo",this._id);
    },
    'click .toggle-private': function(){
      Meteor.call("setPrivate", this._id, !this.private);
    }
  });
}