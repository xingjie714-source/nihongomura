// ヘッダーのモバイルメニュー機能
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('header nav');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle && nav) {
        mobileMenuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
            
            // アイコンを切り替え
            const icon = mobileMenuToggle.querySelector('i');
            if (icon) {
                if (nav.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
        
        // メニュー項目をクリックしたらメニューを閉じる
        if (navMenu) {
            const menuItems = navMenu.querySelectorAll('a');
            menuItems.forEach(item => {
                item.addEventListener('click', () => {
                    nav.classList.remove('active');
                    mobileMenuToggle.classList.remove('active');
                    const icon = mobileMenuToggle.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                });
            });
        }
    }
    
    // ログイン状態に応じてヘッダーボタンを切り替え
    const authButtons = document.querySelector('.auth-buttons');
    if (authButtons && window.supabaseClient) {
        window.supabaseClient.auth.getUser().then(({ data }) => {
            if (data && data.user) {
                authButtons.innerHTML = `
                    <a class="btn-login" href="mypage.html">マイページ</a>
                    <button class="btn-register" onclick="window.supabaseClient.auth.signOut().then(() => location.reload())">ログアウト</button>
                `;
            }
        }).catch(() => {});
    }
});
