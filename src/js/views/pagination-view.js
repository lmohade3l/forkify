import View from './view.js';
import icons from 'url:../../img/icons.svg';


class Pagination_View extends View{
    _parent_element = document.querySelector('.pagination'); 

    add_handler_click(handler) {
        //Event-Delegation cause we don't wanna listen for events on two btns individually:
        this._parent_element.addEventListener('click' , function(e) {
            const btn = e.target.closest('.btn--inline');
            if(!btn) return;  

            const goto_page = +btn.dataset.goto;
            handler(goto_page);
        })
    }

    _generate_markup() {
        const cur_page = this._data.page;
        const num_pages = Math.ceil(this._data.results.length / this._data.results_per_page);

        //page 1 and there are other pages
        if(cur_page===1 && num_pages>1){
            return `
                <button data-goto="${cur_page +1}" class="btn--inline pagination__btn--next">
                    <span>Page ${cur_page +1}</span>
                    <svg class="search__icon">
                        <use href="${icons}#icon-arrow-right"></use>
                    </svg>
                </button>
            `
        }

        //last page
        if(cur_page===num_pages){
            //Only previous page
            return `
                <button data-goto="${cur_page -1}" class="btn--inline pagination__btn--prev">
                    <svg class="search__icon">
                        <use href="${icons}#icon-arrow-left"></use>
                    </svg>
                    <span>Page ${cur_page -1}</span>
                </button>
            `
        }
        
        //other pages
        if(cur_page < num_pages){
            return `
                <button data-goto="${cur_page -1}" class="btn--inline pagination__btn--prev">
                    <svg class="search__icon">
                        <use href="${icons}#icon-arrow-left"></use>
                    </svg>
                    <span>Page ${cur_page -1}</span>
                </button>
                <button data-goto="${cur_page +1}" class="btn--inline pagination__btn--next">
                    <span>Page ${cur_page +1}</span>
                    <svg class="search__icon">
                        <use href="${icons}#icon-arrow-right"></use>
                    </svg>
                </button>
            `
        }

        //page 1 and there are NO other pages
        return '';
    }
};


export default new Pagination_View();