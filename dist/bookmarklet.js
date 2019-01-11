(()=>{const old=document.getElementById("mSecClock");if(null!=old)return document.body.removeChild(old),void clearInterval(window.mSecClock.timer);if(null==window.mSecClock){window.mSecClock={};const style=document.createElement("style");style.type="text/css",style.innerText="#mSecClock{font-size:25px;width:8em;height:1.5em;text-align:center;position:fixed;top:10px;left:10px;border:1px solid #000;border-radius:8px;background:#fff;z-index:2147483647;font-family:arial,sans-serif}#mSecClock span{display:inline-block;width:5.5em;vertical-align:middle}#mSecClock .reload{position:relative;top:6px;left:2px;width:25px;height:25px;border:3px solid;border-right-color:transparent;border-radius:100%;box-sizing:border-box;display:inline-block;margin-right:15px;cursor:pointer}#mSecClock .reload:before{position:absolute;top:5px;right:-4.5px;content:'';height:10px;width:10px;border:5px solid transparent;border-top:10px solid;background:0 0;transform-origin:left top;transform:rotate(-40deg);box-sizing:border-box}",document.head.appendChild(style)}const con=document.createElement("div");con.id="mSecClock",con.classList.add("notranslate"),document.body.appendChild(con);const reload=document.createElement("div");reload.classList.add("reload"),con.appendChild(reload);const span=document.createElement("span");con.appendChild(span);const apiList=["https://ntp-a1.nict.go.jp/cgi-bin/json?","https://ntp-b1.nict.go.jp/cgi-bin/json?","http://ntp-a1.nict.go.jp/cgi-bin/json?","http://ntp-b1.nict.go.jp/cgi-bin/json?"],point={x:0,y:0},mmove=e=>{e.preventDefault(),con.style.top=e.pageY-point.y+"px",con.style.left=e.pageX-point.x+"px",con.addEventListener("mouseup",e=>{document.body.removeEventListener("mousemove",mmove,!1)},!1)};con.addEventListener("mousedown",e=>{e.target!==reload&&(point.x=e.pageX-con.offsetLeft,point.y=e.pageY-con.offsetTop,document.body.addEventListener("mousemove",mmove,!1))},!1);const colChange=col=>{con.style.background=col,setTimeout(()=>{con.style.background="white"},500)};let diff=0;const refleshDiff=()=>{if(0===apiList.length)return colChange("pink");fetch(apiList[0]+Date.now()/1e3,{mode:"cors"}).then(res=>res.json()).then(time=>{const now=Date.now();diff=1e3*time.st+(now-1e3*time.it)/2-now,colChange("azure")}).catch(e=>{apiList.shift(),colChange("pink"),apiList.length>0?refleshDiff():alert("正確な時刻を取得できませんでした。")})};reload.addEventListener("click",e=>{e.preventDefault(),refleshDiff()}),window.mSecClock.timer=setInterval(()=>{span.innerText=(()=>{const date=new Date(Date.now()+diff);return`${("0"+date.getHours()).slice(-2)}:${("0"+date.getMinutes()).slice(-2)}:${("0"+date.getSeconds()).slice(-2)}.${Math.floor(date.getMilliseconds()/100)}`})()},100),refleshDiff()})();