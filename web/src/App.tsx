/**
 * layout:
 *  header
 *    h2 - title
 *    brands
 *  content
 *    hotel list
 *    room list
 *  footer
 *    padding space
 */

import { Brands } from "./components/Brands";
import { HotelGrid } from "./components/HotelGrid";

function App() {
  return (
    <div className="container mx-auto flex flex-col gap-6 py-6 px-6">
      <h1 className="text-3xl font-bold">Hotel Proxy</h1>
      <Brands />
      <HotelGrid />      
    </div>
  );
}

export default App;
