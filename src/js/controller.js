import * as model from './model.js';
import {MODAL_CLOSE_SEC} from './config.js';
import Recipe_View from './views/recipe-view.js';
import Search_View from './views/search-view.js';
import Results_View from './views/results-view.js';
import Pagination_View from './views/pagination-view.js';
import Bookmark_View from './views/bookmark-view.js';
import Add_Recipe_View from './views/add-recipe-view.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import bookmarkView from './views/bookmark-view.js';


// https://forkify-api.herokuapp.com/v2

// if(module.hot) {
//   module.hot.accept();
// }

const control_recipe = async function () {
  try {
    //finding the recipe id from url-without the first hashtag character-:
    const id = window.location.hash.slice(1);
    if(!id) return;
    //Spinner: 
    Recipe_View.render_spinner(); 

    //Update results view to mark selected search result 
    Results_View.update(model.get_search_results_page());  //FIXME WAIT WHAT?
    
    //Loading the recipe
    await model.load_recipe(id);
    
    //Rendering the recipe
    Recipe_View.render(model.state.recipe);

    //Updating bookmarks view
    Bookmark_View.update(model.state.bookmarks);

  } catch (err) { Recipe_View.render_error() }
};

const control_search_results = async function() {
  try{
    Results_View.render_spinner();
    //1. Get search query
    const query = Search_View.get_query();
    if(!query) return;

    //2.Load search results
    await model.load_search_results(query);

    //3.Render results
    //All results in one page:
    // Results_View.render(model.state.search.results);
    //Pagination:
    Results_View.render(model.get_search_results_page());

    //4.Render initial pagination btns
    Pagination_View.render(model.state.search);  //Data be saved in 'data' att of View classes.
  } catch(err) {

  }
};


//function that runs whenever one of the pagination btns in clicked:
const control_pagination = function(goto_page) {
  //Render NEW results
  Results_View.render(model.get_search_results_page(goto_page));  //page gets updated.

  //Render NEW pagination btns
  Pagination_View.render(model.state.search);  //Data be saved in 'data' att of View classes.

}


const control_servings = function(new_serv) {
  //Update the recipe servings in state
  model.update_servings(new_serv);

  //Update the recipe view
  // Recipe_View.render(model.state.recipe);
  Recipe_View.update(model.state.recipe);
}

const control_bookmark = function() {
  //Adding to bookmarks:
  if(!model.state.recipe.bookmarked)  model.add_bookmark(model.state.recipe);
  //Removing from bookmarked:
  else model.remove_bookmark(model.state.recipe.id);
  
  //Updating recipe view:
  Recipe_View.update(model.state.recipe);
  
  //Render bookmarks:
  Bookmark_View.render(model.state.bookmarks);

}

const control_bookmark_save = function() {
  bookmarkView.render(model.state.bookmarks);
}

const control_add_recipe = async function(new_recipe) {
  try {
    //spinner
    Add_Recipe_View.render_spinner();

    //Upload the new recipe data
    await model.upload_recipe(new_recipe);

    //Render recipe:
    Recipe_View.render(model.state.recipe);

    //Success message
    Add_Recipe_View.render_message();

    //render bookmark view
    Bookmark_View.render(model.state.bookmarks);

    //change ID in url
    window.history.pushState(null , '' ,`#${model.state.recipe.id}`);

    //Close form window
    setTimeout(function () {
      Add_Recipe_View.toggle_window();
    } , MODAL_CLOSE_SEC*1000)

  }catch(err) {
    console.error(err);
    Add_Recipe_View.render_error(err.message);
  }

}


const init = function() {
  Bookmark_View.add_handler_render(control_bookmark_save);
  Recipe_View.add_handler_render(control_recipe);
  Search_View.add_handler_search(control_search_results);
  Pagination_View.add_handler_click(control_pagination);
  Recipe_View.add_handler_update_servings(control_servings);
  Recipe_View.add_handler_bookmark(control_bookmark);
  Add_Recipe_View._add_handler_upload(control_add_recipe);
};
init();


