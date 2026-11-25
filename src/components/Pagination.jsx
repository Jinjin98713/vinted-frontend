const Pagination = ({ count, page, limit, changePage }) => {
  // Calcule le nombre total de pages.
  const totalPages = Math.ceil(count / limit);

  // Aucune pagination nécessaire s'il n'y a qu'une page.
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className="pagination" aria-label="Pagination des annonces">
      <button
        type="button"
        disabled={page === 1}
        onClick={() => changePage(page - 1)}
      >
        Précédent
      </button>

      <span>
        Page {page} sur {totalPages}
      </span>

      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => changePage(page + 1)}
      >
        Suivant
      </button>
    </nav>
  );
};

export default Pagination;
