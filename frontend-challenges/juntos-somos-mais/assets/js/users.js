let usersElement = document.querySelector('#users')

// Função que permite o consumo da API
;(function () {
  var cors_api_host = 'cors-anywhere.herokuapp.com'
  var cors_api_url = 'https://' + cors_api_host + '/'
  var slice = [].slice
  var origin = window.location.protocol + '//' + window.location.host
  var open = XMLHttpRequest.prototype.open
  XMLHttpRequest.prototype.open = function () {
    var args = slice.call(arguments)
    var targetOrigin = /^https?:\/\/([^\/]+)/i.exec(args[1])
    if (
      targetOrigin &&
      targetOrigin[0].toLowerCase() !== origin &&
      targetOrigin[1] !== cors_api_host
    ) {
      args[1] = cors_api_url + args[1]
    }
    return open.apply(this, args)
  }
})()

function capitalize(word) {
  return word
    .toLowerCase()
    .replace(/\w/, (firstLetter) => firstLetter.toUpperCase())
}

function treatStreet(string) {
  const street = string.split(' ')
  let treatedStreet = ''

  const number = street.shift()

  street.map((value) => {
    if (value.length <= 2 && !value.startsWith('d')) {
      treatedStreet += `${value}`
    } else if (value.length <= 3 && value.startsWith('d')) {
      treatedStreet += ` ${value}`
    } else {
      treatedStreet += ` ${capitalize(value)}`
    }
  })

  return treatedStreet + `, ${number}`
}

function treatString(str) {
  const string = str.split(' ')
  let treatedString = ''

  string.map((value) => {
    if (value.length <= 3 && value.startsWith('d')) {
      treatedString += ` ${value}`
    } else {
      treatedString += ` ${capitalize(value)}`
    }
  })

  return treatedString
}

let currentPage = 1
let recordsPerPage = 9
let numPages = 0
let users = ''

async function getUsers() {
  const { data } = await axios.get(
    'https://jsm-challenges.s3.amazonaws.com/frontend-challenge.json'
  )

  return data.results
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--
    changePage(currentPage)
  }
}

function nextPage() {
  if (currentPage < numPages) {
    currentPage++
    changePage(currentPage)
  }
}

function getNumPages(usersList) {
  numPages = Math.ceil(usersList.length / recordsPerPage)
}

let usersContainer = document.createElement('div')
usersContainer.setAttribute('class', 'users-container')

/* document.getElementById("search-button").addEventListener("submit", searchUser);

function searchUser(e) {
  e.preventDefault();
  const search = document.getElementById("search").value || "";
  changePage(1, search.toLowerCase());
} */
function searchFunction() {
  let input = document.getElementById('search').value
  changePage(1, input)
}
async function changePage(page, result = '') {
  const test = await getUsers()

  const word = result

  users = test.filter((value) => {
    if (value.name.first.includes(word) || value.name.last.includes(word)) {
      return value
    }
  })

  console.log('users', users)

  getNumPages(users)

  let btn_next = document.getElementById('btn_next')
  let btn_prev = document.getElementById('btn_prev')

  // Validate page
  if (page < 1) page = 1
  if (page > numPages) page = numPages

  let showUsers = ''

  usersContainer.innerHTML = ''

  for (
    let i = (page - 1) * recordsPerPage;
    i < page * recordsPerPage && i < users.length;
    i++
  ) {
    showUsers += `
    <div id="users-box" class="users-box">
      <img src="${users[i].picture.large}" class="user-picture" />
      <div class="users-details">
        <h5>${treatString(users[i].name.first + ' ' + users[i].name.last)}</h5>
        <span class="street">${treatStreet(users[i].location.street)}</span>
        <span class="city">${treatString(users[i].location.city)} </br>
        ${treatString(users[i].location.state)} - CEP: ${
      users[i].location.postcode
    }</span>
      </div>
    </div>
    `
  }

  usersContainer.innerHTML = showUsers

  usersElement.appendChild(usersContainer)

  if (page == 1) {
    btn_prev.style.visibility = 'hidden'
  } else {
    btn_prev.style.visibility = 'visible'
  }

  if (page == numPages) {
    btn_next.style.visibility = 'hidden'
  } else {
    btn_next.style.visibility = 'visible'
  }
}

window.onload = function () {
  changePage(1, '')
}
