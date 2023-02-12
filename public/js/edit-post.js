async function editFormHandler(event) {
     event.preventDefault();
     const name = document.querySelector('input[name="post-title"]').value;
     const description = document.querySelector('textarea[name="post-content"]').value.trim();
     const project_id = window.location.toString().split('/')[
         window.location.toString().split('/').length - 1
     ];
 
     const response = await fetch(`/api/dashboard/edit/${project_id}`, {
         method: 'PUT',
         body: JSON.stringify({
             name,
             description
         }),
         headers: {
             'Content-Type': 'application/json'
         }
     });
 
     if (response.ok) {
         document.location.replace('/dashboard');
     } else {
         alert(response.statusText);
     }
 }
 
 document.querySelector('.edit-link').addEventListener('submit', editFormHandler);