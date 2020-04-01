import '@babel/polyfill';
import { showLineGraph, showColumnGraph } from './graph';

const lineGraphAffected = document.getElementById('chartContainer');
const columnGraphAffected = document.getElementById('chartContainer2');
const lineGraphCountry = document.getElementById('chartContainerCountry');

if (lineGraphAffected) {
  showLineGraph('chartContainer', true);
}

if (columnGraphAffected) {
  showColumnGraph();
}

if (lineGraphCountry) {
  const cc = document.getElementById('chartContainerCountry').dataset
    .countrycode;
  showLineGraph('chartContainerCountry', false, cc);
}
