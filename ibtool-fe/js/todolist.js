
document.addEventListener('DOMContentLoaded', function() {
  var todoListItem = document.querySelector('.todo-list');
  var todoListInput = document.querySelector('.todo-list-input');

  document.querySelector('.add').addEventListener('click', function(event) {
      event.preventDefault();
      var item = todoListInput.value;
      if (item) {
          var li = document.createElement('li');
          li.innerHTML = "<div class='form-check'><label class='form-check-label'><input class='checkbox' type='checkbox' />" + item + "<i class='input-helper'></i></label></div><i class='remove fas fa-trash'></i>";
          todoListItem.appendChild(li);
          todoListInput.value = "";
      }
  });

  document.querySelector('.send-todo').addEventListener('click', function() {
      var todoList = [];
      document.querySelectorAll('.todo-list li').forEach(function(li) {
          var itemText = li.querySelector('.form-check-label').textContent.trim();
          todoList.push(itemText);
      });
      const sso = localStorage.getItem('CURRENT_USER_SSO');

      // Send todo list via Fetch API
      fetch(`${localStorage.getItem('backEndIP')}/todo_endpoint/${sso}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ todo_list: todoList })
    })
      .then(function(response) {
          if (response.ok) {
              console.log('Todo list sent successfully');
              // You can add code here to handle success
          } else {
              console.error('Failed to send todo list');
              // You can add code here to handle failure
          }
      })
      .catch(function(error) {
          console.error('Error sending todo list:', error);
          // You can add code here to handle errors
      });
  });

  todoListItem.addEventListener('change', function(event) {
      if (event.target.classList.contains('checkbox')) {
          event.target.closest('li').classList.toggle('completed');
      }
  });

  todoListItem.addEventListener('click', function(event) {
      if (event.target.classList.contains('remove')) {
          event.target.closest('li').remove();
      }
  });
});
