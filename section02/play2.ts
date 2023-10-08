/*------------------------------*/
// ASYNC CODE AND PROMISES

/*const fetchData = (callback: (value: string) => void) => {
  setTimeout(() => {
    callback("done");
  }, 1500);
};

setTimeout(() => {
  fetchData((text) => {
    console.log(text);
  });
}, 2000);
*/

const fetchData = () => {
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("Done!");
    }, 1500);
  });
  return promise;
};

setTimeout(() => {
  console.log("Timer is done!");
  fetchData()
    .then((text) => {
      console.log(text);
      return fetchData();
    })
    .then((text2) => console.log(text2));
}, 2000);

console.log("Ciao");
console.log("Luca");
