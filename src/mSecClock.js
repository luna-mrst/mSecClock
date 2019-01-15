(([d, m, u]) => {
  const old = document.getElementById('mSecClock');
  if (old != null) {
    // 既に時計を生成していた場合は削除して終了
    document.body.removeChild(old);
    clearInterval(window.mSecClock.timer);
    return;
  } else if (window.mSecClock == null) {
    // 初回呼出し時にタイマー管理用グローバル変数の定義とスタイルの定義を行う
    window.mSecClock = {};
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerText = "#mSecClock{font-size:25px;width:8em;height:1.5em;text-align:center;position:fixed;top:10px;left:10px;border:1px solid #000;border-radius:8px;background:#fff;z-index:2147483647;font-family:arial,sans-serif}#mSecClock span{display:inline-block;width:5.5em;vertical-align:middle}#mSecClock .reload{position:relative;top:6px;left:2px;width:25px;height:25px;border:3px solid;border-right-color:transparent;border-radius:100%;box-sizing:border-box;display:inline-block;margin-right:15px;cursor:pointer}#mSecClock .reload:before{position:absolute;top:5px;right:-4.5px;content:'';height:10px;width:10px;border:5px solid transparent;border-top:10px solid;background:0 0;transform-origin:left top;transform:rotate(-40deg);box-sizing:border-box}";
    document.head.appendChild(style);
  }

  /** コンテナ要素 */
  const con = document.createElement('div');
  con.id = 'mSecClock';
  // Chromeの翻訳機能で変な挙動をするのを防ぐため、notranslateクラスで翻訳の対象外とする。
  con.classList.add('notranslate');
  document.body.appendChild(con);

  /** 更新ボタン */
  const reload = document.createElement('div');
  reload.classList.add('reload');
  con.appendChild(reload);

  /** 時計表示部分 */
  const span = document.createElement('span');
  con.appendChild(span);

  /** NICTのNTPサービスURLのリスト */
  const apiList = [
    'https://ntp-a1.nict.go.jp/cgi-bin/json?',
    'https://ntp-b1.nict.go.jp/cgi-bin/json?',
    'http://ntp-a1.nict.go.jp/cgi-bin/json?',
    'http://ntp-b1.nict.go.jp/cgi-bin/json?'
  ];

  // ドラッグで位置を移動するためのイベントを追加する
  // 参考サイト https://q-az.net/elements-drag-and-drop/
  const point = { x: 0, y: 0 };

  const mdown = ev => {
    const e = ev instanceof TouchEvent ? ev.changedTouches[0] : ev;
    if (e.target === reload) {
      return;
    }
    point.x = e.pageX - con.offsetLeft;
    point.y = e.pageY - con.offsetTop;

    document.body.addEventListener(m, mmove, { passive: false });
    con.addEventListener(u, e => document.body.removeEventListener(m, mmove, false));
  };

  const mmove = ev => {
    const e = ev instanceof TouchEvent ? ev.changedTouches[0] : ev;
    ev.preventDefault();

    con.style.top = e.pageY - point.y + 'px';
    con.style.left = e.pageX - point.x + 'px';
  };

  con.addEventListener(d, mdown, false);



  const colChange = col => {
    con.style.background = col;
    setTimeout(() => {
      con.style.background = 'white';
    }, 500);
  };


  let diff = 0;
  // NTPから時刻を取得して表示する
  /**
   * NTPから取得した時刻と端末の時刻の差分を取得する関数
   * 参考サイト https://qiita.com/sounisi5011/items/31972ed6cc8c1551291e
   */
  const refleshDiff = () => {
    if (apiList.length === 0) return colChange('pink');
    fetch(apiList[0] + (Date.now() / 1000), {
      mode: 'cors'
    })
      .then(res => res.json())
      .then(time => {
        const now = Date.now();
        diff = time.st * 1000 + (now - time.it * 1000) / 2 - now;
        colChange('azure');
      })
      .catch(e => {
        apiList.shift(); // エラーが発生したAPIはリストから削除
        colChange('pink');
        if (apiList.length > 0) refleshDiff();
        else {
          alert('正確な時刻を取得できませんでした。');
        }
      });
  };

  /**
   * 現在の時刻をhh:mm:ss.f形式にフォーマットして返す関数
   */
  const getTime = () => {
    const date = new Date(Date.now() + diff);
    return `${('0' + date.getHours()).slice(-2)}:${(
      '0' + date.getMinutes()
    ).slice(-2)}:${('0' + date.getSeconds()).slice(-2)}.${Math.floor(
      date.getMilliseconds() / 100
    )}`;
  };

  reload.addEventListener('click', e => {
    e.preventDefault();
    refleshDiff();
  });

  window.mSecClock.timer = setInterval(() => {
    span.innerText = getTime();
  }, 100);
  refleshDiff();
})(window.ontouchstart !== undefined ? ['touchstart', 'touchmove', 'touchend'] : ['mousedown', 'mousemove', 'mouseup']);