import { MemoryRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
//import icon from '../../assets/icon.svg';
import './App.css';


const ArraySizeMin = 1;
const ArraySizeMax = 31;

const drawMC = function(ctx, canvas, object, index, mode) {
  switch (mode) {
    case "Heap":
      drawHeap(ctx, canvas, object, index);
      break;
    case "Bar":
      drawBar(ctx, canvas, object, index);
      break;
  }
}

const drawBar = function(ctx, canvas, object, index) {
  if(object !== null)
  {
    ctx.fillStyle = "#AAAAAA";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    let BarViewer = require('./bar.js');
    let arr = object[index].state.values[0];
    let bv = new BarViewer(canvas, 'dst', arr);
    bv.sep.setLen(arr.length);
    let seppos = 1;
    let pow = 2;
    while (seppos < arr.length) {
      bv.sep.add(seppos);
      seppos += pow;
      pow = pow << 1;
    }
    let tmp = object[index].state.values[1];
    bv.tmp.setName('tmp');
    if (tmp != null) {
      bv.tmp.setValue(tmp);
    }
    if (object[index].state.values[5] != null) {
      let root = object[index].state.values[5];
      for (let i = 0; i <= object[index].state.values[2]; i++) {
        let n = root+1;
        
        if (n > i+1) {
          bv.setColor(i, '333333');
        } else {
          let j = i+1;
          while (true) {
            if ((j) < (n << 1)) {
              break;
            }
            j = j>>1;
          }
          if ((j & n) != j) {
            bv.setColor(i, '333333');
          }
        }
      }
    }
    for (let i = object[index].state.values[2] + 1; i < arr.length; i++) {
      bv.setColor(i, 'AAFFAA');
    }
    if (object[index].state.values[3] != null && object[index].state.values[1] != null) {
      bv.setColor(object[index].state.values[3], '777777');
    }
    switch (object[index].state.process) {
      case 'comp':
        if (object[index].object.left.type == 'array') {
          bv.setColor(object[index].object.left.info.index, 'FFCCAA');
        }
        if (object[index].object.right.type == 'array') {
          bv.setColor(object[index].object.right.info.index, 'FFCCAA');
        }
        break;
      case 'swap':
        bv.setColor(object[index].object.left.info.index, 'FFAAAA');
        bv.setColor(object[index].object.right.info.index, 'FFAAAA');
        break;
      case 'change':
        if (object[index].object.info.objName=='arr') {
          if (object[index].result != object[index].state.values[1]) {
            bv.setColor(object[index].state.values[4], 'AAAAFF');
          }
          bv.setColor(object[index].object.info.index, 'FFAAFF');
          bv.setValue(object[index].object.info.index, object[index].result);
        }
        break;
    }
    switch (object[index].state.process) {
      case 'comp':
        if (object[index].object.left.info.objName=='tmp') {
          bv.tmp.setColor('FFCCAA');
        }
        if (object[index].object.right.info.objName=='tmp') {
          bv.tmp.setColor('FFCCAA');
        }
        break;
      case 'set':
        if (object[index].object.info.objName=='tmp') {
          bv.tmp.setColor('FFAAAA');
        }
        break;
      case 'change':
        if (object[index].object.info.objName=='arr') {
          if (object[index].result == tmp) {
            bv.tmp.setColor('AAAAFF');
          }
        }
        break;
    }
    bv.show();
  }
}

const drawHeap = function(ctx, canvas, object, index) {
  if(object !== null)
  {
    ctx.fillStyle = "#AAAAAA";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    let TreeViewer = require('./bt.js');
    let tree = new TreeViewer(ctx, canvas.width);
    let arr = object[index].state.values[0];
    for (let i = 0; i < arr.length; i++) {
      tree.add(arr[i]);
      if (object[index].state.values[2] < i) {
        tree.select(i).setState('outer');
        tree.select(i).setColor('AAFFAA');
      }
    }
    if (object[index].state.values[5] != null) {
      let root = object[index].state.values[5];
      for (let i = 0; i <= object[index].state.values[2]; i++) {
        let n = root+1;
        
        if (n > i+1) {
          tree.select(i).setColor('333333');
        } else {
          let j = i+1;
          while (true) {
            if ((j) < (n << 1)) {
              break;
            }
            j = j>>1;
          }
          if ((j & n) != j) {
            tree.select(i).setColor('333333');
          }
        }
      }
    }
    if (object[index].state.values[1] != null) {
      tree.setTmp(object[index].state.values[1]);
    }
    if (object[index].state.values[3] != null && object[index].state.values[1] != null) {
      tree.select(object[index].state.values[3]).setColor('999999');
    }
    switch (object[index].state.process) {
      case 'comp':
        if (object[index].object.left.type == 'array') {
          tree.select(object[index].object.left.info.index).setColor('FFCCAA');
        } else if (object[index].object.left.info.objName=='tmp') {
          tree.setTmpColor('FFCCAA');
        }
        if (object[index].object.right.type == 'array') {
          tree.select(object[index].object.right.info.index).setColor('FFCCAA');
        } else if (object[index].object.right.info.objName=='tmp') {
          tree.setTmpColor('FFCCAA');
        }
        break;
      case 'swap':
        tree.select(object[index].object.left.info.index).setValue(object[index].object.right.value);
        tree.select(object[index].object.right.info.index).setValue(object[index].object.left.value);
        tree.select(object[index].object.left.info.index).setColor('FFAAAA');
        tree.select(object[index].object.right.info.index).setColor('FFAAAA');
        break;
      case 'change':
        if (object[index].object.info.objName=='arr') {
          if (object[index].result == object[index].state.values[1]) {
            tree.setTmpColor('AAAAFF');
          } else {
            tree.select(object[index].state.values[4]).setColor('AAAAFF');
          }
          tree.select(object[index].object.info.index).setColor('FFAAFF');
          tree.select(object[index].object.info.index).setValue(object[index].result);
        }
        break;
      case 'set':
        if (object[index].object.info.objName == 'tmp') {
          tree.setTmpColor('FFAAAA');
        }
        break;
    }
    tree.bt();
  }
}
const drawAC1 = function(ctx, canvas, object, index) {
  if(object !== null)
  {
    ctx.fillStyle = "#AAAAAA";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    let ArrayViewer = require('./array.js');
    let arr = object[index].state.values[0];
    let av = new ArrayViewer(ctx, 'dst', arr);
    if (object[index].state.values[5] != null) {
      let root = object[index].state.values[5];
      for (let i = 0; i <= object[index].state.values[2]; i++) {
        let n = root+1;
        
        if (n > i+1) {
          av.setColor(i, '333333');
        } else {
          let j = i+1;
          while (true) {
            if ((j) < (n << 1)) {
              break;
            }
            j = j>>1;
          }
          if ((j & n) != j) {
            av.setColor(i, '333333');
          }
        }
      }
    }
    for (let i = object[index].state.values[2] + 1; i < arr.length; i++) {
      av.setColor(i, 'AAFFAA');
    }
    if (object[index].state.values[3] != null && object[index].state.values[1] != null) {
      av.setColor(object[index].state.values[3], '777777');
    }
    switch (object[index].state.process) {
      case 'comp':
        if (object[index].object.left.type == 'array') {
          av.setColor(object[index].object.left.info.index, 'FFCCAA');
        }
        if (object[index].object.right.type == 'array') {
          av.setColor(object[index].object.right.info.index, 'FFCCAA');
        }
        break;
      case 'swap':
        av.setValue(object[index].object.left.info.index, object[index].object.right.value);
        av.setValue(object[index].object.right.info.index, object[index].object.left.value);
        av.setColor(object[index].object.left.info.index, 'FFAAAA');
        av.setColor(object[index].object.right.info.index, 'FFAAAA');
        break;
      case 'change':
        if (object[index].object.info.objName=='arr') {
          if (object[index].result != object[index].state.values[1]) {
            av.setColor(object[index].state.values[4], 'AAAAFF');
          }
          av.setColor(object[index].object.info.index, 'FFAAFF');
          av.setValue(object[index].object.info.index, object[index].result);
        }
        break;
    }
    av.show();
  }
}
const drawAC2 = function(ctx, canvas, object, index) {
  if(object !== null)
  {
    ctx.fillStyle = "#AAAAAA";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    let ArrayViewer = require('./array.js');
    let value = object[index].state.values[1];
    let tmp = [];
    if (value != null) {
      tmp = [value];
    }
    let av = new ArrayViewer(ctx, 'tmp', tmp);
    switch (object[index].state.process) {
      case 'comp':
        if (object[index].object.left.info.objName=='tmp') {
          av.setColor(0, 'FFCCAA');
        }
        if (object[index].object.right.info.objName=='tmp') {
          av.setColor(0, 'FFCCAA');
        }
        break;
      case 'set':
        if (object[index].object.info.objName=='tmp') {
          av.setColor(0, 'FFAAAA');
        }
        break;
      case 'change':
        if (object[index].object.info.objName=='arr') {
          if (object[index].result == value) {
            av.setColor(0, 'AAAAFF');
          }
        }
        break;
    }
    av.show();
  }
}
const drawVC = function(ctx, canvas, object, index) {
  let y = 20;
  if(object !== null)
  {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.font = "14pt sans-serif";
    ctx.fillStyle = "#FFFFFF";
    //const txt_with = this.ctx.measureText(this.tmp.value).width;
    ctx.fillText('Operation:', 10, y);
    y += 25;
    ctx.fillText(object[index].state.process, 30, y);
    if (object[index].state.process == 'comp') {
      let str = '';
      str += object[index].object.left.value;
      str += ' ';
      str += object[index].object.op.string;
      str += ' ';
      str += object[index].object.right.value;
      str += ' : ';
      str += object[index].result;
      y += 25;
      ctx.fillText(str, 30, y);
    }
    y += 40;
    ctx.fillText('Values:', 10, y);
    y += 25;
    if (object[index].state.values[1] != null) {
      let value = object[index].state.values[1];
      switch (object[index].state.process) {
        case 'set':
          if (object[index].object.info.objName == 'tmp') {
            ctx.fillStyle = "#FFFFAA";
          } else {
            ctx.fillStyle = "#FFFFFF";
          }
          break;
      }
      ctx.fillText('tmp: ' + value, 30, y);
      y += 25;
    }
    if (object[index].state.values[5] != null) {
      let value = object[index].state.values[5];
      switch (object[index].state.process) {
        case 'comp':
          if (object[index].object.left.info.objName == 'root') {
            ctx.fillStyle = "#FFCCAA";
          } else if (object[index].object.right.info.objName == 'root') {
            ctx.fillStyle = "#FFCCAA";
          } else {
            ctx.fillStyle = "#FFFFFF";
          }
          break;
        case 'set':
          if (object[index].object.info.objName == 'root') {
            ctx.fillStyle = "#FFFFAA";
          } else {
            ctx.fillStyle = "#FFFFFF";
          }
        break;
      }
      ctx.fillText('root: ' + value, 30, y);
      y += 25;
    }
    if (object[index].state.values[3] != null) {
      let value = object[index].state.values[3];
      switch (object[index].state.process) {
        case 'comp':
          if (object[index].object.left.info.objName == 'parent') {
            ctx.fillStyle = "#FFCCAA";
          } else if (object[index].object.right.info.objName == 'parent') {
            ctx.fillStyle = "#FFCCAA";
          } else {
            ctx.fillStyle = "#FFFFFF";
          }
          break;
        case 'change':
          if (object[index].object.info.objName == 'parent') {
            ctx.fillStyle = "#FFAAFF";
            value = object[index].result;
          } else {
            ctx.fillStyle = "#FFFFFF";
          }
          break;
        case 'set':
          if (object[index].object.info.objName == 'parent') {
            ctx.fillStyle = "#FFFFAA";
          } else if (object[index].object.info.objName == 'root') {
            ctx.fillStyle = "#FFFFAA";
          } else {
            ctx.fillStyle = "#FFFFFF";
          }
          break;
      }
      ctx.fillText('parent: ' + value, 30, y);
      y += 25;
    }
    if (object[index].state.values[4] != null) {
      let value = object[index].state.values[4];
      switch (object[index].state.process) {
        case 'comp':
          if (object[index].object.left.info.objName == 'child') {
            ctx.fillStyle = "#FFCCAA";
          } else if (object[index].object.right.info.objName == 'child') {
            ctx.fillStyle = "#FFCCAA";
          } else {
            ctx.fillStyle = "#FFFFFF";
          }
          break;
        case 'change':
          if (object[index].object.info.objName == 'child') {
            ctx.fillStyle = "#FFAAFF";
            value = object[index].result;
          } else if (object[index].object.info.objName == 'parent') {
            ctx.fillStyle = "#AAAAFF";
          } else {
            ctx.fillStyle = "#FFFFFF";
          }
          break;
        case 'set':
          if (object[index].object.info.objName == 'child') {
            ctx.fillStyle = "#FFFFAA";
          } else {
            ctx.fillStyle = "#FFFFFF";
          }
          break;
      }
      ctx.fillText('child: ' + value, 30, y);
      y += 25;
    }
    if (object[index].state.values[2] != null && object[index].state.values[2] >= 0) {
      let value = object[index].state.values[2];
      switch (object[index].state.process) {
        case 'comp':
          if (object[index].object.left.info.objName=='bottom') {
            ctx.fillStyle = "#FFCCAA";
          } else if (object[index].object.right.info.objName=='bottom') {
            ctx.fillStyle = "#FFCCAA";
          } else {
            ctx.fillStyle = "#FFFFFF";
          }
          break;
        case 'change':
          if (object[index].object.info.objName == 'bottom') {
            ctx.fillStyle = "#FFAAFF";
            value = object[index].result;
          } else {
            ctx.fillStyle = "#FFFFFF";
          }
          break;
        case 'set':
          if (object[index].object.info.objName == 'bottom') {
            ctx.fillStyle = "#FFFFAA";
          } else {
            ctx.fillStyle = "#FFFFFF";
          }
          break;
      }
      ctx.fillText('bottom: ' + value, 30, y);
      y += 25;
    }
  }
}

const Home = function() {
  const navigate = useNavigate();
  const [val, setVal] = useState("10");
  useEffect(()=>{
    document.title = 'Sort';
  },[]);

  const onSubmit = () => {
    const e = document.getElementById('sort_method');
    if (e == null) return;
    const message = [val, e.value];
    window.electron.ipcRenderer.sendMessage('hStart', message);
    switch (e.value) {
      case 'Heap Sort':
        navigate("/hsort");
        break;
      default:
        break;
    }
  };

  const onResetSize = () => {
    const e = document.getElementById('SizeInputBox');
    if (e == null) return;
    e.value = '10';
    setVal(e.value);
  };

  const onQuit = () => {
    window.electron.ipcRenderer.sendMessage('Quit', true);
  };

  const onInputValueChanged = (e) => {
    if (e.target.value < ArraySizeMin) {
      e.target.value = ArraySizeMin;
    } else if (e.target.value > ArraySizeMax) {
      e.target.value = ArraySizeMax;
    }
    setVal(e.target.value);
  }
  return (
    <div>
      <div className="Home InputBox">
        <div className="InputBox_Inner">
          Array Size
        </div>
        <div className="InputBox_Inner">
          <input type="number" value={val} onChange={onInputValueChanged} id='SizeInputBox'></input>
        </div>
      </div>
      <div className="Home InputBox">
        <div className="InputBox_Inner">
          Sort
        </div>
        <div className="InputBox_Inner">
        <select id="sort_method">
          <option>Heap Sort</option>
        </select>
        </div>
      </div>
      <div className="Home">
        <button type="button" onClick={onSubmit}>
          Start
        </button>
        <button type="button" onClick={onResetSize}>
          Reset
        </button>
        <button type="button" onClick={onQuit}>
          Quit
        </button>
      </div>
    </div>
  );
}

const HeapSort = function() {
  const navigate = useNavigate();
  const [contextM,setContextM] = useState(null);
  const [canvasM,setCanvasM] = useState(null);
  const [contextA1,setContextA1] = useState(null);
  const [canvasA1,setCanvasA1] = useState(null);
  const [contextA2,setContextA2] = useState(null);
  const [canvasA2,setCanvasA2] = useState(null);
  const [contextV,setContextV] = useState(null);
  const [canvasV,setCanvasV] = useState(null);
  const [objListIndex,setObjListIndex] = useState(0);
  const [obj,setObj] = useState(null);
  const [val, setVal] = useState("1");
  const [mode, setMode] = useState("Heap");
  const [reloaded,setReloaded] = useState(false);
  useEffect(()=>{
    let mc = document.getElementById('MainCanvas');
    let mctx = mc.getContext("2d");
    setContextM(mctx);
    setCanvasM(mc);
    document.title = 'Sort - Heap Sort';
  },[]);
  useEffect(()=>{
    if (contextM != null) {
      drawMC(contextM, canvasM, obj, objListIndex, mode);
    }
  },[contextM, obj]);

  useEffect(()=>{
    let mc = document.getElementById('ArrayCanvas1');
    let mctx = mc.getContext("2d");
    setContextA1(mctx);
    setCanvasA1(mc);
  },[]);
  useEffect(()=>{
    if (contextA1 != null) {
      drawAC1(contextA1, canvasA1, obj, objListIndex);
    }
  },[contextA1, obj]);

  useEffect(()=>{
    let mc = document.getElementById('ArrayCanvas2');
    let mctx = mc.getContext("2d");
    setContextA2(mctx);
    setCanvasA2(mc);
  },[]);
  useEffect(()=>{
    if (contextA2 != null) {
      drawAC2(contextA2, canvasA2, obj, objListIndex);
    }
  },[contextA2, obj]);

  useEffect(()=>{
    let mc = document.getElementById('ValueCanvas');
    let mctx = mc.getContext("2d");
    setContextV(mctx);
    setCanvasV(mc);
  },[]);
  useEffect(()=>{
    if (contextV != null) {
      drawVC(contextV, canvasV, obj, objListIndex);
    }
  },[contextV, obj]);

  useEffect(()=>{
    if (reloaded) {
      stateChanged();
      setReloaded(false);
    }
  },[reloaded]);

  const onIndexChanged = (e) => {
    if (obj == null) return;
    if (e.target.value < 1) {
      e.target.value = 1;
    } else if (e.target.value > obj.length) {
      e.target.value = objListIndex;
    }
    setVal(e.target.value);
  }
  const setIndex = () => {
    indexChanged(parseInt(val)-1);
  }

  const onQuit = () => {
    window.electron.ipcRenderer.sendMessage('Quit', true);
  };
  const onMode = () => {
    switch (mode) {
      case 'Heap':
        setMode('Bar');
        break;
      case 'Bar':
        setMode('Heap');
        break;
    }
    setReloaded(true);
  };
  const onFirst = () => {
    indexChanged(0);
  };
  const onFinal = () => {
    indexChanged(obj.length-1);
  }
  const onNext = () => {
    let n = 0;
    if (objListIndex + 1 < obj.length) {
      n = objListIndex+1;
    } else {
      n = objListIndex;
    }
    indexChanged(n);
  };
  const onPrev = () => {
    let n = 0;
    if (objListIndex > 0) {
      n = objListIndex - 1;
    } else {
      n = objListIndex;
    }
    indexChanged(n);
  };
  const stateChanged = (index=objListIndex) => {
    drawMC(contextM, canvasM, obj, index, mode);
    drawAC1(contextA1, canvasA1, obj, index);
    drawAC2(contextA2, canvasA2, obj, index);
    drawVC(contextV, canvasV, obj, index);
  }
  const indexChanged = (index) => {
    stateChanged(index);
    document.getElementById('maxValue_viewer').innerHTML=(index+1)+' / '+obj.length;
    setObjListIndex(index);
  };
  window.electron.ipcRenderer.once('SortInfo', (json) => {
    let object = JSON.parse(json);
    setObj(object);
    document.getElementById('maxValue_viewer').innerHTML=(objListIndex+1)+' / '+object.length;
  });

  function onBackHome() {
    navigate("/");
  };

  return (
    <div>
      <div className="Sort_Canvas">
        <div className="Sort_Canvas_value_viewer">
          <canvas id="ValueCanvas" width="260" height="360">
          </canvas>
          <div id='Sort_Canvas_jsMessage'>
          </div>
        </div>
        <div className="Sort_Canvas_inner">
          <canvas id="MainCanvas" width="720" height="360">
          </canvas>
        </div>
      </div>
      <div className="Array_Canvas">
        <canvas id="ArrayCanvas1" width="1000" height="70">
        </canvas>
      </div>
      <div className="Array_Canvas">
        <canvas id="ArrayCanvas2" width="1000" height="70">
        </canvas>
      </div>
      <div className="Viewer_conf">
        <div className="NextPrev">
          <button type="button" onClick={onNext}>Next</button>
          <button type="button" onClick={onPrev}>Prev</button>
          <button type="button" onClick={onFirst}>First</button>
          <button type="button" onClick={onFinal}>Final</button>
          <div className="Number_View">
            <div id='maxValue_viewer' className="Number_View_Child">
            </div>
            <div className="Number_View_Child">
              <input type="number" value={val} onChange={onIndexChanged}></input>
              <button type="button" onClick={setIndex}>Go</button>
            </div>
          </div>
        </div>
        <div className="ViewMode">
          <button type="button" onClick={onMode}>Mode Change</button>
        </div>
      </div>
      <div className="Sort_Canvas_Btn">
        <button type="button" onClick={onBackHome}>
          Back
        </button>
        <button type="button" onClick={onQuit}>
          Quit
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hsort" element={<HeapSort />} />
      </Routes>
    </Router>
  );
}
