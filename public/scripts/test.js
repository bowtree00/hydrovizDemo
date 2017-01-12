const person = {
  name: 'John',
  age: 28
}
console.log('person', person)

const newPerson = person
newPerson.age = 30
console.log('newPerson === person', newPerson === person) // true
console.log('person', person) // { name: 'John', age: 30 }



const guy = {
  name: 'Richard',
  age: 28
}
const newGuy = Object.assign({}, guy, {
  age: 30
})
console.log(newGuy === guy) // false
console.log(guy) // { name: 'John', age: 28 }
console.log(newGuy) // { name: 'John', age: 30 }
