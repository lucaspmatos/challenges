let usersElement = document.querySelector("#users");

// Função que permite o consumo da API
(function () {
  var cors_api_host = "cors-anywhere.herokuapp.com";
  var cors_api_url = "https://" + cors_api_host + "/";
  var slice = [].slice;
  var origin = window.location.protocol + "//" + window.location.host;
  var open = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function () {
    var args = slice.call(arguments);
    var targetOrigin = /^https?:\/\/([^\/]+)/i.exec(args[1]);
    if (
      targetOrigin &&
      targetOrigin[0].toLowerCase() !== origin &&
      targetOrigin[1] !== cors_api_host
    ) {
      args[1] = cors_api_url + args[1];
    }
    return open.apply(this, args);
  };
})();

function capitalize(word) {
  return word
    .toLowerCase()
    .replace(/\w/, (firstLetter) => firstLetter.toUpperCase());
}

function treatStreet(string) {
  const street = string.split(" ");
  let treatedStreet = "";

  const number = street.shift();

  street.map((value) => {
    if (value.length <= 2 && !value.startsWith("d")) {
      treatedStreet += `${value}`;
    } else if (value.length <= 3 && value.startsWith("d")) {
      treatedStreet += ` ${value}`;
    } else {
      treatedStreet += ` ${capitalize(value)}`;
    }
  });

  return treatedStreet + `, ${number}`;
}

function treatString(str) {
  const string = str.split(" ");
  let treatedString = "";

  string.map((value) => {
    if (value.length <= 3 && value.startsWith("d")) {
      treatedString += ` ${value}`;
    } else {
      treatedString += ` ${capitalize(value)}`;
    }
  });

  return treatedString;
}

function treatDate(str) {
  const string = str.split("T");
  const oldDate = string[0].split("-");
  const newDate = `${oldDate[2]}/${oldDate[1]}/${oldDate[0]}`;

  return newDate;
}

function treatGender(str) {
  if (str === 'male') return 'Masculino';
  else return 'Feminino';
}

let currentPage = 1;
let recordsPerPage = 9;
let numPages = 0;

async function getUsers() {
  const { data } = await axios.get(
    "https://jsm-challenges.s3.amazonaws.com/frontend-challenge.json"
  );

  return data.results;
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    changePage(currentPage);
  }
}

function nextPage() {
  if (currentPage < numPages) {
    currentPage++;
    changePage(currentPage);
  }
}

async function getNumPages(users) {
  numPages = Math.ceil(users.length / recordsPerPage);
}

let usersContainer = document.createElement("div");
usersContainer.setAttribute("class", "users-container");

async function changePage(page, result = "") {
  const test = await getUsers();

  const word = result;

  const users = test.filter((value) => {
    if (value.name.first.startsWith(word)) {
      return value;
    }
  });

  console.log(users);

  getNumPages(users);

  let btn_next = document.getElementById("btn_next");
  let btn_prev = document.getElementById("btn_prev");

  // Validate page
  if (page < 1) page = 1;
  if (page > numPages) page = numPages;

  let showUsers = "";

  usersContainer.innerHTML = "";

  for (
    let i = (page - 1) * recordsPerPage;
    i < page * recordsPerPage && i < users.length;
    i++
  ) {
    showUsers += `
    <div id="users-box" class="users-box">
        <img src="${users[i].picture.large}" class="user-picture" />
        <div class="users-details">
          <h5><a id="user-link" href="./user.html?user=${i}">${treatString(
      users[i].name.first + " " + users[i].name.last
    )}</a></h5>
          <span class="street">${treatStreet(users[i].location.street)}</span>
          <span class="city">${treatString(users[i].location.city)} </br>
          ${treatString(users[i].location.state)} - CEP: ${
      users[i].location.postcode
    }</span>
        </div>
    </div>
    `;
  }

  usersContainer.innerHTML = showUsers;

  usersElement.appendChild(usersContainer);

  if (page == 1) {
    btn_prev.style.visibility = "hidden";
  } else {
    btn_prev.style.visibility = "visible";
  }

  if (page == numPages) {
    btn_next.style.visibility = "hidden";
  } else {
    btn_next.style.visibility = "visible";
  }
}

window.onload = function () {
  changePage(1, "");
};

// User Details
let userDetails = document.querySelector(".user-container");
userDetails.innerHTML = "";

async function loadUser(id) {
  const users = await getUsers();

  const showUser = `
    <div class="user-detail">
      <img class="user-picture" src="${users[id].picture.large}" />
      <h4 class="text-center">${treatString(
        users[id].name.first + " " + users[id].name.last
      )}</h4>
      <h6 class="text-center">${treatGender(users[id].gender)}</h6>
      <div class="user-info">
          <span class="detail-title">Endereço</span></br>
          <span>Logradouro: ${treatStreet(users[id].location.street)}</span></br>
          <span>Cidade: ${treatString(users[id].location.city)}</span></br>
          <span>Estado: ${treatString(users[id].location.state)}</span></br>
          <span>CEP: ${users[id].location.postcode}</span></br>
          <span class="detail-title">Contato</span></br>
          <span>E-mail: ${users[id].email}</span></br>
          <span>Telefone: ${users[id].phone} | Celular: ${users[id].cell}</span></br>
          <span class="detail-title">Dados Pessoais</span></br>
          <span>Data de Nascimento: ${treatDate(users[id].dob.date)} | Idade: ${users[id].dob.age} anos</span></br>
          <span>Cadastrado(a) em: ${treatDate(users[id].registered.date)} | Há ${users[id].registered.age} anos</span>
      </div>
    </div>
  `;

  userDetails.innerHTML = showUser;
}

const url = window.location.href.split("=");

const id = url[1];

loadUser(id);