import { async } from "regenerator-runtime";
import {API_URL , RES_PER_PAGE , KEY} from './config.js';
import {get_json , send_json} from './helpers.js';

export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        page: 1,
        results_per_page : RES_PER_PAGE,
    },
    bookmarks:[],
};

const create_recipe_data = function(data) {
    const recipe = data.recipe;
        return {
            id: recipe.id,
            title: recipe.title,
            publisher: recipe.publisher,
            source_url: recipe.source_url,
            image: recipe.image_url,
            servings: recipe.servings, 
            cooking_time: recipe.cooking_time,
            ingredients: recipe.ingredients,
            //FIXME ??
            ...(recipe.key && {key: recipe.key }),
        };
};


export const load_recipe = async function(id) {
    try{
        //FIXME what's ?key=${KEY} ?
        const data = await get_json(`${API_URL}${id}?key=${KEY}`)
        state.recipe = create_recipe_data(data);

        //Check if the recipe we wanna load has been bookmarked:
        if(state.bookmarks.some(b => b.id === id))  
            state.recipe.bookmarked = true;
        else state.recipe.bookmarked = false; 

    }catch(err) {
        console.error(err);
        throw err;
    };
};


export const load_search_results = async function(query) {
    try{
        state.search.query = query;

        const data = await get_json(`${API_URL}?search=${query}&key=${KEY}`);
        state.search.results = data.recipes.map(rec => {
            return {
                id: rec.id,
                title: rec.title,
                publisher: rec.publisher,
                image: rec.image_url,
                ...(rec.key && {key: rec.key })
            };
        });
         // console.log(state.search.results);
         state.search.page = 1;

    }catch (err) {
        console.error(err);
        throw err;
    }
};

//Pagination: returns part of the results corresponding with the page number:
export const get_search_results_page = function(page = state.search.page) {
    //Save the page number we're in rn.
    state.search.page = page;
    const start = ( page- 1)* state.search.results_per_page;
    const end = page * state.search.results_per_page;
    return state.search.results.slice(start , end);
}


export const update_servings = function(new_serv) {
    state.recipe.ingredients.forEach(ing => {
        ing.quantity = (ing.quantity*new_serv) / state.recipe.servings;
    });

    state.recipe.servings = new_serv;
}


const persist_bookmarks = function() {
    localStorage.setItem('bookmarks' , JSON.stringify(state.bookmarks));
};

export const add_bookmark = function(recipe) {
    //add bookmark
    state.bookmarks.push(recipe);

    //mark current recipe as bookmarked
    if(recipe.id === state.recipe.id) state.recipe.bookmarked = true;

    persist_bookmarks();
}

export const remove_bookmark = function(id) {
    const index = state.bookmarks.findIndex(el => el.id===id);
    state.bookmarks.splice(index , 1);

    //mark current recipe as NOT bookmarked
    if(id === state.recipe.id) state.recipe.bookmarked = false;

    persist_bookmarks();
}

const init = function() {
    const storage = localStorage.getItem('bookmarks');
    if(storage) state.bookmarks = JSON.parse(storage);
}
init();

const clear_bookmarks = function() {
    localStorage.clear('bookmarks');
};
// clear_bookmarks();

export const upload_recipe = async function(new_recipe) {
    try{
        //FIXME explain
        const ings = Object.entries(new_recipe).filter(
            entry => entry[0].startsWith('ingredient') && entry[1] !== ''
            ).map(ing => {

                const ing_arr = ing[1].split(',').map(el => el.trim());
                // const ing_arr = ing[1].replaceAll(' ', '').split(',');
                //check if the array has the length of three:
                if(ing_arr.length !== 3) throw new Error('wrong ingredient format')
                const [quantity,unit,description] = ing_arr;
                return {quantity : quantity? +quantity: null, unit , description};
            })

        const recipe = {
            title: new_recipe.title,
            source_url: new_recipe.sourceUrl,
            image_url: new_recipe.image,
            publisher: new_recipe.publisher,
            cooking_time: +new_recipe.cookingTime,
            servings: +new_recipe.servings,
            ings,
        };
        console.log(recipe);

        const data = await send_json(`${API_URL}?key=${KEY}` , recipe);
        state.recipe = create_recipe_data(data);
        add_bookmark(state.recipe);

    } catch(err) {
        throw err;
    };

    
}
