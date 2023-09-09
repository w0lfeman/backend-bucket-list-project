const header = document.getElementById("header");
const bucketlistsubmit = document.getElementById("bucketlistsubmit");
const bucketlist = document.getElementById("bucketlist");

//Session function
async function getonloaddata() {
  const onloaddata = await fetch("/userloginload")
    .then((res) => res.json())
    .then((data) => {
      return data;
    });
  console.log(onloaddata);
  return onloaddata;
}

//Function to load bucketlish from backend database
async function getBucketList() {
  const data = await getonloaddata();
  fetch(`/Items/${data.sessionData.user.id}`)
    .then((res) => res.json())
    .then((data) => {
      bucketlist.innerHTML = showuseritems(data);
    });
}

//Window load
window.addEventListener("load", async (event) => {
  event.preventDefault();
  const data = await getonloaddata();
  header.innerHTML = `<h2>Welcome to your Bucket List Dash Board, ${data.sessionData.user.username}, or shall I call you ${data.sessionData.user.firstname} ${data.sessionData.user.lastname}!!!</h2>
  <button onclick="deleteuserprofile(${data.sessionData.user.id})">Delete My User Profile and Data</button>`;
  bucketlist.innerHTML = ``;
  getBucketList();
});

//Submit to add to user list
bucketlistsubmit.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = await getonloaddata();
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
      event.target.name.value = "";
      event.target.location.value = "";
      event.target.cost.value = "";
      event.target.bywhen.value = "";
      getBucketList();
    });
});

//Function to dynamically map bucketlist to <li> with edit and delete buttons
function showuseritems(items) {
  return items
    .map((item) => {
      return `
            <li>I want to ${item.name} at ${item.location} with the budget of ${item.cost} by this date: ${item.bywhen}
              <form id="edititem-${item.id}">
              <input type="text" class="editContent" name="name" placeholder="Edit Name">
              <input type="text" class="editContent" name="location" placeholder="Edit Location">
              <input type="text" class="editContent" name="cost" placeholder="Edit Cost">
              <input type="date" class="editContent" name="bywhen" placeholder="Edit By When">
                <button type="submit" onclick="startEdit(${item.id})">Edit Content</button>
              </form>
              <button onclick="deletebucketitem(${item.id})">DELETE THIS BUCKET LIST ITEM</button>
            </li>
            `;
    })
    .join("");
}

//Function to edit an item in bucket list
function startEdit(id) {
  console.log(id);
  const edititem = document.getElementById(`edititem-${item.id}`);
  edititem.addEventListener("submit", async (event) => {
    event.preventDefault();
    console.log(event.target.name.value);
    await fetch(`/items/${id}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        name: event.target.name.value,
        location: event.target.location.value,
        cost: event.target.cost.value,
        bywhen: event.target.bywhen.value,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.err) {
          alert("Make Sure To Edit All Fields");
        } else {
          getBucketList();
        }
      });
  });
}
// Function to delete bucket list item
function deletebucketitem(id) {
  fetch(`/items/${id}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      getBucketList();
    });
}

function deleteuserprofile(id) {
  fetch(`/users/${id}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.success) {
        window.location.href = "http://localhost:3000/";
      } else {
        alert("Could not delete");
      }
    });
}
