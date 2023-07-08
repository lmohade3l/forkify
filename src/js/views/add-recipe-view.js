import View from "./view";
import icons from 'url:../../img/icons.svg';

class Add_Recipe_View extends View {
    _parent_element = document.querySelector('.upload');
    _message = 'recipe successfully uploaded';

    _window = document.querySelector('.add-recipe-window');
    _overlay = document.querySelector('.overlay');
    _btn_open = document.querySelector('.nav__btn--add-recipe');
    _btn_close = document.querySelector('.btn--close-modal');

    constructor() {
        super();
        this._add_handler_show_modal();
        this._add_handler_hide_modal();
    }

    toggle_window() {
        this._overlay.classList.toggle('hidden');
        this._window.classList.toggle('hidden');

    }

    //We run this function here as soon as the object is created.
    //The controller does not have anything to do with this.
    _add_handler_show_modal() {
        this._btn_open.addEventListener('click' , this.toggle_window.bind(this)); 
            //you can't use this here. this here refers to btn_open.
            // this._overlay.classList.toggle('hidden');
            // this._window.classList.toggle('hidden');
    }

    _add_handler_hide_modal() {
        this._btn_close.addEventListener('click' , this.toggle_window.bind(this));
        this._overlay.addEventListener('click' , this.toggle_window.bind(this));
    }

    _add_handler_upload(handler) {
        this._parent_element.addEventListener('submit' , function(e) {
            e.preventDefault();

            const data_array = [...new FormData(this)];
            const data = Object.fromEntries(data_array);
            handler(data);
        })
    }

    _generate_markup() {

    }
}

export default new Add_Recipe_View();