import './App.css'
import {Routes, Route} from 'react-router-dom'
import {useWindowSize} from './context/useWindowSize'
import {Navigation} from './components/Navigation'
import {Home} from './components/Home'
import {Categories} from './components/Categories'
import {LoginPage} from './components/LoginPage'
import {VideoDisplay} from './components/VideoDisplay'
import {VideoPage} from './components/VideoPage'
import {PrivateRoute} from './components/PrivateRoute'
import {UserProfile} from './components/private/UserProfile'
import {LikedVideos} from './components/private/LikedVideos'
import {Playlist} from './components/private/Playlist'
import {PlaylistContent} from './components/private/PlaylistContent'
import {WatchLater} from './components/private/WatchLater'
import {Footer} from './components/Footer'

function App() {
  const[, width] = useWindowSize();
  return (
    <div className="App">
      <Navigation/>
      <div style={{minHeight:"100vh"}}>
        <Routes>
          <Route path="/" element = {<Home/>} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/videos" element={<VideoDisplay />} />
          <Route path="/video/:videoId" element={<VideoPage />} />
          <PrivateRoute path="/profile" element={<UserProfile />} />
          <PrivateRoute path="/likedvideo" element={<LikedVideos />} />
          <PrivateRoute path="/watchlater" element={<WatchLater />} />
          <PrivateRoute path="/playlist" element={<Playlist />} />
          <PrivateRoute path="/likedvideo/:videoId" element={<VideoPage />} />
          <PrivateRoute path="/watchlater/:videoId" element={<VideoPage />} />
          <PrivateRoute path="/playlist/:playlistId" element={<PlaylistContent />} />
          <PrivateRoute path="/playlist/:playlistId/:videoId" element={<VideoPage />} />
        </Routes>
      </div>

      <Footer/>
     {width < 600 && (
        <div style={{ height: "10vh", backgroundColor: "#171717" }}></div>
      )}
    </div>
  );
}

export default App;
