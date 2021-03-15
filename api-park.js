const uniqid = require("uniqid");
const fs = require("fs");

const SOUBOR_SEZNAMU = "seznam.json";

let seznam = new Array();
if (fs.existsSync(SOUBOR_SEZNAMU)) {
  seznam = JSON.parse(fs.readFileSync(SOUBOR_SEZNAMU));
}

function seznamZprav(pozadavek, odpoved) {
  odpoved.writeHead(200, {"Content-type": "application/json"});
  odpoved.end(JSON.stringify(seznam));
}

function pridaniVozidla(pozadavek, odpoved) {
  let data = "";
  pozadavek.on('data', function (kusDat) {
    console.log(kusDat);
    data += kusDat;
  })
  pozadavek.on('end', function () {
    let parametry = JSON.parse(data);
    console.log(parametry);
    let obj = {};
    obj.id = uniqid();
    obj.zprava = parametry.zprava;
    seznam.push(obj);
    fs.writeFileSync(SOUBOR_SEZNAMU, JSON.stringify(seznam, null, 4));

    odpoved.writeHead(200, {"Content-type": "application/json",
            "Access-Control-Allow-Origin": "*"});
    odpoved.end(JSON.stringify({status:"OK"}));
  })
}

function detailVozidla(pozadavek, odpoved) {
  let data = "";
  pozadavek.on('data', function (kusDat) {
    console.log(kusDat);
    data += kusDat;
  })
  pozadavek.on('end', function () {
    let parametry = JSON.parse(data);
    console.log(parametry);
    let zprava = {status:"Chyba",chyba:"Nenalezeno"};
    for (let i = 0; i < seznam.length; i++) {
      if (seznam[i].id == parametry.id) {
        zprava = seznam[i];
        break;
      }
    }

    odpoved.writeHead(200, {"Content-type": "application/json",
            "Access-Control-Allow-Origin": "*"});
    odpoved.end(JSON.stringify(zprava));
  })
}

function aktualizaceSeznamu(pozadavek, odpoved) {
  let data = "";
  pozadavek.on('data', function (kusDat) {
    console.log(kusDat);
    data += kusDat;
  })
  pozadavek.on('end', function () {
    let parametry = JSON.parse(data);
    console.log(parametry);
    for (let i = 0; i < seznam.length; i++) {
      if (seznam[i].id == parametry.id) {
        seznam[i].zprava = parametry.zprava;
        seznam[i].upraveno = true;
        fs.writeFileSync(SOUBOR_SEZNAMU, JSON.stringify(seznam, null, 4));
        break;
      }
    }

    odpoved.writeHead(200, {"Content-type": "application/json",
            "Access-Control-Allow-Origin": "*"});
    odpoved.end(JSON.stringify({status:"OK"}));
  })
}

function odstraneniVozidla(pozadavek, odpoved) {
  let data = "";
  pozadavek.on('data', function (kusDat) {
    console.log(kusDat);
    data += kusDat;
  })
  pozadavek.on('end', function () {
    let parametry = JSON.parse(data);
    console.log(parametry);
    for (let i = 0; i < seznam.length; i++) {
      if (seznam[i].id == parametry.id) {
        seznam.splice(i, 1);
        fs.writeFileSync(SOUBOR_SEZNAMU, JSON.stringify(seznam, null, 4));
        break;
      }
    }

    odpoved.writeHead(200, {"Content-type": "application/json",
            "Access-Control-Allow-Origin": "*"});
    odpoved.end(JSON.stringify({status:"OK"}));
  })
}

exports.zpracovaniSeznamu = function(pozadavek, odpoved) {
  if (pozadavek.url.startsWith("/chat/seznamZprav")) {
    seznamZprav(pozadavek, odpoved);
  } else if (pozadavek.url.startsWith("/chat/pridaniVozidla")) {
    pridaniseznam(pozadavek, odpoved);
  } else if (pozadavek.url.startsWith("/chat/detailVozidla")) {
    detailVozidla(pozadavek, odpoved);
  } else if (pozadavek.url.startsWith("/chat/aktualizaceSeznamu")) {
    aktualizaceSeznamu(pozadavek, odpoved);
  } else if (pozadavek.url.startsWith("/chat/odstraneniVozidla")) {
    odstraneniVozidla(pozadavek, odpoved);
  } else {
    odpoved.writeHead(404);
    odpoved.end();
  }

}