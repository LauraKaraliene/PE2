import "./styles/index.css";

export default function App() {
  return (
    <div className="min-h-screen bg-background-light flex flex-col items-center justify-center space-y-4">
      <h1 className="text-3xl text-primary">Custom Heading</h1>
      <p className="text-secondary">Secondary color text</p>
      <button className=" btn-primary text-white ">Primary Button</button>
      <button className=" btn-secondary text-white ">Secondary Button</button>
    </div>
  );
}
