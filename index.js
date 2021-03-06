const express = require("express");
const cors = require("cors");
const scraper = require("./scraping");

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.json({
    message1: "1.  /search/(the movie name u wanna search)",

    message2: "2.  /movie/(id-IMDB of the movie u wanna see the detail)",

    message3: "Thanks to check out ! Best GL - Ngoc Phuc Do",
  });
});

app.get("/search/:title", (req, res) => {
  scraper.searchMovies(req.params.title).then((movies) => {
    res.json(movies);
  });
});

app.get("/movie/:imdbID", (req, res) => {
  scraper.getMovie(req.params.imdbID).then((movie) => {
    res.json(movie);
  });
});

const port = process.env.PORT || 8080;

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`App listening at port ${port}`);
  }
});
