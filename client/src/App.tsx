import { Routes, Route } from 'react-router-dom';
import { ArticleListPage } from './pages/ArticleListPage';
import { CreateArticlePage } from './pages/CreateArticlePage';
import { ArticleDetailPage } from './pages/ArticleDetailPage';
import { EditArticlePage } from './pages/EditArticlePage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<ArticleListPage />} />
      <Route path="/articles/new" element={<CreateArticlePage />} />
      <Route path="/articles/:articleId" element={<ArticleDetailPage />} />
      <Route path="/articles/:articleId/edit" element={<EditArticlePage />} />
    </Routes>
  );
}

export default App;
