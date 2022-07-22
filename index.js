const express = require('express')
const {Client } = require('pg')
const axios = require('axios')

const app = express()
 let x="<table border='1'>";
 x+="<tr><td colspan='5'> Required Data</td></tr>";
 x+="<tr><td>Name</td><td>Last</td><td>Volume</td><td>Buysell</td><td>Base_Unit</td></tr>";


async function test() {
	
	const client = new Client({
		user: 'postgres',
		host: 'localhost',
		database: 'postgres',
		password: '12345',
		port: 5432,
	  })
	  client.connect(function(err) {
		if (err) throw err;
		console.log("Connected!");
	  });

await  axios.get(`https://api.wazirx.com/api/v2/tickers`)
    
      .then(response => {
        let data=Object.entries(response.data);
        //data.push(response.data);
        for(i=0;i<=9;i++){
       // console.log(data.length);
        let name =data[i][1]["name"];
		console.log(name);
		let last =data[i][1]["last"];
		console.log(last);
		let volume =data[i][1]["volume"];
		console.log(volume);
		let sell =data[i][1]["sell"];
		//console.log(sell); 
		let buy =data[i][1]["buy"];
		//console.log(buy);
		let buysell=buy + "/" + sell;
		console.log(buy +"/"+ sell);
		let base_unit =data[i][1]["base_unit"];
		console.log(base_unit);
		//console.log(data[i][1]["high"]);
		client.query(
			"INSERT INTO hodlinfo ( name, last, buysellprice, volume, base_unit)VALUES('" + name + "', '" + last + "','" + buysell +"','" + volume + "','" + base_unit + "')",
			(err, res) => {
			  console.log(err, res);
			  //client.end();
			}
		  );
		  x+="<tr><td>" + name +"</td><td>" + last +"</td><td>"+ volume +"</td><td>" + buysell +"</td><td>" + base_unit + "</td></tr>";
		
        }
      })
      .catch(error => console.log(
          'Error to fetch data\n'))
      
 
}
test();

app.listen(3000, () => {
  console.log("Application started and Listening on port 3000");
});

app.get("/", (req, res) => {
	x+="</table>";
  res.send(x);
});