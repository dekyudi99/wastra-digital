import { RouterProvider } from 'react-router-dom'
import routes from './router/routes'

function App() {
  return (
    <div className="w-full">
      <RouterProvider router={routes} />
    </div>
  );
}

export default App;