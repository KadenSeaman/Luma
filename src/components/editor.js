import { useAppLayout } from "../context/appLayoutContext";
import React, { useRef, useState, useEffect } from 'react';

import '../styles/editor.scss';

function Editor() {
    const { editorHeight, editorWidth } = useAppLayout();

    const editorInputElement = useRef(null);
    const lineNumbers = useRef(null);

    let [numberOfLines, setNumberOfLines] = useState(1);
    let [currentLineNumber, setCurrentLineNumber] = useState(1);

    useEffect(() => {
        const loadWasm = async () => {
          // Dynamically load the wasm_exec.js script
          const wasmExecScript = document.createElement("script");
          wasmExecScript.src = "/wasm_exec.js";
          wasmExecScript.onload = async () => {
            // Create a new Go instance (provided by wasm_exec.js)
            const go = new window.Go();
    
            try {
              // Load the WebAssembly module
              const wasmModule = await WebAssembly.instantiateStreaming(
                fetch("/main.wasm"),
                go.importObject
              );
    
              // Run the Go instance
              go.run(wasmModule.instance);
            } catch (err) {
              console.error("Error loading WebAssembly:", err);
            }
          };
          document.body.appendChild(wasmExecScript);
        };
    
        loadWasm();
      }, []);

    // Scroll Synchronization
    const synchronizeLineNumberScroll = () => {
        lineNumbers.current.scrollTop = editorInputElement.current.scrollTop;
    };

    // Line Number Management
    const updateLineNumbers = () => {
        setNumberOfLines(Math.max(editorInputElement.current.value.split('\n').length, 1));

        let lines = editorInputElement.current.value;
        let lineBreaks = 0;

        setCurrentLineNumber(1);

        for(let i = 0; i < lines.length; i++){
            if(lines[i] === '\n') lineBreaks++;

            let dir = editorInputElement.current.selectionDirection === 'forward' ? editorInputElement.current.selectionEnd : editorInputElement.current.selectionStart;

            if(i === dir - 1){
                setCurrentLineNumber(lineBreaks + 1);
                break;
            }
        }
    };

    const insertAtCursor = (text) => {
        const startPos = editorInputElement.current.selectionStart;
        const endPos = editorInputElement.current.selectionEnd;

        editorInputElement.current.value = editorInputElement.current.value.slice(0, startPos) + text + editorInputElement.current.value.slice(endPos);

        // Reposition cursor
        const newCursorPos = startPos + text.length;
        editorInputElement.current.selectionStart = newCursorPos;
        editorInputElement.current.selectionEnd = newCursorPos;
    };
    
    const handleKeyUp = (e) => {
        synchronizeLineNumberScroll();
        parseTextToNodes();
    };
    
    const handleKeyDown = (e) => {
        if(e.key === 'Tab'){
            e.preventDefault(); 
            insertAtCursor('\t');
        }
        if(e.ctrlKey && e.key === 'l'){
            e.preventDefault();
        }

        setTimeout(() => {
            updateLineNumbers();
        }, 1);
    }

    
    const parseTextToNodes = () => {
        try {
            console.log(JSON.parse(window.parse(editorInputElement.current.value)))
        } catch (error) {
            console.log('Cannot parse', error)
        }
    }

    const editorStyle = {
        width:  editorWidth + 'vw',
        height: editorHeight + 'vh',
    }

    return (
        <div id='editor' style={editorStyle}>
            <div ref={lineNumbers} id="line-numbers">
                {Array.from({length: numberOfLines}, (_,i) => <div className={currentLineNumber === i + 1 ? 'selected-line-number' : 'line-number'} key={i}>{i + 1}</div>)}
            </div>
            <textarea ref={editorInputElement} id='editor-input' onScroll={synchronizeLineNumberScroll} onKeyUp={handleKeyUp} onKeyDown={handleKeyDown}></textarea>
        </div>
    )
}
export default Editor;