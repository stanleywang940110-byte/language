// app.js - Google Meet Presentation Layout for Taiwanese Tutor

const questions = [
  {
    type: 'mcq',
    topic: '日常問候',
    context: '鄰居跟你問好...',
    questionHanzi: '你早頓食飽未？',
    questionRoman: 'Lí tsá-tǹg tsia̍h-pá--buē?',
    options: [
      { id: 'A', hanzi: '猶未，我腹肚足枵', romanization: 'Iáu-buē, guá pak-tóo tsiok iau', isCorrect: true, feedback: '正確！回答「猶未」(還沒)，表示肚子很餓。' },
      { id: 'B', hanzi: '多謝，我袂去買茶', romanization: 'To-siā, guá buē khì bé tê', isCorrect: false, feedback: '這是「謝謝，我不會去買茶」，語意不符喔。' },
      { id: 'C', hanzi: '再會，順行', romanization: 'Tsài-huē, sūn-kiânn', isCorrect: false, feedback: '這是「再見，慢走」喔。' }
    ]
  },
  {
    type: 'fill_blank',
    topic: '天氣與關心',
    context: '和同事討論今天的天氣...',
    questionPrefix: '今仔日天氣真',
    questionSuffix: '，愛記得啉水。',
    options: [
      { id: 'A', text: '熱 (jua̍h)', isCorrect: true, feedback: '正確！「真熱」表示天氣很熱，要多喝水。' },
      { id: 'B', text: '水 (tsuí)', isCorrect: false, feedback: '「水」用來形容人漂亮，不形容天氣熱。' },
      { id: 'C', text: '寒 (kuânn)', isCorrect: false, feedback: '「寒」是冷的意思，通常冷的時候會說要穿衣服。' }
    ]
  },
  {
    type: 'construct',
    topic: '自我介紹',
    context: '向新朋友介紹自己...',
    prompt: '請拼出：「我是台灣人」',
    scrambledWords: ['人', '我', '學生', '是', '台灣'],
    correctOrder: ['我', '是', '台灣', '人'],
    feedback: '「我是台灣人」的台語是 Guá sī Tâi-uân lâng。'
  },
  {
    type: 'mcq',
    topic: '邀請作客',
    context: '朋友熱情邀請你...',
    questionHanzi: '這禮拜有閒來阮兜泡茶無？',
    questionRoman: 'Tsit lé-pài ū-îng lâi gún tau phàu-tê bô?',
    options: [
      { id: 'A', hanzi: '好啊，我來去買水果', romanization: 'Hó--ah, guá lâi-khì bé tsuí-kó', isCorrect: true, feedback: '很道地！「好啊，我去買水果」是很常見的作客回應。' },
      { id: 'B', hanzi: '無要緊，我這馬去', romanization: 'Bô-iàu-kín, guá tsit-má khì', isCorrect: false, feedback: '意思是「沒關係，我現在去」。不太像回應邀請。' },
      { id: 'C', hanzi: '失禮，我袂曉啉茶', romanization: 'Sit-lé, guá buē-hiáu lim tê', isCorrect: false, feedback: '雖然文法對，但回應「我不會喝茶」有點破壞氣氛喔。' }
    ]
  },
  {
    type: 'construct',
    topic: '點餐',
    context: '在小吃店點餐...',
    prompt: '請拼出：「老闆，我要一碗滷肉飯」',
    scrambledWords: ['頭家', '一碗', '滷肉飯', '我', '欲', '麵'],
    correctOrder: ['頭家', '我', '欲', '一碗', '滷肉飯'],
    feedback: '「頭家，我欲一碗滷肉飯」 (Thâu-ke, guá beh tsi̍t uán lóo-bah-pn̄g)。'
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
      <h1>林老師的台語教室</h1>
      <p class="subtitle">今日進度：情境式對話與文法練習 (Session 2)</p>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #1a73e8; margin-bottom: 30px;">
        <h3>課程說明</h3>
        <p style="color: #202124; margin-bottom: 10px;">請根據林老師在白板上給的情境，完成各種題型的對話任務：</p>
        <ul style="color: #5f6368; font-size: 0.95rem; margin-top: 0; padding-left: 20px;">
          <li><strong>選擇題</strong>：選出最合適的回應</li>
          <li><strong>填空題</strong>：選擇正確的詞彙完成句子</li>
          <li><strong>重組題</strong>：點擊單字卡，組合出正確的台語句子</li>
        </ul>
      </div>

      <button class="btn-primary" id="start-btn">開始上課</button>
    `;
    
    appContainer.appendChild(slideContent);
    setTimeout(() => {
      document.getElementById('start-btn').addEventListener('click', () => {
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
          nextBtn.textContent = '查看課程結果';
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

      // MCQ Type Render
      if (qType === 'mcq') {
        interactionArea.innerHTML = `
          <div class="taigi-question-block">
            <div class="question-hanzi">${q.questionHanzi}</div>
            <div class="question-roman">${q.questionRoman}</div>
            <div class="question-context">情境提示：${q.context}</div>
          </div>
          <div class="options-list" id="options-container"></div>
        `;
        
        const optionsContainer = document.getElementById('options-container');
        q.options.forEach((opt, idx) => {
          const row = document.createElement('div');
          row.className = 'option-row';
          row.innerHTML = `
            <div class="option-marker">${opt.id}.</div>
            <div class="option-content">
              <span class="option-hanzi">${opt.hanzi}</span>
              <span class="option-roman">${opt.romanization}</span>
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
                if(q.options[i].isCorrect) {
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
        interactionArea.innerHTML = `
          <div class="taigi-question-block">
            <div class="question-context">情境提示：${q.context}</div>
          </div>
          <div class="sentence-container">
            ${q.questionPrefix} <span id="blank-space" class="blank-space"></span> ${q.questionSuffix}
          </div>
          <div class="options-list" id="options-container"></div>
        `;
        
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
                if(q.options[i].isCorrect) {
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
        interactionArea.innerHTML = `
          <div class="taigi-question-block">
            <div class="question-context">情境提示：${q.context}</div>
            <div class="question-hanzi" style="font-size: 1.8rem;">${q.prompt}</div>
          </div>
          <div class="construct-area" id="construct-area">
            <span class="placeholder-text" id="construct-placeholder">請點擊下方單字來造句...</span>
          </div>
          <div class="word-bank" id="word-bank"></div>
          <button class="btn-primary btn-submit-construct" id="submit-construct-btn" style="display:none; margin-top: 15px;">送出答案</button>
        `;

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
                 if(state.answered) return;
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
                   if(state.answered) return;
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
    if (state.score === questions.length) message = '太棒了！你完全掌握了情境對答。';
    else if (state.score >= 3) message = '表現不錯！回家記得複習台羅拼音喔。';
    else message = '多加練習，台語會越講越溜！';

    slideContent.innerHTML = `
      <h1>課程結束</h1>
      <p class="subtitle">評估報告</p>
      
      <div style="font-size: 1.5rem; margin-bottom: 20px;">
        總得分：<strong style="color: #1a73e8;">${state.score} / ${questions.length}</strong>
      </div>
      
      <p style="color: #202124; font-size: 1.2rem; margin-bottom: 40px; border-left: 4px solid #34a853; padding-left: 15px;">
        林老師的講評：${message}
      </p>

      <button class="btn-primary" id="restart-btn">重新上課</button>
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
