// app.js - Google Meet Presentation Layout for Taiwanese Tutor

const questions = [
  {
    type: 'fill_blank',
    topic: '語法：選出適當的語詞 (1)',
    context: '選出適當的語詞使句義通順',
    questionPrefix: '1. 阿爸真',
    questionSuffix: '，所以見擺拄著代誌攏愛阿母替伊出面。',
    options: [
      { id: '1', text: '大面神', isCorrect: false, feedback: '「大面神」(tuā-bīn-sîn) 是不知羞恥、厚臉皮的意思。' },
      { id: '2', text: '小面神', isCorrect: true, feedback: '正確！「小面神」(sió-bīn-sîn) 指臉皮薄、容易害羞，所以遇到事情才需要阿母出面。' },
      { id: '3', text: '好笑神', isCorrect: false, feedback: '「好笑神」(hó-tshiò-sîn) 指笑容滿面。' },
      { id: '4', text: '風神', isCorrect: false, feedback: '「風神」(hong-sîn) 喜歡誇耀、吹噓，很有面子的意思。' }
    ]
  },
  {
    type: 'fill_blank',
    topic: '語法：選出適當的語詞 (2)',
    context: '選出適當的語詞使句義通順',
    questionPrefix: '2. 佳芬咧',
    questionSuffix: '水餃的時陣會用飯篱共熟的水餃撈起來，盤仔底才袂水傷濟。',
    options: [
      { id: '1', text: '糋', isCorrect: false, feedback: '「糋」(tsìnn) 是油炸。' },
      { id: '2', text: '煏', isCorrect: false, feedback: '「煏」(piak) 是爆香、乾煸。' },
      { id: '3', text: '炕', isCorrect: false, feedback: '「炕」(khòng) 是慢火燉熬。' },
      { id: '4', text: '煠', isCorrect: true, feedback: '正確！「煠」(sa̍h) 是放進滾水中燙熟，因為撈起來用怕水太多所以可推測是水煮。' }
    ]
  },
  {
    type: 'mcq',
    topic: '拼音與漢字測驗 (1)',
    context: '選出正確的漢字',
    questionHanzi: '1. tà-bông',
    questionRoman: '',
    options: [
      { id: '1', hanzi: '搭雺', romanization: '', isCorrect: false, feedback: '用字不正確喔。' },
      { id: '2', hanzi: '大濛', romanization: '', isCorrect: false, feedback: '用字不正確喔。' },
      { id: '3', hanzi: '罩雺', romanization: '', isCorrect: true, feedback: '正確！「罩雺」(tà-bông) 是起霧的意思。' },
      { id: '4', hanzi: '搭濛', romanization: '', isCorrect: false, feedback: '用字不正確喔。' }
    ]
  },
  {
    type: 'mcq',
    topic: '拼音與漢字測驗 (2)',
    context: '選出正確的拼音',
    questionHanzi: '2. 冤家',
    questionRoman: '(吵架/不和的意思)',
    options: [
      { id: '1', hanzi: 'uan-ke', romanization: '', isCorrect: true, feedback: '正確！「冤家」(吵架) 的台語發音為 uan-ke。' },
      { id: '2', hanzi: 'on-ke', romanization: '', isCorrect: false, feedback: '拼音寫法錯誤。' },
      { id: '3', hanzi: 'uoan-ge', romanization: '', isCorrect: false, feedback: '台羅沒有 uoan-ge 這種拼法。' },
      { id: '4', hanzi: 'uan-khe', romanization: '', isCorrect: false, feedback: '字尾不是 khe，是 ke 喔。' }
    ]
  },
  {
    type: 'listen',
    topic: '聽力測驗',
    context: '點擊播放音檔，並請選出你聽到的詞彙',
    audioUrl: 'a-tsa.m4a',
    questionHanzi: '', // We won't show anything here for listening
    questionRoman: '',
    options: [
      { id: '1', hanzi: '腌臢', romanization: '', isCorrect: true, feedback: '正確！「腌臢」(a-tsa) 常用來形容骯髒、不乾淨。' },
      { id: '2', hanzi: '垃圾', romanization: '', isCorrect: false, feedback: '雖然意思相近，但「垃圾」(lap-sap) 發音為 lap-sap。' },
      { id: '3', hanzi: '枵饞', romanization: '', isCorrect: false, feedback: '「枵饞」(iau-sâi) 是嘴饞、貪吃的意思。' },
      { id: '4', hanzi: '齷齪', romanization: '', isCorrect: false, feedback: '錯誤！「齷齪」(ak-tsak)是心情鬱悶的意思。' }
    ]
  }
];

let state = {
  screen: 'start',
  currentIndex: 0,
  score: 0,
  answered: false,
  constructAnswer: [] // For 'construct' type questions
};

const appContainer = document.getElementById('app');

// Update clock
setInterval(() => {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const clockEl = document.getElementById('clock-display');
  if (clockEl) clockEl.textContent = timeStr;
}, 1000);

function render() {
  appContainer.innerHTML = '';

  const slideContent = document.createElement('div');
  slideContent.className = 'slide-content';

  if (state.screen === 'start') {
    slideContent.innerHTML = `
      <div class="start-screen-container">
        <div class="start-left-col">
          <div class="start-hero-header">
            <div class="start-hero-icon"><span class="material-icons">school</span></div>
            <h1>林老師的台語教室</h1>
            <p class="start-subtitle">Taigi Tutor Challenge</p>
          </div>
          
          <button class="btn-primary start-pulse-btn" id="start-btn">
            開始測驗 <span class="material-icons">arrow_forward</span>
          </button>
        </div>
        
        <div class="start-right-col">
          <div class="start-info-card">
            <h3 class="card-title"><span class="material-icons">assignment</span> 今日測驗目標</h3>
            <p class="card-desc">準備好接受綜合挑戰了嗎？測驗將包含：</p>
            
            <div class="feature-list">
              <div class="feature-item">
                <div class="feature-icon bg-blue"><span class="material-icons">font_download</span></div>
                <div class="feature-text">
                  <strong>選擇題</strong>
                  <span>漢字與拼音互相對照</span>
                </div>
              </div>
              <div class="feature-item">
                <div class="feature-icon bg-green"><span class="material-icons">edit_note</span></div>
                <div class="feature-text">
                  <strong>填空題</strong>
                  <span>根據生活情境進行語意判斷</span>
                </div>
              </div>
              <div class="feature-item">
                <div class="feature-icon bg-purple"><span class="material-icons">headphones</span></div>
                <div class="feature-text">
                  <strong>聽力題</strong>
                  <span>聆聽原音重現，選出正確語彙</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    appContainer.appendChild(slideContent);
    setTimeout(() => {
      document.getElementById('start-btn').addEventListener('click', () => {
        state.screen = 'intro';
        render();
      });
    }, 0);

  } else if (state.screen === 'intro') {
    slideContent.innerHTML = `
      <div style="text-align: center; padding: 40px 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 400px; background: linear-gradient(to bottom, #ffffff, #f8f9fa); border-radius: 16px;">
        
        <img src="tutor_avatar.png" alt="Tutor Avatar" class="intro-avatar">
        
        <h2 style="margin-bottom: 15px; color: #202124; font-size: 2rem; font-weight: 700; letter-spacing: 1px;">林老師的課前問候</h2>
        <p style="font-size: 1.2rem; color: #5f6368; margin-bottom: 40px; max-width: 400px; line-height: 1.5;">
          在正式進入挑戰之前，先戴上耳機，聽聽看老師今天有哪些想說的話吧！
        </p>
        
        <div style="margin-bottom: 30px; height: 80px; display: flex; align-items: center; justify-content: center;">
           <button class="intro-play-btn" id="play-intro-btn">
             <span class="material-icons" style="font-size: 2.2rem;">play_circle_filled</span>
             播放開場語音
           </button>
        </div>

        <div style="height: 60px; display: flex; align-items: center; justify-content: center; width: 100%;">
           <button class="btn-primary" id="go-quiz-btn" style="display: none; padding: 14px 45px; font-size: 1.25rem; border-radius: 30px; background: #34a853; box-shadow: 0 4px 12px rgba(52, 168, 83, 0.3);">
             準備好了，進入測驗！
           </button>
        </div>
      </div>
    `;

    appContainer.appendChild(slideContent);

    setTimeout(() => {
      const playBtn = document.getElementById('play-intro-btn');
      const goQuizBtn = document.getElementById('go-quiz-btn');
      const introAudio = new Audio('開頭.m4a');

      playBtn.addEventListener('click', () => {
        introAudio.play().then(() => {
          playBtn.classList.add('playing');
          playBtn.innerHTML = '<span class="material-icons" style="font-size: 2.2rem;">graphic_eq</span> 語音播放中...';
        }).catch(e => {
          alert('找不到音檔 (開頭.m4a) 或是無法播放喔！請確認有把檔案放進資料夾。');
        });

        goQuizBtn.style.display = 'block';
        goQuizBtn.style.animation = 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards';

        introAudio.onended = () => {
          playBtn.classList.remove('playing');
          playBtn.innerHTML = '<span class="material-icons" style="font-size: 2.2rem;">replay</span> 再聽一次';
        };
      });

      goQuizBtn.addEventListener('click', () => {
        introAudio.pause();
        state.screen = 'quiz';
        render();
      });
    }, 0);

  } else if (state.screen === 'quiz') {
    const q = questions[state.currentIndex];
    const qType = q.type || 'mcq';

    slideContent.innerHTML = `
      <div class="quiz-header">
        <span class="situation-tag">【 ${q.topic} 】進度 ${state.currentIndex + 1} / ${questions.length}</span>
      </div>

      <div class="interaction-area" id="interaction-area"></div>
      
      <!-- Feedback Area -->
      <div id="feedback-obj" class="feedback-banner"></div>

      <div class="next-action" style="display: none;" id="nav-container">
        <button class="btn-primary" id="next-btn">下一題</button>
      </div>
    `;

    appContainer.appendChild(slideContent);

    setTimeout(() => {
      const interactionArea = document.getElementById('interaction-area');
      const feedbackObj = document.getElementById('feedback-obj');
      const navContainer = document.getElementById('nav-container');
      const nextBtn = document.getElementById('next-btn');

      const showNext = () => {
        navContainer.style.display = 'flex';
        if (state.currentIndex === questions.length - 1) {
          nextBtn.textContent = '查看測驗結果';
        }
      };

      const handleCorrect = (msg) => {
        state.answered = true;
        state.score++;
        feedbackObj.className = 'feedback-banner show-correct';
        feedbackObj.innerHTML = `<span class="material-icons">check_circle</span> <div><strong>答對！</strong> ${msg}</div>`;
        showNext();
      };

      const handleError = (msg) => {
        state.answered = true;
        feedbackObj.className = 'feedback-banner show-error';
        feedbackObj.innerHTML = `<span class="material-icons">cancel</span> <div><strong>錯誤！</strong> ${msg}</div>`;
        showNext();
      };

      // MCQ and LISTEN Type Render
      if (qType === 'mcq' || qType === 'listen') {
        let audioBtnHtml = '';
        if (q.audioUrl) {
          audioBtnHtml = `
            <div style="margin-top: 10px;">
                <button class="btn-audio" id="play-audio-btn">
                  <span class="material-icons">volume_up</span> 播放語音
                </button>
            </div>
          `;
        }

        interactionArea.innerHTML = `
          <div class="taigi-question-block">
            <div class="question-context">情境提示：${q.context}</div>
            ${q.questionHanzi ? `<div class="question-hanzi">${q.questionHanzi}</div>` : ''}
            ${q.questionRoman ? `<div class="question-roman">${q.questionRoman}</div>` : ''}
            ${audioBtnHtml}
          </div>
          <div class="options-list" id="options-container"></div>
        `;

        if (q.audioUrl) {
          document.getElementById('play-audio-btn').addEventListener('click', () => {
            const audio = new Audio(q.audioUrl);
            audio.play().catch(e => {
              alert('因為找不到音檔文件 (' + q.audioUrl + ')，所以無法播放。請確認音檔名稱正確並放在同一個資料夾。');
            });
          });
        }

        const optionsContainer = document.getElementById('options-container');
        q.options.forEach((opt, idx) => {
          const row = document.createElement('div');
          row.className = 'option-row';
          row.innerHTML = `
            <div class="option-marker">${opt.id}.</div>
            <div class="option-content">
              <span class="option-hanzi">${opt.hanzi}</span>
              ${opt.romanization ? `<span class="option-roman">${opt.romanization}</span>` : ''}
            </div>
          `;

          row.addEventListener('click', () => {
            if (state.answered) return;
            document.querySelectorAll('.option-row').forEach(el => el.classList.add('disabled'));
            row.classList.remove('disabled');

            if (opt.isCorrect) {
              row.classList.add('correct');
              handleCorrect(opt.feedback);
            } else {
              row.classList.add('incorrect');
              handleError(opt.feedback);
              document.querySelectorAll('.option-row').forEach((el, i) => {
                if (q.options[i].isCorrect) {
                  el.classList.remove('disabled');
                  el.classList.add('correct');
                }
              });
            }
          });
          optionsContainer.appendChild(row);
        });

        // FILL IN THE BLANK Type Render
      } else if (qType === 'fill_blank') {
        let audioBtnHtml = '';
        if (q.audioUrl) {
          audioBtnHtml = `
            <div style="margin-top: 10px; margin-bottom: 20px;">
                <button class="btn-audio" id="play-audio-btn">
                  <span class="material-icons">volume_up</span> 播放語音
                </button>
            </div>
          `;
        }

        interactionArea.innerHTML = `
          <div class="taigi-question-block">
            <div class="question-context">情境提示：${q.context}</div>
          </div>
          ${audioBtnHtml}
          <div class="sentence-container">
            ${q.questionPrefix} <span id="blank-space" class="blank-space"></span> ${q.questionSuffix}
          </div>
          <div class="options-list" id="options-container"></div>
        `;

        if (q.audioUrl) {
          document.getElementById('play-audio-btn').addEventListener('click', () => {
            const audio = new Audio(q.audioUrl);
            audio.play().catch(e => {
              alert('因為找不到音檔文件 (' + q.audioUrl + ')，所以無法播放。');
            });
          });
        }

        const optionsContainer = document.getElementById('options-container');
        const blankSpace = document.getElementById('blank-space');

        q.options.forEach((opt) => {
          const row = document.createElement('div');
          row.className = 'option-row';
          row.innerHTML = `
            <div class="option-marker">${opt.id}.</div>
            <div class="option-content">
              <span class="option-hanzi">${opt.text}</span>
            </div>
          `;

          row.addEventListener('click', () => {
            if (state.answered) return;
            document.querySelectorAll('.option-row').forEach(el => el.classList.add('disabled'));
            row.classList.remove('disabled');

            blankSpace.textContent = opt.text;
            blankSpace.className = 'blank-filled';

            if (opt.isCorrect) {
              row.classList.add('correct');
              handleCorrect(opt.feedback);
            } else {
              row.classList.add('incorrect');
              handleError(opt.feedback);
              document.querySelectorAll('.option-row').forEach((el, i) => {
                if (q.options[i].isCorrect) {
                  el.classList.remove('disabled');
                  el.classList.add('correct');
                }
              });
            }
          });
          optionsContainer.appendChild(row);
        });

        // CONSTRUCT SENTENCE Type Render
      } else if (qType === 'construct') {
        state.constructAnswer = [];
        let audioBtnHtml = '';
        if (q.audioUrl) {
          audioBtnHtml = `
            <div style="margin-top: 10px;">
                <button class="btn-audio" id="play-audio-btn">
                  <span class="material-icons">volume_up</span> 播放語音
                </button>
            </div>
          `;
        }

        interactionArea.innerHTML = `
          <div class="taigi-question-block">
            <div class="question-context">情境提示：${q.context}</div>
            <div class="question-hanzi" style="font-size: 1.8rem;">${q.prompt}</div>
            ${audioBtnHtml}
          </div>
          <div class="construct-area" id="construct-area">
            <span class="placeholder-text" id="construct-placeholder">請點擊下方單字來造句...</span>
          </div>
          <div class="word-bank" id="word-bank"></div>
          <button class="btn-primary btn-submit-construct" id="submit-construct-btn" style="display:none; margin-top: 15px;">送出答案</button>
        `;

        if (q.audioUrl) {
          document.getElementById('play-audio-btn').addEventListener('click', () => {
            const audio = new Audio(q.audioUrl);
            audio.play().catch(e => {
              alert('因為找不到音檔文件 (' + q.audioUrl + ')，所以無法播放。');
            });
          });
        }

        const constructArea = document.getElementById('construct-area');
        const wordBank = document.getElementById('word-bank');
        const submitBtn = document.getElementById('submit-construct-btn');
        const placeholder = document.getElementById('construct-placeholder');

        const updateConstructUI = () => {
          constructArea.innerHTML = '';
          if (state.constructAnswer.length === 0) {
            constructArea.appendChild(placeholder);
            submitBtn.style.display = 'none';
          } else {
            submitBtn.style.display = 'block';
            state.constructAnswer.forEach((originalIdx, currentPos) => {
              const chip = document.createElement('div');
              chip.className = 'word-chip';
              chip.textContent = q.scrambledWords[originalIdx];
              chip.addEventListener('click', () => {
                if (state.answered) return;
                state.constructAnswer.splice(currentPos, 1);
                updateConstructUI();
              });
              constructArea.appendChild(chip);
            });
          }

          wordBank.innerHTML = '';
          q.scrambledWords.forEach((word, idx) => {
            const btn = document.createElement('div');
            btn.className = 'word-chip';
            btn.textContent = word;
            if (state.constructAnswer.includes(idx)) {
              btn.classList.add('used');
            } else {
              btn.addEventListener('click', () => {
                if (state.answered) return;
                state.constructAnswer.push(idx);
                updateConstructUI();
              });
            }
            wordBank.appendChild(btn);
          });
        };

        updateConstructUI();

        submitBtn.addEventListener('click', () => {
          if (state.answered) return;
          submitBtn.style.display = 'none';
          const answeredWords = state.constructAnswer.map(idx => q.scrambledWords[idx]);
          const isCorrect = JSON.stringify(answeredWords) === JSON.stringify(q.correctOrder);
          if (isCorrect) {
            handleCorrect('太棒了！造句完全正確。<br><span style="font-size:0.95rem;color:#137333">' + q.feedback + '</span>');
          } else {
            handleError(`順序或內容有誤喔！正確解答是：「${q.correctOrder.join('')}」<br><span style="font-size:0.95rem;color:#c5221f">${q.feedback}</span>`);
          }
        });
      }

      nextBtn.addEventListener('click', () => {
        if (state.currentIndex < questions.length - 1) {
          state.currentIndex++;
          state.answered = false;
          render();
        } else {
          state.screen = 'end';
          render();
        }
      });
    }, 0);

  } else if (state.screen === 'end') {
    let message = '';
    if (state.score === questions.length) message = '全部答對！台語語感非常好喔。';
    else if (state.score >= 3) message = '表現不錯！一些容易混淆的詞彙再留意一下。';
    else message = '台語有很多細節，再接再厲多練習！';

    slideContent.innerHTML = `
      <h1>測驗結束</h1>
      <p class="subtitle">評估報告</p>
      
      <div style="font-size: 1.5rem; margin-bottom: 20px;">
        總得分：<strong style="color: #1a73e8;">${state.score} / ${questions.length}</strong>
      </div>
      
      <p style="color: #202124; font-size: 1.2rem; margin-bottom: 40px; border-left: 4px solid #34a853; padding-left: 15px;">
        林老師的講評：${message}
      </p>

      <button class="btn-primary" id="restart-btn">重新測驗</button>
    `;

    appContainer.appendChild(slideContent);

    setTimeout(() => {
      document.getElementById('restart-btn').addEventListener('click', () => {
        state.screen = 'start';
        state.currentIndex = 0;
        state.score = 0;
        state.answered = false;
        render();
      });
    }, 0);
  }
}

// Init
document.addEventListener('DOMContentLoaded', render);
