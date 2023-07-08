import View from './view.js';
import icons from 'url:../../img/icons.svg';
import Preview_View from './preview-view.js';


class Bookmark_View extends View{
    _parent_element = document.querySelector('.bookmarks__list');
    _error_msg = 'No bookmarks yet.';
    _message = '';

    //FIXME needed this to for the localstorage implementation to work. why?
    add_handler_render(handler) {
        window.addEventListener('load' , handler);
    }

    _generate_markup() {
        //FIXME WTF?
        /* Why don't we call preview-view.generate-markup? because we need to add the data to the data property. */
        return this._data.map(bookmark => Preview_View.render(bookmark , false)).join('');
    }

    
}

export default new Bookmark_View();