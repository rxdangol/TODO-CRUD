"use strict";

const display = document.getElementById("lecture-list");
const addPostForm = document.getElementById("lecture-add");
const titleValue = document.getElementById("title-value");
const descriptionValue = document.getElementById("description-value");
const priorityValue = document.getElementById("priority-value");
const addBtn = document.querySelector(".success");

let output = "";
let priority = "";
const renderPost = (posts) => {
  posts.forEach((post) => {
    output += `
      <div data-id='${post._id}'>
            <ul>
                <li>
                    <div>
                        <h6 class="title">${post.name}<span class="priority ml-2 badge badge-info"></span></h6>
                        <p class="description">${post.description}</p>
                    </div>
                    <div>
                        <button class="btn btn-success fas fa-check" id='complete-post'></button>
                        <button class="btn btn-warning fas fa-pencil" id='edit-post'></button>
                         <button class="btn btn-danger far fa-trash-alt" id="delete-post"></button>
                    </div>
                </li>
            </ul>
      </div>
        `;
  });
  display.innerHTML = output;
};

const url = "https://infodev-server.herokuapp.com/api/todos";

// Fetch data
// Method: GET
fetch(url)
  .then((res) => res.json())
  .then((data) => renderPost(data));

//Create - Insert new post
//Method: POST

addPostForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // console.log(titleValue.value);
  // console.log(descriptionValue.value);
  // console.log(priorityValue.value);

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: titleValue.value,
      priority: priorityValue.value,
      description: descriptionValue.value,
      completed: false,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      const dataArr = [];
      dataArr.push(data);
      renderPost(dataArr);
    });

  //reset input field to empty
  titleValue.value = "";
  priorityValue.value = "";
  descriptionValue.value = "";
});

display.addEventListener("click", (e) => {
  e.preventDefault();
  let deleteBtn = e.target.id === "delete-post";
  let editBtn = e.target.id == "edit-post";
  let completeBtn = e.target.id == "complete-post";
  let id =
    e.target.parentElement.parentElement.parentElement.parentElement.dataset.id;
  // console.log(`${url}/:${id}`);

  //Delete Post
  //Method: DELETE
  if (deleteBtn) {
    fetch(`${url}/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => location.reload());
  }
  
  //Edit Post 
  if (editBtn) {
    const parent =
      e.target.parentElement.parentElement.parentElement.parentElement;
    // console.log(parent);
    let titleContent = parent.querySelector(".title").textContent;
    let descriptionContent = parent.querySelector(".description").textContent;

    titleValue.value = titleContent;
    priorityValue.value = 0;
    descriptionValue.value = descriptionContent;
  }
  //Complete Post 
  
  if (completeBtn) {
    fetch(`${url}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        completed: true,
      }),
    })
      .then((res) => res.json())
      .then(() => {}); // I am unable to do the complete action to cut the title name and remove the complete and edit button..
  }

  // Update Data
  //Method: PUT
  addBtn.addEventListener("click", (e) => {
    e.preventDefault();
    fetch(`${url}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: titleValue.value,
        priority: priorityValue.value,
        description: descriptionValue.value,
        completed: false,
      }),
    })
      .then((res) => res.json())
      .then(() => location.reload());
  });
});
