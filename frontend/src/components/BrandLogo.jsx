import audi from '../assets/brands/audi.svg';
import bmw from '../assets/brands/bmw.svg';
import chevrolet from '../assets/brands/chevrolet.svg';
import citroen from '../assets/brands/citroen.svg';
import fiat from '../assets/brands/fiat.svg';
import ford from '../assets/brands/ford.svg';
import honda from '../assets/brands/honda.svg';
import husqvarna from '../assets/brands/husqvarna.svg';
import hyundai from '../assets/brands/hyundai.svg';
import jeep from '../assets/brands/jeep.svg';
import kia from '../assets/brands/kia.svg';
import mitsubishi from '../assets/brands/mitsubishi.svg';
import nissan from '../assets/brands/nissan.svg';
import peugeot from '../assets/brands/peugeot.svg';
import porsche from '../assets/brands/porsche.svg';
import ram from '../assets/brands/ram.svg';
import renault from '../assets/brands/renault.svg';
import toyota from '../assets/brands/toyota.svg';
import volkswagen from '../assets/brands/volkswagen.svg';
import volvo from '../assets/brands/volvo.svg';
import kawasaki from '../assets/brands/kawasaki.svg';
import mercedes from '../assets/brands/mercedes.svg';

const BRAND_MAP = {
    audi: audi,
    bmw: bmw,
    chevrolet: chevrolet,
    gm: chevrolet,
    citroen: citroen,
    'citroën': citroen,
    fiat: fiat,
    ford: ford,
    honda: honda,
    husqvarna: husqvarna,
    hyundai: hyundai,
    jeep: jeep,
    kia: kia,
    mitsubishi: mitsubishi,
    nissan: nissan,
    peugeot: peugeot,
    porsche: porsche,
    ram: ram,
    renault: renault,
    toyota: toyota,
    volkswagen: volkswagen,
    volks: volkswagen,
    'volks wagon': volkswagen,
    vw: volkswagen,
    volvo: volvo,
    kawasaki: kawasaki,
    mercedes: mercedes,
};

function normalizeBrand(brand = '') {
  return brand
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export default function BrandLogo({ marca }) {
  const normalized = normalizeBrand(marca);

  const logo = BRAND_MAP[normalized];

  if (!logo) {
    return null;
  }

    return (
    <span className="brand-logo-container">
        <img
        src={logo}
        alt={marca}
        className="brand-logo"
        loading="lazy"
        />
    </span>
    );
}