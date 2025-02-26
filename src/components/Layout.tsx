import {Link, Outlet} from 'react-router-dom';



const Layout = () => {
  return (
    <>
    <header>
      <div>
      <h1 className="mb-2 text-xl font-extrabold text-gray-900 dark:text-white md:text-4xl lg:text-5xl"><span className="text-transparent bg-clip-text bg-gradient-to-r to-pink-600 from-sky-400">Wild</span>Lens</h1>
        <div>
        </div>
      </div>
    </header>
    <main className="container mx-auto p-2 bg-gray-900 rounded-lg shadow-lg mt-4 h-full">
      <Outlet />
    </main>
    <footer className="bg-gray-800 text-white text-center p-4 fixed bottom-0 w-full z-10 inset-x-0">
      <div>
        <nav>
          <ul className="flex justify-center space-x-25 text-lg">
            <li>
              <Link to="/"><i aria-label="Link to home page" className="fa-solid fa-house hover:opacity-80 hover:scale-105 transition-all duration-200"></i></Link>
            </li>
            <li>
              <Link to="/search" aria-label="Link to search page"><i className="fa-solid fa-search hover:opacity-80 hover:scale-105 transition-all duration-200"></i></Link>
            </li>
            <li>
              <Link to="/post"><i aria-label="link to upload" className="fa-solid fa-plus hover:opacity-80 hover:scale-105 transition-all duration-200"></i></Link>
            </li>
            <li>
              <Link to="/user"><i aria-label="link to user page" className="fa-regular fa-user hover:opacity-80 hover:scale-105 transition-all duration-200"></i></Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
    </>
  );
};

export default Layout
