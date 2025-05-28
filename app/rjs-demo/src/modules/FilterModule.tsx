import { PageModule } from 'rjs-frame';
import { useNavigate, useSearchParams } from 'react-router-dom';

export class FilterModule extends PageModule {
  renderContent() {
    return <FilterContent />;
  }
}

function FilterContent() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const category = searchParams.get('category') || 'all';
  const currentPage = searchParams.get('page') || '1';

  const categories = ['all', 'active', 'completed'];

  const updateSearchParams = (updates: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      newParams.set(key, value);
    });
    navigate(`${window.location.pathname}?${newParams.toString()}`);
  };

  const handleCategoryChange = (newCategory: string) => {
    updateSearchParams({ 
      category: newCategory,
      page: '1' // Reset to first page when changing category
    });
  };

  const handlePageChange = (newPage: number) => {
    updateSearchParams({ page: newPage.toString() });
  };

  return (
    <div className="filter-module" style={{ padding: '20px', border: '1px solid #eee' }}>
      <h3>Filter Demo</h3>
      
      <div className="categories" style={{ marginBottom: '20px' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            style={{
              marginRight: '10px',
              padding: '8px 16px',
              backgroundColor: category === cat ? '#007bff' : '#fff',
              color: category === cat ? '#fff' : '#000',
              border: '1px solid #007bff',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      <div className="content" style={{ marginBottom: '20px' }}>
        <p>Current Category: {category}</p>
        <p>Current Page: {currentPage}</p>
      </div>

      <div className="pagination">
        <button
          onClick={() => handlePageChange(Math.max(1, parseInt(currentPage) - 1))}
          disabled={currentPage === '1'}
          style={{ marginRight: '10px' }}
        >
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button
          onClick={() => handlePageChange(parseInt(currentPage) + 1)}
          style={{ marginLeft: '10px' }}
        >
          Next
        </button>
      </div>
    </div>
  );
} 