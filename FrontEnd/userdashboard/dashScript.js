const header = document.getElementById("header");
const bucketlistsubmit = document.getElementById("bucketlistsubmit");
const bucketlist = document.getElementById("bucketlist");
//Window load
window.addEventListener("load", (event) => {
  event.preventDefault();
  fetch("/userloginload")
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      console.log(("Session Data:", data.sessionData));
      header.innerHTML = `<h2>Welcome to your Bucket List Dash Board, ${data.sessionData.user.username}, or shall I call you ${data.sessionData.user.firstname} ${data.sessionData.user.lastname}!!!</h2>`;
      bucketlist.innerHTML = ``;

      //Submit to add to user list
      bucketlistsubmit.addEventListener("submit", (event) => {
        event.preventDefault();
        fetch("/newitem", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            name: event.target.name.value,
            location: event.target.location.value,
            cost: event.target.cost.value,
            bywhen: event.target.bywhen.value,
            userId: data.sessionData.user.id,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            getBucketList();
          });
      });
      //Function to load bucketlish from backend database
      function getBucketList() {
        fetch(`/Items/${data.sessionData.user.id}`)
          .then((res) => res.json())
          .then((data) => {
            bucketlist.innerHTML = showuseritems(data);
          });
      }
      getBucketList();
      //Function to dynamically map bucketlist to <li> with edit and delete buttons
      function showuseritems(items) {
        console.log(items);
        return items
          .map((item) => {
            return `
            <li>Activity: ${item.name} Location: ${item.location} Cost: ${item.cost} By when: ${item.bywhen}
              <form id="editToDo">
              <input type="text" class="editContent" name="editContent" placeholder="Edit Task">
                <button type="submit" onclick="startEdit(${item.name})">Edit Content</button>
              <input type="text" class="editContent" name="editContent" placeholder="Edit Task">
                <button type="submit" onclick="startEdit(${item.location})">Edit Content</button>
              <input type="text" class="editContent" name="editContent" placeholder="Edit Task">
                <button type="submit" onclick="startEdit(${item.cost})">Edit Content</button>
              <input type="text" class="editContent" name="editContent" placeholder="Edit Task">
                <button type="submit" onclick="startEdit(${item.bywhen})">Edit Content</button>
                <button onclick="deletebucketitem(${item.id})">DELETE THIS BUCKET LIST ITEM</button>
              </form>
            </li>
            `;
          })
          .join("");
      }

      //Function to edit an item in bucket list
      function startEdit(id) {
        console.log("Button Pressed");
        const editToDo = document.getElementById("editToDo");
        editToDo.addEventListener("submit", (event) => {
          event.preventDefault();
          console.log("Hello");

          // console.log(event.target);
          // console.log(event.target.editContent);
          console.log(event.target.editContent.value);
          fetch(`/todos/${id}`, {
            method: "PUT",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({
              content: event.target.editContent.value,
            }),
          })
            .then((res) => res.json())
            .then((data) => {
              console.log(data);
              event.target.editContent.value = "";
              getAllTodo();
            });
        });
      }

      //Function to delete bucket list item
      function deletebucketitem(id) {
        fetch(`/items/${data.sessionData.user.id}`, {
          method: "DELETE",
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            getAllTodo();
          });
      }
    });
});
