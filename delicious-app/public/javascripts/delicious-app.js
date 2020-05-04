import '../sass/style.scss';

import { $, $$ } from './modules/bling';

import autocomplete from './modules/autocomplete';

console.log('input deberia impirmir');

autocomplete( $('#address'), $('#lat'), $('#lng'));