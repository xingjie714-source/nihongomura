// 管理者権限チェック関数
async function checkAdminRole() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
        window.location.href = 'admin-login.html';
        return false;
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
        return false;
    }
    
    return true;
}

// 管理者権限チェック
(async () => {
    const isAdmin = await checkAdminRole();
    if (isAdmin) {
        loadDashboard();
    }
})();

// ダッシュボードを読み込み
async function loadDashboard() {
    await loadStats();
    await loadUsers();
    await loadSeminars();
    await loadEvents();
    await loadConsultations();
    await loadJobs();
    await loadArticles();
}

// 統計情報を読み込み
async function loadStats() {
    // ユーザー数
    const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
    document.getElementById('totalUsers').textContent = usersCount || 0;

    // セミナー数
    const { count: seminarsCount } = await supabase
        .from('seminars')
        .select('*', { count: 'exact', head: true });
    document.getElementById('totalSeminars').textContent = seminarsCount || 0;

    // イベント数
    const { count: eventsCount } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true });
    document.getElementById('totalEvents').textContent = eventsCount || 0;

    // 求人数
    const { count: jobsCount } = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true });
    document.getElementById('totalJobs').textContent = jobsCount || 0;
}

// タブ切り替え
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        const tabName = tab.dataset.tab;
        
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        document.getElementById(tabName).classList.add('active');
    });
});

// ========================================
// ユーザー管理機能（拡張版）
// ========================================

// グローバル変数: すべてのユーザーデータを保存
let allUsers = [];

// ユーザー一覧を読み込み（拡張版）
async function loadUsers() {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error loading users:', error);
        document.getElementById('usersTableBody').innerHTML = '<tr><td colspan="11" style="text-align: center; color: var(--medium-gray);">データの読み込みに失敗しました</td></tr>';
        return;
    }

    allUsers = data || [];
    
    // 国籍フィルターのオプションを更新
    updateNationalityFilter();
    
    // ユーザーを表示
    displayUsers(allUsers);
}

// ユーザーを表示する関数
function displayUsers(users) {
    const tbody = document.getElementById('usersTableBody');
    
    if (!users || users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="11" style="text-align: center; color: var(--medium-gray);">登録ユーザーがいません</td></tr>';
        return;
    }

    tbody.innerHTML = users.map(user => `
        <tr>
            <td>${user.full_name || '-'}</td>
            <td>${user.email || '-'}</td>
            <td>${user.nationality || '-'}</td>
            <td>${user.university || '-'}</td>
            <td>${user.major || '-'}</td>
            <td>${user.degree_level || '-'}</td>
            <td>${user.japanese_level || '-'}</td>
            <td>${user.phone || '-'}</td>
            <td>${formatDate(user.birth_date)}</td>
            <td>${formatDate(user.graduation_date)}</td>
            <td>${formatDate(user.created_at)}</td>
        </tr>
    `).join('');
}

// 国籍フィルターのオプションを更新
function updateNationalityFilter() {
    const nationalities = [...new Set(allUsers.map(u => u.nationality).filter(n => n))].sort();
    const select = document.getElementById('filterNationality');
    
    if (!select) return; // フィルター要素がない場合は終了
    
    // 既存のオプションをクリア（「すべて」以外）
    select.innerHTML = '<option value="">すべて</option>';
    
    // 国籍オプションを追加
    nationalities.forEach(nationality => {
        const option = document.createElement('option');
        option.value = nationality;
        option.textContent = nationality;
        select.appendChild(option);
    });
    
    // 卒業予定日フィルターのオプションを更新
    updateGraduationDateFilter();
}

// 卒業予定日フィルターのオプションを更新
function updateGraduationDateFilter() {
    const graduationDates = [...new Set(allUsers.map(u => u.graduation_date).filter(d => d))].sort();
    const select = document.getElementById('filterGraduationDate');
    
    if (!select) return; // フィルター要素がない場合は終了
    
    // 既存のオプションをクリア（「すべて」以外）
    select.innerHTML = '<option value="">すべて</option>';
    
    // 卒業予定日オプションを追加（YYYY-MM形式に変換）
    const yearMonths = [...new Set(graduationDates.map(date => {
        if (!date) return null;
        const d = new Date(date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    }).filter(ym => ym))].sort();
    
    yearMonths.forEach(yearMonth => {
        const option = document.createElement('option');
        option.value = yearMonth;
        const [year, month] = yearMonth.split('-');
        option.textContent = `${year}年${parseInt(month)}月`;
        select.appendChild(option);
    });
}

// フィルターを適用
function applyFilters() {
    const nationalityFilter = document.getElementById('filterNationality').value.toLowerCase();
    const japaneseLevelFilter = document.getElementById('filterJapaneseLevel').value;
    const graduationDateFilter = document.getElementById('filterGraduationDate').value;
    
    const filteredUsers = allUsers.filter(user => {
        const matchNationality = !nationalityFilter || (user.nationality || '').toLowerCase() === nationalityFilter;
        const matchJapaneseLevel = !japaneseLevelFilter || user.japanese_level === japaneseLevelFilter;
        
        // 卒業予定日フィルター（YYYY-MM形式で比較）
        let matchGraduationDate = true;
        if (graduationDateFilter && user.graduation_date) {
            const userDate = new Date(user.graduation_date);
            const userYearMonth = `${userDate.getFullYear()}-${String(userDate.getMonth() + 1).padStart(2, '0')}`;
            matchGraduationDate = userYearMonth === graduationDateFilter;
        } else if (graduationDateFilter) {
            matchGraduationDate = false;
        }
        
        return matchNationality && matchJapaneseLevel && matchGraduationDate;
    });
    
    displayUsers(filteredUsers);
}

// フィルターをリセット
function resetFilters() {
    document.getElementById('filterNationality').value = '';
    document.getElementById('filterJapaneseLevel').value = '';
    document.getElementById('filterGraduationDate').value = '';
    displayUsers(allUsers);
}

// CSVダウンロード機能
function downloadUsersCSV() {
    if (!allUsers || allUsers.length === 0) {
        alert('ダウンロードするデータがありません');
        return;
    }
    
    // CSVヘッダー
    const headers = [
        '氏名',
        'メールアドレス',
        '国籍',
        '大学',
        '専攻',
        '学位レベル',
        '日本語レベル',
        '電話番号',
        '生年月日',
        '卒業予定日',
        '登録日'
    ];
    
    // CSVデータ
    const rows = allUsers.map(user => [
        user.full_name || '',
        user.email || '',
        user.nationality || '',
        user.university || '',
        user.major || '',
        user.degree_level || '',
        user.japanese_level || '',
        user.phone || '',
        formatDate(user.birth_date),
        formatDate(user.graduation_date),
        formatDate(user.created_at)
    ]);
    
    // CSV文字列を生成
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    // BOM付きUTF-8でダウンロード
    const bom = '\uFEFF';
    const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    const now = new Date();
    const filename = `users_${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}.csv`;
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// ========================================
// セミナー管理
// ========================================

// セミナー一覧を読み込み
async function loadSeminars() {
    const { data, error } = await supabase
        .from('seminars')
        .select(`
            *,
            seminar_bookings (count)
        `)
        .order('date', { ascending: false });

    const tbody = document.getElementById('seminarsTableBody');
    
    if (error || !data || data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: var(--medium-gray);">セミナーがありません</td></tr>';
        return;
    }

    tbody.innerHTML = data.map(seminar => {
        const bookingCount = seminar.seminar_bookings ? seminar.seminar_bookings.length : 0;
        return `
            <tr>
                <td>${seminar.title_ja}</td>
                <td>${formatDate(seminar.date)}</td>
                <td>${formatTime(seminar.start_time)} - ${formatTime(seminar.end_time)}</td>
                <td>${seminar.venue_ja}</td>
                <td>${seminar.capacity || '-'}</td>
                <td>${bookingCount}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-edit" onclick="editSeminar('${seminar.id}')">編集</button>
                        <button class="btn-delete" onclick="deleteSeminar('${seminar.id}')">削除</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// セミナーを開く（プレースホルダー）
function openSeminarModal() {
    alert('セミナー追加機能は実装中です。データベースに直接追加してください。');
}

function editSeminar(id) {
    alert('セミナー編集機能は実装中です。');
}

async function deleteSeminar(id) {
    if (!confirm('本当に削除しますか？')) return;
    const { error } = await supabase.from('seminars').delete().eq('id', id);
    if (error) {
        alert('削除に失敗しました: ' + error.message);
    } else {
        alert('削除しました');
        loadSeminars();
    }
}

// ========================================
// イベント管理
// ========================================

// イベント一覧を読み込み
async function loadEvents() {
    const { data, error } = await supabase
        .from('events')
        .select(`
            *,
            event_bookings (count)
        `)
        .order('date', { ascending: false });

    const tbody = document.getElementById('eventsTableBody');
    
    if (error || !data || data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: var(--medium-gray);">イベントがありません</td></tr>';
        return;
    }

    tbody.innerHTML = data.map(event => {
        const bookingCount = event.event_bookings ? event.event_bookings.length : 0;
        return `
            <tr>
                <td>${event.title_ja}</td>
                <td>${formatDate(event.date)}</td>
                <td>${formatTime(event.start_time)} - ${formatTime(event.end_time)}</td>
                <td>${event.venue_ja}</td>
                <td>${event.capacity || '-'}</td>
                <td>${bookingCount}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-edit" onclick="editEvent('${event.id}')">編集</button>
                        <button class="btn-delete" onclick="deleteEvent('${event.id}')">削除</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// イベントを開く（プレースホルダー）
function openEventModal() {
    alert('イベント追加機能は実装中です。データベースに直接追加してください。');
}

function editEvent(id) {
    alert('イベント編集機能は実装中です。');
}

async function deleteEvent(id) {
    if (!confirm('本当に削除しますか？')) return;
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) {
        alert('削除に失敗しました: ' + error.message);
    } else {
        alert('削除しました');
        loadEvents();
    }
}

// ========================================
// 個別相談管理
// ========================================

// 個別相談一覧を読み込み
async function loadConsultations() {
    const { data, error } = await supabase
        .from('consultations')
        .select(`
            *,
            profiles (full_name)
        `)
        .order('date', { ascending: false });

    const tbody = document.getElementById('consultationsTableBody');
    
    if (error || !data || data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--medium-gray);">個別相談の予約がありません</td></tr>';
        return;
    }

    tbody.innerHTML = data.map(consultation => {
        const statusText = consultation.status === 'confirmed' ? '予約確定' : 
                          consultation.status === 'cancelled' ? 'キャンセル済み' : 
                          consultation.status === 'completed' ? '完了' : '保留中';
        return `
            <tr>
                <td>${consultation.profiles?.full_name || '-'}</td>
                <td>${consultation.consultation_type}</td>
                <td>${formatDate(consultation.date)} ${consultation.time_slot}</td>
                <td>${consultation.preferred_language}</td>
                <td>${statusText}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-edit" onclick="updateConsultationStatus('${consultation.id}')">ステータス変更</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// 個別相談のステータスを更新
async function updateConsultationStatus(id) {
    const newStatus = prompt('新しいステータスを入力してください（pending/confirmed/completed/cancelled）:');
    if (!newStatus) return;

    const { error } = await supabase
        .from('consultations')
        .update({ status: newStatus })
        .eq('id', id);

    if (error) {
        alert('更新に失敗しました: ' + error.message);
    } else {
        alert('更新しました');
        loadConsultations();
    }
}

// ========================================
// 求人管理
// ========================================

// 求人一覧を読み込み
async function loadJobs() {
    const { data, error } = await supabase
        .from('jobs')
        .select(`
            *,
            job_applications (count)
        `)
        .order('created_at', { ascending: false });

    const tbody = document.getElementById('jobsTableBody');
    
    if (error || !data || data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--medium-gray);">求人がありません</td></tr>';
        return;
    }

    tbody.innerHTML = data.map(job => {
        const applicationCount = job.job_applications ? job.job_applications.length : 0;
        return `
            <tr>
                <td>${job.company_name_ja}</td>
                <td>${job.title_ja}</td>
                <td>${job.location_name_ja || job.location}</td>
                <td>${job.salary_min ? `${job.salary_min}万円〜` : '-'}</td>
                <td>${applicationCount}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-edit" onclick="editJob('${job.id}')">編集</button>
                        <button class="btn-delete" onclick="deleteJob('${job.id}')">削除</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// 求人を開く（プレースホルダー）
function openJobModal() {
    alert('求人追加機能は実装中です。データベースに直接追加してください。');
}

function editJob(id) {
    alert('求人編集機能は実装中です。');
}

async function deleteJob(id) {
    if (!confirm('本当に削除しますか？')) return;
    const { error } = await supabase.from('jobs').delete().eq('id', id);
    if (error) {
        alert('削除に失敗しました: ' + error.message);
    } else {
        alert('削除しました');
        loadJobs();
    }
}

// ========================================
// 記事管理
// ========================================

// 記事一覧を読み込み
async function loadArticles() {
    const { data, error } = await supabase
        .from('knowledge_articles')
        .select('*')
        .order('created_at', { ascending: false });

    const tbody = document.getElementById('articlesTableBody');
    
    if (error || !data || data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--medium-gray);">記事がありません</td></tr>';
        return;
    }

    tbody.innerHTML = data.map(article => {
        const tagsText = article.tags ? article.tags.join(', ') : '-';
        const publishedText = article.is_published ? '公開中' : '下書き';
        const publishedDate = article.published_at ? formatDate(article.published_at) : '-';
        return `
            <tr>
                <td>${article.title_ja}</td>
                <td>${tagsText}</td>
                <td>${article.view_count || 0}</td>
                <td>${publishedText}</td>
                <td>${publishedDate}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-edit" onclick="editArticle('${article.id}')">編集</button>
                        <button class="btn-delete" onclick="deleteArticle('${article.id}')">削除</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// 記事モーダルを開く
function openArticleModal(articleId = null) {
    const modal = document.getElementById('articleModal');
    const form = document.getElementById('articleForm');
    
    if (articleId) {
        // 編集モード
        document.getElementById('articleModalTitle').textContent = '記事を編集';
        loadArticleData(articleId);
    } else {
        // 新規作成モード
        document.getElementById('articleModalTitle').textContent = '記事を追加';
        form.reset();
        document.getElementById('articleId').value = '';
    }
    
    modal.classList.add('active');
}

// 記事モーダルを閉じる
function closeArticleModal() {
    document.getElementById('articleModal').classList.remove('active');
}

// 記事データを読み込み
async function loadArticleData(articleId) {
    const { data, error } = await supabase
        .from('knowledge_articles')
        .select('*')
        .eq('id', articleId)
        .single();

    if (error || !data) {
        alert('記事の読み込みに失敗しました');
        return;
    }

    document.getElementById('articleId').value = data.id;
    document.getElementById('articleTitleJa').value = data.title_ja;
    document.getElementById('articleExcerptJa').value = data.excerpt_ja;
    document.getElementById('articleContentJa').value = data.content_ja;
    document.getElementById('articleTags').value = data.tags ? data.tags.join(', ') : '';
    document.getElementById('articleImageUrl').value = data.image_url || '';
    document.getElementById('articlePublished').value = data.is_published ? 'true' : 'false';
}

// 記事フォーム送信
document.getElementById('articleForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const articleId = document.getElementById('articleId').value;
    const titleJa = document.getElementById('articleTitleJa').value;
    const excerptJa = document.getElementById('articleExcerptJa').value;
    const contentJa = document.getElementById('articleContentJa').value;
    const tagsInput = document.getElementById('articleTags').value;
    const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()) : [];
    const imageUrl = document.getElementById('articleImageUrl').value;
    const isPublished = document.getElementById('articlePublished').value === 'true';

    const articleData = {
        title_ja: titleJa,
        excerpt_ja: excerptJa,
        content_ja: contentJa,
        tags,
        image_url: imageUrl || null,
        is_published: isPublished,
        published_at: isPublished ? new Date().toISOString() : null
    };

    let error;
    if (articleId) {
        // 更新
        ({ error } = await supabase
            .from('knowledge_articles')
            .update(articleData)
            .eq('id', articleId));
    } else {
        // 新規作成
        ({ error } = await supabase
            .from('knowledge_articles')
            .insert([articleData]));
    }

    if (error) {
        alert('保存に失敗しました: ' + error.message);
        return;
    }

    alert('保存しました');
    closeArticleModal();
    loadArticles();
});

// 記事を編集
function editArticle(articleId) {
    openArticleModal(articleId);
}

// 記事を削除
async function deleteArticle(articleId) {
    if (!confirm('本当に削除しますか？')) return;

    const { error } = await supabase
        .from('knowledge_articles')
        .delete()
        .eq('id', articleId);

    if (error) {
        alert('削除に失敗しました: ' + error.message);
        return;
    }

    alert('削除しました');
    loadArticles();
}

// ========================================
// ユーティリティ関数
// ========================================

// 日付フォーマット関数
function formatDate(dateString) {
    if (!dateString) return '-';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '-';
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    } catch (error) {
        console.error('Date formatting error:', error);
        return '-';
    }
}

// 時刻フォーマット関数
function formatTime(timeString) {
    if (!timeString) return '-';
    try {
        return timeString.substring(0, 5);
    } catch (error) {
        console.error('Time formatting error:', error);
        return '-';
    }
}
