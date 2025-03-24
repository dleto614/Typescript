interface Shape {
  GetArea(): number;
}

class Circle implements Shape {
  constructor(public radius: number) { }

  GetArea(): number {
    return Math.PI * this.radius ** 2;
  }
}

class Rectangle implements Shape {
  constructor(public width: number, public height: number) { }

  GetArea(): number {
    return this.width * this.height;
  }
}

class Triangle implements Shape {
  constructor(public base: number, public height: number) { }

  GetArea(): number {
    return (1/2) * this.base * this.height;
  }
}

function PrintArea(shape: Shape) {
  console.log(`Area: ${shape.GetArea()}`);
}

const circle = new Circle(5);
const rectangle = new Rectangle(4, 6);
const triangle = new Triangle(5, 10);

PrintArea(circle);
PrintArea(rectangle);
PrintArea(triangle);
