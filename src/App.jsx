import { RouterProvider } from 'react-router-dom'
import routes from './router/routes'

function App() {
  return (
    <div classname="w-screen md:w-full">
      <RouterProvider router={routes} />
    </div>
  );
}

export default App;