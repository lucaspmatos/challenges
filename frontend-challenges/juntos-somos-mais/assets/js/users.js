let usersElement = document.querySelector('#users');

(function() {
  var cors_api_host = 'cors-anywhere.herokuapp.com';
  var cors_api_url = 'https://' + cors_api_host + '/';
  var slice = [].slice;
  var origin = window.location.protocol + '//' + window.location.host;
  var open = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function() {
      var args = slice.call(arguments);
      var targetOrigin = /^https?:\/\/([^\/]+)/i.exec(args[1]);
      if (targetOrigin && targetOrigin[0].toLowerCase() !== origin &&
          targetOrigin[1] !== cors_api_host) {
          args[1] = cors_api_url + args[1];
      }
      return open.apply(this, args);
  };
})();
function capitalize(word) {
  return word
    .toLowerCase()
    .replace(/\w/, firstLetter => firstLetter.toUpperCase());
}

function treatStreet(string) {
  const street = string.split(' ');
  let treatedStreet = '';

  const number = street.shift();
  street.map((value) => {
    if (value.length <= 2 && !value.startsWith('d')) {
      treatedStreet += `${value}`;
    } else if (value.length <= 3 && value.startsWith('d')) {
      treatedStreet += ` ${value}`;
    } else {
      treatedStreet += ` ${capitalize(value)}`;
    }
  });

  return treatedStreet + `, ${number}`;
}

function treatString(str) {
  const string = str.split(' ');
  let treatedString = '';
  
  string.map((value) => {
    if (value.length <= 3 && value.startsWith('d')) {
      treatedString += ` ${value}`;
    } else {
      treatedString += ` ${capitalize(value)}`;
    }
  });

  return treatedString;
}

function getUsers() {
  axios
    .get("https://jsm-challenges.s3.amazonaws.com/frontend-challenge.json")
    .then(function (response) {
      console.log(response);

      let users = response.data.results;

      console.log(users);

      let aux = 0;

      let cont = 0;

      let obj = {};

      for (let i = 0; i < 18; i += 1) {
        if (cont <= 9) {
          obj[aux] = {
            users: 'string',
          };
        }

        if (cont === 9) {
          aux += 1;
        }

        cont += 1;
      }

      console.log(obj);

      /* let showUsers = "";

      const k = parseInt(users.length/3);

      let j = 0;
      let l = 0;

      for (let i = 0; i < k; i += 1) {
        let usersContainer = document.createElement('div');

        usersContainer.setAttribute('class', 'users-container');

        l = j + 3;

        for (j; j < l; j += 3) {
          showUsers += `
          <div id="users-box" class="users-box">
            <img src="${users[j].picture.large}" class="user-picture" />
            <div class="users-details">
              <h5>${treatString(users[j].name.first + ' ' + users[j].name.last)}</h5>
              <span class="street">${treatStreet(users[j].location.street)}</span>
              <span class="city">${treatString(users[j].location.city)} </br>
              ${treatString(users[j].location.state)} - CEP: ${users[j].location.postcode}</span>
            </div>
          </div>
          `; 
        }

        usersContainer.innerHTML = showUsers;

        usersElement.appendChild(usersContainer);
      } */
    })
    .catch(function (error) {
      console.log(error);
    });
}

getUsers();