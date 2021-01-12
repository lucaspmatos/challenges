const content = async function getUsers() {
  const { data } = await axios.get({
    url: "https://jsm-challenges.s3.amazonaws.com/frontend-challenge.json",
    method: "get",
  });

  return data.results;
}; 

const users = content().then(data => console.log(data));

let showUsers = "";

for (let i = 0; i < users.length; i += 1) {
  showUsers += `
    <div id="users-box" class="users-box">
        <img src="${users[i].picture.large}" class="user-picture" />
        <div class="users-details">
        <h5>${users[i].name.first} ${users[i].name.last}</h5>
        <span class="street">${users[i].location.street}</span>
        <span class="city">${users[i].location.city} ${users[i].location.state} - CEP: ${users[i].location.postcode}</span>
        </div>
    </div>
    `;
}

document.getElementById("users-container").innerHTML = showUsers;