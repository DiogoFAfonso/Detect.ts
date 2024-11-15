let arr = [1, 2, 3]

if (index < arr.length) {
    console.log(arr[index])                         // Controlled Dynamic Access
}

console.log(arr[index])                             // Uncontrolled Dynamic Access




var data: any = "Tuesday";

if (typeof data === 'number') {
    var numData: number = data as number;
    console.log(numData.toExponential());           // Controlled Downcast
}

var numData: number = data as number;
console.log(numData.toExponential());               // Uncontrolled Downcast



let num: { n: number } = { n: 4 }
let quantity: { n: number | string } = num
quantity.n = "four"                                 // Union-Type Property Update
console.log(num.n.toExponential())




let quant: { n: number | string } = { n: 4 }
let quant_copy = quant

if (typeof quant.n === "number") {
    quant_copy.n = "four"
    console.log(quant.n.toExponential())            // Unsafe Object Aliasing
}