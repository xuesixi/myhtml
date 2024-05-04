function Temp(value) {
	this.value = value;
}

let num = new Temp(10);
console.log(num.constructor.name);
