import View from './view.js';
import icons from 'url:../../img/icons.svg';
import Preview_View from './preview-view.js';



class Results_View extends View{
    _parent_element = document.querySelector('.results');
    _error_msg = 'No recipes found.';
    _message = '';

    _generate_markup() {
        //FIXME WTF?
        /* Why don't we call preview-view.generate-markup? because we need to add the data to the data property. */
        return this._data.map(bookmark => Preview_View.render(bookmark , false)).join('');
    }
}

export default new Results_View();