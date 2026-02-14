// 管理者ダッシュボードのメインスクリプト

// グローバル変数
let currentTab = 'users';
let users = [];
let seminars = [];
let events = [];
let jobs = [];

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', async () => {
    // 管理者認証チェック
    await checkAdminAuth();
    
    // 初期データ読み込み
    await loadDashboardData();
    
    // タブ切り替えイベント
    setupTabListeners();
});

// 管理者認証チェック
async function checkAdminAuth() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
        window.location.href = 'admin-login.html';
        return;
    }
    
    // プロフィール取得
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
    
    if (!profile || profile.role !== 'admin') {
        alert('管理者権限がありません');
        window.location.href = 'index.html';
        return;
    }
}

// ダッシュボードデータ読み込み
async function loadDashboardData() {
    await Promise.all([
        loadUsers(),
        loadSeminars(),
        loadEvents(),
        loadJobs()
    ]);
    
    updateStats();
    renderCurrentTab();
}

// ユーザーデータ読み込み
async function loadUsers() {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
    
    if (error) {
        console.error('ユーザーデータ取得エラー:', error);
        return;
    }
    
    users = data || [];
}

// セミナーデータ読み込み
async function loadSeminars() {
    const { data, error } = await supabase
        .from('seminars')
        .select('*')
        .order('date', { ascending: false });
    
    if (error) {
        console.error('セミナーデータ取得エラー:', error);
        return;
    }
    
    seminars = data || [];
}

// イベントデータ読み込み
async function loadEvents() {
    const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: false });
    
    if (error) {
        console.error('イベントデータ取得エラー:', error);
        return;
    }
    
    events = data || [];
}

// 求人データ読み込み
async function loadJobs() {
    const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });
    
    if (error) {
        console.error('求人データ取得エラー:', error);
        return;
    }
    
    jobs = data || [];
}

// 統計情報更新
function updateStats() {
    document.querySelector('.stat-card:nth-child(1) .stat-number').textContent = users.length;
    document.querySelector('.stat-card:nth-child(2) .stat-number').textContent = seminars.length;
    document.querySelector('.stat-card:nth-child(3) .stat-number').textContent = events.length;
    document.querySelector('.stat-card:nth-child(4) .stat-number').textContent = jobs.length;
}

// タブリスナー設定
function setupTabListeners() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentTab = btn.dataset.tab;
            
            // アクティブタブ切り替え
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // コンテンツ表示
            renderCurrentTab();
        });
    });
}

// 現在のタブをレンダリング
function renderCurrentTab() {
    const contentArea = document.querySelector('.tab-content.active');
    if (!contentArea) return;
    
    switch (currentTab) {
        case 'users':
            renderUsersTable();
            break;
        case 'seminars':
            renderSeminarsTable();
            break;
        case 'events':
            renderEventsTable();
            break;
        case 'consultations':
            // admin-consultations.jsで処理
            break;
        case 'jobs':
            renderJobsTable();
            break;
        case 'articles':
            renderArticlesTable();
            break;
    }
}

// ユーザーテーブルレンダリング
function renderUsersTable() {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem; color: var(--medium-gray);">登録ユーザーがいません</td></tr>';
        return;
    }
    
    users.forEach(user => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${escapeHtml(user.full_name || '-')}</td>
            <td>${escapeHtml(user.email || '-')}</td>
            <td>${escapeHtml(user.nationality || '-')}</td>
            <td>${escapeHtml(user.university || '-')}</td>
            <td>${escapeHtml(user.japanese_level || '-')}</td>
            <td>${formatDate(user.created_at)}</td>
        `;
        tbody.appendChild(tr);
    });
}

// セミナーテーブルレンダリング
function renderSeminarsTable() {
    const tbody = document.getElementById('seminarsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (seminars.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2rem; color: var(--medium-gray);">セミナーがありません</td></tr>';
        return;
    }
    
    seminars.forEach(seminar => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${escapeHtml(seminar.title_ja || '-')}</td>
            <td>${formatDate(seminar.date)}</td>
            <td>${escapeHtml(seminar.speaker || '-')}</td>
            <td><span class="status-badge status-${seminar.status}">${getStatusText(seminar.status)}</span></td>
            <td>
                <button class="btn-icon" onclick="editSeminar('${seminar.id}')"><i class="fas fa-edit"></i></button>
                <button class="btn-icon btn-delete" onclick="deleteSeminar('${seminar.id}')"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// イベントテーブルレンダリング
function renderEventsTable() {
    const tbody = document.getElementById('eventsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (events.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2rem; color: var(--medium-gray);">イベントがありません</td></tr>';
        return;
    }
    
    events.forEach(event => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${escapeHtml(event.title_ja || '-')}</td>
            <td>${formatDate(event.date)}</td>
            <td>${escapeHtml(event.location || '-')}</td>
            <td><span class="status-badge status-${event.status}">${getStatusText(event.status)}</span></td>
            <td>
                <button class="btn-icon" onclick="editEvent('${event.id}')"><i class="fas fa-edit"></i></button>
                <button class="btn-icon btn-delete" onclick="deleteEvent('${event.id}')"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// 求人テーブルレンダリング
function renderJobsTable() {
    const tbody = document.getElementById('jobsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (jobs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2rem; color: var(--medium-gray);">求人がありません</td></tr>';
        return;
    }
    
    jobs.forEach(job => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${escapeHtml(job.company_ja || '-')}</td>
            <td>${escapeHtml(job.title_ja || '-')}</td>
            <td>${escapeHtml(job.location || '-')}</td>
            <td><span class="status-badge status-${job.status}">${getStatusText(job.status)}</span></td>
            <td>
                <button class="btn-icon" onclick="editJob('${job.id}')"><i class="fas fa-edit"></i></button>
                <button class="btn-icon btn-delete" onclick="deleteJob('${job.id}')"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// 記事テーブルレンダリング
function renderArticlesTable() {
    const tbody = document.getElementById('articlesTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2rem; color: var(--medium-gray);">記事管理機能は準備中です</td></tr>';
}

// ユーティリティ関数
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

function getStatusText(status) {
    const statusMap = {
        'published': '公開中',
        'draft': '下書き',
        'archived': 'アーカイブ',
        'active': 'アクティブ',
        'inactive': '非アクティブ'
    };
    return statusMap[status] || status;
}

// ログアウト
async function logout() {
    await supabase.auth.signOut();
    window.location.href = 'admin-login.html';
}
