class Search_View {
    _parent_element = document.querySelector('.search');

    get_query() {
        const query = this._parent_element.querySelector('.search__field').value;
        this._clear_input();
        return query;
    }

    _clear_input() {
        this._parent_element.querySelector('.search__field').value = '';
    }

    add_handler_search(handler) {
        //Listening for either 'search btn' or 'entering the search field'
        this._parent_element.addEventListener('submit' , function(e) {
            e.preventDefault();
            handler();
        });

    }
}

export default new Search_View();