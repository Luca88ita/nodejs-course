const person = {
  p_name: "Luca",
  p_age: 35,
  greet() {
    console.log(`Hello ${this.p_name}`);
  },
};

person.greet();

/*---------------------------*/

// MAPPING AND BASIC ARRAY FUNCTIONS
const hobbies = ["bike", "kayak"];
hobbies.push("cooking");

hobbies.forEach((hobby) => {
  console.log(hobby);
});

console.log(
  hobbies.map((hobby) => {
    return `Hobby: ${hobby}`;
  })
);

/*---------------------------*/

// SPREAD AND REST OPERATORS
const hobbies2 = [...hobbies];
hobbies2.forEach((hobby) => {
  console.log(hobby);
});

const toArray = (...rest: any) => {
  return rest;
};

console.log(toArray(1, 2, 3, 4, 5, 8));

/*---------------------------*/

// DESTRUCTURING
const printName = ({ p_name }: typeof person) => {
  console.log(p_name);
};

printName(person);

const { p_name, p_age } = person;
console.log(p_name, p_age);

const [elem1, elem2] = hobbies;
console.log(elem1, elem2);

/*---------------------------*/
