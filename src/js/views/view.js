import icons from 'url:../../img/icons.svg';


export default class View {
    _data;


    render(data , render=true) {
      if(!data || (Array.isArray(data) && data.length===0)) return this.render_error();

      this._data = data;
      const markup = this._generate_markup();

      if(!render) return markup;
      
      //Adding recipe to the DOM + clear out the container
      this._clear();
      this._parent_element.insertAdjacentHTML('afterbegin', markup);
    } 

    //FIXME WHAT IN THE NAME OF GOD.
    update(data) {
      
      this._data = data;
      const new_markup = this._generate_markup();
      const new_DOM = document.createRange().createContextualFragment(new_markup);
      const new_elements = Array.from(new_DOM.querySelectorAll('*'));
      const cur_elements = Array.from(this._parent_element.querySelectorAll('*'));

      new_elements.forEach((new_el , i) => {
        const cur_el = cur_elements[i];

        //Update changed text:
        if(!new_el.isEqualNode(cur_el) && 
            new_el.firstChild?.nodeValue.trim() !== '') {
          cur_el.textContent = new_el.textContent;
        }

        //Update changed ATTRIBUTES:
        if(!new_el.isEqualNode(cur_el)){
          Array.from(new_el.attributes).forEach(attr => cur_el.setAttribute(attr.name , attr.value));
        }
      });
    }


    _clear() {
        this._parent_element.innerHTML = '';
    }

    //Loading spinner before recipe coming up
    render_spinner = function() {
      const html = `
        <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>
      `;
        this._clear();
        this._parent_element.insertAdjacentHTML('afterbegin' , html);
    }


    render_error(message = this._error_msg) {
      const markup = `
        <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
          <p>${message}</p>
        </div>
      `;
      this._clear();
      this._parent_element.insertAdjacentHTML('afterbegin' , markup);

    }

    render_message(message = this._message) {
      const markup = `
        <div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
          <p>${message}</p>
        </div>
      `;
      this._clear();
      this._parent_element.insertAdjacentHTML('afterbegin' , markup);
    }
}