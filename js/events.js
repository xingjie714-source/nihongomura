// イベントページのJavaScript

// サンプルイベントデータ
const eventsData = [
    {
        id: 1,
        title: {
            ja: "【AGC株式会社】グローバルIT戦略を日本から世界へ",
            en: "AGC Corporation - Lead Global IT Strategy from Japan",
            zh: "【AGC株式会社】从日本引领全球IT战略"
        },
        description: {
            ja: "AGCは、世界をリードする素材メーカーです。情報システム部門では、グローバルなIT戦略を担当するポジションを募集しています。",
            en: "AGC is a world-leading materials manufacturer. The Information Systems Division is recruiting for positions responsible for global IT strategy.",
            zh: "AGC是世界领先的材料制造商。信息系统部门正在招聘负责全球IT战略的职位。"
        },
        date: "2026-02-12",
        time: "17:00-18:00",
        format: {
            ja: "オンライン",
            en: "Online",
            zh: "在线"
        },
        venue: {
            ja: "Zoom",
            en: "Zoom",
            zh: "Zoom"
        },
        capacity: {
            ja: "50名",
            en: "50 people",
            zh: "50人"
        },
        target: {
            ja: "理系専攻（学士/修士/博士）2026年9月～2027年3月卒業予定",
            en: "STEM majors (Bachelor/Master/PhD) graduating Sep 2026 - Mar 2027",
            zh: "理科专业（学士/硕士/博士）2026年9月～2027年3月毕业预定"
        },
        theme: {
            ja: "情報システム部門 / デジタルイノベーション",
            en: "Information Systems / Digital Innovation",
            zh: "信息系统部门 / 数字创新"
        },
        deadline: "2026-02-11 18:00",
        tags: ["online", "stem", "english"],
        japaneseLevel: "N3以上",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600",
        companyAppeal: {
            ja: "AGCは、ガラス、化学品、セラミックスなどの素材を通じて、世界中の人々の暮らしに貢献しています。売上高2兆円を超えるグローバル企業として、世界30カ国以上で事業を展開しています。",
            en: "AGC contributes to people's lives worldwide through materials such as glass, chemicals, and ceramics. As a global company with sales exceeding 2 trillion yen, we operate in over 30 countries.",
            zh: "AGC通过玻璃、化学品、陶瓷等材料为全球人们的生活做出贡献。作为销售额超过2万亿日元的全球企业，我们在30多个国家开展业务。"
        },
        whyHire: {
            ja: "グローバルな視点と多様な文化背景を持つ留学生は、当社のイノベーションに不可欠です。異なる視点から課題を捉え、新しい価値を創造できる人材を求めています。",
            en: "International students with global perspectives and diverse cultural backgrounds are essential to our innovation. We seek talent who can approach challenges from different angles and create new value.",
            zh: "具有全球视野和多元文化背景的留学生对我们的创新至关重要。我们寻求能够从不同角度看待挑战并创造新价值的人才。"
        },
        positions: {
            ja: "情報システム企画、ITアーキテクト、データサイエンティスト",
            en: "IT Planning, IT Architect, Data Scientist",
            zh: "信息系统规划、IT架构师、数据科学家"
        },
        jobAppeal: {
            ja: "グローバル規模でのシステム構築に携わり、最先端技術を活用しながら、世界中の拠点をつなぐITインフラを構築できます。",
            en: "Engage in global-scale system development, utilizing cutting-edge technology to build IT infrastructure connecting bases worldwide.",
            zh: "参与全球规模的系统开发，利用尖端技术构建连接全球据点的IT基础设施。"
        }
    },
    {
        id: 2,
        title: {
            ja: "【NTN株式会社】世界を支える精密機械メーカー",
            en: "NTN Corporation - Precision Machinery Supporting the World",
            zh: "【NTN株式会社】支撑世界的精密机械制造商"
        },
        description: {
            ja: "NTNは、ベアリング（軸受）を中心とした精密機械部品のグローバルメーカーです。自動車、航空機、産業機械など、あらゆる「回転」を支えています。",
            en: "NTN is a global manufacturer of precision machinery parts centered on bearings. We support all kinds of 'rotation' in automobiles, aircraft, and industrial machinery.",
            zh: "NTN是以轴承为中心的精密机械零部件的全球制造商。我们支持汽车、飞机、工业机械等各种'旋转'。"
        },
        date: "2026-03-25",
        time: "10:00-11:30",
        format: {
            ja: "オンライン",
            en: "Online",
            zh: "在线"
        },
        venue: {
            ja: "Zoom",
            en: "Zoom",
            zh: "Zoom"
        },
        capacity: {
            ja: "100名",
            en: "100 people",
            zh: "100人"
        },
        target: {
            ja: "2026年9月～2027年3月卒業見込みの理系留学生（機械、電気電子、材料、情報など）",
            en: "STEM international students graduating Sep 2026 - Mar 2027 (Mechanical, Electrical, Materials, IT, etc.)",
            zh: "2026年9月～2027年3月毕业预定的理科留学生（机械、电气电子、材料、信息等）"
        },
        theme: {
            ja: "技術系総合職（研究開発、設計、生産技術）",
            en: "Technical Positions (R&D, Design, Production Engineering)",
            zh: "技术类综合职位（研发、设计、生产技术）"
        },
        deadline: "2026-03-24 18:00",
        tags: ["online", "stem"],
        japaneseLevel: "N2以上",
        image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600",
        companyAppeal: {
            ja: "創業100年以上の歴史を持ち、世界トップクラスのベアリングメーカーとして、グローバルに事業を展開しています。日本語能力N3～N2レベルの方を積極的に採用しています。",
            en: "With over 100 years of history, we are a world-class bearing manufacturer operating globally. We actively recruit candidates with Japanese proficiency N3-N2 level.",
            zh: "拥有100多年历史，作为世界顶级轴承制造商在全球开展业务。我们积极招聘日语能力N3～N2水平的候选人。"
        },
        whyHire: {
            ja: "グローバル展開を加速する中で、多様な文化背景を持つ人材が必要です。留学生の皆さんの国際的な視点と技術力を活かして、世界中のお客様に貢献してほしいと考えています。",
            en: "As we accelerate global expansion, we need talent with diverse cultural backgrounds. We want international students to contribute to customers worldwide using their international perspectives and technical skills.",
            zh: "在加速全球化发展的过程中，我们需要具有多元文化背景的人才。我们希望留学生利用其国际视野和技术能力为全球客户做出贡献。"
        },
        positions: {
            ja: "研究開発、設計開発、生産技術、品質保証",
            en: "R&D, Design Engineering, Production Engineering, Quality Assurance",
            zh: "研发、设计开发、生产技术、质量保证"
        },
        jobAppeal: {
            ja: "世界中の「動き」を支える製品開発に携わり、最先端の技術と伝統的なモノづくりの両方を学べる環境です。",
            en: "Engage in product development supporting 'movement' worldwide, in an environment where you can learn both cutting-edge technology and traditional manufacturing.",
            zh: "参与支持全球'运动'的产品开发，在可以学习尖端技术和传统制造的环境中工作。"
        }
    },
    {
        id: 3,
        title: {
            ja: "【アース製薬株式会社】グローバル研究職募集",
            en: "Earth Corporation - Global Research Positions",
            zh: "【Earth制药株式会社】全球研究职位招聘"
        },
        description: {
            ja: "「地球を、キモチいい家に。」をビジョンに、虫ケア用品、オーラルケア、入浴剤など、生活に密着した製品を開発しています。",
            en: "With the vision 'Make the Earth a comfortable home,' we develop products closely related to daily life such as insect care, oral care, and bath products.",
            zh: "以'让地球成为舒适的家'为愿景，开发与生活密切相关的产品，如虫害防治、口腔护理、入浴剂等。"
        },
        date: "2026-03-11",
        time: "14:00-16:00",
        format: {
            ja: "オンライン",
            en: "Online",
            zh: "在线"
        },
        venue: {
            ja: "Zoom",
            en: "Zoom",
            zh: "Zoom"
        },
        capacity: {
            ja: "30名",
            en: "30 people",
            zh: "30人"
        },
        target: {
            ja: "2026年9月～2027年3月卒業見込みの大学院生（化学・バイオ・医学・薬学・環境系、機械・材料、プロダクトデザイン専攻）",
            en: "Graduate students graduating Sep 2026 - Mar 2027 (Chemistry, Bio, Medicine, Pharmacy, Environment, Mechanical, Materials, Product Design)",
            zh: "2026年9月～2027年3月毕业预定的研究生（化学、生物、医学、药学、环境、机械、材料、产品设计专业）"
        },
        theme: {
            ja: "グローバル市場向け製品開発・マーケティング",
            en: "Product Development & Marketing for Global Markets",
            zh: "面向全球市场的产品开发・市场营销"
        },
        deadline: "2026-03-04",
        tags: ["online", "stem"],
        image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600",
        companyAppeal: {
            ja: "アジア、中東、中南米市場での製品開発を担当し、各地域の文化やニーズに合わせた商品を創造します。上場企業として安定した経営基盤を持ち、留学生の採用実績も豊富です。",
            en: "Responsible for product development in Asian, Middle Eastern, and Latin American markets, creating products tailored to regional cultures and needs. As a listed company with a stable management foundation and extensive experience hiring international students.",
            zh: "负责亚洲、中东、中南美市场的产品开发，创造符合各地区文化和需求的产品。作为上市公司拥有稳定的经营基础，留学生录用实绩丰富。"
        },
        whyHire: {
            ja: "母国市場の理解と日本の技術力を組み合わせ、グローバル展開を加速させたいと考えています。留学生の皆さんの文化的背景と専門知識が、新しい市場開拓に不可欠です。",
            en: "We want to accelerate global expansion by combining understanding of home markets with Japanese technology. International students' cultural backgrounds and expertise are essential for new market development.",
            zh: "我们希望结合对母国市场的理解和日本的技术实力，加速全球化发展。留学生的文化背景和专业知识对于开拓新市场至关重要。"
        },
        positions: {
            ja: "グローバル研究開発、マーケティング、製品企画",
            en: "Global R&D, Marketing, Product Planning",
            zh: "全球研发、市场营销、产品企划"
        },
        jobAppeal: {
            ja: "「モノづくり⇒商品を創る」に興味がある方に最適です。研究開発からマーケティング、商品化まで一貫して携われる環境が魅力です。",
            en: "Ideal for those interested in 'manufacturing → creating products.' The appeal is an environment where you can be involved from R&D to marketing and commercialization.",
            zh: "适合对'制造→创造产品'感兴趣的人。魅力在于可以从研发到市场营销、商品化一贯参与的环境。"
        }
    }
];

// 現在の言語を取得
function getCurrentLanguage() {
    return localStorage.getItem('language') || 'ja';
}

// イベント一覧を表示
document.addEventListener('DOMContentLoaded', function() {
    renderEventsList();
    
    // 言語切り替え時にイベントカードを再レンダリング
    window.addEventListener('languageChanged', function() {
        renderEventsList();
    });
});

function renderEventsList() {
    const lang = getCurrentLanguage();
    const eventsList = document.getElementById('events-list');
    
    if (!eventsList) return;

    eventsList.innerHTML = '';

    eventsData.forEach(event => {
        const card = document.createElement('div');
        card.className = 'event-card';
        card.id = `event-${event.id}`;

        const tagsHTML = generateTags(event.tags, lang, event.japaneseLevel);
        
        card.innerHTML = `
            <div class="event-image" style="background-image: url('${event.image}')"></div>
            <div class="event-content">
                <div class="event-tags">
                    ${tagsHTML}
                </div>
                <h3 class="event-title">${event.title[lang]}</h3>
                <p class="event-description">${event.description[lang]}</p>
                <div class="event-details">
                    <div class="detail-item">
                        <span class="detail-label">${getLabel('format', lang)}:</span>
                        <span class="detail-value">${event.format[lang]}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">${getLabel('venue', lang)}:</span>
                        <span class="detail-value">${event.venue[lang]}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">${getLabel('datetime', lang)}:</span>
                        <span class="detail-value">${event.date} ${event.time}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">${getLabel('capacity', lang)}:</span>
                        <span class="detail-value">${event.capacity[lang]}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">${getLabel('target', lang)}:</span>
                        <span class="detail-value">${event.target[lang]}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">${getLabel('theme', lang)}:</span>
                        <span class="detail-value">${event.theme[lang]}</span>
                    </div>
                </div>
                <div class="event-actions">
                    <a href="events-detail-public.html?id=${event.id}" class="btn-details">
                        ${getLabel('details', lang)} <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        `;

        eventsList.appendChild(card);
    });
}

// タグを生成
function generateTags(tags, lang, japaneseLevel) {
    const tagLabels = {
        online: { ja: 'オンライン', en: 'Online', zh: '在线' },
        onsite: { ja: '対面', en: 'On-site', zh: '现场' },
        stem: { ja: '理系募集', en: 'STEM', zh: '理科招聘' },
        english: { ja: 'English OK', en: 'English OK', zh: 'English OK' }
    };

    let tagsHTML = tags.map(tag => {
        const label = tagLabels[tag] ? tagLabels[tag][lang] : tag;
        const className = tag === 'online' ? 'tag online' : 
                         tag === 'onsite' ? 'tag onsite' : 
                         tag === 'stem' ? 'tag stem' :
                         'tag';
        return `<span class="${className}">${label}</span>`;
    }).join('');

    // 日本語レベルタグを追加
    if (japaneseLevel) {
        tagsHTML += `<span class="tag level">${japaneseLevel}</span>`;
    }

    return tagsHTML;
}

// ラベルを取得
function getLabel(key, lang) {
    const labels = {
        format: { ja: '形式', en: 'Format', zh: '形式' },
        venue: { ja: '会場', en: 'Venue', zh: '会场' },
        datetime: { ja: '開催日時', en: 'Date & Time', zh: '举办日期' },
        capacity: { ja: '定員', en: 'Capacity', zh: '定员' },
        target: { ja: '対象', en: 'Target', zh: '对象' },
        theme: { ja: 'テーマ', en: 'Theme', zh: '主题' },
        details: { ja: '詳細・申し込み', en: 'Details & Apply', zh: '详情・申请' }
    };

    return labels[key] ? labels[key][lang] : key;
}

// イベントデータをグローバルに公開（詳細ページで使用）
window.eventsData = eventsData;
