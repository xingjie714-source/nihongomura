// 共通コンポーネント（ヘッダー・フッター）を動的に読み込む

async function loadComponent(elementId, componentPath) {
    try {
        const response = await fetch(componentPath);
        if (!response.ok) throw new Error(`Failed to load ${componentPath}`);
        const html = await response.text();
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = html;
        }
    } catch (error) {
        console.error('Component loading error:', error);
    }
}

// ページ読み込み時にヘッダーとフッターを読み込む
document.addEventListener('DOMContentLoaded', async () => {
    // ヘッダーを読み込む
    await loadComponent('header-placeholder', '/components/header.html');
    
    // フッターを読み込む
    await loadComponent('footer-placeholder', '/components/footer.html');
    
    // 言語切り替え機能を初期化（language.jsが読み込まれている場合）
    if (typeof updatePageContent === 'function') {
        setTimeout(() => {
            updatePageContent();
            updateLanguageButtons();
        }, 100);
    }
});
