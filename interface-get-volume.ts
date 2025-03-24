interface Shape {
    GetVolume(): number;
}

class Circle implements Shape {
    constructor(public radius: number) { }

    // (4/3) * pi * radius to the 3rd power
    GetVolume(): number {
        return (4.0/3) * Math.PI * Math.pow(this.radius, 3); 
    }
}

class Rectangle implements Shape {

    constructor(public height: number, public width: number, public length: number) { }

    // width * height * length
    GetVolume(): number {
        return this.width * this.height * this.length;
    }
    
}

class Triangle implements Shape {

    constructor(public base: number, public height: number, public length: number) {}

    // 1/2 * base * height * length
    GetVolume(): number {
        return (1.0/2.0) * this.base * this.height * this.length;
    }

}

function PrintVolume(shape: Shape) {
    console.log(`Volume: ${shape.GetVolume()}`);
}

const circle = new Circle(5);
const rectangle = new Rectangle(4, 4, 4);
const triangle = new Triangle(5, 8, 12);

PrintVolume(circle);
PrintVolume(rectangle);
PrintVolume(triangle);
