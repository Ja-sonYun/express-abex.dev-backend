let a = new Cookie('sd');

a.set('anwead', 1);

console.log(a.get());

const ORIGIN = document.title;
let visited = new Cookie(ORIGIN);
if(visited.get()) {

}
