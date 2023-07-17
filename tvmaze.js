"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */
async function getShowsByTerm(term) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  const q = term;
  let response = await axios.get(`http://api.tvmaze.com/search/shows`,{params:{q}});
  console.log(response.data);
   const shows = new Array();
   for (const data of response.data) {
      const show = data.show
     const {id,name, summary,image} = show;
     const incomingShow = new Object()
     incomingShow.id = id,
     incomingShow.name =name;
     incomingShow.summary= summary;
     incomingShow.image =image;
     shows.push(incomingShow);
     
   }
   return shows;

  
}

/** Given list of shows, create markup for each and to DOM */
function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img

              src="${show.image.original??'https://tinyurl.com/tv-missing' }""
              alt="${show.name}"
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary??'' }</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($show);
  }
}
/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */
async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);
  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});

$showsList.on("click", async (e)=>{
  const elementType = e.target;
  const classList =  Array.from(elementType.classList)
   
 if(classList.includes("Show-getEpisodes"))
 {
    const showId = e.target.parentElement.parentElement.parentElement.getAttribute('data-show-id');
    console.log(showId);
    const episodes = await getEpisodesOfShow(showId);
    console.log(episodes);
    populateEpisodes(episodes);
    const episodeArea = document.getElementById("episodesArea")
    episodeArea.style.display ="";
 }
  
})

/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

 async function getEpisodesOfShow(id) {
 const q = id;
 let response = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
 const episodes = new Array();
 for (const iterator of response.data) {
   const {id,name, season,number} = iterator;
   const episode = new Object();
   episode.id=id
   episode.name = name;
   episode.season = season;
   episode.number = number
   episodes.push(episode);
 }
 console.log(episodes);
 return episodes;
 }
/** Write a clear docstring for this function... */
 function populateEpisodes(episodes){
    const episodeList = document.getElementById("episodesList");
    episodeList.innerHTML ="";
    for (const episode of episodes) {
    const newLiElement = document.createElement("LI")
    newLiElement.innerHTML = `${episode.name} (season ${episode.season}, episode ${episode.number} )`;
    episodeList.append(newLiElement);
  }
   

 }

