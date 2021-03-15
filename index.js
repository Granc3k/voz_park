const http = require("http");
const fs = require("fs");
const url = require("url");
const path = require("path");

const zpracovaniVozidel = require("./api-park.js").zpracovaniVozidel;

function zpracovaniPozadavku(pozadavek, odpoved) {
  console.log(pozadavek.url);
  if (pozadavek.url == "/") {
    odpoved.writeHead(200, {"Content-type": "text/html"});
    odpoved.end(fs.readFileSync("index.html"));
  } else if (pozadavek.url == "/script.js") {
    odpoved.writeHead(200, {"Content-type": "text/javascript"});
    odpoved.end(fs.readFileSync("script.js"));
  } else if (pozadavek.url == "/style.css") {
    odpoved.writeHead(200, {"Content-type": "text/css"});
    odpoved.end(fs.readFileSync("style.css"));
  } else if (pozadavek.url.startsWith("/obrazky/")) {
    let nazevSouboru = path.basename(pozadavek.url);
    let pripona = path.extname(pozadavek.url);
    console.log("nazevSouboru:"+nazevSouboru);
    console.log("pripona:"+pripona);
    odpoved.writeHead(200, {"Content-type": "image/"+pripona});
    odpoved.end(fs.readFileSync("./obrazky/"+nazevSouboru));
  } else if (pozadavek.url.startsWith("/chat/")) {
    zpracovaniVozidel(pozadavek, odpoved);
  } else {
    odpoved.writeHead(404);
    odpoved.end();
  }
}

let srv = http.createServer(zpracovaniPozadavku);
srv.listen(8080);
