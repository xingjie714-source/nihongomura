// 完全な3言語切り替え機能（日本語、英語、中国語）
// data-ja, data-en, data-zh属性とdata-i18n属性の両方をサポート

// 現在の言語を取得（デフォルトは日本語）
let currentLang = localStorage.getItem('language') || 'ja';

// 言語を設定
function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang);
    updatePageContent();
    updateLanguageButtons();
}

// ページコンテンツを更新
function updatePageContent() {
    // data-ja, data-en, data-zh属性を持つ要素を更新
    document.querySelectorAll('[data-ja], [data-en], [data-zh]').forEach(element => {
        const langAttr = `data-${currentLang}`;
        const translatedText = element.getAttribute(langAttr);
        
        if (translatedText) {
            // input, textarea, selectのplaceholderを更新
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                if (element.hasAttribute('placeholder')) {
                    element.placeholder = translatedText;
                } else {
                    element.textContent = translatedText;
                }
            } 
            // selectのoptionを更新
            else if (element.tagName === 'OPTION') {
                element.textContent = translatedText;
            }
            // titleタグを更新
            else if (element.tagName === 'TITLE') {
                document.title = translatedText;
            }
            // その他の要素のテキストを更新
            else {
                element.textContent = translatedText;
            }
        }
    });
    
    // HTMLのlang属性を更新
    document.documentElement.lang = currentLang;
}

// 言語ボタンの表示を更新
function updateLanguageButtons() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const activeBtn = document.querySelector(`.lang-btn[data-lang="${currentLang}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
}

// ページ読み込み時に実行
document.addEventListener('DOMContentLoaded', () => {
    // 言語切り替えボタンのイベントリスナーを設定
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            setLanguage(lang);
        });
    });
    
    // 初期表示
    updatePageContent();
    updateLanguageButtons();
});

// ページが動的に更新された場合のために、MutationObserverを使用
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
            updatePageContent();
        }
    });
});

// body要素の変更を監視
if (document.body) {
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}
