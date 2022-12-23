const http = require("http");
const fs = require("fs");
var requests = require("requests");

const homeFile = fs.readFileSync("index.html", "utf-8");

const replaceVal = (tempVal, orgval) => {
  let temperature = tempVal.replace("{%tempval%}", orgval.main.temp);
  temperature = temperature.replace("{%tempmin%}", orgval.main.temp_min);
  temperature = temperature.replace("{%tempmax%}", orgval.main.temp_max);
  temperature = temperature.replace("{%location%}", orgval.name);
  temperature = temperature.replace("{%country%}", orgval.sys.country);
    temperature = temperature.replace("{%tempstatus}", orgval.weather[0].main);
  return temperature;
};
const server = http.createServer((req, res) => {
    if (req.url == "/") {
      requests('https://api.openweathermap.org/data/2.5/weather?q=Pune&units=metric&appid=2e609152a350062002948daab933d75d')
        .on("data", (chunk) => {
          const objdata = JSON.parse(chunk);
          const arrData = [objdata];
          //console.log(arrData[0].main.temp);
          const realTimeData = arrData
          .map((val) => replaceVal(homeFile, val))
          .join("");

          res.write(realTimeData);
          console.log(realTimeData);
        })
  .on("end", (err) => {
    if (err) return console.log("connection closed due to errors", err);

    res.end();
  });

});

server.listen(3000, () => {
 console.log('Server started at 3000');
});
