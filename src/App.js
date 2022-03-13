import { useState } from 'react';
import './App.css';
import { createTex } from './lib/builder';
import { decompress } from './lib/decoder';
import { compress } from './lib/encoder';

function readFileDataAsBase64(e) {
  const file = e.target.files[0];

  return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
          resolve(event.target.result);
      };

      reader.onerror = (err) => {
          reject(err);
      };

      reader.readAsArrayBuffer(file);
  });
}

function App() {

  let [buffer, setBuffer] = useState();
  let [tex, setTex] = useState({
    LOCAL_BIN: undefined,
    LOCAL_CLUT: undefined,
    GK_LOCAL_BIN: undefined,
    AWAY_BIN: undefined,
    AWAY_CLUT: undefined,
    GK_AWAY_BIN: undefined,
    FLAG_BIN: undefined,
    FLAG_CLUT: undefined,
    REFEREE_BIN: undefined,
  });

  const handleInputFile = async (e) => {
    e.preventDefault();
    /*const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      //console.log(text);
    };
    reader.readAsText(e.target.files[0]);
    console.log(reader)*/
    let file = await readFileDataAsBase64(e);
    let arrayBuffer = new Uint8Array(file);
    //console.log(arrayBuffer);
    setBuffer(arrayBuffer);
  }

  const handleCompress = () => {
    let arrayBuffer = Uint8Array.from(buffer);    
    let zip = compress(arrayBuffer);
    //console.log(Uint8Array.from(zip));
    console.log(zip.buffer);

    const url = window.URL.createObjectURL(new Blob([zip]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `mexwezip.bin`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  }

  const handleDecompress = () => {
    let arrayBuffer = Uint8Array.from(buffer); 
    decompress(arrayBuffer);
  }

  const handleInputTex = async (e, fileID) => {
    e.preventDefault();    
    let file = await readFileDataAsBase64(e);
    let arrayBuffer = new Uint8Array(file);
    setTex(prevState => ({...prevState, [fileID]: arrayBuffer}))
  }

  const handleButtonTest = () => {
    //let BYTE_04_05 = 48 + tex.LOCAL_BIN.length + 32 + tex.GK_LOCAL_BIN.length + 32 + (tex.LOCAL_CLUT.length-20);
    console.log(tex);
    //console.log(BYTE_04_05);
    createTex(tex)
  }

  return (
    <div className="App">
      <p>MexWE ZIP</p>
      <div>
        <input type="file" onChange={handleInputFile}/>
        <button onClick={() => handleCompress()}>Comprimir</button>
        <button onClick={() => handleDecompress()}>Descomprimir</button>
      </div>

      <div>
        <button onClick={() => handleButtonTest()}>TEST</button>

        <span>Titular Comprimido</span>
        <input type="file" accept='.bin' onChange={(e) => handleInputTex(e,"LOCAL_BIN")}/>

        <span>Titular Paleta</span>
        <input type="file" accept='.tim' onChange={(e) => handleInputTex(e,"LOCAL_CLUT")}/>

        <span>GK Titular Comprimido</span>
        <input type="file" accept='.bin' onChange={(e) => handleInputTex(e,"GK_LOCAL_BIN")}/>

        <span>Suplente Comprimido</span>
        <input type="file" accept='.bin' onChange={(e) => handleInputTex(e,"AWAY_BIN")}/>

        <span>Suplente Paleta</span>
        <input type="file" accept='.tim' onChange={(e) => handleInputTex(e,"AWAY_CLUT")}/>

        <span>GK Suplente Comprimido</span>
        <input type="file" accept='.bin' onChange={(e) => handleInputTex(e,"GK_AWAY_BIN")}/>
      </div>
    </div>
  );
}

export default App;
