/* debug JSON error in class_names.txt */

const fs = require('fs');

let data = fs.readFileSync('model/class_names.txt');
data = data.toString();

console.log(data);
s = data.replace(/\\n/g, "\\n")  
               .replace(/\\'/g, "\\'")
               .replace(/\\"/g, '\\"')
               .replace(/\\&/g, "\\&")
               .replace(/\\r/g, "\\r")
               .replace(/\\t/g, "\\t")
               .replace(/\\b/g, "\\b")
               .replace(/\\f/g, "\\f");
// remove non-printable and other non-valid JSON chars
s = s.replace(/[\u0000-\u0019]+/g,""); 

var o = JSON.parse(s);
console.log(o);