import Header from './components/Header/Header'
import HomeSection from './components/HomeSection'
import SearchSection from './components/SearchSection'
import AuthSection from './components/AuthSection'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PostPage from './components/Post/PostPage.jsx';
import AddPostSection from './components/AddPostSection.jsx';
import { AuthProvider } from './components/AuthContext.jsx';
import UserCard from './components/User/UserCard.jsx';
import EditPasswordSection from './components/EditPasswordSection.jsx';
import EditProfileSection from './components/EditProfileSection.jsx';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomeSection />} />
            <Route path="/search" element={<SearchSection />} />
            <Route path="/me" element={<AuthSection />} />
            <Route path="/posts/:id" element={<PostPage />} />
            <Route path="/add" element={<AddPostSection />} />
            <Route path="/:user_id" element={<UserCard />} />
            <Route path="/me/edit" element={<EditProfileSection />} />
            <Route path="/me/password" element={<EditPasswordSection />} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  )
}