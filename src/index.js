import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const searchBox = document.querySelector("#search-box");
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchBox.addEventListener('input', debounce(onSearchCountry, DEBOUNCE_DELAY));

    function onSearchCountry(evt) {
        const searchQuery = evt.target.value.trim();

        if (!searchQuery) {
            emptyInput();
            return;
        }

        fetchCountries(searchQuery)
            .then(renderCountryCard)
            .catch(error => {
                emptyInput();
                Notiflix.Notify.info('Oops, there is no country with that name.');
            });   
}

function emptyInput() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}

function renderCountryCard(country) {
    if (country.length > 10) {
        emptyInput();
        Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
        return;
    };
    
    if (country.length < 10 && country.length > 2) {
        emptyInput();
        countryList.innerHTML = countryListMarkup(country);
        return;
    };
    
    if (country.length = 1) {
        emptyInput();
        countryList.innerHTML = countryInfoMarkup(country);
        return;
    };
}

function countryListMarkup(country) {
    return country
      .map(({ flags, name }) => {
        return `<li>
                      <img src="${flags.svg}" alt="${name.official}" width="30" height="20"/>&nbsp<span> ${name.official}</span>
                  </li>`;
      })
      .join('');
  }

function countryInfoMarkup(country) {
    return country
      .map(({ flags, name, capital, population, languages }) => {
        return `<img src="${flags.svg}" alt="${name.official}" width="30" height="20" />&nbsp
                  <b><span class="title"> ${name.official}</span></b>
                  <p><b><span>Capital:</b></span> ${capital}</p>
                  <p><b><span>Population:</b></span> ${population}</p>
                  <p><b>
                      <span>Languages:</b></span> 
                      ${Object.values(languages).join(', ')}
                  </p>`;
      })
      .join('');
  }
 
