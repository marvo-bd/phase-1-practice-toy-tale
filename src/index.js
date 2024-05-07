document.addEventListener("DOMContentLoaded", () => {
  const toyCollection = document.getElementById("toy-collection");
  const toyForm = document.querySelector(".add-toy-form");
  let addToy = false;

  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");

  addBtn.addEventListener("click", () => {
    // Toggle visibility of the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  // Fetch Andy's Toys
  function fetchToys() {
    fetch("http://localhost:3000/toys")
      .then(response => response.json())
      .then(toys => {
        toys.forEach(toy => renderToy(toy));
      });
  }

  // Render Toy Card
  function renderToy(toy) {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" id="${toy.id}">Like ❤️</button>
    `;
    toyCollection.appendChild(card);
    addLikeListener(card, toy);
  }

  // Add Toy Listener
  toyForm.addEventListener("submit", event => {
    event.preventDefault();
    const name = event.target.name.value;
    const image = event.target.image.value;
    const likes = 0;

    const newToy = { name, image, likes };

    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(newToy)
    })
      .then(response => response.json())
      .then(toy => renderToy(toy));

    event.target.reset();
  });

  // Add Like Listener
  function addLikeListener(card, toy) {
    const likeButton = card.querySelector(".like-btn");
    likeButton.addEventListener("click", () => {
      const newLikes = toy.likes + 1;
      fetch(`http://localhost:3000/toys/${toy.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({ likes: newLikes })
      })
        .then(response => response.json())
        .then(updatedToy => {
          const likesElement = card.querySelector("p");
          likesElement.textContent = `${updatedToy.likes} Likes`;
        });
    });
  }

  // Initial Fetch
  fetchToys();
});
