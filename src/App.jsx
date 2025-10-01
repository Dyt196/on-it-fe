import { useState, useEffect } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [itemList, setItem] = useState([])
  const [selectedItem, setSelected] = useState([])
  const [thePack, setPackage] = useState([])
  const [openDialog, setDialog] = useState(false);
  const [loadPack, setLoadpack] = useState(false)

  

  useEffect(() => {
    fetch("https://on-it-be-production.up.railway.app/main")  // <-- Replace with your API URL
      .then((res) => res.json())
      .then((data) => setItem(data))
      .catch((err) => console.error("Failed to fetch:", err));
  }, []);

  const handleSelect = (item) => {
    setSelected((prev) => {
      const exists = prev.find((i) => i.xid === item.xid);
      if (exists) {
        // Remove if already selected
        return prev.filter((i) => i.xid !== item.xid);
      } else {
        // Add if not selected
        return [...prev, item];
      }
    });
  };

  const processCart = async () => {
    setLoadpack(true)
    try {
      const apiResponse = await fetch("https://on-it-be-production.up.railway.app/main/processcart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "cart": selectedItem
        })
      })
      const theResult = await apiResponse.json()
      setPackage(theResult)
      setLoadpack(false)
      setDialog(true)
    } catch(error){
      console.error(error)
      setLoadpack(false)
    }
  }

  return (
    <>
      <div className="h-screen flex flex-col content-center">
        <h1>Product List</h1>
        <div className="flex px-4 pb-5">
          <div className="w-4"></div>
          <div className="flex-1">Name</div>
          <div className="flex-1 flex justify-center">Price</div>
          <div className="flex-1 flex justify-end">Weight</div>
        </div>
        <div className="flex-1 flex flex-col overflow-y-auto px-4">
          {itemList.map((item, index) => (
          <div className="flex flex-row items-center" key={index} style={{ marginBottom: "8px" }}>
            <div className="w-4 flex content-center">
              <input
                type="checkbox"
                checked={!!selectedItem.find((i) => i.xid === item.xid)}
                onChange={() => handleSelect(item)}
              />
            </div>
            <div className="flex-1">{item.nme}</div>
            <div className="flex-1 flex justify-center">{item.prc}</div>
            <div className="flex-1 flex justify-end">{item.wgt}</div>
          </div>
        ))}
        </div>
        <div className="flex w-full justify-center p-6">
          <button
            onClick={() => processCart()}
            className={`${selectedItem.length === 0 || loadPack ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500"} text-white px-4 py-2 rounded`}
            disabled={selectedItem.length === 0 || loadPack}

          >
            {loadPack ? "Processing..." : "Place Order"}
          </button>
        </div>
      </div>
      {
        openDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <div className='h-80 flex flex-col'>
              <p className='text-black pb-2'>This order has following packages:</p>
              <div className='overflow-y-auto flex-1'>
              {thePack.map((pack, index) => (
                <div className="flex pb-3 flex-col">
                  <p className='text-black pb-2'>Package {index + 1}</p>
                  <p className='text-black'>Items - {pack.item.map((item, itIndex) => (
                    <span>{item.nme}{ itIndex !== pack.item.length - 1 && <span>, </span> }
                    </span>
                  ))}</p>
                  <p className="flex text-black">
                    <span className='flex-1'>Total weight:</span>
                    <span className='flex-1'>- {pack.totalWeight}g</span>
                  </p>
                  <p className="flex text-black">
                    <span className='flex-1'>Total price:</span>
                    <span className='flex-1'>- ${pack.totalPrice}</span>
                  </p>
                  <p className="flex text-black">
                    <span className='flex-1'>Courier price:</span>
                    <span className='flex-1'>- ${pack.courierPrice}</span>
                  </p>
                </div>
              ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setDialog(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
        )
      }
    </>
  )
}

export default App
