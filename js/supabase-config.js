// Supabase設定ファイル
// このファイルはSupabaseプロジェクトとの接続を管理します

const SUPABASE_URL = 'https://ibrydjjygyzgtldznwhw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlicnlkamp5Z3l6Z3RsZHpud2h3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5NzYzNDcsImV4cCI6MjA4NjU1MjM0N30.4Bd2VM75bro6RA3qrPTWrlXriyKuvDRL5_HdOjfUF1E';

// Supabaseクライアントを初期化
function initSupabase() {
    try {
        if (typeof window.supabase === 'undefined') {
            console.error('Supabase SDK not loaded');
            return null;
        }
        
        const { createClient } = window.supabase;
        const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('Supabase initialized successfully');
        return client;
    } catch (error) {
        console.error('Error initializing Supabase:', error);
        return null;
    }
}

// グローバル変数として公開
window.supabaseClient = initSupabase();

// ヘルパー関数: 現在のユーザーを取得
async function getCurrentUser() {
    if (!window.supabaseClient) return null;
    const { data: { user } } = await window.supabaseClient.auth.getUser();
    return user;
}

window.getCurrentUser = getCurrentUser;
