const fetch = require("node-fetch");
const cheerio = require("cheerio");

const searchURL = "https://www.imdb.com/find?ref_=nv_sr_sm&q=";
const movieURL = "https://www.imdb.com/title/";

const searchCache = {};
const movieCache = {};

function searchMovies(searchTerm) {
  if (searchCache[searchTerm]) {
    Promise.resolve(searchCache[searchTerm]);
    console.log("Serving from cache: " + searchTerm);
  }
  return fetch(`${searchURL}${searchTerm}`)
    .then((Response) => Response.text())
    .then((body) => {
      const movies = [];
      const $ = cheerio.load(body);
      $(".findResult").each(function (i, element) {
        const $element = $(element);
        const $imageURL = $element.find("td a img");
        const $title = $element.find("td.result_text a");
        const imdbID = ($title.attr("href").match(/title\/(.*)\//) || [])[1];
        const movie = {
          image: $imageURL.attr("src"),
          title: $title.text(),
          imdbID,
        };
        movies.push(movie);
      });

      searchCache[searchTerm] = movies;
      return movies;
    });
}

function getMovie(imdbID) {
  if (movieCache[imdbID]) {
    Promise.resolve(movieCache[imdbID]);
    console.log("Serving from cache: " + imdbID);
  }
  return fetch(`${movieURL}${imdbID}`).then((Response) =>
    Response.text().then((body) => {
      const $ = cheerio.load(body);
      const title = $(".title_wrapper h1").text().trim();
      const rating = $(".ratingValue strong span").text();
      const runTime = $(".subtext time").text().trim();
      const category = $(".subtext a");
      const cates = [];
      category.each(function (i, element) {
        const cate = $(element).text();
        cates.push(cate);
        return cates;
      });
      const moviePoster = $(".poster a img").attr("src");
      const sumary = $(".summary_text").text().trim();
      const director = $(".credit_summary_item a")[0];
      const directorName = director.children[0].data;
      const stars = $(".plot_summary ").children().last().text().trim();
      const stars1 = stars.split("\n")[1];
      const stars2 = stars1.split("            ")[0];
      const storyLine = $(".canwrap p span").text().trim();
      const trailerLink =
        "https://www.imdb.com" + $(".slate_wrapper .slate a").attr("href");

      const movie = {
        title,
        rating,
        runTime,
        cates,
        moviePoster,
        sumary,
        directorName,
        stars: stars2,
        storyLine,
        trailerLink,
      };

      movieCache[imdbID] = movie;

      return movie;
    })
  );
}
getMovie("tt6751668");
module.exports = {
  searchMovies,
  getMovie,
};
