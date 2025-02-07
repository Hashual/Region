const path = "https://geo.api.gouv.fr";
const regList = document.getElementById("regions");
const dptList = document.getElementById("departements");
const cityList = document.getElementById("villes");
const cityDetails = document.getElementById("cityDetails");

const displayError = (message, type = "alert") => {
  alert.log(message, type);
};

/**
 *
 * Mise à jour du compteur des listes
 * @param {*} list
 * @param {*} value
 */
const setCounter = (list, value) => {
  list.parentElement.parentElement.querySelector(".counter").innerText = value;
};

/**
 * Affichage des infos de la commune survolée
 * @param {*} e
 */
const displayInfo = (e) => {
  //Maj du contenu
  const elt = e.target;
  cityDetails.innerHTML = `<h2 class="border-b-2 border-gray-500  ">${
    elt.innerText
  }</h2><p class="text-sm text-gray-500">Population : ${elt.getAttribute(
    "elt-population"
  )}<br>Surface : ${elt.getAttribute("elt-surface")}</p>`;

  //Positionnement
  cityDetails.style.left =
    e.target.offsetLeft + e.target.offsetWidth - cityDetails.offsetWidth + "px";
  cityDetails.style.top = e.target.offsetTop - 10 + "px";
  cityDetails.style.display = "block";
};

/**
 * Fonction de changement du style d'un item sélectionné dans une liste
 * @param {*} e
 */
const setItemStatus = (e) => {
  const style = "bg-slate-100";
  //On désactive les autres régions actives
  const oldActive = e.currentTarget.querySelectorAll(`.${style}`);
  [...oldActive].forEach((element) => element.classList.remove(style));

  e.target.classList.add(style); //On modifie l'élement sélectionné
};

const getRegions = async () => {
  fetch(`https://geo.api.gouv.fr/regions`).then((response) => {
    return response.json();
  }).then((data) => {
    console.log(data);
    displayRegions(data);
  });
};

const displayRegions = (data) => {
  data.forEach((region) => {
    const option = document.createElement("option");
    option.value = region.code;
    option.text = region.nom;
    regList.appendChild(option);
  });
  setCounter(regList, data.length);

}

getRegions();

const getDepartements = (event) => {
  setItemStatus(event);
  fetch(`${path}/regions/${event.target.value}/departements`).then((response) => {
    return response.json();
  }).then((data) => {
    console.log(data);
    displayDepartements(data);
  });
};

const displayDepartements = (data) => {
  dptList.innerHTML = "";
  data.forEach((departement) => {
    const option = document.createElement("option");
    option.value = departement.code;
    option.text = departement.nom;
    dptList.appendChild(option);
  });
  setCounter(dptList, data.length);
}

regList.addEventListener("click", getDepartements);

dptList.addEventListener("click", (event) => {
  setItemStatus(event);
  fetch(`${path}/departements/${event.target.value}/communes?fields=code,nom,population,surface`).then((response) => {
    return response.json();
  }).then((data) => {
    console.log(data);
    displayCities(data);
  });
});

const displayCities = (data) => {
  cityList.innerHTML = "";
  data.forEach((city) => {
    const option = document.createElement("option");
    option.value = city.code;
    option.text = city.nom;
    option.setAttribute("elt-population", city.population);
    option.setAttribute("elt-surface", city.surface);
    option.addEventListener("mouseover", displayInfo);
    cityList.appendChild(option);
  });
  setCounter(cityList, data.length);
}



