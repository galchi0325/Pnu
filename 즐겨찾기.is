// 🟢 좋아요(즐겨찾기) 토글
function toggleFavorite(id) {
    const favorites = getFavorites();
    const button = document.querySelector(`button[data-id="${id}"]`);
    
    if (favorites.includes(id)) {
        saveFavorites(favorites.filter(fav => fav !== id));
        button.classList.remove('hearted');
    } else {
        favorites.push(id);
        saveFavorites(favorites);
        button.classList.add('hearted');
    }

    // 🟢 즐겨찾기 페이지에 있을 경우, 실시간 업데이트
    if (window.location.pathname.includes
