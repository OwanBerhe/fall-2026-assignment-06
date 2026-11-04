import { Routes, Route, Link } from 'react-router-dom';
import { ArticleListPage } from './pages/ArticleListPage';
import { CreateArticlePage } from './pages/CreateArticlePage';
import { ArticleDetailPage } from './pages/ArticleDetailPage';
import { EditArticlePage } from './pages/EditArticlePage';

function App() {
  return (
    <div className="app-container">
      <header className="site-header">
        <div className="site-header-content">
          <Link to="/" className="site-brand">
            Articles &amp; Comments
          </Link>
          <nav className="site-nav" aria-label="Main Navigation">
            <Link to="/" className="site-nav-link">
              Articles
            </Link>
            <Link to="/articles/new" className="btn btn-primary btn-sm">
              + Create Article
            </Link>
          </nav>
        </div>
      </header>

      <div className="main-content">
        <Routes>
          <Route path="/" element={<ArticleListPage />} />
          <Route path="/articles/new" element={<CreateArticlePage />} />
          <Route path="/articles/:articleId" element={<ArticleDetailPage />} />
          <Route
            path="/articles/:articleId/edit"
            element={<EditArticlePage />}
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
